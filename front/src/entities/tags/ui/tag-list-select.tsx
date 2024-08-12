import { Form, Select } from 'antd';
import type { FC } from 'react';
import type { TagListSelectProps } from '../types';

export const TagListSelect: FC<TagListSelectProps> = ({ options }) => {
  return (
    <Form.Item<string[]> name={'tagList'} className={'inputs'}>
      <Select
        size={'large'}
        mode={'tags'}
        placeholder={'Tags'}
        options={options}
        allowClear
      />
    </Form.Item>
  );
};
