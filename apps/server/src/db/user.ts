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
  const user = await prisma.users.create({
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
  return user;
};

export const updateUserById = async (id: number, data: Partial<User>) => {
  const user = await prisma.users.update({
    where: { id },
    data
  });
  return user;
};
