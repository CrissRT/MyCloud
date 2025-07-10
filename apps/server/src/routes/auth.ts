import { compare, hash } from 'bcryptjs';
import crypto from 'crypto';
import dayjs from 'dayjs';
import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { z } from 'zod';

import { $Enums } from '@prisma/client';
import {
  createSession,
  createUserAndStorageAndPreferences,
  getStorageInfoByUserId,
  getUserByEmail,
  updateGeneralPreferenceByUserId,
  updateSessionById,
  updateUserById
} from '@server/db';
import { createResetToken, deleteResetTokenByUserId, getResetTokenByUserId } from '@server/db/resetTokens';
import {
  AuthCookie,
  ForgotPasswordResponse,
  forgotPasswordSchema,
  googleOAuthSchema,
  registerSchema,
  resetPasswordSchema,
  Session,
  SessionCreate,
  userLoginSchema
} from '@server/models';
import {
  checkIfEnoughSpaceInMB,
  convertMimeTypeToFileExtension,
  decodeJwt,
  DEFAULT_STORAGE_SPACE_IN_MB,
  DEFAULT_USED_STORAGE_SPACE,
  findRelevantSession,
  generateDefaultProfileImage,
  getNextBanDuration,
  getSaltRounds,
  getSerializedUserSessionCookie,
  isBanned,
  isValidFileSize,
  isValidJwt,
  isValidProfileImageType,
  MAX_LOGIN_ATTEMPTS,
  saveProfileImage,
  sendResetPasswordEmail,
  setCookieHeader,
  shouldResetBanDueToInactivity,
  signJwt
} from '@server/utils';
import { ErrorCodes } from '@shared/types';

const SALT_ROUNDS = getSaltRounds();

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const deviceInfo = req.headers['user-agent'] || 'unknown';
    const ip = String(req?.headers?.['x-forwarded-for']).split(',')[0] || req.ip || 'unknown';

    // Validate the request body against the user registration schema
    const resultParseBody = registerSchema.safeParse(req.body);

    // If validation fails, return a 400 error with the validation error message
    if (!resultParseBody.success) {
      res.status(400).json({
        code: ErrorCodes.ZOD_ERROR,
        message: resultParseBody.error.formErrors
      });
      return;
    }

    // Check if the user already exists by email
    const email = resultParseBody.data.email;
    const foundUser = await getUserByEmail(email);

    // If a user with the given email already exists, return a 400 error
    if (foundUser) {
      res.status(400).json({
        code: ErrorCodes.RECORD_ALREADY_EXISTS,
        message: req.t('errors.userAlreadyExists')
      });
      return;
    }

    const isEnoughSpaceToAllocate = await checkIfEnoughSpaceInMB(DEFAULT_STORAGE_SPACE_IN_MB);
    if (!isEnoughSpaceToAllocate) {
      res.status(507).json({
        code: ErrorCodes.INSUFFICIENT_STORAGE,
        message: req.t('errors.insufficientStorage')
      });
      return;
    }

    const hashedPassword = await hash(resultParseBody.data.password, SALT_ROUNDS);
    const userName = resultParseBody.data.email.split('@')[0];

    const response: AuthCookie = {
      email: resultParseBody.data.email,
      username: userName,
      firstName: resultParseBody.data.firstName,
      lastName: resultParseBody.data.lastName,
      role: $Enums.roleEnum.user,
      sex: resultParseBody.data.sex,
      birthDate: resultParseBody.data.birthDate,
      storageSpaceInMB: String(DEFAULT_STORAGE_SPACE_IN_MB),
      usedStorageInBytes: String(DEFAULT_USED_STORAGE_SPACE)
    };

    // Create generalPreferences for the user
    const allowedLanguages: $Enums.languageEnum[] = ['ro', 'ru', 'en'];
    const language = allowedLanguages.find((l) => l === req.i18n.language) || 'en';

    // Create user with all related records in a single transaction
    const { filename: profileName } = await generateDefaultProfileImage(
      response.firstName,
      response.lastName,
      response.username
    );
    const createdUser = await createUserAndStorageAndPreferences({
      email: response.email,
      username: response.username,
      firstName: response.firstName,
      lastName: response.lastName,
      password: hashedPassword,
      role: response.role,
      sex: response.sex,
      birthDate: response.birthDate,
      language,
      profileName
    });

    const userSessionCookie = getSerializedUserSessionCookie(response);

    // Create a session for the user
    await createSession({
      userId: createdUser.id,
      deviceInfo,
      ip,
      cookie: userSessionCookie,
      lastActive: dayjs().toDate(),
      loginAttempts: 0,
      banStart: null,
      banDurationMinutes: null
    });

    setCookieHeader(res, userSessionCookie);
    res.status(201).json(response);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ code: ErrorCodes.INTERNAL_SERVER_ERROR, message: req.t('errors.internalServerError') });
  }
});

