import { prisma } from '@server/utils';

export const getReservedStorageInMB = async () => {
  const result = await prisma.users.aggregate({
    _sum: { storageSpaceInMb: true }
  });
  return result._sum.storageSpaceInMb ?? 0n;
};
