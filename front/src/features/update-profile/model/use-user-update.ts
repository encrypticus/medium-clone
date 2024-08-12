import { useGetTokenFromCookie } from '@/src/shared/lib';
import useSWRMutation from 'swr/mutation';
import type { AxiosError } from 'axios';
import axios from 'axios';
import { Api } from '@/src/shared/endpoints';
import type { ErrorResponse } from '@/src/shared/lib';
import { useResponseError } from '@/src/shared/lib';
import type { UserRequest, UserResponse } from '@/src/entities/user';

export const useUserUpdate = () => {
  const { onError } = useResponseError();
  const { getToken } = useGetTokenFromCookie();

  return useSWRMutation<
    UserResponse,
    AxiosError<ErrorResponse>,
    string,
    UserRequest
  >(
    'user-update',
    async (_, { arg: user }) => {
      const token = await getToken();

      if (token) {
        const res = await axios.put(
          Api.user.updateInfo,
          {
            user,
          },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );

        return res.data;
      }
    },
    { onError },
  );
};
