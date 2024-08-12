import type { FC } from 'react';
import type { NextPageProps } from '@/src/pages/types';
import { ErrorPage } from '@/src/shared/ui/error';
import { articleBySlugQuery } from '@/src/features/get-article-by-slug';
import { getAllTags } from '@/src/shared/api';
import { EditArticleForm } from '@/src/features/edit-article';

export const EditArticlePage: FC<NextPageProps> = async ({ params }) => {
  try {
    const articleRes = await articleBySlugQuery(params.slug);
    const tagsRes = await getAllTags();
    if (!articleRes.article) {
      throw new Error('Article not found');
    }
    return (
      <EditArticleForm tagList={tagsRes.tags} article={articleRes.article} />
    );
  } catch (error) {
    if (error instanceof Error) {
      return <ErrorPage error={error.message} />;
    }
  }
};
