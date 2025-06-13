import dayjs from 'dayjs';

import { convertObjectKeysSnakeCaseToCamelCase, pool } from '@server/utils';
import { UserSession, UserSessionCreate } from '@shared/models';

export const getSessionById = async (id: number) => {
  const query = 'SELECT * FROM sessions WHERE id = $1';
  const values = [id];
  const result = await pool.query(query, values);

  if (result.rows.length === 0) return null;
  const session: UserSession = convertObjectKeysSnakeCaseToCamelCase(result.rows[0]);

  return session;
};

export const getSessionsByUserId = async (userId: number) => {
  const query = 'SELECT * FROM sessions WHERE user_id = $1';
  const values = [userId];
  const result = await pool.query(query, values);

  if (result.rows.length === 0) return null;

  const sessions: UserSession[] = convertObjectKeysSnakeCaseToCamelCase(result.rows);

  return sessions;
};

// export const getSessionsByUserIdAndDeviceInfo = async (userId: number, deviceInfo: string) => {
//   const query = 'SELECT * FROM sessions WHERE user_id = $1 AND device_info = $2';
//   const values = [userId, deviceInfo];
//   const result = await pool.query(query, values);

//   if (result.rows.length === 0) return null;

//   const sessions: UserSession[] = convertObjectKeysSnakeCaseToCamelCase(result.rows);

//   return sessions;
// };

export const getSessionsByIp = async (ip: string) => {
  const query = 'SELECT * FROM sessions WHERE ip = $1';
  const values = [ip];
  const result = await pool.query(query, values);

  if (result.rows.length === 0) return null;

  const sessions: UserSession[] = convertObjectKeysSnakeCaseToCamelCase(result.rows);

  return sessions;
};

export const getSessionsByDeviceInfo = async (deviceInfo: string) => {
  const query = 'SELECT * FROM sessions WHERE device_info = $1';
  const values = [deviceInfo];
  const result = await pool.query(query, values);

  if (result.rows.length === 0) return null;

  const sessions: UserSession[] = convertObjectKeysSnakeCaseToCamelCase(result.rows);

  return sessions;
};

export const createSession = async ({
  userId,
  deviceInfo,
  ip,
  cookie,
  lastActive,
  loginAttempts,
  lastLoginAttempt,
  banStart = null,
  banDurationMinutes = null
}: UserSessionCreate) => {
  const query =
    'INSERT INTO sessions (user_id, device_info, ip, cookie, last_active, login_attempts, last_login_attempt, created_at, ban_start, ban_duration_minutes) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8, $9) RETURNING id';
  const values = [
    userId,
    deviceInfo,
    ip,
    cookie,
    lastActive,
    loginAttempts,
    lastLoginAttempt,
    banStart,
    banDurationMinutes
  ];
  const result = await pool.query(query, values);
  const resultSession: UserSession = convertObjectKeysSnakeCaseToCamelCase(result.rows[0]);
  return resultSession;
};

export const updateSession = async (session: UserSession) => {
  const query =
    'UPDATE sessions SET user_id = $1, device_info = $2, ip = $3, cookie = $4, last_active = $5, login_attempts = $6, last_login_attempt = $7 WHERE id = $8  RETURNING *';
  const values = [
    session.userId,
    session.deviceInfo,
    session.ip,
    session.cookie,
    session.lastActive,
    session.loginAttempts,
    session.lastLoginAttempt,
    session.id
  ];
  const result = await pool.query(query, values);

  if (result.rowCount === 0) return null;

  const updatedSession: UserSession = convertObjectKeysSnakeCaseToCamelCase(result.rows[0]);
  return updatedSession;
};

export const findRelevantSession = async (ip: string, deviceInfo: string): Promise<UserSession | null> => {
  const [byIp, byDevice] = await Promise.all([getSessionsByIp(ip), getSessionsByDeviceInfo(deviceInfo)]);

  const allSessions: UserSession[] = [...(byIp || []), ...(byDevice || [])];

  if (allSessions.length === 0) return null;

  // Filter sessions where both IP and deviceInfo match
  const bothMatch = allSessions.filter((session) => session.ip === ip && session.deviceInfo === deviceInfo);

  const candidates = bothMatch.length > 0 ? bothMatch : allSessions;

  candidates.sort((a, b) => dayjs(b.lastLoginAttempt).valueOf() - dayjs(a.lastLoginAttempt).valueOf());

  return candidates[0];
};
