import i18next from 'i18next';
import enZod from 'zod-i18n-map/locales/en/zod.json';
import roZod from 'zod-i18n-map/locales/ro/zod.json';
import ruZod from 'zod-i18n-map/locales/ru/zod.json';

import en from './locales/en.json';
import customEnZod from './locales/en.zod.json';
import ro from './locales/ro.json';
import customRoZod from './locales/ro.zod.json';
import ru from './locales/ru.json';
import customRuZod from './locales/ru.zod.json';
import { i18nConfig } from './settings';

export const initI18nClient = (language: string) => {
  if (!i18next.isInitialized) {
    i18next.init({
      fallbackLng: i18nConfig.defaultLocale,
      supportedLngs: i18nConfig.locales,
      lng: language,
      resources: {
        en: {
          translation: en,
          zod: enZod,
          customZod: customEnZod
        },
        ro: {
          translation: ro,
          zod: roZod,
          customZod: customRoZod
        },
        ru: {
          translation: ru,
          zod: ruZod,
          customZod: customRuZod
        }
      },
      interpolation: {
        escapeValue: false
      },
      react: { useSuspense: false }
    });
  }

  return i18next;
};
