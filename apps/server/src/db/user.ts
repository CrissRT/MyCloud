import { $Enums } from '@prisma/client';
import { User } from '@server/models';
import {
  DEFAULT_STORAGE_SPACE_IN_MB,
  DEFAULT_USED_STORAGE_SPACE,
  prisma,
  sanitizeNameForDatabase
} from '@server/utils';

export const getUserById = async (id: number) => {
  const user = await prisma.users.findUnique({ where: { id } });
  if (!user) return null;

  return user;
};

export const getUserByEmail = async (email: string) => {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) return null;

  return user;
};

export const createUserAndStorageAndPreferences = async ({
  email,
  username,
  password,
  firstName,
  lastName,
  birthDate,
  role,
  sex,
  language = 'en',
  profileName
}: Omit<User, 'id' | 'createdAt'> & { language?: $Enums.languageEnum; profileName: string }) => {
  // Use transaction to ensure atomicity of user, storage, and preference creation
  const result = await prisma.$transaction(async (tx) => {
    // Create user
    const user = await tx.users.create({
      data: {
        email,
        username,
        password,
        firstName: sanitizeNameForDatabase(firstName),
        lastName: sanitizeNameForDatabase(lastName),
        birthDate,
        role,
        sex,
        profileImage: profileName
      }
    });

    // Create storage for the user
    await tx.storage.create({
      data: {
        userId: user.id,
        storageSpaceInMB: DEFAULT_STORAGE_SPACE_IN_MB,
        usedStorageInBytes: DEFAULT_USED_STORAGE_SPACE
      }
    });

    // Create general preferences for the user
    await tx.preferences.create({
      data: {
        userId: user.id,
        language
      }
    });

    // Create notification preferences for the user
    await tx.notificationPreferences.create({
      data: {
        userId: user.id
      }
    });

    return user;
  });

  return result;
};

export const updateUserById = async (id: number, data: Partial<User>) => {
  const user = await prisma.users.update({
    where: { id },
    data
  });
  return user;
};
