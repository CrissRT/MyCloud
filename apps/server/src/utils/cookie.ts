import cookie from 'cookie';
import { NextFunction, Response } from 'express';

import { AuthCookie, AuthenticatedRequest } from '@server/models';
import { ErrorCodes } from '@shared/types';

import { Cache } from './cache';
import { findRelevantSession } from './session';

const userEmailCache = new Cache();

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

    const userData = JSON.parse(userSession);

    if (!userData || !userData.email) {
      res.status(401).json({ code: ErrorCodes.INVALID_RECORD, message: req.t('errors.invalidSessionCookie') });
      return;
    }

    if (userEmailCache.has(userData.email)) {
      req.user = userData;
      next();
      return;
    }

    const userSessionDB = await findRelevantSession(userData.ip, userData.deviceInfo, userData.id);

    if (!userSessionDB) {
      res.status(401).json({ code: ErrorCodes.INVALID_RECORD, message: req.t('errors.invalidSessionCookie') });
      return;
    }

    userEmailCache.add(userData.email);

    req.user = userData;
    next();
  } catch {
    res.status(401).json({ code: ErrorCodes.INVALID_RECORD, message: req.t('errors.invalidSessionCookie') });
  }
};
