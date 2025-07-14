import { authCookieSchema, errors } from '@server/models';
import { makeApi } from '@zodios/core';

export const accountApi = makeApi([
  {
    method: 'get',
    path: '/account/me',
    alias: 'getMe',
    response: authCookieSchema,
    status: 200,
    description: 'Get current user information',
    errors: errors,
    security: [{ cookieAuth: [] }]
  }
]);
