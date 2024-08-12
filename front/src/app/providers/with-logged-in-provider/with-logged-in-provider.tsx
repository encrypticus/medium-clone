'use client';
import type { FC } from 'react';
import { useState } from 'react';

import type { WithProviderProps } from '@/src/shared/lib/auth-context';
import { AuthContext } from '@/src/shared/lib/auth-context';

type WithLoggedInProviderProps = WithProviderProps<{
  isLoggedIn?: boolean;
  login?: (isLoggedIn: boolean) => void;
}>;

export const WithLoggedInProvider: FC<WithLoggedInProviderProps> = ({
  children,
  isLoggedIn: isLogged,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(isLogged);

  const login = (isLoggedIn: boolean) => setIsLoggedIn(isLoggedIn);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
