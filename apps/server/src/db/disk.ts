import { pool } from '@server/utils';

export const getReservedStorageInMB = async () => {
  const query = 'SELECT SUM(storage_space_in_mb) FROM users';
  const result = await pool.query(query);

  if (result.rows.length === 0 || !result.rows[0].sum) return 0n;

  return BigInt(result.rows[0].sum);
};
