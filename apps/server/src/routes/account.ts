import express from 'express';

import { AuthenticatedRequest } from '@server/models';
import { authenticateWithCookie } from '@server/utils';
import { ErrorCodes } from '@shared/types';

const router = express.Router();

router.get('/me', authenticateWithCookie, (req: AuthenticatedRequest, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('Error during Google OAuth:', error);
    res.status(500).json({
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: req.t('errors.internalServerError')
    });
  }
});

export { router as accountRouter };
