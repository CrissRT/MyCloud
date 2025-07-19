'use server';

import { cookies } from 'next/headers';

export const logOutUser = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('user_session');
};
