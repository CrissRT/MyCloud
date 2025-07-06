import { NotificationPreferences } from '@server/models';
import { prisma } from '@server/utils';

export const createNotificationPreferences = async (
  data: Omit<Partial<NotificationPreferences>, 'id' | 'createdAt'> & Pick<NotificationPreferences, 'userId'>
) => {
  const createdNotification = await prisma.notificationPreferences.create({
    data
  });
  return createdNotification;
};
