import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useConfirm } from '@/src/shared/ui/confirm';
import { useDeleteComment } from '../model/use-delete-comment';
import type { FC } from 'react';

interface DeleteCommentButtonProps {
  commentId: number;
  articleSlug: string;
}

export const DeleteCommentButton: FC<DeleteCommentButtonProps> = ({
  commentId,
  articleSlug,
}) => {
  const { showConfirm } = useConfirm({
    title: 'Are you sure you want to delete the comment?',
    onOk: async () => await mutateAsync({ commentId, articleSlug }),
  });

  const { mutateAsync } = useDeleteComment();

  return (
    <Button
      onClick={showConfirm}
      type={'text'}
      icon={<DeleteOutlined />}
      danger
    />
  );
};
