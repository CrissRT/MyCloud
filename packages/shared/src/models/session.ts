import { z } from 'zod';

export const sessionSchema = z.object({
  id: z.number().int().nonnegative(),
  userId: z.number().int().nonnegative(),
  deviceInfo: z.string().min(1),
  ip: z.string().ip(),
  cookie: z.string().nullable(),
  createdAt: z.date(),
  lastActive: z.date(),
  loginAttempts: z.number().int().nonnegative(),
  banDurationMinutes: z.number().int().nullable(), // null = no ban, -1 = permanent ban
  banStart: z.date().nullable()
});

export type Session = z.infer<typeof sessionSchema>;

export const sessionCreateSchema = sessionSchema.omit({ id: true });

export type SessionCreate = z.infer<typeof sessionCreateSchema>;
