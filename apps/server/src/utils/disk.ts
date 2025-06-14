import checkDiskSpace from 'check-disk-space';

import { getReservedStorageInMB } from '@server/db';
import { convertBytesToGB, convertBytesToMB, convertGBToMB } from '@server/utils';

export const getAvailableSpaceinMB = async () => {
  const currentPath = process.cwd(); // Current working dir (where app is running)
  const { free } = await checkDiskSpace(currentPath);
  return convertBytesToMB(free); // Convert bytes to MB
};

export const getTotalSpaceinMB = async () => {
  const currentPath = process.cwd(); // Current working dir (where app is running)
  const { size } = await checkDiskSpace(currentPath);
  return convertBytesToMB(size); // Convert bytes to MB
};

export const getAvailableSpaceinGB = async () => {
  const currentPath = process.cwd(); // Current working dir (where app is running)
  const { free } = await checkDiskSpace(currentPath);
  return convertBytesToGB(free); // Convert bytes to GB
};

export const getTotalSpaceinGB = async () => {
  const currentPath = process.cwd(); // Current working dir (where app is running)
  const { size } = await checkDiskSpace(currentPath);
  return convertBytesToGB(size); // Convert bytes to GB
};

export const checkIfEnoughSpaceInMB = async (requiredSpaceInMB: bigint) => {
  const [availablePhysicalMB, totalPhysicalMB, reservedLogicalMB] = await Promise.all([
    getAvailableSpaceinMB(), // available free space on current disk
    getTotalSpaceinMB(), // total size of disk where backend is running
    getReservedStorageInMB() // sum of all allocated storage from DB
  ]);

  const enoughPhysical = availablePhysicalMB >= requiredSpaceInMB;
  const enoughUnreserved = totalPhysicalMB - reservedLogicalMB >= requiredSpaceInMB;

  return enoughPhysical && enoughUnreserved;
};

export const checkIfEnoughSpaceInGB = async (requiredSpaceInGB: bigint) =>
  await checkIfEnoughSpaceInMB(convertGBToMB(requiredSpaceInGB));
