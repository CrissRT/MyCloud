import { config as configDotenv } from 'dotenv';
// Load root .env first, then local .env (local overrides root)
import path from 'path';
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

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
