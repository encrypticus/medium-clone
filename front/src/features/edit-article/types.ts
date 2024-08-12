import type { ArticleEntity, CreateArticleDto } from '@/src/entities/article';
export type FormItemTitle = Pick<CreateArticleDto, 'title'>;
export type FormItemDescription = Pick<CreateArticleDto, 'description'>;
export type FormItemBody = Pick<CreateArticleDto, 'body'>;

export interface EditArticleProps {
  tagList: string[];
  article: ArticleEntity;
}
