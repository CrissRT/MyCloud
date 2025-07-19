'use client';

import { useRouter } from 'next/navigation';

import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { GetAccountMeResponse, PostAuthLoginResponse } from '@client/api/openapi/requests';
import { getUserLocalStorage, guestRoutes, logOutUser, protectedRoutes, setUserLocalStorage } from '@client/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useMeServiceGetAccountMe } from '@client/api/openapi/queries';

interface AuthContextProps {
  user: GetAccountMeResponse | null;
  logOut: () => Promise<void>;
  login: (data: PostAuthLoginResponse) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { data: userData, isPending } = useMeServiceGetAccountMe();
  const [user, setUser] = useState<PostAuthLoginResponse | null>(getUserLocalStorage);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  useEffect(() => {
    // Fallback to localStorage if userData is not available
    if (userData && !isPending) {
      setUser(userData);
      setUserLocalStorage(userData);
    }
  }, [userData, isPending]);

  const login = async (data: PostAuthLoginResponse) => {
    setUser(data);
    setUserLocalStorage(data);
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
