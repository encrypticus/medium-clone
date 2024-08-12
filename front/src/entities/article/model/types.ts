export interface AuthorEntity {
  id: number;
  username: string;
  email: string;
  bio: string;
  image: string;
  following?: boolean;
}

interface CommentEntity {
  id: number;
  text: string;
  createdAt: string;
  updatedAt: string;
  user: Omit<AuthorEntity, 'following'>;
  article: Omit<ArticleEntity, 'favorited'>;
}

export interface ArticleEntity {
  id: number;
  slug: string;
  title: string;
  description: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  tagList: string[];
  favorited: boolean;
  favoritesCount: number;
  author: AuthorEntity;
  comments: CommentEntity[];
}

export interface ArticleResponse {
  article: ArticleEntity | null;
}

export interface ArticlesResponse {
  articles: ArticleEntity[];
  articlesCount: number;
}

export interface CreateArticleDto {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
}

export interface DeleteArticleResponse {
  raw: any;
  affected?: number | null;
}
export type GetAllArticlesReqParams = {
  offset: number;
  limit: number;
};
