import { errors, userSchema } from '@shared/models';
import { makeApi } from '@zodios/core';

export const authApi = makeApi([
  {
    method: 'post',
    path: '/auth/register',
    alias: 'register',
    response: userSchema.omit({ password: true, id: true }),
    description: 'Register a new user',
    errors: errors
  },
  {
    method: 'post',
    path: '/auth/login',
    alias: 'login',
    response: userSchema.omit({ password: true, id: true }),
    description: 'Login a user',
    errors: errors
  }
]);
