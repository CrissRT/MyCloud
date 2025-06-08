import { compare, hash } from 'bcryptjs';
import cookie from 'cookie';
import express from 'express';

import { createUser, getUserByEmail } from '@server/db';
import { getSaltRounds } from '@server/utils';
import { Role, UserAuthResponse, userLoginSchema, userRegisterSchema } from '@shared/models';

const SALT_ROUNDS = getSaltRounds();

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const resultParse = userRegisterSchema.safeParse(req.body);

    if (!resultParse.success) {
      res.status(400).json({
        //   TODO: add i18n support
        code: 'VALIDATION_ERROR',
        message: resultParse.error.message
      });
      return;
    }
    const email = resultParse.data.email;
    const foundUser = await getUserByEmail(email);

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

    const newUser = {
      email: resultParse.data.email,
      username: userName,
      firstName: resultParse.data.firstName,
      lastName: resultParse.data.lastName,
      role: Role.USER,
      sex: resultParse.data.sex,
      birthDate: resultParse.data.birthDate,
      password: hashedPassword
    };

    await createUser(newUser);

    const userSessionCookie = cookie.serialize('user_session', JSON.stringify(responseUser), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    //   Add the the session db operations

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
