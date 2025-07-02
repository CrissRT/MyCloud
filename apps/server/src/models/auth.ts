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
    birthDate: true,
    storageSpaceInMB: true,
    usedStorageInBytes: true
  })
  .transform((user) => ({
    ...user,
    storageSpaceInMB: String(user.storageSpaceInMB),
    usedStorageInBytes: String(user.usedStorageInBytes)
  }));

export type AuthResponse = z.infer<typeof authResponseSchema>;

export const forgotPasswordSchema = userSchema.pick({
  email: true
});

export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;

export const forgotPasswordResponseSchema = z.object({
  message: z.string()
});

export type ForgotPasswordResponse = z.infer<typeof forgotPasswordResponseSchema>;

export const resetPasswordGetSchema = z.object({
  token: z.string().min(1)
});

export type ResetPasswordGet = z.infer<typeof resetPasswordGetSchema>;

export const resetPasswordPostSchema = userSchema.pick({
  password: true
});

export type ResetPasswordPost = z.infer<typeof resetPasswordPostSchema>;
