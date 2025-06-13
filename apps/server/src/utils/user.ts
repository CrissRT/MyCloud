import dayjs from 'dayjs';

import { UserSession, UserSessionCreate } from '@shared/models';

import { LOCKOUT_TIERS_MINUTES, MAX_LOGIN_ATTEMPTS, PERMANENT_BAN_FLAG } from './constants';

export const isBanned = (session: UserSession | UserSessionCreate): boolean => {
  if (session.banDurationMinutes === null || session.banStart === null) return false;

  if (session.banDurationMinutes === PERMANENT_BAN_FLAG) return true;

  const banEnd = dayjs(session.banStart).add(session.banDurationMinutes, 'minute');
  return dayjs().isBefore(banEnd);
};

export const getNextBanDuration = (attempts: number): number | -1 => {
  const tier = Math.floor(attempts / MAX_LOGIN_ATTEMPTS);
  return LOCKOUT_TIERS_MINUTES[tier] ?? PERMANENT_BAN_FLAG;
};
