import { hash } from 'bcryptjs';
import { configDotenv } from 'dotenv';
import { TFunction } from 'i18next';

import { pool } from '@server/app';
import { Role, User, UserSession } from '@server/models';
import { BadRequestError, InternalServerError } from '@server/utils';

configDotenv();

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);

export type UserRegisterParams = Pick<User, 'email' | 'password' | 'sex' | 'firstName' | 'lastName' | 'birthDate'> &
  Pick<UserSession, 'deviceInfo' | 'ip'>;

export class UsersService {
  public async register(
    { email, password, firstName, lastName, birthDate, sex, deviceInfo, ip }: UserRegisterParams,
    t: TFunction
  ) {
    try {
      // If user already exists, throw an error
      const foundUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (foundUser.rows.length > 0) throw new BadRequestError(t('errors.userAlreadyExists'));

      const userNameDb = email.split('@')[0];
      const passwordDb = await hash(password, SALT_ROUNDS);

      // Insert new user into the database
      const userResult = await pool.query(
        'INSERT INTO users (email, username, password, first_name, last_name, birth_date, role, sex, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING id',
        [email, userNameDb, passwordDb, firstName, lastName, birthDate, Role.USER, sex]
      );

      if (!userResult.rowCount || userResult.rowCount === 0)
        throw new BadRequestError(t('errors.userRegistrationFailed'));

      const userId = userResult.rows[0].id;

      // Insert user session into the database
      const sessionResult = await pool.query(
        'INSERT INTO user_sessions (user_id, device_info, ip, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id',
        [userId, deviceInfo, ip]
      );

      if (!sessionResult.rowCount || sessionResult.rowCount === 0)
        throw new BadRequestError(t('errors.userSessionCreationFailed'));

      return {
        user: userResult.rows[0],
        session: sessionResult.rows[0]
      };
    } catch (e) {
      if (e instanceof BadRequestError) throw e;
      throw new InternalServerError(String(e) || t('errors.internalServerError'));
    }
  }
}
