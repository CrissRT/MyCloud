import { hash } from 'bcryptjs';
import cookie from 'cookie';
import express from 'express';

import { createUser, getUserByEmail } from '@server/db';
import { getSaltRounds } from '@server/utils';
import { Role, UserAuthResponse, userRegisterSchema } from '@shared/models';

const SALT_ROUNDS = getSaltRounds();

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const resultParse = userRegisterSchema.safeParse(req.body);

    if (!resultParse.success) {
      res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: resultParse.error.message
      });
      return;
    }
    const email = resultParse.data.email;
    const foundUser = await getUserByEmail(email);

    if (foundUser) {
      res.status(400).json({
        code: 'USER_ALREADY_EXISTS',
        message: 'User with this email already exists'
      });
      return;
    }

    const { password, ...parsedUser } = resultParse.data;

    const hashedPassword = await hash(password, SALT_ROUNDS);

    const userName = resultParse.data.email.split('@')[0];

    const responseUser: UserAuthResponse = {
      ...parsedUser,
      username: userName,
      role: Role.USER
    };

    const newUser = {
      ...parsedUser,
      username: userName,
      role: Role.USER,
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

export { router as authRouter };
