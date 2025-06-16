import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import * as middleware from 'i18next-http-middleware';
import enTranslationZod from 'zod-i18n-map/locales/en/zod.json';
import roTranslationZod from 'zod-i18n-map/locales/ro/zod.json';
import ruTranslationZod from 'zod-i18n-map/locales/ru/zod.json';

import { $Enums } from '@prisma/client';

import enTranslation from './locales/en.json';
import roTranslation from './locales/ro.json';
import ruTranslation from './locales/ru.json';

await i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: $Enums.languageEnum.en,
    preload: [$Enums.languageEnum.en, $Enums.languageEnum.ru, $Enums.languageEnum.ro],
    ns: ['translation', 'zod'],
    defaultNS: 'translation',
    resources: {
      [$Enums.languageEnum.en]: { translation: enTranslation, zod: enTranslationZod },
      [$Enums.languageEnum.ru]: { translation: ruTranslation, zod: ruTranslationZod },
      [$Enums.languageEnum.ro]: { translation: roTranslation, zod: roTranslationZod }
    },
    detection: {
      order: ['querystring', 'header', 'cookie'],
      caches: ['cookie', 'header']
    }
  });

export const i18n = i18next;
