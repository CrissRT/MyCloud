import { userSchema } from '@shared/models';
import { makeApi } from '@zodios/core';

export const authApi = makeApi([
  {
    method: 'post',
    path: '/auth/register',
    alias: 'register',
    response: userSchema.omit({ password: true, id: true }),
    description: 'Health check endpoint'
  }
]);
