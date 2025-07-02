import { prisma } from '@server/utils';

export const getStorageInfoByUserId = async (userId: number) => {
  const storageInfo = await prisma.storage.findUnique({
    where: { userId }
  });

  return storageInfo;
};

export const createStorageInfo = async (userId: number) => {
  const storageInfo = await prisma.storage.create({
    data: {
      userId
    }
  });

  return storageInfo;
};
