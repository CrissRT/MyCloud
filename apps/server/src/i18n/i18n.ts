import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import * as middleware from 'i18next-http-middleware';
// import path from 'path';
// import { fileURLToPath } from 'url';
import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';
import enTranslationZod from 'zod-i18n-map/locales/en/zod.json';
import roTranslationZod from 'zod-i18n-map/locales/ro/zod.json';
import ruTranslationZod from 'zod-i18n-map/locales/ru/zod.json';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
import { Language } from '@shared/models';

import enTranslation from './locales/en.json';
import roTranslation from './locales/ro.json';
import ruTranslation from './locales/ru.json';

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: Language.EN,
    preload: [Language.EN, Language.RU, Language.RO],
    // backend: {
    //   loadPath: path.resolve(__dirname, 'locales', '{{lng}}.json')
    // },
    resources: {
      [Language.EN]: { translation: { ...enTranslation, ...enTranslationZod } },
      [Language.RU]: { translation: { ...ruTranslation, ...ruTranslationZod } },
      [Language.RO]: { translation: { ...roTranslation, ...roTranslationZod } }
    },
    detection: {
      order: ['querystring', 'cookie', 'header'],
      caches: ['cookie', 'header']
    }
  });

z.setErrorMap(zodI18nMap);

export { z };
export const i18n = i18next;
