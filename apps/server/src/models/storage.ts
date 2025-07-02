import { z } from 'zod';

export const storageSchema = z.object({
  id: z.number().int().nonnegative(),
  userId: z.number().int().nonnegative(),
  storageSpaceInMB: z
    .string()
    .regex(/^\d+$/)
    .transform((val) => BigInt(String(val))),
  usedStorageInBytes: z
    .string()
    .regex(/^\d+$/)
    .transform((val) => BigInt(String(val)))
});

export type Storage = z.infer<typeof storageSchema>;
