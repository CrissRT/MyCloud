import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ro from './locales/ro.json';
import ru from './locales/ru.json';
import { i18nConfig } from './settings';

if (!i18next.isInitialized) {
  i18next.use(LanguageDetector).init({
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
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
}

export default i18next;
