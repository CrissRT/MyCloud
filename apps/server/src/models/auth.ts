import { z } from 'zod';

import { userSchema } from './user';

export const registerSchema = userSchema.pick({
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  sex: true,
  birthDate: true
});

export type Register = z.infer<typeof registerSchema>;

export const userLoginSchema = userSchema.pick({
  email: true,
  password: true
});
export type Login = z.infer<typeof userLoginSchema>;

export const authResponseSchema = userSchema
  .pick({
    email: true,
    username: true,
    firstName: true,
    lastName: true,
    role: true,
    sex: true,
    birthDate: true
  })
  .extend({
    storageSpaceInMB: z.string().regex(/^\d+$/),
    usedStorageInBytes: z.string().regex(/^\d+$/)
  });

export type AuthResponse = z.infer<typeof authResponseSchema>;
