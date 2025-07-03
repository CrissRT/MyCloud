'use client';

import { createContext, PropsWithChildren, useState } from 'react';
import { PostAuthRegisterResponse } from '@client/api/openapi/requests';
import { getLocalStorageUser, removeLocalStorageUser, setLocalStorageUser } from '@client/utils';

interface AuthContextProps {
  user: PostAuthRegisterResponse | null;
  login: (userData: PostAuthRegisterResponse) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<PostAuthRegisterResponse | null>(getLocalStorageUser);

  const login = (userData: PostAuthRegisterResponse) => {
    setLocalStorageUser(userData);
    setUser(userData);
  };

  const logout = () => {
    removeLocalStorageUser();
    setUser(null);
  };

  return <AuthContext value={{ user, login, logout }}>{children}</AuthContext>;
};
