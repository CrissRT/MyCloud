import checkDiskSpace from 'check-disk-space';

import { getReservedStorageInMB } from '@server/db';
import { convertBytesToMB, convertGBToMB } from '@server/utils';

export const getAvailableDiskSpaceinMB = async () => {
  const currentPath = process.cwd(); // Current working dir (where app is running)
  const { free } = await checkDiskSpace(currentPath);
  return convertBytesToMB(free); // Convert bytes to MB
};

export const getTotalDiskSpaceinMB = async () => {
  const currentPath = process.cwd(); // Current working dir (where app is running)
  const { size } = await checkDiskSpace(currentPath);
  return convertBytesToMB(size); // Convert bytes to MB
};

export const checkIfEnoughSpaceInMB = async (requiredSpaceInMB: bigint | number) => {
  const [availablePhysicalMB, totalPhysicalMB, reservedLogicalMB] = await Promise.all([
    getAvailableDiskSpaceinMB(), // available free space on current disk
    getTotalDiskSpaceinMB(), // total size of disk where backend is running
    getReservedStorageInMB() // sum of all allocated storage from DB
  ]);

  const enoughPhysical = availablePhysicalMB >= requiredSpaceInMB;
  const enoughUnreserved = totalPhysicalMB - reservedLogicalMB >= requiredSpaceInMB;

  return enoughPhysical && enoughUnreserved;
};

export const checkIfEnoughSpaceInGB = async (requiredSpaceInGB: bigint | number) =>
  await checkIfEnoughSpaceInMB(convertGBToMB(requiredSpaceInGB));
