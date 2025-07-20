import { errors, generalPreferencesSchema, generalPreferencesUpdateSchema, profileSchema } from '@server/models';
import { makeApi } from '@zodios/core';

export const accountApi = makeApi([
  {
    method: 'get',
    path: '/account/me',
    alias: 'getMe',
    response: profileSchema,
    status: 200,
    description: 'Get current user information',
    errors: errors,
    security: [{ cookieAuth: [] }]
  },
  {
    method: 'patch',
    path: '/account/preferences',
    alias: 'updatePreferences',
    response: generalPreferencesSchema,
    status: 200,
    description: 'Update user preferences',
    errors: errors,
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: generalPreferencesUpdateSchema,
        description: 'Update user preferences'
      }
    ],
    security: [{ cookieAuth: [] }]
  }
]);
