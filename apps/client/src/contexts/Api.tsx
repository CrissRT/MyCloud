'use client';

import { PropsWithChildren, useEffect } from 'react';
import { OpenAPI } from '@client/api/openapi/requests';
import { i18nConfig } from '@client/i18n/settings';
import { getAPIBaseUrl } from '@client/utils';

export const APIProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    OpenAPI.BASE = getAPIBaseUrl();

    // ensure cookies are sent with every request
    OpenAPI.fetch = (input, init) => fetch(input, { ...init, credentials: 'include' });

    // set language header
    OpenAPI.interceptors.request.use(async (config) => {
      const language = i18nConfig.defaultLocale;

      if (!config.headers) config.headers = {};
      config.headers['Accept-Language'] = language;

      return config;
    });
  }, []);

  return children;
};
