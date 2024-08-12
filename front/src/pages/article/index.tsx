import type { FC } from 'react';
import type { NextPageProps } from '../types';
import { ErrorPage } from '@/src/shared/ui/error';
import { ArticleWithComments } from '@/src/widgets/aritcle-with-comments';

export const ArticlePage: FC<NextPageProps> = async ({ params }) => {
  try {
    return <ArticleWithComments slug={params.slug} />;
  } catch (error) {
    if (error instanceof Error) {
      return <ErrorPage error={error.message} />;
    }
  }
};
