'use client';
import type { FC } from 'react';
import { useState } from 'react';
import { useResponseError } from '@/src/shared/lib';
import { useAllArticles, ArticleList } from '@/src/entities/article';
import { AddArticleToFavoritesButton } from '@/src/features/add-article-to-favorites';

export const ArticleListWidget: FC = () => {
  const { onError } = useResponseError();

  const [reqParams, setReqParams] = useState<{ offset: number; limit: number }>(
    {
      offset: 0,
      limit: 10,
    },
  );

  const changeReqParams = (params: Partial<typeof reqParams>) => {
    setReqParams((prevState) => ({ ...prevState, ...params }));
  };

  const { data, isFetching, error } = useAllArticles(reqParams);

  if (error) onError(error);

  return (
    <ArticleList
      isFetching={isFetching}
      reqParams={reqParams}
      changeParams={changeReqParams}
      articles={data?.articles}
      articlesCount={data?.articlesCount}
      renderAddToFavorites={(slug, favoritesCount, favorited) => (
        <AddArticleToFavoritesButton
          slug={slug}
          favoritesCount={favoritesCount}
          favorited={favorited}
        />
      )}
    />
  );
};
