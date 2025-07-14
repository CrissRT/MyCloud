import cookie from 'cookie';
import { NextFunction, Response } from 'express';

import { AuthCookie, AuthenticatedRequest } from '@server/models';

const maxAgeCookie = 60 * 60 * 24 * 7; // 1 week
const cookieOptions = {
  httpOnly: true,
  maxAge: maxAgeCookie,
  path: '/',
  secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax' // Use 'lax' in development for Swagger UI compatibility
} as const;

export const getSerializedUserSessionCookie = (user: AuthCookie) =>
  cookie.serialize('user_session', JSON.stringify(user), cookieOptions);

export const setCookieHeader = (res: Response, cookieHeader: string) => {
  res.setHeader('Set-Cookie', cookieHeader);
};

export const authenticateWithCookie = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const userSession = cookies.user_session;

    if (!userSession) {
      res.status(401).json({ message: 'Authentication required - no session cookie found' });
      return;
    }

    // Parse the user session data
    const userData = JSON.parse(userSession);

    //   TODO: add validation searching from DB
    if (!userData) {
      res.status(401).json({ message: 'Invalid session cookie' });
      return;
    }

    // Attach user data to request for use in route handlers
    req.user = userData.user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid session cookie format' });
  }
};
