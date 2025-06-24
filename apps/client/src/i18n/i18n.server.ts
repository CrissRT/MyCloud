'use server';

import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import enZod from 'zod-i18n-map/locales/en/zod.json';
import roZod from 'zod-i18n-map/locales/ro/zod.json';
import ruZod from 'zod-i18n-map/locales/ru/zod.json';

import en from './locales/en.json';
import ro from './locales/ro.json';
import ru from './locales/ru.json';
import { i18nConfig } from './settings';

export default async function createServerI18n(lng: string) {
  const instance = i18next.createInstance();
  await instance.use(Backend).init({
    lng,
    fallbackLng: i18nConfig.defaultLocale,
    resources: {
      en: {
        translation: en,
        zod: enZod
      },
      ro: {
        translation: ro,
        zod: roZod
      },
      ru: {
        translation: ru,
        zod: ruZod
      }
    },
    interpolation: {
      escapeValue: false
    },
    react: { useSuspense: false }
  });
  return instance;
}
