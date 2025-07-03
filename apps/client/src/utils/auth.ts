'use server';

import { cookies } from 'next/headers';

import { PostAuthRegisterResponse } from '@client/api/openapi/requests';

export const getUser = async () => {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user_session')?.value;

  if (!userCookie) return null;

  try {
    const result: PostAuthRegisterResponse = JSON.parse(userCookie);
    return result;
  } catch {
    return null;
  }
};

export const logOutUser = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('user_session');
};
