import express from 'express';

import { getGeneralPreferenceByUserId, getUserByEmail } from '@server/db';
import { AuthenticatedRequest, Profile } from '@server/models';
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
      layout: foundGeneralPreferences!.layout,
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

export { router as accountRouter };
