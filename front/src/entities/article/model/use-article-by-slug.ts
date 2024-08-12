'use client';
import type { ErrorResponse } from '@/src/shared/lib';
import { useQuery } from '@tanstack/react-query';
import type { ArticleResponse } from '@/src/entities/article';
import type { AxiosError } from 'axios';
import axios from 'axios';
import { queryKeys } from '@/src/shared/query-keys';
import { Api } from '@/src/shared/endpoints';
import { useGetUserFromToken } from '@/src/shared/lib/use-get-user-from-cookie';
import type { UserInfo } from '@/src/shared/lib/use-get-user-from-cookie';

export const useArticleBySlug = (slug: string) => {
  const { getUserInfo } = useGetUserFromToken();

  return useQuery<
    {
      article: ArticleResponse['article'];
      userInfo: { user: UserInfo; token: string } | null;
    },
    AxiosError<ErrorResponse>
  >({
    queryKey: queryKeys.articles.article.bySlug(slug),
    queryFn: async () => {
      const userInfo = await getUserInfo(false);

      const res = await axios.get<ArticleResponse>(
        Api.articles.getBySlug(slug),
        {
          headers: userInfo?.token
            ? { Authorization: `Token ${userInfo.token}` }
            : undefined,
        },
      );
      return {
        article: res.data.article,
        userInfo,
      };
    },
    retry: false,
  });
};
