import { config as configDotenv } from 'dotenv';
import express from 'express';
import path from 'path';
import pkg from 'pg';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { Pool } = pkg;
const app = express();

// Load root .env first, then local .env (local overrides root)
configDotenv({ path: path.resolve(__dirname, '../../../.env') });
configDotenv({ path: path.resolve(__dirname, '../.env') });

app.use(express.json());

export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT)
});

app.get('/users', async (_, res) => {
  try {
    res.json('test');
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

const PORT = process.env.PORT;
if (isNaN(Number(PORT))) {
  console.error(`Invalid PORT value: ${PORT}. Please set a valid port number in the environment variables.`);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
