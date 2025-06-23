import axios from 'axios';

import { getAPIBaseUrl } from '@client/utils';

const baseUrl = getAPIBaseUrl();

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});
