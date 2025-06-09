import { pool } from '@server/utils';
import { User } from '@shared/models';

export const getUserById = async (id: string) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const values = [id];
  const result = await pool.query(query, values);

  if (result.rows.length === 0) return null;

  const user: User = result.rows[0];
  return user;
};

export const getUserByEmail = async (email: string) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];
  const result = await pool.query(query, values);

  if (result.rows.length === 0) return null;

  const user: User = result.rows[0];
  return user;
};

export const createUser = async ({
  email,
  username,
  password,
  firstName,
  lastName,
  birthDate,
  role,
  sex
}: Omit<User, 'id' | 'createdAt'>) => {
  const query =
    'INSERT INTO users (email, username, password, first_name, last_name, birth_date, role, sex, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING id';
  const values = [email, username, password, firstName, lastName, birthDate, role, sex];
  const result = await pool.query(query, values);

  if (result.rowCount === 0) return null;

  const user: User = result.rows[0];
  return user;
};
