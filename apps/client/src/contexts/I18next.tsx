'use client';

import { z } from 'zod';
import { makeZodI18nMap } from 'zod-i18n-map';

import { PropsWithChildren, useEffect, useRef } from 'react';
import { I18nextProvider } from 'react-i18next';
import { useLanguage } from '@client/hooks';
import { initI18nClient } from '@client/i18n/i18n.client';

export const AppI18nextProvider = ({ children }: PropsWithChildren) => {
  const { language: validLanguage, isClient } = useLanguage();

  // Initialize with the valid language to prevent mismatches
  const i18nextRef = useRef(initI18nClient(validLanguage));

  const isZodInitializedRef = useRef(false);

  useEffect(() => {
    if (!isClient) return;

    const i18next = i18nextRef.current;

    // Set up zod error map once on client
    if (!isZodInitializedRef.current) {
      z.setErrorMap(makeZodI18nMap({ ns: 'zod', t: i18next.t }));
      isZodInitializedRef.current = true;
    }

    // Change language if it's different from current
    if (i18next.language !== validLanguage) {
      // Use requestAnimationFrame to ensure DOM is ready
      const frameId = requestAnimationFrame(() => {
        i18next.changeLanguage(validLanguage);
      });

      return () => cancelAnimationFrame(frameId);
    }

    // Return empty cleanup function if no animation frame was set
    return () => {};
  }, [validLanguage, isClient]);

  return <I18nextProvider i18n={i18nextRef.current}>{children}</I18nextProvider>;
};
