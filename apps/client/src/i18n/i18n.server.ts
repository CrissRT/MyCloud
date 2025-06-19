import i18next, { i18n } from 'i18next';
import Backend from 'i18next-fs-backend';
import { join } from 'path';

import { i18nConfig } from '@client/i18n';

const instanceCache: Record<string, i18n> = {};

export default async function createServerI18n(lng: string) {
  if (instanceCache[lng]) return instanceCache[lng];

  const instance = i18next.createInstance();
  await instance.use(Backend).init({
    lng,
    fallbackLng: i18nConfig.defaultLocale,
    backend: {
      loadPath: join(process.cwd(), 'src/i18n/locales/{{lng}}.json')
    },
    interpolation: {
      escapeValue: false
    },
    react: { useSuspense: true }
  });

  instanceCache[lng] = instance;

  return instance;
}
