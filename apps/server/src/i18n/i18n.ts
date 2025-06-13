import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import * as middleware from 'i18next-http-middleware';
import { z } from 'zod';
import { makeZodI18nMap } from 'zod-i18n-map';
import enTranslationZod from 'zod-i18n-map/locales/en/zod.json';
import roTranslationZod from 'zod-i18n-map/locales/ro/zod.json';
import ruTranslationZod from 'zod-i18n-map/locales/ru/zod.json';

import { Language } from '@shared/models';

import enTranslation from './locales/en.json';
import roTranslation from './locales/ro.json';
import ruTranslation from './locales/ru.json';

await i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: Language.EN,
    preload: [Language.EN, Language.RU, Language.RO],
    ns: ['translation', 'zod'],
    defaultNS: 'translation',
    resources: {
      [Language.EN]: { translation: enTranslation, zod: enTranslationZod },
      [Language.RU]: { translation: ruTranslation, zod: ruTranslationZod },
      [Language.RO]: { translation: roTranslation, zod: roTranslationZod }
    },
    detection: {
      order: ['querystring', 'cookie', 'header'],
      caches: ['cookie', 'header']
    }
  });
z.setErrorMap(makeZodI18nMap({ ns: 'zod', t: i18next.t }));

export { z };
export const i18n = i18next;
