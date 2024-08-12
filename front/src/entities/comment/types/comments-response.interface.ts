import type { CommentEntity } from './comment.entity';

export interface CommentsResponse {
  comments: CommentEntity[];
  commentsCount: number;
}
