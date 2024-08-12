'use client';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useArticleBySlug } from '@/src/entities/article';
import { useResponseError } from '@/src/shared/lib';
import { ErrorPage } from '@/src/shared/ui/error';
import { Article } from '@/src/entities/article';
import { DeleteArticleButton } from '@/src/features/delete-article';
import { FollowToAuthorButton } from '@/src/features/follow-to-author';
import { Divider } from 'antd';
import { CommentList } from '@/src/entities/comment';
import { AddArticleToFavoritesButton } from '@/src/features/add-article-to-favorites';
import { UiTitle } from '@/src/shared/ui/title/UiTitle';
import { AddCommentForm } from '@/src/features/add-comment';
import { DeleteCommentButton } from '@/src/features/delete-comment';

export const ArticleWithComments: FC<{ slug: string }> = ({ slug }) => {
  const { data, error, isLoading } = useArticleBySlug(slug);
  const { onError } = useResponseError();

  useEffect(() => {
    if (error) onError(error);
  }, [error]);

  if (error) return <ErrorPage error={'Article not found'} />;

  return (
    <>
      <Article
        isLoading={isLoading}
        slug={slug}
        article={data?.article}
        userInfo={data?.userInfo?.user}
        renderDeleteArticle={(slug) => (
          <DeleteArticleButton articleSlug={slug} />
        )}
        renderFollowToAuthor={(authorName, following) => (
          <FollowToAuthorButton authorName={authorName} following={following} />
        )}
        renderAddToFavorites={(props) => (
          <AddArticleToFavoritesButton {...props} />
        )}
      />
      <Divider />
      <UiTitle text={'Comments'} level={2} />
      <CommentList
        comments={data?.article?.comments ?? []}
        articleId={data?.article?.id}
        currentUserEmail={data?.userInfo?.user?.email}
        renderAddComment={(articleId) => (
          <AddCommentForm articleId={articleId} />
        )}
        renderDeleteComment={(commentId, articleSlug) => (
          <DeleteCommentButton
            commentId={commentId}
            articleSlug={articleSlug}
          />
        )}
      />
    </>
  );
};
