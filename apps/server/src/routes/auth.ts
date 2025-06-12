import { compare, hash } from 'bcryptjs';
import dayjs from 'dayjs';
import express from 'express';

import { createUser, getSessionsByUserIdAndDeviceInfo, getUserByEmail } from '@server/db';
import { createSession, updateSession } from '@server/db';
import { getSaltRounds, getSerializedUserSessionCookie, maxLoginAttempts, setCookieHeader } from '@server/utils';
import { errorCodes, Role, UserAuthResponse, userLoginSchema, userRegisterSchema } from '@shared/models';

const SALT_ROUNDS = getSaltRounds();

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    // Validate the request body against the user registration schema
    const resultParse = userRegisterSchema.safeParse(req.body);

    // If validation fails, return a 400 error with the validation error message
    if (!resultParse.success) {
      res.status(400).json({
        //   TODO: add i18n support
        code: errorCodes.VALIDATION_ERROR,
        message: resultParse.error.message
      });
      return;
    }
    // Check if the user already exists by email
    const email = resultParse.data.email;
    const foundUser = await getUserByEmail(email);

    // If a user with the given email already exists, return a 400 error
    if (foundUser) {
      res.status(400).json({
        //   TODO: add i18n support
        code: errorCodes.USER_ALREADY_EXISTS,
        message: 'User with this email already exists'
      });
      return;
    }

    const hashedPassword = await hash(resultParse.data.password, SALT_ROUNDS);

    const userName = resultParse.data.email.split('@')[0];

    const responseUser: UserAuthResponse = {
      email: resultParse.data.email,
      username: userName,
      firstName: resultParse.data.firstName,
      lastName: resultParse.data.lastName,
      role: Role.USER,
      sex: resultParse.data.sex,
      birthDate: resultParse.data.birthDate,
      deviceInfo: resultParse.data.deviceInfo,
      ip: resultParse.data.ip
    };

    const createdUser = await createUser({
      email: resultParse.data.email,
      username: userName,
      firstName: resultParse.data.firstName,
      lastName: resultParse.data.lastName,
      role: Role.USER,
      sex: resultParse.data.sex,
      birthDate: resultParse.data.birthDate,
      password: hashedPassword
    });

    // If user creation fails, return a 500 error
    if (!createdUser) {
      console.error('Failed to create user in the database');
      res.status(500).json({
        code: errorCodes.INTERNAL_SERVER_ERROR,
        message: 'Failed to create user'
      });
      return;
    }

    const userSessionCookie = getSerializedUserSessionCookie(responseUser);

    // Create a session for the user
    await createSession({
      userId: createdUser.id,
      deviceInfo: resultParse.data.deviceInfo,
      ip: resultParse.data.ip,
      cookie: userSessionCookie,
      lastActive: new Date(),
      loginAttempts: 0,
      lastLoginAttempt: new Date()
    });

    res = setCookieHeader(res, userSessionCookie);
    res.status(201).json(responseUser);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ code: errorCodes.INTERNAL_SERVER_ERROR, message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const resultParse = userLoginSchema.safeParse(req.body);

    if (!resultParse.success) {
      res.status(400).json({
        code: errorCodes.VALIDATION_ERROR,
        message: resultParse.error.message
      });
      return;
    }

    const { email, password } = resultParse.data;
    const foundUser = await getUserByEmail(email);

    if (!foundUser) {
      res.status(401).json({
        code: errorCodes.INVALID_CREDENTIALS,
        message: 'User with this email does not exist'
      });
      return;
    }
    
    const sameDeviceSessions = await getSessionsByUserIdAndDeviceInfo(foundUser.id, resultParse.data.deviceInfo);

    const passwordMatch = await compare(password, foundUser.password);
    if (!passwordMatch) {
      if (!sameDeviceSessions || sameDeviceSessions.length === 0) {
        createSession({
          userId: foundUser.id,
          deviceInfo: resultParse.data.deviceInfo,
          ip: resultParse.data.ip,
          cookie: null,
          lastActive: new Date(),
          loginAttempts: 1,
          lastLoginAttempt: new Date()
        });
      } else {
        const updatedSession = {
          ...sameDeviceSessions[0],
          ip: resultParse.data.ip,
          cookie: null,
          lastActive: new Date(),
          loginAttempts: sameDeviceSessions[0].loginAttempts + 1,
          lastLoginAttempt: new Date()
        };

        // Update the session in the database
        await updateSession(updatedSession);

        // Check if the user is locked out
        if (
          updatedSession.loginAttempts >= maxLoginAttempts &&
          dayjs(updatedSession.lastLoginAttempt).isAfter(dayjs().subtract(30, 'minute'))
        ) {
          console.warn(`User ${email} is locked out due to too many failed login attempts.`);
          res.status(403).json({
            code: errorCodes.USER_LOCKED_OUT,
            message: 'User is locked out due to too many failed login attempts'
          });
          return;
        } else if (
          updatedSession.loginAttempts >= maxLoginAttempts &&
          dayjs(updatedSession.lastLoginAttempt).isBefore(dayjs().subtract(30, 'minute'))
        ) {
          // if user has more than 10 failed login attempts, but last attempt was more than 30 minutes ago, reset login attempts
          updatedSession.loginAttempts = 1;
          await updateSession(updatedSession);
        }
      }

      console.warn(`Failed login attempt for user: ${email}`);
      res.status(401).json({
        code: errorCodes.INVALID_CREDENTIALS,
        message: 'Invalid email or password'
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
      birthDate: foundUser.birthDate,
      deviceInfo: resultParse.data.deviceInfo,
      ip: resultParse.data.ip
    };

    const userSessionCookie = getSerializedUserSessionCookie(responseUser);

    if (!sameDeviceSessions || sameDeviceSessions.length === 0)
      createSession({
        userId: foundUser.id,
        deviceInfo: resultParse.data.deviceInfo,
        ip: resultParse.data.ip,
        cookie: userSessionCookie,
        lastActive: new Date(),
        loginAttempts: 0,
        lastLoginAttempt: new Date()
      });

    res = setCookieHeader(res, userSessionCookie);
    res.status(200).json(responseUser);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ code: errorCodes.INTERNAL_SERVER_ERROR, message: 'Internal server error' });
  }
});

export { router as authRouter };
