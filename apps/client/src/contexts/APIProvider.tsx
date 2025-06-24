'use client';

import { PropsWithChildren, useEffect } from 'react';
import { OpenAPI } from '@client/api/openapi/requests';
import { routing } from '@client/i18n';
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
      const language = getCookie('NEXT_LOCALE') || routing.defaultLocale;
      if (!config.headers) config.headers = {};

      config.headers['Accept-Language'] = language;

      return config;
    });
  }, []);

  return children;
};
