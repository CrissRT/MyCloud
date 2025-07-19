'use client';

import { GetAccountMeResponse } from '@client/api/openapi/requests';

export const getUserLocalStorage = (): GetAccountMeResponse | null => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user from localStorage:', error);
    return null;
  }
};

export const setUserLocalStorage = (user: GetAccountMeResponse | null) => {
  try {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  } catch (error) {
    console.error('Error setting user in localStorage:', error);
  }
};
