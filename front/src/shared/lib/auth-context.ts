'use client';
import { createContext, type PropsWithChildren, useContext } from 'react';

export type WithProviderProps<P = unknown> = PropsWithChildren<P> & {
  isLoggedIn?: boolean;
};

type WithLoggedInProviderProps = WithProviderProps<{
  isLoggedIn?: boolean;
  login?: (isLoggedIn: boolean) => void;
}>;

export const AuthContext = createContext<WithLoggedInProviderProps>(
  {} as WithLoggedInProviderProps,
);

export const useAuth = () => useContext(AuthContext);
