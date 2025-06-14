import checkDiskSpace from 'check-disk-space';

import { convertBytesToGB, convertBytesToMB } from './converters';

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
  const availableSpace = await getAvailableSpaceinMB();
  return availableSpace >= requiredSpaceInMB;
};

export const checkIfEnoughSpaceInGB = async (requiredSpaceInGB: bigint) => {
  const availableSpace = await getAvailableSpaceinGB();
  return availableSpace >= requiredSpaceInGB;
};
