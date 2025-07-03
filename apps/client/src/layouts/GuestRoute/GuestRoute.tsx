'use client';

import { useRouter } from 'next/navigation';

import { PropsWithChildren } from 'react';
import { useAuth } from '@client/hooks';
import { routes } from '@client/utils';

export const GuestRoute = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return children;

  router.replace(routes.home);
  return;
};
