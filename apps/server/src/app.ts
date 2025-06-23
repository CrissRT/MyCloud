import cors from 'cors';
import { handle } from 'i18next-http-middleware';
import { serve, setup } from 'swagger-ui-express';

import { authApi } from '@server/api';
import { zodMiddleware } from '@server/api/middlewares';
import { i18n } from '@server/i18n/i18n';
import { authRouter } from '@server/routes';
import { getHostNameOfServer, getPortOfServer, prisma } from '@server/utils';
import { zodiosApp } from '@zodios/express';
import { bearerAuthScheme, openApiBuilder } from '@zodios/openapi';

const app = zodiosApp();

app.use(cors());
app.use(handle(i18n));

app.use(zodMiddleware);

app.use('/auth', authRouter);

const swaggerDocument = openApiBuilder({
  title: 'User API',
  version: '1.0.0',
  description: 'A simple user API'
})
  .addServer({ url: '/' })
  .addSecurityScheme('admin', bearerAuthScheme())
  .addPublicApi(authApi)
  .build();

app.get('/docs/swagger.json', (_req, res) => {
  res.json(swaggerDocument);
});
app.use('/docs', serve);
app.use('/docs', setup(undefined, { swaggerUrl: '/docs/swagger.json' }));

const PORT = getPortOfServer();
const HOSTNAME = getHostNameOfServer();

app
  .listen(PORT, HOSTNAME, () => {
    console.log(`Server running on port ${PORT} and hostname ${HOSTNAME}`);
  })
  .on('error', async (err) => {
    console.error('Error:', err);
    await prisma.$disconnect();
    console.log('Disconnected from Prisma');
    console.log('Exiting process due to error');
    process.exit(1);
  });
