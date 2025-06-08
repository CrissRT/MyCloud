import { config as configDotenv } from 'dotenv';
import path from 'path';
import pkg from 'pg';
import { serve, setup } from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { z } from 'zod';

import { makeApi } from '@zodios/core';
import { zodiosApp } from '@zodios/express';
import { bearerAuthScheme, openApiBuilder } from '@zodios/openapi';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { Pool } = pkg;

// Load root .env first, then local .env (local overrides root)
configDotenv({ path: path.resolve(__dirname, '../../../.env') });
configDotenv({ path: path.resolve(__dirname, '../.env') });

const app = zodiosApp();
// app.use(express.json());

export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT)
});

// --- Zodios API definition ---
const api = makeApi([
  {
    method: 'get',
    path: '/ping',
    alias: 'ping',
    response: z.object({ message: z.string() }),
    description: 'Health check endpoint'
  }
]);

// Register endpoint handlers
app.get('/ping', async (_, res) => {
  res.json({ message: 'pong' });
});

const swaggerDocument = openApiBuilder({
  title: 'User API',
  version: '1.0.0',
  description: 'A simple user API'
})
  .addServer({ url: '/api/v1' })
  .addSecurityScheme('admin', bearerAuthScheme())
  .addPublicApi(api)
  .build();

app.router.get('/docs/swagger.json', (_req, res) => {
  res.json(swaggerDocument);
});
app.use('/docs', serve);
app.use('/docs', setup(undefined, { swaggerUrl: '/docs/swagger.json' }));

const PORT = process.env.PORT;
if (isNaN(Number(PORT))) {
  console.error(`Invalid PORT value: ${PORT}. Please set a valid port number in the environment variables.`);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
