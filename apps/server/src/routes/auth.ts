import { compare, hash } from 'bcryptjs';
import cookie from 'cookie';
import dayjs from 'dayjs';
import express from 'express';

import { createUser, getUserByEmail } from '@server/db';
import { createSession, getSessionsByUserId, updateSession } from '@server/db';
import { getSaltRounds } from '@server/utils';
import { Role, UserAuthResponse, userLoginSchema, userRegisterSchema } from '@shared/models';

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
        code: 'VALIDATION_ERROR',
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
        code: 'USER_ALREADY_EXISTS',
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
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create user'
      });
      return;
    }

    const userSessionCookie = cookie.serialize('user_session', JSON.stringify(responseUser), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

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

    res.setHeader('Set-Cookie', userSessionCookie);
    res.status(201).json(responseUser);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const resultParse = userLoginSchema.safeParse(req.body);

    if (!resultParse.success) {
      res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: resultParse.error.message
      });
      return;
    }

    const { email, password } = resultParse.data;
    const foundUser = await getUserByEmail(email);

    if (!foundUser) {
      res.status(401).json({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      });
      return;
    }

    const passwordMatch = await compare(password, foundUser.password);
    if (!passwordMatch) {
      const foundSessions = await getSessionsByUserId(foundUser.id);

      if (!foundSessions || foundSessions.length === 0) {
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
        const sameDeviceSession = foundSessions.find((session) => session.deviceInfo === resultParse.data.deviceInfo);
        if (!sameDeviceSession) {
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
            ...sameDeviceSession,
            lastActive: new Date(),
            loginAttempts: sameDeviceSession.loginAttempts + 1,
            lastLoginAttempt: new Date()
          };

          // Update the session in the database
          await updateSession(updatedSession);

          // Check if the user is locked out
          if (
            updatedSession.loginAttempts >= 10 &&
            dayjs(updatedSession.lastLoginAttempt).isAfter(dayjs().subtract(30, 'minute'))
          ) {
            console.warn(`User ${email} is locked out due to too many failed login attempts.`);
            res.status(403).json({
              code: 'USER_LOCKED_OUT',
              message: 'User is locked out due to too many failed login attempts'
            });
            return;
          }
        }
      }

      console.warn(`Failed login attempt for user: ${email}`);
      res.status(401).json({
        code: 'INVALID_CREDENTIALS',
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

    const userSessionCookie = cookie.serialize('user_session', JSON.stringify(responseUser), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    res.setHeader('Set-Cookie', userSessionCookie);
    res.status(200).json(responseUser);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
  }
});

export { router as authRouter };
