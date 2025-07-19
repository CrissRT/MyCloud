'use client';

import { useRouter } from 'next/navigation';

import { createContext, PropsWithChildren, useState, useEffect } from 'react';
import { GetAccountMeResponse, PostAuthLoginResponse } from '@client/api/openapi/requests';
import { guestRoutes, logOutUser, protectedRoutes } from '@client/utils';
import { useMeServiceGetAccountMe, useMeServiceGetAccountMeKey } from '@client/api/openapi/queries';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface AuthContextProps {
  user: GetAccountMeResponse | null;
  logOut: () => Promise<void>;
  login: (data: PostAuthLoginResponse) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { data: userData, isPending } = useMeServiceGetAccountMe();
  const [user, setUser] = useState<GetAccountMeResponse | null>(userData || null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  useEffect(() => {
    if (userData && !isPending) setUser(userData);
  }, [userData]);

  const login = async (data: PostAuthLoginResponse) => {
    setUser(data);
    router.push(protectedRoutes.dashboard);
  };

  const logOut = async () => {
    try {
      setUser(null);
      await logOutUser();
      queryClient.clear();
    } catch (error) {
      toast.error(t('errors.logout'));
    } finally {
      router.push(guestRoutes.login);
    }
  };

  return <AuthContext.Provider value={{ user, logOut, login }}>{children}</AuthContext.Provider>;
};
