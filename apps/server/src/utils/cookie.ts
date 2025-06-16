import cookie from 'cookie';
import { Response } from 'express';

import { AuthResponse } from '@server/models';

const maxAgeCookie = 60 * 60 * 24 * 7; // 1 week
const cookieOptions = {
  httpOnly: true,
  maxAge: maxAgeCookie,
  path: '/',
  secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
  sameSite: 'strict' // Prevent CSRF attacks
} as const;

export const getSerializedUserSessionCookie = (user: AuthResponse) =>
  cookie.serialize('user_session', JSON.stringify(user), cookieOptions);

export const setCookieHeader = (res: Response, cookie: string) => {
  res.setHeader('Set-Cookie', cookie);
};
