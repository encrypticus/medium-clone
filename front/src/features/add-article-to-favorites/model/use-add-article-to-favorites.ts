import useSWRMutation from 'swr/mutation';
import type { ErrorResponse } from '@/src/shared/lib';
import { useGetTokenFromCookie, useResponseError } from '@/src/shared/lib';
import type { ArticleResponse } from '@/src/entities/article';
import type { AxiosError } from 'axios';
import axios from 'axios';
import { Api } from '@/src/shared/endpoints';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/src/shared/query-keys';
import {
  useGetUserFromToken,
  type UserInfo,
} from '@/src/shared/lib/use-get-user-from-cookie';

export const useSwrAddArticleToFavorites = (articleSlug: string) => {
  const { onError } = useResponseError();
  const { getToken } = useGetTokenFromCookie();
  return useSWRMutation<ArticleResponse, AxiosError<ErrorResponse>, string>(
    'add-article-to-favorites' + articleSlug,
    async () => {
      const token = await getToken();
      if (token) {
        const res = await axios.post(
          Api.articles.addToFavorites(articleSlug),
          null,
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

export const useAddArticleToFavorites = (articleSlug: string) => {
  const { getUserInfo } = useGetUserFromToken();
  const { onError } = useResponseError();
  const queryClient = useQueryClient();

  return useMutation<
    | {
        article: ArticleResponse['article'];
        userInfo: { user: UserInfo; token: string } | null;
      }
    | undefined,
    AxiosError<ErrorResponse>
  >({
    mutationFn: async () => {
      const userInfo = await getUserInfo();

      if (userInfo?.token) {
        const res = await axios.post(
          Api.articles.addToFavorites(articleSlug),
          null,
          {
            headers: { Authorization: `Token ${userInfo.token}` },
          },
        );
        return {
          article: res.data.article,
          userInfo,
        };
      }
    },

    onSuccess: (data) =>
      queryClient.setQueryData(queryKeys.articles.article.bySlug(articleSlug), {
        article: data?.article,
        userInfo: data?.userInfo,
      }),

    onError,
  });
};
