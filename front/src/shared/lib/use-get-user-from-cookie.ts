import { useGetTokenFromCookie } from '@/src/shared/lib/use-get-token-from-cookie';
import { jwtDecode } from 'jwt-decode';

export type UserInfo = {
  id: number;
  username: string;
  email: string;
  iat: number;
};

export const useGetUserFromToken = () => {
  const { getToken } = useGetTokenFromCookie();

  const getUserInfo = async (withRedirect: boolean = true) => {
    const token = await getToken(withRedirect);

    if (token) {
      return {
        user: jwtDecode<UserInfo>(token),
        token,
      };
    }

    return null;
  };

  return { getUserInfo };
};
