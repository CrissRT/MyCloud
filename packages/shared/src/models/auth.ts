import { z } from 'zod';

import { userSchema } from './user';

export const userRegisterSchema = userSchema.omit({ id: true, role: true, username: true, createdAt: true });

export type UserRegister = z.infer<typeof userRegisterSchema>;

export const authResponseSchema = userSchema.omit({ id: true, password: true, createdAt: true });

export type AuthResponse = z.infer<typeof authResponseSchema>;

export const userLoginSchema = userSchema.pick({
  email: true,
  password: true
});
export type UserLogin = z.infer<typeof userLoginSchema>;
