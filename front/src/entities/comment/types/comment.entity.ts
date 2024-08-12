interface CommentAuthor {
  id: number;
  username: string;
  email: string;
  bio: string;
  image: string;
}

interface ArticleEntity {
  id: number;
  slug: string;
  title: string;
  description: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  tagList: string[];
  favoritesCount: number;
}

export interface CommentEntity {
  id: number;
  text: string;
  createdAt: string;
  updatedAt: string;
  user: CommentAuthor;
  article: ArticleEntity;
}
