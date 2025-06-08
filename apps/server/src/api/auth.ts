import { errors, userRegisterSchema, userSchema } from '@shared/models';
import { makeApi } from '@zodios/core';

export const authApi = makeApi([
  {
    method: 'post',
    path: '/auth/register',
    alias: 'register',
    response: userSchema.omit({ password: true, id: true }),
    description: 'Register a new user',
    errors: errors,
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: userRegisterSchema,
        description: 'User registration details'
      }
    ]
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
