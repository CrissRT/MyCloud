import { z } from 'zod';

import { errors, userAuthResponseSchema, userLoginSchema, userRegisterSchema } from '@shared/models';
import { makeApi } from '@zodios/core';

const authHeaders = [
  {
    name: 'x-forwarded-for',
    type: 'Header',
    schema: z.string().ip(),
    description: 'Client IP address'
  },
  {
    name: 'user-agent',
    type: 'Header',
    schema: z.string().min(1),
    description: 'User agent string'
  }
] as const;

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
      {
        name: 'x-forwarded-for',
        type: 'Header',
        schema: z.string().ip(),
        description: 'Client IP address'
      },
      ...authHeaders
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
      ...authHeaders
    ]
  }
]);
