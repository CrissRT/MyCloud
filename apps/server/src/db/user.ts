import { User } from '@server/models';
import { prisma } from '@server/utils';

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

export const createUser = async ({
  email,
  username,
  password,
  firstName,
  lastName,
  birthDate,
  role,
  sex
}: Omit<User, 'id' | 'createdAt'>) => {
  // Use transaction to ensure atomicity of user and storage creation
  const result = await prisma.$transaction(async (tx) => {
    // Create user
    const user = await tx.users.create({
      data: {
        email,
        username,
        password,
        firstName,
        lastName,
        birthDate,
        role,
        sex
      }
    });

    // Create storage for the user
    await tx.storage.create({
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
