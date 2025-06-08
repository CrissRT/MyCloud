import { z } from '@server/i18n/i18n';

export enum Role {
  USER = 'user',
  ADMIN = 'admin'
}

export enum Sex {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export const userSchema = z.object({
  id: z.number().int().nonnegative(),
  email: z.string().email(),
  username: z.string().min(3).max(30),
  password: z.string().min(8),
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
  role: z.nativeEnum(Role),
  sex: z.nativeEnum(Sex),
  birthDate: z.date()
});

export type User = z.infer<typeof userSchema>;

export const userSessionSchema = z.object({
  id: z.number().int().nonnegative(),
  userId: z.number().int().nonnegative(),
  deviceInfo: z.string().min(1),
  ip: z.string().ip(),
  cookie: z.string().nullable(),
  createdAt: z.date(),
  lastActive: z.date(),
  loginAttempts: z.number().int().nonnegative(),
  lastLoginAttempt: z.date()
});

export type UserSession = z.infer<typeof userSessionSchema>;
