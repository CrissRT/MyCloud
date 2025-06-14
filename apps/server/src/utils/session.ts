import dayjs from 'dayjs';

import { getSessionsByDeviceInfoAndIpAndUserId } from '@server/db';
import { Session, SessionCreate } from '@shared/models';

import {
  LOCKOUT_TIERS_MINUTES,
  MAX_LOGIN_ATTEMPTS,
  MAX_TIERS,
  PERMANENT_BAN_FLAG,
  RESET_AFTER_INACTIVITY_DAYS
} from './constants';

export const isBanned = (session: Session | SessionCreate) => {
  if (session.banDurationMinutes === null || session.banStart === null) return false;

  if (session.banDurationMinutes === PERMANENT_BAN_FLAG) return true;

  const unbanAt = dayjs(session.banStart).add(session.banDurationMinutes, 'minute');
  return dayjs().isBefore(unbanAt);
};

export const getNextBanDuration = (attempts: number) => {
  const tier = Math.floor(attempts / MAX_LOGIN_ATTEMPTS);
  return LOCKOUT_TIERS_MINUTES[tier] ?? LOCKOUT_TIERS_MINUTES[MAX_TIERS - 1];
};

export const shouldResetBanDueToInactivity = (session: Session | SessionCreate) => {
  if (!session.banStart) return false;

  const isPermanent = session.banDurationMinutes === PERMANENT_BAN_FLAG;
  if (isPermanent) return false;

  const isAtMaxBan = session.banDurationMinutes === LOCKOUT_TIERS_MINUTES[MAX_TIERS - 1];
  if (!isAtMaxBan) return false;

  const oneWeekAgo = dayjs().subtract(RESET_AFTER_INACTIVITY_DAYS, 'day');
  const banStarted = dayjs(session.banStart);

  return banStarted.isBefore(oneWeekAgo);
};

export const findRelevantSession = async (ip: string, deviceInfo: string, userId: number) => {
  const allSessions = await getSessionsByDeviceInfoAndIpAndUserId(deviceInfo, ip, userId);

  if (!allSessions || allSessions.length === 0) return null;

  const sessionsWithTimestamps = allSessions.map((session) => ({
    ...session,
    banStartTimestamp: session.banStart ? dayjs(session.banStart).valueOf() : 0
  }));
  sessionsWithTimestamps.sort((a, b) => b.banStartTimestamp - a.banStartTimestamp);

  return sessionsWithTimestamps[0];
};
