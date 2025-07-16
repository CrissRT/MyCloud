'use client';

import { useRouter } from 'next/navigation';

import { createContext, PropsWithChildren, useState } from 'react';
import { GetAccountMeResponse } from '@client/api/openapi/requests';
import { guestRoutes, logOutUser, protectedRoutes } from '@client/utils';
import { useMeServiceGetAccountMe } from '@client/api/openapi/queries';

interface AuthContextProps {
  user: GetAccountMeResponse | null;
  logOut: () => Promise<void>;
  login: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { data: userData } = useMeServiceGetAccountMe();
  const [user, setUser] = useState(userData || null);
  const router = useRouter();

  const login = async () => {
    router.push(protectedRoutes.dashboard);
    if (userData) setUser(userData);
  };

  const logOut = async () => {
    await logOutUser();
    router.push(guestRoutes.login);
    // await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay to ensure logout is processed
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, logOut, login }}>{children}</AuthContext.Provider>;
};
