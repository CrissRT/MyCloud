import { User } from '@server/models';
import { prisma } from '@server/utils';

export const getUserById = async (id: string) => {
  const user = await prisma.users.findUnique({ where: { id: Number(id) } });
  return user;
};

export const getUserByEmail = async (email: string) => {
  const user = await prisma.users.findUnique({ where: { email } });
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
