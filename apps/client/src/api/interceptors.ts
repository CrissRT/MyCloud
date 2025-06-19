import { axiosInstance } from '@client/api';

axiosInstance.interceptors.request.use(
  (config) => {
    const language = localStorage.getItem('i18nextLng');
    if (language) config.headers['Accept-Language'] = language;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
