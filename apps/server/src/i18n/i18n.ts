import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import * as middleware from 'i18next-http-middleware';

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'ro'],
    backend: {
      loadPath: 'src/i18n/locales/{{lng}}.json'
    },
    detection: {
      order: ['querystring', 'cookie', 'header'],
      caches: ['cookie', 'header']
    }
  });

export const i18n = i18next;
