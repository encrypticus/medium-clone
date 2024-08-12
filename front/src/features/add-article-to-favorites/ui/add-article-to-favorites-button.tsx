'use client';
import type { FC, MouseEventHandler } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Button } from 'antd';
import type { AddArticleToFavoritesButtonProps } from '../model/types';
import { useAddArticleToFavorites } from '../model/use-add-article-to-favorites';

export const AddArticleToFavoritesButton: FC<
  AddArticleToFavoritesButtonProps
> = ({ favoritesCount, slug, favorited, compact = true }) => {
  const [state, setState] = useState({
    count: favoritesCount,
    isFavorited: favorited,
  });

  const { mutateAsync, isPending } = useAddArticleToFavorites(slug);

  useEffect(() => {
    setState({ count: favoritesCount, isFavorited: favorited });
  }, [favoritesCount, favorited]);

  const renderText = () => {
    return state.isFavorited ? 'Unfavorite article ' : 'Favorite article ';
  };

  const handleClick: MouseEventHandler<HTMLElement> = async (event) => {
    event.stopPropagation();
    const res = await mutateAsync();
    if (res?.article) {
      setState({
        count: res.article.favoritesCount,
        isFavorited: res.article.favorited,
      });
    }
  };

  return (
    <Button
      onClick={handleClick}
      icon={state.isFavorited ? <HeartFilled /> : <HeartOutlined />}
      type={state.isFavorited ? 'primary' : 'default'}
      loading={isPending}
    >
      {!compact ? renderText() : null}
      {`(${state.count})`}
    </Button>
  );
};
