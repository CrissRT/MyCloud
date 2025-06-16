import { prisma } from '@server/utils';

export const getReservedStorageInMB = async () => {
  const result = await prisma.users.aggregate({
    _sum: { storageSpaceInMb: true }
  });
  return BigInt(result._sum.storageSpaceInMb ?? 0);
};
