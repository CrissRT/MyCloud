import { UserSession, UserSessionCreateOrUpdate } from '@shared/models';
import { isWithinLastMinutes } from '@shared/utils';

import { maxLoginAttempts } from './constants';

export const isLockedOut = (session: UserSession | UserSessionCreateOrUpdate) =>
  session.loginAttempts >= maxLoginAttempts && isWithinLastMinutes(session.lastLoginAttempt);

export const shouldResetLockout = (session: UserSession | UserSessionCreateOrUpdate) =>
  session.loginAttempts >= maxLoginAttempts && !isWithinLastMinutes(session.lastLoginAttempt);
