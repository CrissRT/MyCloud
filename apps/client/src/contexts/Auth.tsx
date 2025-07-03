'use client';

import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { PostAuthRegisterResponse } from '@client/api/openapi/requests';

interface AuthContextProps {
  user: PostAuthRegisterResponse | null;
}

interface Props extends PropsWithChildren {
  client: PostAuthRegisterResponse | null;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children, client }: Props) => {
  const [user, setUser] = useState<PostAuthRegisterResponse | null>(client);

  useEffect(() => {
    setUser(client);
  }, [client]);

  return <AuthContext value={{ user }}>{children}</AuthContext>;
};
