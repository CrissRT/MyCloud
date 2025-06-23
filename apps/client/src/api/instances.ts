import axios from 'axios';

import { getAPIBaseUrl } from '@client/utils';

import { createApiClient } from './openapi';

const baseUrl = getAPIBaseUrl();

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const zodiosInstance = createApiClient(baseUrl, {
  axiosInstance
});
