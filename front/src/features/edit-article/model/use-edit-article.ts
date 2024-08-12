import {
  type ErrorResponse,
  useGetTokenFromCookie,
  useResponseError,
} from '@/src/shared/lib';
import useSWRMutation from 'swr/mutation';
import type { ArticleResponse, CreateArticleDto } from '@/src/entities/article';
import type { AxiosError } from 'axios';
import axios from 'axios';
import { Api } from '@/src/shared/endpoints';
import {
  useGetUserFromToken,
  type UserInfo,
} from '@/src/shared/lib/use-get-user-from-cookie';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/src/shared/query-keys';

export const useSwrEditArticle = (slug: string) => {
  const { onError } = useResponseError();
  const { getToken } = useGetTokenFromCookie();

  return useSWRMutation<
    ArticleResponse,
    AxiosError<ErrorResponse>,
    string,
    CreateArticleDto
  >(
    'edit-article',
    async (_, { arg: article }) => {
      const token = await getToken();
      if (token) {
        const res = await axios.put(
          Api.articles.getBySlug(slug),
          { article },
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

export const useEditArticle = (slug: string) => {
  const { getUserInfo } = useGetUserFromToken();
  const { onError } = useResponseError();
  const queryClient = useQueryClient();

  return useMutation<
    | {
        article: ArticleResponse['article'];
        userInfo: { user: UserInfo; token: string } | null;
      }
    | undefined,
    AxiosError<ErrorResponse>,
    CreateArticleDto
  >({
    mutationFn: async (variables) => {
      const userInfo = await getUserInfo();
      if (!userInfo?.token) return;

      const res = await axios.put(
        Api.articles.getBySlug(slug),
        { article: variables },
        {
          headers: {
            Authorization: `Token ${userInfo.token}`,
          },
        },
      );

      return {
        article: res.data.article,
        userInfo,
      };
    },

    onSuccess: (data) => {
      if (data?.article) {
        queryClient.setQueryData(
          queryKeys.articles.article.bySlug(data.article.slug),
          {
            article: data.article,
            userInfo: data.userInfo,
          },
        );
      }
    },

    onError,
  });
};
