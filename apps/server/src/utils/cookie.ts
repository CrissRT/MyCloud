import cookie from 'cookie';
import { NextFunction, Response } from 'express';

import { getUserByEmail } from '@server/db';
import { AuthCookie, AuthenticatedRequest } from '@server/models';
import { ErrorCodes } from '@shared/types';

const userEmailCache = new Set<string>();

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

export const authenticateWithCookie = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const userSession = cookies.user_session;

    if (!userSession) {
      res.status(401).json({ code: ErrorCodes.INVALID_RECORD, message: req.t('errors.authenticationFailed') });
      return;
    }

    // Parse the user session data
    const userData = JSON.parse(userSession);

    if (!userData) {
      res.status(401).json({ code: ErrorCodes.INVALID_RECORD, message: req.t('errors.invalidSessionCookie') });
      return;
    }

    // Check if the user session is cached
    if (userEmailCache.has(userData.user.email)) {
      req.user = userData.user;
      next();
      return;
    }

    // If not cached, fetch user data from the database
    const userFromDb = await getUserByEmail(userData.user.email);

    if (!userFromDb) {
      res.status(401).json({ code: ErrorCodes.INVALID_RECORD, message: req.t('errors.invalidSessionCookie') });
      return;
    }

    // Cache the user email
    userEmailCache.add(userFromDb.email);

    // Attach user data to request for use in route handlers
    req.user = userData.user;
    next();
  } catch {
    res.status(401).json({ code: ErrorCodes.INVALID_RECORD, message: req.t('errors.invalidSessionCookie') });
  }
};
