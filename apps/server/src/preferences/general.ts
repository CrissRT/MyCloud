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
  cosy = 'cosy',
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

export interface GeneralPreferences {
  id: number;
  userId: number;
  appearance: Appearance;
  density: Density;
  openFiles: OpenFiles;
  layout: Layout;
  language: Language;
}
