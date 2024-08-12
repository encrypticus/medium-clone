import { CommentEntity } from '@app/comment/comment.entity';

export interface CommentsResponse {
  comments: CommentEntity[];
  commentsCount: number;
}
