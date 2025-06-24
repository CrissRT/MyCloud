'use client';

import { usePathname } from 'next/navigation';

import { PropsWithChildren, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18next from '@client/i18n/i18n.client';

export const AppI18nextProvider = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();

  useEffect(() => {
    i18next.changeLanguage(pathname.split('/')[1]);
  }, [pathname]);

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
};
