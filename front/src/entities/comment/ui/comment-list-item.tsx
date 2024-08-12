'use client';
import type { FC, ReactElement } from 'react';
import type { CommentEntity } from '@/src/entities/comment/types/comment.entity';
import { Avatar, Button, List } from 'antd';
import { format } from 'date-fns';
import { UiText } from '@/src/shared/ui/text';
import { EditOutlined } from '@ant-design/icons';

interface CommentListItemProps {
  comment: CommentEntity;
  currentUserEmail?: string;
  renderDeleteComment?: (
    commentId: number,
    articleSlug: string,
  ) => ReactElement;
}

export const CommentListItem: FC<CommentListItemProps> = ({
  comment,
  currentUserEmail,
  renderDeleteComment,
}) => {
  const renderActions = () => {
    if (currentUserEmail === comment.user.email) {
      return [
        <Button type={'text'} icon={<EditOutlined />} />,
        renderDeleteComment?.(comment.id, comment.article.slug),
      ];
    }
    return undefined;
  };

  return (
    <List.Item actions={renderActions()}>
      <List.Item.Meta
        avatar={<Avatar src={comment.user.image} />}
        title={`${comment.user.username}, ${format(comment.updatedAt, 'MMMM dd, yyyy / HH:mm:ss')}`}
        description={<UiText text={comment.text} />}
      />
    </List.Item>
  );
};
