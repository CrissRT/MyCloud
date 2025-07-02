import { prisma } from '@server/utils';

export const createResetToken = async (token: string, userId: number) => {
  const resetToken = await prisma.resetTokens.create({
    data: {
      token,
      userId
    }
  });
  return resetToken;
};

export const getResetTokenByUserId = async (userId: number) => {
  const resetToken = await prisma.resetTokens.findFirst({
    where: {
      userId
    }
  });
  return resetToken;
};

export const getResetTokenByUserMail = async (email: string) => {
  const resetToken = await prisma.resetTokens.findFirst({
    where: {
      users: {
        email
      }
    },
    include: {
      users: true
    }
  });
  return resetToken;
};

export const deleteResetTokenByUserId = async (userId: number) => {
  await prisma.resetTokens.deleteMany({
    where: {
      userId
    }
  });
};
