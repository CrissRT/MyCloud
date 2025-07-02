import { prisma } from '@server/utils';

export const getReservedStorageInMB = async () => {
  const result = await prisma.storage.aggregate({
    _sum: { storageSpaceInMB: true }
  });
  return result._sum.storageSpaceInMB ?? 0n;
};
