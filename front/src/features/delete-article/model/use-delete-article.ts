import {
  type ErrorResponse,
  useGetTokenFromCookie,
  useResponseError,
} from '@/src/shared/lib';
import useSWRMutation from 'swr/mutation';
import type { AxiosError } from 'axios';
import axios from 'axios';
import { Api } from '@/src/shared/endpoints';
import { useGetUserFromToken } from '@/src/shared/lib/use-get-user-from-cookie';
import { useMutation } from '@tanstack/react-query';
import type { DeleteArticleResponse } from '@/src/entities/article';
import { useRouter } from 'next/navigation';

export const useSwrDeleteArticle = (articleSlug: string) => {
  const { onError } = useResponseError();
  const { getToken } = useGetTokenFromCookie();

  return useSWRMutation<unknown, AxiosError<ErrorResponse>, string>(
    'delete-article',
    async () => {
      const token = await getToken();
      if (token) {
        const res = await axios.delete(
          `${Api.articles.delete}/${articleSlug}`,
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

export const useDeleteArticle = (articleSlug: string) => {
  const { onError } = useResponseError();
  const { getUserInfo } = useGetUserFromToken();
  const router = useRouter();

  return useMutation<
    DeleteArticleResponse | undefined,
    AxiosError<ErrorResponse>
  >({
    mutationFn: async () => {
      const userInfo = await getUserInfo();
      if (!userInfo?.token) return;

      const res = await axios.delete(`${Api.articles.delete}/${articleSlug}`, {
        headers: {
          Authorization: `Token ${userInfo.token}`,
        },
      });
      return res.data;
    },

    onSuccess: (data) => {
      if (data) router.push(Api.home);
    },

    onError,
  });
};
