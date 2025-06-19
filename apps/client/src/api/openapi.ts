import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const register_Body = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  firstName: z.string().min(3).max(255),
  lastName: z.string().min(3).max(255),
  sex: z.enum(['male', 'female', 'other']),
  birthDate: z.string().datetime({ offset: true })
});
const login_Body = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
});

export const schemas = {
  register_Body,
  login_Body
};

const endpoints = makeApi([
  {
    method: 'post',
    path: '/auth/login',
    alias: 'login',
    description: `Login a user`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        description: `User login details`,
        type: 'Body',
        schema: login_Body
      }
    ],
    response: z.object({
      email: z.string().email(),
      username: z.string().min(3).max(30),
      firstName: z.string().min(3).max(255),
      lastName: z.string().min(3).max(255),
      role: z.enum(['admin', 'user']),
      sex: z.enum(['male', 'female', 'other']),
      birthDate: z.string().datetime({ offset: true }),
      storageSpaceInMB: z.string().regex(/^\d+$/),
      usedStorageInBytes: z.string().regex(/^\d+$/)
    }),
    errors: [
      {
        status: 400,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 401,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 402,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 403,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 404,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 405,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 406,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 407,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 408,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 409,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 410,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 411,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 412,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 413,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 414,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 415,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 416,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 417,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 418,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 421,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 422,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 423,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 424,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 425,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 426,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 428,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 429,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 431,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 451,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 500,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 501,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 502,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 503,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 504,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 505,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 506,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 507,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 508,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 510,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 511,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      }
    ]
  },
  {
    method: 'post',
    path: '/auth/register',
    alias: 'register',
    description: `Register a new user`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        description: `User registration details`,
        type: 'Body',
        schema: register_Body
      }
    ],
    response: z.object({
      email: z.string().email(),
      username: z.string().min(3).max(30),
      firstName: z.string().min(3).max(255),
      lastName: z.string().min(3).max(255),
      role: z.enum(['admin', 'user']),
      sex: z.enum(['male', 'female', 'other']),
      birthDate: z.string().datetime({ offset: true }),
      storageSpaceInMB: z.string().regex(/^\d+$/),
      usedStorageInBytes: z.string().regex(/^\d+$/)
    }),
    errors: [
      {
        status: 400,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 401,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 402,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 403,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 404,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 405,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 406,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 407,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 408,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 409,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 410,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 411,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 412,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 413,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 414,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 415,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 416,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 417,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 418,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 421,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 422,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 423,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 424,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 425,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 426,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 428,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 429,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 431,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 451,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 500,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 501,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 502,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 503,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 504,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 505,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 506,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 507,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 508,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 510,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      },
      {
        status: 511,
        description: `Error`,
        schema: z.object({
          code: z.enum([
            'VALIDATION_ERROR',
            'USER_ALREADY_EXISTS',
            'INTERNAL_SERVER_ERROR',
            'INVALID_CREDENTIALS',
            'USER_LOCKED_OUT',
            'ZOD_ERROR',
            'INSUFFICIENT_STORAGE'
          ]),
          message: z.string()
        })
      }
    ]
  }
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
