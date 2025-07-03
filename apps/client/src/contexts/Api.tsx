'use client';

import { PropsWithChildren, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { OpenAPI } from '@client/api/openapi/requests';
import { getAPIBaseUrl } from '@client/utils';

export const APIProvider = ({ children }: PropsWithChildren) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    OpenAPI.BASE = getAPIBaseUrl();
    // send HTTP-only cookies with every request
    OpenAPI.WITH_CREDENTIALS = true;
    OpenAPI.CREDENTIALS = 'include';
  }, []);

  useEffect(() => {
    OpenAPI.interceptors.request.use(async (config) => {
      if (!config.headers) config.headers = {};
      config.headers['Accept-Language'] = i18n.language;
      return config;
    });
  }, [i18n.language]);

  return children;
};
