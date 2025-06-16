import { z } from 'zod';

import { $Enums } from '@prisma/client';

export enum Appearance {
  LIGHT = 'light',
  DARK = 'dark',
  DEVICE = 'device'
}

export enum Language {
  EN = 'en',
  RO = 'ro',
  RU = 'ru'
}

export enum Density {
  COMFORTABLE = 'comfortable',
  COSY = 'cosy',
  COMPACT = 'compact'
}

export enum OpenFiles {
  PREVIEW = 'preview',
  NEW_TAB = 'newTab'
}

export enum Layout {
  LIST = 'list',
  GRID = 'grid'
}

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
