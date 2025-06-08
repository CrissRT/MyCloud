import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import * as middleware from 'i18next-http-middleware';
import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';

import { Language } from '@server/models';

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: Language.EN,
    preload: [Language.EN, Language.RU, Language.RO],
    backend: {
      loadPath: 'src/i18n/locales/{{lng}}.json'
    },
    detection: {
      order: ['querystring', 'cookie', 'header'],
      caches: ['cookie', 'header']
    }
  });

z.setErrorMap(zodI18nMap);

export { z };
export const i18n = i18next;
