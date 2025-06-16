import { z } from 'zod';

import { $Enums } from '@prisma/client';

export const generalPreferencesSchema = z.object({
  id: z.number().int().nonnegative(),
  userId: z.number().int().nonnegative(),
  appearance: z.nativeEnum($Enums.appearanceEnum),
  density: z.nativeEnum($Enums.densityEnum),
  openFiles: z.nativeEnum($Enums.openFilesEnum),
  layout: z.nativeEnum($Enums.layoutEnum),
  language: z.nativeEnum($Enums.languageEnum)
});

export type GeneralPreferences = z.infer<typeof generalPreferencesSchema>;