router.post('/login', async (req, res) => {
  try {
    const allowedLanguages: $Enums.languageEnum[] = ['ro', 'ru', 'en'];
    const language = allowedLanguages.find((l) => l === req.i18n.language);

    const parse = userLoginSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({
        code: ErrorCodes.ZOD_ERROR,
        message: parse.error.formErrors
      });
      return;
    }

    const ip = String(req.headers['x-forwarded-for'])?.split(',')[0] || req.ip || 'unknown';
    const deviceInfo = req.headers['user-agent'] || 'unknown';
    const { email, password } = parse.data;

    const foundUser = await getUserByEmail(email);
    if (!foundUser) {
      res.status(401).json({
        code: ErrorCodes.INVALID_RECORD,
        message: req.t('errors.invalidCredentials')
      });
      return;
    }

    // Get or create session
    const foundSession = await findRelevantSession(ip, deviceInfo, foundUser.id);
    let session: Session | SessionCreate | null = foundSession;

    if (!session) {
      session = {
        userId: foundUser.id,
        deviceInfo,
        ip,
        cookie: null,
        lastActive: dayjs().toDate(),
        loginAttempts: 0,
        banStart: null,
        banDurationMinutes: null
      };
    }

    if (shouldResetBanDueToInactivity(session)) {
      session.banDurationMinutes = null;
      session.banStart = null;
    } else if (isBanned(session)) {
      // Check ban
      res.status(403).json({
        code: ErrorCodes.USER_LOCKED_OUT,
        message: req.t('errors.userLockedOut')
      });
      return;
    }

    const passwordMatch = await compare(password, foundUser.password);

    if (!passwordMatch) {
      session.loginAttempts += 1;

      // Evaluate if new ban should be applied
      if (session.loginAttempts % MAX_LOGIN_ATTEMPTS === 0) {
        const banDuration = getNextBanDuration(session.loginAttempts);
        session.banStart = dayjs().toDate();
        session.banDurationMinutes = banDuration;
      }

      session = foundSession ? await updateSessionById(foundSession.id, session) : await createSession(session);

      res.status(401).json({
        code: ErrorCodes.INVALID_RECORD,
        message: req.t('errors.invalidCredentials')
      });
      return;
    }

    // Correct password — clear bans and attempts
    session.loginAttempts = 0;
    session.banStart = null;
    session.banDurationMinutes = null;

    // Get storage information for the user
    const foundStorage = await getStorageInfoByUserId(foundUser.id);

    if (!foundStorage) {
      res.status(404).json({
        code: ErrorCodes.RECORD_NOT_FOUND,
        message: req.t('errors.userNotInitializedCorrectly')
      });
      return;
    }

    const userCookie = getSerializedUserSessionCookie({
      email: foundUser.email,
      username: foundUser.username,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      role: foundUser.role,
      sex: foundUser.sex,
      birthDate: foundUser.birthDate,
      storageSpaceInMB: String(foundStorage.storageSpaceInMB),
      usedStorageInBytes: String(foundStorage.usedStorageInBytes)
    });

    session.cookie = userCookie;
    session.lastActive = dayjs().toDate();

    session = foundSession ? await updateSessionById(foundSession.id, session) : await createSession(session);

    await updateGeneralPreferenceByUserId(foundUser.id, { language });

    const response: AuthCookie = {
      email: foundUser.email,
      username: foundUser.username,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      role: foundUser.role,
      sex: foundUser.sex,
      birthDate: foundUser.birthDate,
      storageSpaceInMB: String(foundStorage.storageSpaceInMB),
      usedStorageInBytes: String(foundStorage.usedStorageInBytes)
    };

    setCookieHeader(res, userCookie);
    res.status(200).json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: req.t('errors.internalServerError')
    });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const result = forgotPasswordSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        code: ErrorCodes.ZOD_ERROR,
        message: result.error.formErrors
      });
      return;
    }

    const { email } = result.data;

    const user = await getUserByEmail(email);

    if (!user) {
      res.status(404).json({
        code: ErrorCodes.RECORD_NOT_FOUND,
        message: req.t('errors.userNotFound')
      });
      return;
    }

    await deleteResetTokenByUserId(user.id);

    const resetToken = signJwt({
      data: { email: user.email }
    });

    // Create a reset token in the database
    await createResetToken(resetToken, user.id);

    try {
      // Send the reset password email
      await sendResetPasswordEmail(`${user.firstName} ${user.lastName}`, user.email, resetToken);

      const response: ForgotPasswordResponse = {
        message: req.t('success.resetPasswordEmailSent')
      };

      res.status(200).json(response);
    } catch {
      res.status(500).json({
        code: ErrorCodes.INVALID_RECORD,
        message: req.t('errors.resetPasswordFailed')
      });
    }
  } catch (error) {
    console.error('Error during forgot password:', error);
    res.status(500).json({
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: req.t('errors.internalServerError')
    });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const emailTokenSchema = z.object({ data: z.object({ email: z.string().email() }) });
    const resultParse = resetPasswordSchema.safeParse(req.body);

    if (!resultParse.success) {
      res.status(400).json({
        code: ErrorCodes.ZOD_ERROR,
        message: resultParse.error.formErrors
      });
      return;
    }

    const { token } = resultParse.data;

    // Verify the token expiration and validity
    if (!isValidJwt(token)) {
      res.status(400).json({
        code: ErrorCodes.INVALID_RECORD,
        message: req.t('errors.resetTokenInvalid')
      });
      return;
    }

    // Validate the reset token
    const decodedToken = decodeJwt(token);

    const parsedToken = emailTokenSchema.safeParse(decodedToken);

    if (!parsedToken.success) {
      res.status(400).json({
        code: ErrorCodes.INVALID_RECORD,
        message: req.t('errors.resetTokenInvalid')
      });
      return;
    }

    const email = parsedToken.data.data.email;

    // Check if the user exists
    const user = await getUserByEmail(email);

    if (!user) {
      res.status(404).json({
        code: ErrorCodes.RECORD_NOT_FOUND,
        message: req.t('errors.userNotFound')
      });
      return;
    }

    // Check if the reset token exists for the user
    const foundToken = await getResetTokenByUserId(user.id);
    if (!foundToken || foundToken.token !== token) {
      res.status(404).json({
        code: ErrorCodes.INVALID_RECORD,
        message: req.t('errors.resetTokenInvalid')
      });
      return;
    }

    // Hash the new password
    const hashedPassword = await hash(resultParse.data.password, SALT_ROUNDS);

    const isSamePassword = await compare(resultParse.data.password, user.password);

    if (isSamePassword) {
      res.status(400).json({
        code: ErrorCodes.INVALID_RECORD,
        message: req.t('errors.samePassword')
      });
      return;
    }

    // Update the user's password
    await updateUserById(user.id, { password: hashedPassword });

    // Delete the reset token from the database
    await deleteResetTokenByUserId(user.id);

    res.status(204).end();
  } catch (error) {
    console.error('Error during reset password:', error);
    res.status(500).json({
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: req.t('errors.internalServerError')
    });
  }
});

