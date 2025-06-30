'use client';

import { usePathname } from 'next/navigation';

import { useEffect, useState } from 'react';
import { i18nConfig } from '@client/i18n/settings';

export const useLanguage = () => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Extract language from pathname
  const pathLanguage = pathname.split('/')[1];

  // Validate and fallback to default if invalid
  const validLanguage = i18nConfig.locales.includes(pathLanguage) ? pathLanguage : i18nConfig.defaultLocale;

  return {
    language: validLanguage,
    isClient
  };
};
