import { pool } from '@server/app';

export const getUserById = async (id: string) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const values = [id];
  const result = await pool.query(query, values);

  if (result.rows.length === 0) return null;

  return result.rows[0];
};
