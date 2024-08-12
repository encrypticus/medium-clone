'use client';
import type { NextPage } from 'next';

interface ErrorPageProps {
  error: string;
}

const ErrorPage: NextPage<ErrorPageProps> = ({ error }) => {
  return (
    <>
      <div>Something went wrong</div>
      <div>{error}</div>
    </>
  );
};

export default ErrorPage;
