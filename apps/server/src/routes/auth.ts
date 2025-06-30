import { compare, hash } from 'bcryptjs';
import dayjs from 'dayjs';
import express from 'express';

import { $Enums } from '@prisma/client';
import { createSession, createUser, getUserByEmail, updateSession } from '@server/db';
import { AuthResponse, registerSchema, Session, SessionCreate, userLoginSchema } from '@server/models';
import {
  checkIfEnoughSpaceInMB,
  DEFAULT_STORAGE_SPACE_IN_MB,
  DEFAULT_USED_STORAGE_SPACE,
  findRelevantSession,
  getNextBanDuration,
  getSaltRounds,
  getSerializedUserSessionCookie,
  isBanned,
  MAX_LOGIN_ATTEMPTS,
  setCookieHeader,
  shouldResetBanDueToInactivity
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
        code: ErrorCodes.USER_ALREADY_EXISTS,
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

    const response: AuthResponse = {
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

    const createdUser = await createUser({
      ...response,
      password: hashedPassword,
      storageSpaceInMB: DEFAULT_STORAGE_SPACE_IN_MB,
      usedStorageInBytes: DEFAULT_USED_STORAGE_SPACE
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
      createdAt: dayjs().toDate(),
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
        code: ErrorCodes.INVALID_CREDENTIALS,
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
        createdAt: dayjs().toDate(),
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

      session = foundSession ? await updateSession({ ...foundSession, ...session }) : await createSession(session);

      res.status(401).json({
        code: ErrorCodes.INVALID_CREDENTIALS,
        message: req.t('errors.invalidCredentials')
      });
      return;
    }

    // Correct password — clear bans and attempts
    session.loginAttempts = 0;
    session.banStart = null;
    session.banDurationMinutes = null;

    const userCookie = getSerializedUserSessionCookie({
      email: foundUser.email,
      username: foundUser.username,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      role: foundUser.role,
      sex: foundUser.sex,
      birthDate: foundUser.birthDate,
      storageSpaceInMB: String(foundUser.storageSpaceInMb),
      usedStorageInBytes: String(foundUser.usedStorageSpaceInBytes)
    });

    session.cookie = userCookie;
    session.lastActive = dayjs().toDate();

    session = foundSession ? await updateSession({ ...foundSession, ...session }) : await createSession(session);

    const response: AuthResponse = {
      email: foundUser.email,
      username: foundUser.username,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      role: foundUser.role,
      sex: foundUser.sex,
      birthDate: foundUser.birthDate,
      storageSpaceInMB: String(foundUser.storageSpaceInMb),
      usedStorageInBytes: String(foundUser.usedStorageSpaceInBytes)
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

export { router as authRouter };
