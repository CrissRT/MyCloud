'use client';

import { PropsWithChildren, useEffect } from 'react';
import { OpenAPI } from '@client/api/openapi/requests';
import { i18nConfig } from '@client/i18n/settings';
import { getAPIBaseUrl } from '@client/utils';

const getCookie = (name: string) => {
  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
  return cookieValue;
};

export const APIProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    OpenAPI.BASE = getAPIBaseUrl();

    OpenAPI.interceptors.request.use(async (config) => {
      const language = getCookie('NEXT_LOCALE') || i18nConfig.defaultLocale;

      if (!config.headers) config.headers = {};

      config.headers['Accept-Language'] = language;

      config.headers['Content-Type'] = 'application/json';

      return config;
    });
  }, []);

  return children;
};
