import { config as configDotenv } from 'dotenv';
// Load root .env first, then local .env (local overrides root)
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

configDotenv({ path: path.resolve(__dirname, '../../../.env') });
configDotenv({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
// import pkg from 'pg';
// const { Pool } = pkg;

const app = express();
app.use(express.json());

// const pool = new Pool({
//   user: process.env.POSTGRES_USER,
//   host: process.env.POSTGRES_HOST,
//   database: process.env.POSTGRES_DB,
//   password: process.env.POSTGRES_PASSWORD,
//   port: Number(process.env.POSTGRES_PORT)
// });

app.get('/users', async (_, res) => {
  try {
    res.json('test');
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
