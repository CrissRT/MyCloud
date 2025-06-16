import { prisma } from '@server/app';
import { User } from '@shared/models';

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id: Number(id) } });
  return user as User | null;
};

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  return user as User | null;
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
  const user: User = await prisma.user.create({
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
