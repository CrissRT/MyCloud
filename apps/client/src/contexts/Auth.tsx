'use client';

import { usePathname } from 'next/navigation';

import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { PostAuthRegisterResponse } from '@client/api/openapi/requests';
import { getUser } from '@client/utils';

interface AuthContextProps {
  user: PostAuthRegisterResponse | null;
}

interface Props extends PropsWithChildren {
  client: PostAuthRegisterResponse | null;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children, client }: Props) => {
  const [user, setUser] = useState<PostAuthRegisterResponse | null>(client);
  const pathname = usePathname();

  // Sync initial client prop (from SSR) to state
  useEffect(() => {
    setUser(client);
  }, [client]);

  // Refresh user info on client-side route changes
  useEffect(() => {
    async function refreshUser() {
      const fresh = await getUser();
      setUser(fresh);
    }
    refreshUser();
  }, [pathname]);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};
