import type { ArticleResponse } from '@/src/entities/article';
import axios, { AxiosError } from 'axios';
import { Api } from '@/src/shared/endpoints';
import { getToken } from '@/src/shared/lib/get-token';

export const articleBySlugQuery = async (
  slug: string,
): Promise<ArticleResponse> => {
  const token = getToken();
  try {
    const res = await axios.get<ArticleResponse>(Api.articles.getBySlug(slug), {
      headers: {
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw new AxiosError('Failed to get article');
  }
};