router.post('/google', async (req, res) => {
  try {
    const allowedLanguages: $Enums.languageEnum[] = ['ro', 'ru', 'en'];
    const language = allowedLanguages.find((l) => l === req.i18n.language);
    const deviceInfo = req.headers['user-agent'] || 'unknown';
    const ip = String(req?.headers?.['x-forwarded-for']).split(',')[0] || req.ip || 'unknown';

    // Validate the request body
    const resultParseBody = googleOAuthSchema.safeParse(req.body);

    if (!resultParseBody.success) {
      res.status(400).json({
        code: ErrorCodes.ZOD_ERROR,
        message: resultParseBody.error.formErrors
      });
      return;
    }

    // Fetch Google user info using access token
    const accessToken = resultParseBody.data.credential;
    const oauth2Client = new OAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });
    const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });

    let userInfo;
    try {
      const response = await oauth2.userinfo.get();
      userInfo = response.data;
    } catch (fetchError) {
      console.error('Failed to fetch Google user info:', fetchError);
      res.status(401).json({
        code: ErrorCodes.INVALID_RECORD,
        message: req.t('errors.invalidGoogleToken')
      });
      return;
    }

    const { email, given_name: givenName, family_name: familyName, picture: profilePicture } = userInfo;
    if (!email || !givenName || !familyName) {
      res.status(400).json({
        code: ErrorCodes.INVALID_RECORD,
        message: req.t('errors.missingGoogleUserInfo')
      });
      return;
    }

    // Check if user exists
    let foundUser = await getUserByEmail(email);

    if (!foundUser) {
      // Check if there's enough space to create a new user
      const isEnoughSpaceToAllocate = await checkIfEnoughSpaceInMB(DEFAULT_STORAGE_SPACE_IN_MB);
      if (!isEnoughSpaceToAllocate) {
        res.status(507).json({
          code: ErrorCodes.INSUFFICIENT_STORAGE,
          message: req.t('errors.insufficientStorage')
        });
        return;
      }

      // Create new user with default password (since it's OAuth)
      const randomPassword = await hash(crypto.randomUUID(), SALT_ROUNDS);
      const userName = email.split('@')[0];

      let profileName: string;
      if (profilePicture) {
        // Fetch the image data from the URL and convert to Buffer
        const response = await fetch(profilePicture);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Validate MIME type and file size
        const mimeType = response.headers.get('content-type');
        const fileSize = buffer.length;
        if (!isValidProfileImageType(String(mimeType))) {
          res.status(400).json({
            code: ErrorCodes.INVALID_TYPE,
            message: req.t('errors.invalidImageType')
          });
          return;
        }

        if (!isValidFileSize(fileSize)) {
          res.status(413).json({
            code: ErrorCodes.RESOURCE_TOO_LARGE,
            message: req.t('errors.fileTooLarge')
          });
          return;
        }

        const { filename } = await saveProfileImage(
          userName,
          `${profilePicture}${convertMimeTypeToFileExtension(String(mimeType))}`,
          buffer
        );
        profileName = filename;
      } else {
        const { filename } = await generateDefaultProfileImage(givenName, familyName, userName);
        profileName = filename;
      }

      // Create user with all related records in a single transaction
      foundUser = await createUserAndStorageAndPreferences({
        email: email,
        username: userName,
        firstName: givenName,
        lastName: familyName,
        password: randomPassword,
        role: $Enums.roleEnum.user,
        sex: $Enums.sexEnum.other, // Default since Google doesn't provide this
        birthDate: dayjs('1990-01-01').toDate(), // Default since Google doesn't provide this
        language: language,
        profileName
      });
    } else await updateGeneralPreferenceByUserId(foundUser.id, { language });

    const storageInfo = await getStorageInfoByUserId(foundUser.id);

    const response: AuthCookie = {
      email: foundUser.email,
      username: foundUser.username,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      role: foundUser.role,
      sex: foundUser.sex,
      birthDate: foundUser.birthDate,
      storageSpaceInMB: String(storageInfo?.storageSpaceInMB || DEFAULT_STORAGE_SPACE_IN_MB),
      usedStorageInBytes: String(storageInfo?.usedStorageInBytes || DEFAULT_USED_STORAGE_SPACE)
    };

    const userSessionCookie = getSerializedUserSessionCookie(response);

    // Create or update session
    const foundSession = await findRelevantSession(ip, deviceInfo, foundUser.id);

    if (foundSession) {
      await updateSessionById(foundSession.id, {
        userId: foundUser.id,
        deviceInfo,
        ip,
        lastActive: dayjs().toDate(),
        cookie: userSessionCookie,
        loginAttempts: 0,
        banStart: null,
        banDurationMinutes: null
      });
    } else {
      await createSession({
        userId: foundUser.id,
        deviceInfo,
        ip,
        cookie: userSessionCookie,
        lastActive: dayjs().toDate(),
        loginAttempts: 0,
        banStart: null,
        banDurationMinutes: null
      });
    }

    setCookieHeader(res, userSessionCookie);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error during Google OAuth:', error);
    res.status(500).json({
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: req.t('errors.internalServerError')
    });
  }
});

export { router as authRouter };
