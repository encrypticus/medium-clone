'use client';
import type { FC } from 'react';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useConfirm } from '@/src/shared/ui/confirm';
import { useDeleteArticle } from '../model/use-delete-article';

export const DeleteArticleButton: FC<{ articleSlug: string }> = ({
  articleSlug,
}) => {
  const { mutateAsync } = useDeleteArticle(articleSlug);

  const { showConfirm } = useConfirm({
    title: 'Are you sure you want to delete the article?',
    onOk: async () => await mutateAsync(),
  });

  return (
    <Button icon={<DeleteOutlined />} onClick={showConfirm} danger>
      Delete article
    </Button>
  );
};
