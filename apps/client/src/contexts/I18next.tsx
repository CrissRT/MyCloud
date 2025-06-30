'use client';

import { usePathname } from 'next/navigation';
import { z } from 'zod';
import { makeZodI18nMap } from 'zod-i18n-map';

import { PropsWithChildren, useEffect, useRef } from 'react';
import { I18nextProvider } from 'react-i18next';
import { initI18nClient } from '@client/i18n/i18n.client';

export const AppI18nextProvider = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const currentLanguage = pathname.split('/')[1];

  // Use ref to store i18next instance to avoid recreation on every render
  const i18nextRef = useRef(initI18nClient(currentLanguage));
  const isZodInitializedRef = useRef(false);

  useEffect(() => {
    const i18next = i18nextRef.current;

    // Set up zod error map once
    if (!isZodInitializedRef.current) {
      z.setErrorMap(makeZodI18nMap({ ns: 'zod', t: i18next.t }));
      isZodInitializedRef.current = true;
    }

    // Change language if it's different from current
    if (i18next.language !== currentLanguage) {
      // Use setTimeout to defer the language change to avoid setState during render
      const timeoutId = setTimeout(() => {
        i18next.changeLanguage(currentLanguage);
      }, 0);

      return () => clearTimeout(timeoutId);
    }

    // Return empty cleanup function if no timeout was set
    return () => {};
  }, [currentLanguage]);

  return <I18nextProvider i18n={i18nextRef.current}>{children}</I18nextProvider>;
};
