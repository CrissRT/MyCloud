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

// Create a map to store instances per language to avoid hydration issues
const i18nInstances = new Map<string, typeof i18next>();

export const initI18nClient = (language: string) => {
  // Validate language and fallback to default if invalid
  const validLanguage = i18nConfig.locales.includes(language) ? language : i18nConfig.defaultLocale;

  // Check if we already have an instance for this language
  if (i18nInstances.has(validLanguage)) return i18nInstances.get(validLanguage)!;

  // Create a new instance for this language
  const instance = i18next.createInstance();

  instance.init({
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    lng: validLanguage,
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
      // Prevent hydration mismatches
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i']
    }
  });

  // Store the instance
  i18nInstances.set(validLanguage, instance);

  return instance;
};
