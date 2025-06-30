'use server';

import i18next, { i18n } from 'i18next';
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

// Cache for server instances to improve performance
const serverInstances = new Map<string, i18n>();

export default async function createServerI18n(lng: string) {
  // Validate language and fallback to default if invalid
  const validLanguage = i18nConfig.locales.includes(lng) ? lng : i18nConfig.defaultLocale;

  // Check cache first
  if (serverInstances.has(validLanguage)) return serverInstances.get(validLanguage);

  const instance = i18next.createInstance();

  await instance.use(Backend).init({
    lng: validLanguage,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
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
    react: {
      useSuspense: false,
      // Ensure consistent rendering
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i']
    }
  });

  // Cache the instance
  serverInstances.set(validLanguage, instance);

  return instance;
}
