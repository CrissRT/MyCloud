import { GeneralPreferences, GeneralPreferencesUpdate } from '@server/models';
import { prisma } from '@server/utils';

export const createGeneralPreference = async (
  data: Partial<Omit<GeneralPreferences, 'id'>> & Pick<GeneralPreferences, 'userId'>
) => {
  const createdPreference = await prisma.preferences.create({
    data
  });

  return createdPreference;
};

export const getGeneralPreferenceByUserId = async (userId: number) => {
  const preference = await prisma.preferences.findUnique({
    where: { userId }
  });

  return preference;
};

export const updateGeneralPreferenceByUserId = async (userId: number, data: GeneralPreferencesUpdate) => {
  const updatedPreference = await prisma.preferences.update({
    where: { userId },
    data
  });

  return updatedPreference;
};

export const updateGeneralPreferenceByUserEmail = async (email: string, data: GeneralPreferencesUpdate) => {
  const updatedPreference = await prisma.preferences.updateManyAndReturn({
    where: { users: { email } },
    data
  });

  return updatedPreference[0];
};
