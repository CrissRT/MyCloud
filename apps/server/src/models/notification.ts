import { z } from 'zod';

import { $Enums } from '@prisma/client';

export const notificationPreferencesSchema = z.object({
  id: z.number().int().nonnegative(),
  userId: z.number().int().nonnegative(),
  newlySharedItems: z.boolean(),
  requestAccess: z.boolean()
});

export type NotificationPreferences = z.infer<typeof notificationPreferencesSchema>;

export const notificationSchema = z.object({
  id: z.number().int().nonnegative(),
  userId: z.number().int().nonnegative(),
  type: z.nativeEnum($Enums.notificationTypeEnum),
  message: z.string().min(1),
  read: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Notification = z.infer<typeof notificationSchema>;
