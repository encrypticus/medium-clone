import 'server-only';
import type { ArticlesResponse } from '@/src/entities/article';
import { getToken } from '@/src/shared/lib/get-token';
import axios, { AxiosError } from 'axios';
import { Api } from '@/src/shared/endpoints';
import { JWT_TOKEN_KEY } from '@/src/shared/constants';

export const allArticlesQuery = async (): Promise<ArticlesResponse> => {
  const token = getToken();

  try {
    const res = await axios.get<ArticlesResponse>(Api.articles.list, {
      headers: {
        Authorization: `Token ${token}`,
        Cookie: `${JWT_TOKEN_KEY}=${token}`,
      },
      params: { limit: 10 },
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    throw new AxiosError('Failed to fetch articles');
  }
};
