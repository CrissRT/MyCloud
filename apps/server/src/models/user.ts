import dayjs from 'dayjs';
import { z } from 'zod';

import { $Enums } from '@prisma/client';
import { passwordRegex } from '@shared/utils';

export const userSchema = z.object({
  id: z.number().int().nonnegative(),
  email: z.string().email(),
  username: z.string().min(1).max(30),
  password: z.string().regex(passwordRegex),
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
  role: z.nativeEnum($Enums.roleEnum),
  sex: z.nativeEnum($Enums.sexEnum),
  birthDate: z.preprocess((val) => dayjs(String(val)).toDate(), z.date()),
  createdAt: z.date()
});

export type User = z.infer<typeof userSchema>;
