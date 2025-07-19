import { configDotenv } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

configDotenv({ path: path.resolve(__dirname, '../../.env') });

export const getSaltRounds = () => {
  const saltRounds = Number(process.env.SALT_ROUNDS);

  if (isNaN(saltRounds) || saltRounds <= 0) {
    console.error('Invalid SALT_ROUNDS value in environment variables. It must be a positive number.');
    process.exit(1);
  }

  return saltRounds;
};

export const getPortOfServer = () => {
  const port = Number(process.env.PORT);

  if (isNaN(port) || port <= 0) {
    console.error('Invalid PORT value in environment variables. It must be a positive number.');
    process.exit(1);
  }

  return port;
};

export const getHostNameOfServer = () => {
  const host = process.env.HOSTNAME;

  if (!host) {
    console.error('HOSTNAME value is not set in environment variables.');
    process.exit(1);
  }

  return host;
};

export const getJwtSecret = () => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('JWT_SECRET value is not set in environment variables.');
    process.exit(1);
  }

  return jwtSecret;
};

export const getEmailService = () => {
  const emailService = process.env.EMAIL_SERVICE;
  if (!emailService) {
    console.error('EMAIL_SERVICE value is not set in environment variables.');
    process.exit(1);
  }
  return emailService;
};

export const getEmail = () => {
  const email = process.env.EMAIL;
  if (!email) {
    console.error('EMAIL value is not set in environment variables.');
    process.exit(1);
  }
  return email;
};

export const getEmailPassword = () => {
  const emailPassword = process.env.EMAIL_PASSWORD;
  if (!emailPassword) {
    console.error('EMAIL_PASSWORD value is not set in environment variables.');
    process.exit(1);
  }
  return emailPassword;
};

export const getFrontendUrl = () => {
  const frontendUrl = process.env.FRONTEND_URL;
  if (!frontendUrl) {
    console.error('FRONTEND_URL value is not set in environment variables.');
    process.exit(1);
  }
  return frontendUrl;
};

export const getGoogleClientId = () => {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  if (!googleClientId) {
    console.error('GOOGLE_CLIENT_ID value is not set in environment variables.');
    process.exit(1);
  }
  return googleClientId;
};

export const prisma = new PrismaClient();

export const LOCKOUT_TIERS_MINUTES = [5, 15, 60, 180, 720, 1440]; // up to 24 hours
export const MAX_TIERS = LOCKOUT_TIERS_MINUTES.length;
export const PERMANENT_BAN_FLAG = -1;
export const RESET_AFTER_INACTIVITY_DAYS = 7; // Reset ban if inactive for 7 days
export const MAX_LOGIN_ATTEMPTS = 10; // Maximum login attempts before lockout

export const DEFAULT_STORAGE_SPACE_IN_MB = 15360n; // 15 GB = 15360 MB
export const DEFAULT_USED_STORAGE_SPACE = 0n; // Default to 0 bytes used

export const UPLOADS_BASE_DIR = path.join(__dirname, '..', 'uploads');
