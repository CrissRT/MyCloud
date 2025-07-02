import { z } from 'zod';

import {
  authResponseSchema,
  errors,
  forgotPasswordResponseSchema,
  forgotPasswordSchema,
  googleOAuthSchema,
  registerSchema,
  resetPasswordSchema,
  userLoginSchema
} from '@server/models';
import { makeApi } from '@zodios/core';

export const authApi = makeApi([
  {
    method: 'post',
    path: '/auth/register',
    alias: 'register',
    response: authResponseSchema,
    status: 201,
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
    status: 200,
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
    status: 200,
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
  },
  {
    method: 'post',
    path: '/auth/reset-password',
    alias: 'resetPassword',
    response: z.void(),
    status: 204,
    description: 'Reset user password',
    errors: errors,
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: resetPasswordSchema,
        description: 'User new password details'
      }
    ]
  },
  {
    method: 'post',
    path: '/auth/google',
    alias: 'googleOAuth',
    response: authResponseSchema,
    status: 200,
    description: 'Login or register a user with Google OAuth',
    errors: errors,
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: googleOAuthSchema,
        description: 'Google OAuth credential'
      }
    ]
  }
]);
