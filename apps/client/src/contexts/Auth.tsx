'use client';

import { useRouter } from 'next/navigation';

import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { PostAuthRegisterResponse } from '@client/api/openapi/requests';
import { getUser, guestRoutes, logOutUser, protectedRoutes } from '@client/utils';

interface AuthContextProps {
  user: PostAuthRegisterResponse | null;
  logOut: () => Promise<void>;
  login: () => Promise<void>;
}

interface Props extends PropsWithChildren {
  client: PostAuthRegisterResponse | null;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children, client }: Props) => {
  const [user, setUser] = useState<PostAuthRegisterResponse | null>(client);
  const router = useRouter();

  // Sync initial client prop (from SSR) to state
  useEffect(() => {
    setUser(client);
  }, [client]);

  const login = async () => {
    const userData = await getUser();
    router.push(protectedRoutes.dashboard);
    if (userData) setUser(userData);
  };

  const logOut = async () => {
    await logOutUser();
    router.push(guestRoutes.login);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, logOut, login }}>{children}</AuthContext.Provider>;
};
