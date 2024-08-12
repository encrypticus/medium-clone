import type { FC } from 'react';
import { Avatar, Col, Row } from 'antd';
import { format } from 'date-fns';
import { UiText } from '@/src/shared/ui/text';
import type { AuthorEntity } from '../model/types';

export const UserAvatar: FC<AuthorEntity & { date?: string }> = (props) => {
  return (
    <Row gutter={[5, 5]} align={'middle'}>
      <Col>
        <Avatar src={props.image} />
      </Col>
      <Col>
        <Row>
          <Col span={24}>
            <UiText text={props.username} />
          </Col>
          <Col span={24}>
            <UiText text={format(props.date ?? '', 'MMMM dd, yyyy')} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
