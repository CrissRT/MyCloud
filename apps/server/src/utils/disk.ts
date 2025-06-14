import checkDiskSpace from 'check-disk-space';

export const getAvailableSpaceinMB = async () => {
  const currentPath = process.cwd(); // Current working dir (where app is running)
  const { free } = await checkDiskSpace(currentPath);
  return free / (1024 * 1024); // Convert bytes to MB
};

export const getTotalSpaceinMB = async () => {
  const currentPath = process.cwd(); // Current working dir (where app is running)
  const { size } = await checkDiskSpace(currentPath);
  return size / (1024 * 1024); // Convert bytes to MB
};

export const getAvailableSpaceinGB = async () => {
  const currentPath = process.cwd(); // Current working dir (where app is running)
  const { free } = await checkDiskSpace(currentPath);
  return free / (1024 * 1024 * 1024); // Convert bytes to GB
};

export const getTotalSpaceinGB = async () => {
  const currentPath = process.cwd(); // Current working dir (where app is running)
  const { size } = await checkDiskSpace(currentPath);
  return size / (1024 * 1024 * 1024); // Convert bytes to GB
};

export const checkIfEnoughSpaceInMB = async (requiredSpaceInMB: bigint) => {
  const availableSpace = await getAvailableSpaceinMB();
  return availableSpace >= requiredSpaceInMB;
};

export const checkIfEnoughSpaceInGB = async (requiredSpaceInGB: bigint) => {
  const availableSpace = await getAvailableSpaceinGB();
  return availableSpace >= requiredSpaceInGB;
};
