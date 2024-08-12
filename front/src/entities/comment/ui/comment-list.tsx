'use client';
import type { FC, ReactElement } from 'react';
import type { CommentEntity } from '@/src/entities/comment/types/comment.entity';
import { CommentListItem } from '@/src/entities/comment/ui/comment-list-item';
import { List } from 'antd';

interface CommentListProps {
  comments: CommentEntity[];
  articleId?: number;
  currentUserEmail?: string;
  renderAddComment?: (articleId?: number) => ReactElement;
  renderDeleteComment?: (
    commentId: number,
    articleSlug: string,
  ) => ReactElement;
}

export const CommentList: FC<CommentListProps> = ({
  comments,
  articleId,
  currentUserEmail,
  renderAddComment,
  renderDeleteComment,
}) => {
  return (
    <>
      {renderAddComment?.(articleId)}
      <List
        dataSource={comments}
        renderItem={(item) => (
          <CommentListItem
            comment={item}
            currentUserEmail={currentUserEmail}
            renderDeleteComment={renderDeleteComment}
          />
        )}
      />
    </>
  );
};
