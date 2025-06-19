import axios from 'axios';
import { createApiClient } from './openapi';

const axiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const zodiosInstance = createApiClient('https://jsonplaceholder.typicode.com', {
  axiosInstance
});
