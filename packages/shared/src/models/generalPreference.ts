import { z } from '@server/i18n';

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
  appearance: z.nativeEnum(Appearance),
  density: z.nativeEnum(Density),
  openFiles: z.nativeEnum(OpenFiles),
  layout: z.nativeEnum(Layout),
  language: z.nativeEnum(Language)
});

export type GeneralPreferences = z.infer<typeof generalPreferencesSchema>;
