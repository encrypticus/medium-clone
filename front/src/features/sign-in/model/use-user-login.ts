import useSWRMutation from 'swr/mutation';
import type { AxiosError } from 'axios';
import axios from 'axios';
import { Api } from '@/src/shared/endpoints';
import type { ErrorResponse } from '@/src/shared/lib';
import { useResponseError } from '@/src/shared/lib';
import type { UserLoginDto, UserResponse } from '@/src/entities/user';

export const useSwrUserLogin = () => {
  const { onError } = useResponseError();
  return useSWRMutation<
    UserResponse,
    AxiosError<ErrorResponse>,
    string,
    UserLoginDto
  >(
    'user-login',
    async (_, { arg: { email, password } }) => {
      const res = await axios.post(
        Api.auth.login,
        {
          user: {
            email,
            password,
          },
        },
        { withCredentials: true },
      );

      return res.data;
    },
    { onError },
  );
};

export const useUserLogin = () => {
  const { onError } = useResponseError();
};
