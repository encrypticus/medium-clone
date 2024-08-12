import { ArticleType } from '@app/article/types/article.type';

export interface ArticlesResponse {
  articles: ArticleType[];
  articlesCount: number;
}
