import 'server-only';
import { getToken } from '@/src/shared/lib/get-token';
import { jwtDecode } from 'jwt-decode';

type UserInfo = {
  id: number;
  username: string;
  email: string;
  iat: number;
};

export const getUserFromToken = (): UserInfo | null => {
  const token = getToken();
  if (token) {
    return jwtDecode<UserInfo>(token);
  }
  return null;
};
