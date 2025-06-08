import { configDotenv } from 'dotenv';
import path from 'path';
import pkg from 'pg';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { Pool } = pkg;

// Load root .env first, then local .env (local overrides root)
configDotenv({ path: path.resolve(__dirname, '../../../../.env') });
configDotenv({ path: path.resolve(__dirname, '../.env') });

const getPostgresConfig = () => {
  const user = process.env.POSTGRES_USER;
  console.log("🚀 ~ getPostgresConfig ~ user:", user)
  const host = process.env.POSTGRES_HOST;
  console.log("🚀 ~ getPostgresConfig ~ host:", host)
  const database = process.env.POSTGRES_DB;
  console.log("🚀 ~ getPostgresConfig ~ database:", database)
  const password = process.env.POSTGRES_PASSWORD;
  console.log("🚀 ~ getPostgresConfig ~ password:", password)
  const port = Number(process.env.POSTGRES_PORT);
  console.log("🚀 ~ getPostgresConfig ~ port:", port)

  if (!user || !host || !database || !password || isNaN(port) || port <= 0) {
    console.error('Invalid PostgreSQL configuration in environment variables.');
    process.exit(1);
  }

  return {
    user,
    host,
    database,
    password,
    port
  };
};

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

export const pool = new Pool(getPostgresConfig());
