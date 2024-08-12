'use client';
import type { FC } from 'react';
import styles from './update-profile-form.module.css';
import type { FormProps } from 'antd';
import { Button, Form, Input, Typography } from 'antd';
import type { UserResponse } from '@/src/entities/user';
import { useUserUpdate } from '../model/use-user-update';
import FormItem from 'antd/lib/form/FormItem';
import type { UserRequest } from '@/src/entities/user';

const { Item } = Form;

export const UpdateProfileForm: FC<UserResponse> = ({ user }) => {
  const { id, username, email, bio, image } = user;
  const { trigger, isMutating } = useUserUpdate();

  const onSubmit: FormProps<UserRequest>['onFinish'] = (values) => {
    trigger(values);
  };

  return (
    <div className={styles.layout}>
      <Typography.Title>Your settings</Typography.Title>
      <Form
        className={styles.form}
        onFinish={onSubmit}
        initialValues={{
          id,
          username,
          email,
          bio,
          image,
        }}
      >
        <Item
          rules={[{ required: true, message: 'Please input username!' }]}
          className={styles.inputs}
          name={'username'}
        >
          <Input size={'large'} placeholder={'username'} required allowClear />
        </Item>

        <Item
          rules={[{ required: true, message: 'Please input email!' }]}
          className={styles.inputs}
          name={'email'}
        >
          <Input size={'large'} placeholder={'email'} allowClear />
        </Item>

        <Item className={styles.inputs} name={'bio'}>
          <Input.TextArea
            rows={10}
            size={'large'}
            placeholder={'bio'}
            allowClear
          />
        </Item>

        <Item className={styles.inputs} name={'image'}>
          <Input size={'large'} placeholder={'image url'} allowClear />
        </Item>

        <FormItem>
          <Button loading={isMutating} htmlType={'submit'}>
            Update
          </Button>
        </FormItem>
      </Form>
    </div>
  );
};
