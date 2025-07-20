import express from 'express';

import { getGeneralPreferenceByUserId, getUserByEmail, updateGeneralPreferenceByUserEmail } from '@server/db';
import { AuthenticatedRequest, generalPreferencesUpdateSchema, Profile } from '@server/models';
import { authenticateWithCookie, getProfileImageInBase64 } from '@server/utils';
import { ErrorCodes } from '@shared/types';

const router = express.Router();

router.get('/me', authenticateWithCookie, async (req: AuthenticatedRequest, res) => {
  try {
    const foundUser = await getUserByEmail(req.user!.email);

    const foundGeneralPreferences = await getGeneralPreferenceByUserId(foundUser!.id);

    const response: Profile = {
      email: req.user!.email,
      username: req.user!.username,
      firstName: req.user!.firstName,
      lastName: req.user!.lastName,
      storageSpaceInMB: req.user!.storageSpaceInMB,
      usedStorageInBytes: req.user!.usedStorageInBytes,
      role: req.user!.role,
      sex: req.user!.sex,
      birthDate: req.user!.birthDate,
      layout: foundGeneralPreferences?.layout || 'grid',
      profileImage: await getProfileImageInBase64(req.user!.username, foundUser!.profileImage)
    };

    res.json(response);
  } catch (error) {
    console.error('Error during Google OAuth:', error);
    res.status(500).json({
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: req.t('errors.internalServerError')
    });
  }
});

router.patch('/preferences', authenticateWithCookie, async (req: AuthenticatedRequest, res) => {
  try {
    const resultParse = generalPreferencesUpdateSchema.safeParse(req.body);

    if (!resultParse.success) {
      res.status(400).json({
        code: ErrorCodes.ZOD_ERROR,
        message: resultParse.error.formErrors
      });
      return;
    }

    const updatedPreferences = await updateGeneralPreferenceByUserEmail(req.user!.email, resultParse.data);
    res.status(200).json(updatedPreferences);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: req.t('errors.internalServerError')
    });
  }
});
export { router as accountRouter };
