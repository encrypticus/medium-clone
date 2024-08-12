'use client';
import type { NextPage } from 'next';
import { Result } from 'antd';

interface ErrorPageProps {
  error: string;
}

export const ErrorPage: NextPage<ErrorPageProps> = ({ error }) => {
  return <Result title={error} status={'404'} />;
};
