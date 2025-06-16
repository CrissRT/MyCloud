import { prisma } from '@server/app';

export const getReservedStorageInMB = async () => {
  const result = await prisma.user.aggregate({
    _sum: { storageSpaceInMb: true }
  });
  return BigInt(result._sum.storageSpaceInMb ?? 0);
};
