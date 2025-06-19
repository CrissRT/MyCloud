import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { join } from 'path';

import { i18nConfig } from '@client/i18n';

export default async function createServerI18n(lng: string) {
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
    react: { useSuspense: false }
  });
  return instance;
}
