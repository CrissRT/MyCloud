import jwt from 'jsonwebtoken';

import { getJwtSecret } from './constants';

const jwtSecret = getJwtSecret();

export const signJwt = (payload: object, options?: jwt.SignOptions) =>
  jwt.sign(payload, jwtSecret, { expiresIn: '24h', ...options });

export const isValidJwt = (token: string) => {
  try {
    return !!jwt.verify(token, jwtSecret);
  } catch {
    return false;
  }
};

export const decodeJwt = (token: string) => {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch {
    return null;
  }
};
