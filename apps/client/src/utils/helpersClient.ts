'use client';

import { PostAuthRegisterResponse } from '@client/api/openapi/requests';

export const setLocalStorageUser = (user: PostAuthRegisterResponse) =>
  localStorage.setItem('user', JSON.stringify(user));

export const getLocalStorageUser = () => {
  const user = localStorage.getItem('user');
  try {
    if (user) return JSON.parse(user);

    return null;
  } catch {
    return null;
  }
};

export const removeLocalStorageUser = () => localStorage.removeItem('user');
