import useSWRMutation from 'swr/mutation';
import type { AxiosError } from 'axios';
import axios from 'axios';
import type { UserResponse, UserSignUpDto } from '@/src/entities/user';
import { Api } from '@/src/shared/endpoints';
import type { ErrorResponse } from '@/src/shared/lib';
import { useResponseError } from '@/src/shared/lib';

export const useUserSignUp = () => {
  const { onError } = useResponseError();
  return useSWRMutation<
    UserResponse,
    AxiosError<ErrorResponse>,
    string,
    UserSignUpDto
  >(
    'user-signup',
    async (_, { arg: { email, password, username } }) => {
      const res = await axios.post(
        Api.auth.signup,
        {
          user: {
            username,
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
