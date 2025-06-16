import dayjs from 'dayjs';
import { z } from 'zod';

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
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  firstName: z.string().min(3).max(255),
  lastName: z.string().min(3).max(255),
  role: z.nativeEnum(Role),
  sex: z.nativeEnum(Sex),
  birthDate: z.preprocess((val) => dayjs(String(val)).toDate(), z.date()),
  createdAt: z.date(),
  storageSpaceInMB: z
    .string()
    .regex(/^\d+$/)
    .transform((val) => BigInt(String(val))),
  usedStorageInBytes: z
    .string()
    .regex(/^\d+$/)
    .transform((val) => BigInt(String(val)))
});

export type User = z.infer<typeof userSchema>;
