'use client';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useFollowToAuthor } from '../model/use-follow-to-author';

export const FollowToAuthorButton: FC<{
  authorName: string;
  following?: boolean;
}> = ({ authorName, following }) => {
  const [isFollowing, setIsFollowing] = useState(following);

  useEffect(() => {
    setIsFollowing(following);
  }, [following]);

  const { mutateAsync, isPending } = useFollowToAuthor(authorName);

  const text = isFollowing ? 'Unfollow' : 'Follow';

  const handleClick = async () => {
    const data = await mutateAsync();
    if (data) setIsFollowing(data.profile.following);
  };

  return (
    <Button
      icon={isFollowing ? <MinusOutlined /> : <PlusOutlined />}
      type={isFollowing ? 'primary' : 'default'}
      loading={isPending}
      onClick={handleClick}
    >
      {`${text} ${authorName}`}
    </Button>
  );
};
