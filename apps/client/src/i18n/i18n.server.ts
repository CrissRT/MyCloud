'use server';

import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
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

export default async function createServerI18n(lng: string) {
  const instance = i18next.createInstance();
  await instance.use(Backend).init({
    lng,
    fallbackLng: i18nConfig.defaultLocale,
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
  return instance;
}
