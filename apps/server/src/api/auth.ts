import { authHeadersSchema, errors, userAuthResponseSchema, userLoginSchema, userRegisterSchema } from '@shared/models';
import { makeApi } from '@zodios/core';

const authHeaders = {
  name: 'Headers',
  type: 'Header',
  schema: authHeadersSchema,
  description: 'IP address of the user & User-Agent header of the request '
} as const;

export const authApi = makeApi([
  {
    method: 'post',
    path: '/auth/register',
    alias: 'register',
    response: userAuthResponseSchema,
    description: 'Register a new user',
    errors: errors,
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: userRegisterSchema,
        description: 'User registration details'
      },
      authHeaders
    ]
  },
  {
    method: 'post',
    path: '/auth/login',
    alias: 'login',
    response: userAuthResponseSchema,
    description: 'Login a user',
    errors: errors,
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: userLoginSchema,
        description: 'User login details'
      },
      authHeaders
    ]
  }
]);
