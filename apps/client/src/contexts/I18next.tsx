'use client';

import { usePathname, useRouter } from 'next/navigation';
import { z } from 'zod';
import { makeZodI18nMap } from 'zod-i18n-map';

import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { initI18nClient } from '@client/i18n/i18n.client';
import { i18nConfig } from '@client/i18n/settings';

export const AppI18nextProvider = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Extract language from pathname
  const pathLanguage = pathname.split('/')[1];

  // Validate and fallback to default if invalid
  const validLanguage = i18nConfig.locales.includes(pathLanguage) ? pathLanguage : i18nConfig.defaultLocale;

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

  useEffect(() => {
    const instance = i18nextRef.current;
    const handler = (lng: string) => router.push(`/${lng}${pathname.slice(pathLanguage.length + 1)}`);
    instance.on('languageChanged', handler);
    return () => instance.off('languageChanged', handler);
  }, [router, pathname, pathLanguage]);

  return <I18nextProvider i18n={i18nextRef.current}>{children}</I18nextProvider>;
};
