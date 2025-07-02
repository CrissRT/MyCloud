'use client';

import { createContext, PropsWithChildren, useState } from 'react';
import { PostAuthRegisterResponse } from '@client/api/openapi/requests';

interface AuthContextProps {
  user: PostAuthRegisterResponse | null;
  login: (userData: PostAuthRegisterResponse) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<PostAuthRegisterResponse | null>(null);

  const login = (userData: PostAuthRegisterResponse) => setUser(userData);

  const logout = () => setUser(null);

  return <AuthContext value={{ user, login, logout }}>{children}</AuthContext>;
};
