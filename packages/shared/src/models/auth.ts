import { z } from 'zod';

import { userSchema } from './user';

export const registerSchema = userSchema.omit({ id: true, role: true, username: true, createdAt: true });

export type Register = z.infer<typeof registerSchema>;

export const authResponseSchema = userSchema.omit({ id: true, password: true, createdAt: true });

export type AuthResponse = z.infer<typeof authResponseSchema>;

export const userLoginSchema = userSchema.pick({
  email: true,
  password: true
});
export type Login = z.infer<typeof userLoginSchema>;
