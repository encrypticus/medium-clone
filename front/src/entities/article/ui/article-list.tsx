'use client';
import type { FC, ReactElement } from 'react';
import { Button, Col, List, Row } from 'antd';
import { UserAvatar } from './user-avatar';
import Link from 'next/link';
import { Routes } from '@/src/shared/routes';
import styles from './article.module.css';
import { useRouter } from 'next/navigation';
import { UiParagraph } from '@/src/shared/ui/paragraph';
import type { ArticleEntity } from '@/src/entities/article';

interface ArticleListProps {
  isFetching: boolean;
  articles?: ArticleEntity[];
  articlesCount?: number;
  reqParams: { limit: number; offset: number };
  changeParams: (params: Partial<ArticleListProps['reqParams']>) => void;
  renderAddToFavorites?: (
    slug: string,
    favoritesCount: number,
    favorited: boolean,
  ) => ReactElement;
}

export const ArticleList: FC<ArticleListProps> = ({
  isFetching,
  articles,
  articlesCount,
  reqParams,
  changeParams,
  renderAddToFavorites,
}) => {
  const { push } = useRouter();

  return (
    <List
      loading={isFetching}
      dataSource={articles}
      renderItem={(item) => {
        return (
          <List.Item
            className={styles.listItem}
            onClick={() => push(Routes.client.articles.article(item.slug))}
          >
            <Row gutter={[5, 5]} style={{ width: '100%' }}>
              <Col span={24}>
                <Row justify={'space-between'} align={'middle'}>
                  <Col>
                    <UserAvatar {...item.author} date={item.createdAt} />
                  </Col>
                  <Col>
                    {renderAddToFavorites?.(
                      item.slug,
                      item.favoritesCount,
                      item.favorited,
                    )}
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <List.Item.Meta
                  title={item.title}
                  description={
                    <Row>
                      <Col span={24}>
                        <UiParagraph
                          text={item.description}
                          onClick={() =>
                            push(Routes.client.articles.article(item.slug))
                          }
                        />
                      </Col>
                      <Col span={24}>
                        <Button type={'link'}>
                          <Link
                            href={Routes.client.articles.article(item.slug)}
                          >
                            Read more...
                          </Link>
                        </Button>
                      </Col>
                    </Row>
                  }
                />
              </Col>
            </Row>
          </List.Item>
        );
      }}
      pagination={{
        position: 'both',
        align: 'end',
        onChange: async (page) => {
          const offset = reqParams.limit * (page - 1);
          changeParams({ offset });
        },
        pageSize: 10,
        total: articlesCount,
      }}
    />
  );
};
