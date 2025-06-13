import { compare, hash } from 'bcryptjs';
import dayjs from 'dayjs';
import express from 'express';

import { createUser, getSessionsByUserIdAndDeviceInfo, getUserByEmail } from '@server/db';
import { createSession, updateSession } from '@server/db';
import { getSaltRounds, getSerializedUserSessionCookie, maxLoginAttempts, setCookieHeader } from '@server/utils';
import { errorCodes, Role, UserAuthResponse, userLoginSchema, userRegisterSchema } from '@shared/models';
import { isWithinLastMinutes } from '@shared/utils';

const SALT_ROUNDS = getSaltRounds();

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    // Validate the request body against the user registration schema
    const resultParseBody = userRegisterSchema.safeParse(req.body);

    // If validation fails, return a 400 error with the validation error message
    if (!resultParseBody.success) {
      res.status(400).json({
        code: errorCodes.ZOD_ERROR,
        message: resultParseBody.error.message
      });
      return;
    }

    // Check if the user already exists by email
    const email = resultParseBody.data.email;
    const foundUser = await getUserByEmail(email);

    // If a user with the given email already exists, return a 400 error
    if (foundUser) {
      res.status(400).json({
        code: errorCodes.USER_ALREADY_EXISTS,
        message: req.t('errors.userAlreadyExists')
      });
      return;
    }

    const hashedPassword = await hash(resultParseBody.data.password, SALT_ROUNDS);

    const userName = resultParseBody.data.email.split('@')[0];

    const responseUser: UserAuthResponse = {
      email: resultParseBody.data.email,
      username: userName,
      firstName: resultParseBody.data.firstName,
      lastName: resultParseBody.data.lastName,
      role: Role.USER,
      sex: resultParseBody.data.sex,
      birthDate: resultParseBody.data.birthDate
    };

    const createdUser = await createUser({
      email: resultParseBody.data.email,
      username: userName,
      firstName: resultParseBody.data.firstName,
      lastName: resultParseBody.data.lastName,
      role: Role.USER,
      sex: resultParseBody.data.sex,
      birthDate: resultParseBody.data.birthDate,
      password: hashedPassword
    });

    // If user creation fails, return a 500 error
    if (!createdUser) {
      console.error('Failed to create user in the database');
      res.status(500).json({
        code: errorCodes.INTERNAL_SERVER_ERROR,
        message: req.t('errors.failedToCreateUser')
      });
      return;
    }

    const userSessionCookie = getSerializedUserSessionCookie(responseUser);

    const deviceInfo = req.headers['user-agent'] || 'unknown';
    const ip = String(req?.headers?.['x-forwarded-for']).split(',')[0] || req.ip || 'unknown';

    // Create a session for the user
    await createSession({
      userId: createdUser.id,
      deviceInfo,
      ip,
      cookie: userSessionCookie,
      lastActive: new Date(),
      loginAttempts: 0,
      lastLoginAttempt: new Date()
    });

    setCookieHeader(res, userSessionCookie);

    res.status(201).json(responseUser);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ code: errorCodes.INTERNAL_SERVER_ERROR, message: req.t('errors.internalServerError') });
  }
});

router.post('/login', async (req, res) => {
  try {
    const resultParseBody = userLoginSchema.safeParse(req.body);

    if (!resultParseBody.success) {
      res.status(400).json({
        code: errorCodes.ZOD_ERROR,
        message: resultParseBody.error.message
      });
      return;
    }
    const ip = String(req?.headers?.['x-forwarded-for']).split(',')[0] || req.ip || 'unknown';
    const deviceInfo = req.headers['user-agent'] || 'unknown';
    const { email, password } = resultParseBody.data;
    const foundUser = await getUserByEmail(email);

    if (!foundUser) {
      res.status(401).json({
        code: errorCodes.INVALID_CREDENTIALS,
        message: req.t('errors.invalidCredentials')
      });
      return;
    }

    const sameDeviceSessions = await getSessionsByUserIdAndDeviceInfo(foundUser.id, deviceInfo);

    const passwordMatch = await compare(password, foundUser.password);
    if (!passwordMatch) {
      if (!sameDeviceSessions || sameDeviceSessions.length === 0) {
        createSession({
          userId: foundUser.id,
          deviceInfo,
          ip,
          cookie: null,
          lastActive: dayjs().toDate(),
          loginAttempts: 1,
          lastLoginAttempt: dayjs().toDate()
        });
      } else {
        const updatedSession = {
          ...sameDeviceSessions[0],
          ip,
          cookie: null,
          lastActive: dayjs().toDate(),
          loginAttempts: sameDeviceSessions[0].loginAttempts + 1,
          lastLoginAttempt: dayjs().toDate()
        };

        // Update the session in the database
        await updateSession(updatedSession);

        // Check if the user is locked out
        if (
          updatedSession.loginAttempts >= maxLoginAttempts &&
          isWithinLastMinutes(updatedSession.lastLoginAttempt, dayjs(), { value: 30, unit: 'minute' })
        ) {
          console.warn(`User ${email} is locked out due to too many failed login attempts.`);
          res.status(403).json({
            code: errorCodes.USER_LOCKED_OUT,
            message: req.t('errors.userLockedOut')
          });
          return;
        } else if (
          updatedSession.loginAttempts >= maxLoginAttempts &&
          !isWithinLastMinutes(updatedSession.lastLoginAttempt, dayjs(), { value: 30, unit: 'minute' })
        ) {
          // if user has more than 10 failed login attempts, but last attempt was more than 30 minutes ago, reset login attempts
          updatedSession.loginAttempts = 1;
          await updateSession(updatedSession);
        }
      }

      console.warn(`Failed login attempt for user: ${email}`);
      res.status(401).json({
        code: errorCodes.INVALID_CREDENTIALS,
        message: req.t('errors.invalidCredentials')
      });
      return;
    }

    const responseUser: UserAuthResponse = {
      email: foundUser.email,
      username: foundUser.username,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      role: foundUser.role,
      sex: foundUser.sex,
      birthDate: foundUser.birthDate
    };

    const userSessionCookie = getSerializedUserSessionCookie(responseUser);

    if (!sameDeviceSessions || sameDeviceSessions.length === 0)
      await createSession({
        userId: foundUser.id,
        deviceInfo,
        ip,
        cookie: userSessionCookie,
        lastActive: dayjs().toDate(),
        loginAttempts: 0,
        lastLoginAttempt: dayjs().toDate()
      });

    setCookieHeader(res, userSessionCookie);
    res.status(200).json(responseUser);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ code: errorCodes.INTERNAL_SERVER_ERROR, message: req.t('errors.internalServerError') });
  }
});

export { router as authRouter };
