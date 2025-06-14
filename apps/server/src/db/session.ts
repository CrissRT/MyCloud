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

export const getSessionsByDeviceInfoAndIpAndUserId = async (deviceInfo: string, ip: string, userId: number) => {
  const query = 'SELECT * FROM sessions WHERE device_info = $1 AND ip = $2 AND user_id = $3';
  const values = [deviceInfo, ip, userId];
  const result = await pool.query(query, values);

  if (result.rows.length === 0) return null;

  const sessions: UserSession[] = convertObjectKeysSnakeCaseToCamelCase(result.rows);

  return sessions;
};

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
  banStart = null,
  banDurationMinutes = null
}: UserSessionCreate) => {
  const query =
    'INSERT INTO sessions (user_id, device_info, ip, cookie, last_active, login_attempts, created_at, ban_start, ban_duration_minutes) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8) RETURNING id';
  const values = [userId, deviceInfo, ip, cookie, lastActive, loginAttempts, banStart, banDurationMinutes];
  const result = await pool.query(query, values);
  const resultSession: UserSession = convertObjectKeysSnakeCaseToCamelCase(result.rows[0]);
  return resultSession;
};

export const updateSession = async (session: UserSession) => {
  const query = `UPDATE sessions
     SET user_id = $1,
         device_info = $2,
         ip = $3,
         cookie = $4,
         last_active = $5,
         login_attempts = $6,
         ban_duration_minutes = $7,
         ban_start = $8
     WHERE id = $9
     RETURNING *`;
  const values = [
    session.userId,
    session.deviceInfo,
    session.ip,
    session.cookie,
    session.lastActive,
    session.loginAttempts,
    session.banDurationMinutes,
    session.banStart,
    session.id
  ];
  const result = await pool.query(query, values);

  if (result.rowCount === 0) return null;

  const updatedSession: UserSession = convertObjectKeysSnakeCaseToCamelCase(result.rows[0]);
  return updatedSession;
};
