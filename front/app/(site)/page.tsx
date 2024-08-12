import type { Metadata } from 'next';
import { ArticleListPage } from '@/src/pages/article-list';

export const metadata: Metadata = {
  title: 'Home',
};

export const revalidate = 0;

export default ArticleListPage;
