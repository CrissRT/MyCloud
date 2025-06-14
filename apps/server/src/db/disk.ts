import { pool } from '@server/utils';

export const getReservedStorageInMB = async () => {
  const query = 'SELECT SUM(storage_space_in_mb) FROM users';
  const result = await pool.query(query);

  if (result.rows.length === 0) return null;

  return BigInt(result.rows[0].sum);
};
