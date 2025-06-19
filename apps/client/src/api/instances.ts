import axios from 'axios';

import { createApiClient } from '@client/api';
import { getAPIBaseUrl } from '@client/utils';

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
