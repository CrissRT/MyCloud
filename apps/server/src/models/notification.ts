import { z } from '@server/i18n/i18n';

export enum NotificationType {
  NEW_PASSWORD = 'newPassword',
  NEW_IP = 'newIp',
  NEW_DEVICE_LOGIN = 'newDeviceLogin',
  SHARED_ITEMS = 'sharedItems',
  REQUEST_ACCESS = 'requestAccess'
}

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
  type: z.nativeEnum(NotificationType),
  message: z.string().min(1),
  read: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Notification = z.infer<typeof notificationSchema>;
