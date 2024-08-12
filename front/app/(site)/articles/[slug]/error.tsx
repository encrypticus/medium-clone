'use client';
import type { NextPage } from 'next';

interface ErrorPageProps {
  error: string;
}

const ArticleErrorPage: NextPage<ErrorPageProps> = ({ error }) => {
  return (
    <>
      <div>Something went wrong</div>
      <div>{error}</div>
    </>
  );
};

export default ArticleErrorPage;
