import {
  authResponseSchema,
  errors,
  forgotPasswordResponseSchema,
  forgotPasswordSchema,
  registerSchema,
  userLoginSchema
} from '@server/models';
import { makeApi } from '@zodios/core';

export const authApi = makeApi([
  {
    method: 'post',
    path: '/auth/register',
    alias: 'register',
    response: authResponseSchema,
    description: 'Register a new user',
    errors: errors,
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: registerSchema,
        description: 'User registration details'
      }
    ]
  },
  {
    method: 'post',
    path: '/auth/login',
    alias: 'login',
    response: authResponseSchema,
    description: 'Login a user',
    errors: errors,
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: userLoginSchema,
        description: 'User login details'
      }
    ]
  },
  {
    method: 'post',
    path: '/auth/forgot-password',
    alias: 'forgotPassword',
    response: forgotPasswordResponseSchema,
    description: 'Send forgot password email',
    errors: errors,
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: forgotPasswordSchema,
        description: 'User email for password reset'
      }
    ]
  }
]);
