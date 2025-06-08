import { serve, setup } from 'swagger-ui-express';

import { zodiosApp } from '@zodios/express';
import { bearerAuthScheme, openApiBuilder } from '@zodios/openapi';

import { authApi } from './api';
import { authRouter } from './routes/auth';
import { getPortOfServer } from './utils/constants';

const app = zodiosApp();

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

app.router.get('/docs/swagger.json', (_req, res) => {
  res.json(swaggerDocument);
});
app.use('/docs', serve);
app.use('/docs', setup(undefined, { swaggerUrl: '/docs/swagger.json' }));

const PORT = getPortOfServer();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
