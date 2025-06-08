import { pool } from '@server/utils';
import { UserSession } from '@shared/models';

export const getSessionById = async (id: number) => {
  const query = 'SELECT * FROM sessions WHERE id = $1';
  const values = [id];
  const result = await pool.query(query, values);

  if (result.rows.length === 0) return null;
  return result.rows[0];
};

export const getSessionsByUserId = async (userId: number) => {
  const query = 'SELECT * FROM sessions WHERE user_id = $1';
  const values = [userId];
  const result = await pool.query(query, values);

  if (result.rows.length === 0) return null;

  return result.rows;
};

export const createSession = async ({
  userId,
  deviceInfo,
  ip,
  cookie,
  lastActive,
  loginAttempts,
  lastLoginAttempt
}: Omit<UserSession, 'id' | 'createdAt'>) => {
  const query =
    'INSERT INTO sessions (user_id, device_info, ip, cookie, last_active, login_attempts, last_login_attempt, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING id';
  const values = [userId, deviceInfo, ip, cookie, lastActive, loginAttempts, lastLoginAttempt];
  const result = await pool.query(query, values);

  if (result.rowCount === 0) return null;

  return result.rows[0];
};
