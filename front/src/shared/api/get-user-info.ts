import 'server-only';
import axios, { AxiosError } from 'axios';
import { Api } from '@/src/shared/endpoints';
import { getToken } from '@/src/shared/lib/get-token';
import { JWT_TOKEN_KEY } from '@/src/shared/constants';

interface UserEntity {
  id: number;
  username: string;
  email: string;
  bio: string;
  image: string;
  password: string;
}

interface UserResponse {
  user: UserEntity & { token: string };
}

export const getUserInfo = async (): Promise<UserResponse['user']> => {
  const token = getToken();

  if (!token) {
    throw new AxiosError('Unauthorized');
  }

  try {
    const res = await axios.get<UserResponse>(Api.user.getInfo, {
      headers: {
        Authorization: `Token ${token}`,
        Cookie: `${JWT_TOKEN_KEY}=${token}`,
      },
      withCredentials: true,
    });

    return res.data.user;
  } catch (error) {
    throw new AxiosError('Failed to fetch user info');
  }
};
