import { hash } from 'bcryptjs';
import express from 'express';

import { createUser, getUserByEmail } from '@server/db';
import { getSaltRounds } from '@server/utils';
import { Role, userRegisterSchema } from '@shared/models';

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

    const hashedPassword = await hash(resultParse.data.password, SALT_ROUNDS);

    const newUser = {
      ...resultParse.data,
      username: resultParse.data.email.split('@')[0],
      role: Role.USER,
      password: hashedPassword
    };

    await createUser(newUser);

    res.status(201).json('test');
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
  }
});

export { router as authRouter };
