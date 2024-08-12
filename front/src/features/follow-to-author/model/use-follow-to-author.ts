import useSWRMutation from 'swr/mutation';
import type { ErrorResponse } from '@/src/shared/lib';
import { useGetTokenFromCookie, useResponseError } from '@/src/shared/lib';
import type { ProfileResponse } from '@/src/entities/profile';
import type { AxiosError } from 'axios';
import axios from 'axios';
import { Api } from '@/src/shared/endpoints';
import { useGetUserFromToken } from '@/src/shared/lib/use-get-user-from-cookie';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/src/shared/query-keys';

export const useSwrFollowToAuthor = (authorName: string) => {
  const { onError } = useResponseError();
  const { getToken } = useGetTokenFromCookie();

  return useSWRMutation<ProfileResponse, AxiosError<ErrorResponse>>(
    'follow-to-author',
    async () => {
      const token = await getToken();
      if (token) {
        const res = await axios.post(Api.profiles.follow(authorName), null, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        return res.data;
      }
    },
    { onError },
  );
};

export const useFollowToAuthor = (authorName: string) => {
  const { onError } = useResponseError();
  const { getUserInfo } = useGetUserFromToken();
  const queryClient = useQueryClient();

  return useMutation<ProfileResponse | undefined, AxiosError<ErrorResponse>>({
    mutationFn: async () => {
      const userInfo = await getUserInfo();
      if (!userInfo) return;

      const res = await axios.post(Api.profiles.follow(authorName), null, {
        headers: {
          Authorization: `Token ${userInfo.token}`,
        },
      });
      return res.data;
    },

    onSuccess: (data) => {
      if (!data) return;

      queryClient.setQueryData(
        queryKeys.profiles.profile.byUserName(authorName),
        data.profile,
      );
    },

    onError,
  });
};
