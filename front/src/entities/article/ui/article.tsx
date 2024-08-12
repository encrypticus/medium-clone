'use client';
import type { FC, ReactElement } from 'react';
import React from 'react';
import { UiParagraph } from '@/src/shared/ui/paragraph';
import { UiTitle } from '@/src/shared/ui/title/UiTitle';
import { Button, Col, Row } from 'antd';
import { UserAvatar } from '@/src/entities/article/ui/user-avatar';
import { EditOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Routes } from '@/src/shared/routes';
import { Spinner } from '@/src/shared/ui/spinner';
import type { UserInfo } from '@/src/shared/lib/use-get-user-from-cookie';
import type { ArticleEntity } from '@/src/entities/article';

interface ArticleProps {
  isLoading: boolean;
  slug: string;
  userInfo?: UserInfo;
  article?: ArticleEntity | null;
  renderDeleteArticle?: (slug: string) => ReactElement;
  renderFollowToAuthor?: (
    authorName: string,
    following?: boolean,
  ) => ReactElement;
  renderAddToFavorites?: (
    props: Pick<ArticleEntity, 'favoritesCount' | 'slug'> & {
      favorited?: boolean;
      compact?: boolean;
    },
  ) => ReactElement;
}

export const Article: FC<ArticleProps> = ({
  isLoading,
  slug,
  userInfo,
  article,
  renderDeleteArticle,
  renderFollowToAuthor,
  renderAddToFavorites,
}) => {
  const renderEditArticle = (
    <Row gutter={[5, 5]}>
      <Col>
        <Button icon={<EditOutlined />}>
          <Link href={Routes.client.articles.edit(slug)}>Edit Article</Link>
        </Button>
      </Col>
      <Col>{renderDeleteArticle?.(slug)}</Col>
    </Row>
  );

  const renderControls = () => {
    if (isLoading) return <Spinner size={'default'} />;
    if (userInfo?.email) {
      if (userInfo.email === article?.author?.email) {
        return renderEditArticle;
      }
    }
    return (
      <Row gutter={[10, 10]}>
        <Col>
          {renderFollowToAuthor?.(
            article?.author?.username ?? '',
            article?.author?.following,
          )}
        </Col>
        <Col>
          {renderAddToFavorites?.({
            favoritesCount: article?.favoritesCount ?? 0,
            favorited: article?.favorited,
            slug,
            compact: false,
          })}
        </Col>
      </Row>
    );
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <UiTitle text={article?.title} />
        <Row gutter={[16, 16]}>
          <Col>
            {article?.author && (
              <UserAvatar date={article?.createdAt} {...article?.author} />
            )}
          </Col>
          <Col>{renderControls()}</Col>
        </Row>
      </Col>
      <UiParagraph text={article?.body} />
    </Row>
  );
};
