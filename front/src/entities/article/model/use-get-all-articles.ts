'use client';
import type { ErrorResponse } from '@/src/shared/lib';
import { useGetTokenFromCookie, useResponseError } from '@/src/shared/lib';
import useSWR from 'swr';
import type { ArticlesResponse } from '@/src/entities/article';
import type { AxiosError } from 'axios';
import axios from 'axios';
import { Api } from '@/src/shared/endpoints';
import type { GetAllArticlesReqParams } from './types';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/src/shared/query-keys';

export const useGetAllArticles = (params: GetAllArticlesReqParams) => {
  const { onError } = useResponseError();
  const { getToken } = useGetTokenFromCookie();

  return useSWR<ArticlesResponse, AxiosError<ErrorResponse>>(
    queryKeys.articles.byPage(params.offset),
    async () => {
      const token = await getToken(false);

      const headers = token
        ? {
            Authorization: `Token ${token}`,
          }
        : {};

      const res = await axios.get(Api.articles.list, {
        headers,
        params,
      });
      return res.data;
    },
    { onError },
  );
};

export const useAllArticles = (params: GetAllArticlesReqParams) => {
  const { getToken } = useGetTokenFromCookie();
  return useQuery<ArticlesResponse, AxiosError<ErrorResponse>>({
    queryKey: queryKeys.articles.byPage(params.offset),
    queryFn: async () => {
      const token = await getToken(false);

      const headers = token
        ? {
            Authorization: `Token ${token}`,
          }
        : {};

      const res = await axios.get(Api.articles.list, {
        headers,
        params,
      });
      return res.data;
    },
  });
};
