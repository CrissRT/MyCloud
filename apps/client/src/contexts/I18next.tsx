'use client';

import { usePathname } from 'next/navigation';
import { z } from 'zod';
import { makeZodI18nMap } from 'zod-i18n-map';

import { PropsWithChildren, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { initI18nClient } from '@client/i18n/i18n.client';

export const AppI18nextProvider = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();

  const i18next = initI18nClient(pathname.split('/')[1]);

  useEffect(() => {
    z.setErrorMap(makeZodI18nMap({ ns: 'zod', t: i18next.t }));
    i18next.changeLanguage(pathname.split('/')[1]);
  }, [pathname, i18next]);

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
};
