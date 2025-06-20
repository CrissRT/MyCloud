import { cookies } from 'next/headers';

import { axiosInstance } from '@client/api';
import { routing } from '@client/i18n/routing';

axiosInstance.interceptors.request.use(
  async (config) => {
    const cookieStore = await cookies();

    const language = cookieStore.get('NEXT_LOCALE')?.value || routing.defaultLocale;
    config.headers['Accept-Language'] = language;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
