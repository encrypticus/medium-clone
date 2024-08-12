import type { FC, PropsWithChildren } from 'react';
import { Button, Col, Layout, Row } from 'antd';
import { Footer, Header, Content } from 'antd/lib/layout/layout';
import styles from './main-layout.module.css';

import Link from 'next/link';
import { Api } from '@/src/shared/endpoints';
import { HeaderMenu } from '@/src/widgets/header-menu';

export const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <Row justify={'space-between'}>
          <Col>
            <Button type={'text'}>
              <Link prefetch={true} href={Api.home}>
                Logo
              </Link>
            </Button>
          </Col>
          <Col>
            <HeaderMenu />
          </Col>
        </Row>
      </Header>
      <Content className={styles.content}>{children}</Content>
      <Footer className={styles.footer}>Footer</Footer>
    </Layout>
  );
};
