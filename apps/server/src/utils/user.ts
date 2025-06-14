import dayjs from 'dayjs';

import { getSessionsByDeviceInfoAndIp } from '@server/db';
import { UserSession, UserSessionCreate } from '@shared/models';

import {
  LOCKOUT_TIERS_MINUTES,
  MAX_LOGIN_ATTEMPTS,
  MAX_TIERS,
  PERMANENT_BAN_FLAG,
  RESET_AFTER_INACTIVITY_DAYS
} from './constants';

export const isBanned = (session: UserSession | UserSessionCreate) => {
  if (session.banDurationMinutes === null || session.banStart === null) return false;

  if (session.banDurationMinutes === PERMANENT_BAN_FLAG) return true;

  const unbanAt = dayjs(session.banStart).add(session.banDurationMinutes, 'minute');
  return dayjs().isBefore(unbanAt);
};

export const getNextBanDuration = (attempts: number) => {
  const tier = Math.floor(attempts / MAX_LOGIN_ATTEMPTS);
  return LOCKOUT_TIERS_MINUTES[tier] ?? LOCKOUT_TIERS_MINUTES[MAX_TIERS - 1];
};

export const shouldResetBanDueToInactivity = (session: UserSession | UserSessionCreate) => {
  if (!session.banStart) return false;

  const isPermanent = session.banDurationMinutes === -1;
  if (isPermanent) return false;

  const isAtMaxBan = session.banDurationMinutes === LOCKOUT_TIERS_MINUTES[MAX_TIERS - 1];
  if (!isAtMaxBan) return false;

  const oneWeekAgo = dayjs().subtract(RESET_AFTER_INACTIVITY_DAYS, 'day');
  const banStarted = dayjs(session.banStart);

  return banStarted.isBefore(oneWeekAgo);
};

export const findRelevantSession = async (ip: string, deviceInfo: string, userId?: number) => {
  const allSessions = await getSessionsByDeviceInfoAndIp(deviceInfo, ip);

  if (!allSessions || allSessions.length === 0) return null;

  const filteredByUserId = userId ? allSessions.filter((session) => session.userId === userId) : allSessions;

  filteredByUserId.sort((a, b) => dayjs(b.banStart).valueOf() - dayjs(a.banStart).valueOf());

  return filteredByUserId[0];
};
