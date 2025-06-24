'use server';

import i18next from 'i18next';
import Backend from 'i18next-fs-backend';

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
        translation: en
      },
      ro: {
        translation: ro
      },
      ru: {
        translation: ru
      }
    },
    interpolation: {
      escapeValue: false
    },
    react: { useSuspense: false }
  });
  return instance;
}
