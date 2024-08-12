'use client';
import type { FC } from 'react';
import type { FormProps } from 'antd';
import { Flex } from 'antd';
import { Button, Form, Input, Typography } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import styles from './sign-in-form.module.css';

import type { UserLoginDto } from '@/src/entities/user';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Routes } from '@/src/shared/routes';
import { Api } from '@/src/shared/endpoints';
import { useSwrUserLogin } from '../model/use-user-login';
import { useAuth } from '@/src/shared/lib/auth-context';

export const SignInForm: FC = () => {
  const { trigger, isMutating } = useSwrUserLogin();
  const { login } = useAuth();
  const { push } = useRouter();

  const onSubmit: FormProps<UserLoginDto>['onFinish'] = (values) => {
    trigger(values).then(() => {
      login?.(true);
      push(Api.home);
    });
  };

  return (
    <div className={styles.layout}>
      <Typography.Title>Sign in</Typography.Title>
      <Link className={styles.link} href={Routes.client.signUp}>
        or sign up
      </Link>
      <Form className={styles.form} onFinish={onSubmit}>
        <FormItem
          className={styles.inputs}
          name={'email'}
          rules={[{ required: true, message: 'Please input email!' }]}
        >
          <Input
            type={'email'}
            size={'large'}
            placeholder={'email'}
            allowClear
          />
        </FormItem>
        <FormItem
          className={styles.inputs}
          name={'password'}
          rules={[{ required: true, message: 'Please input password!' }]}
        >
          <Input size={'large'} placeholder={'password'} allowClear />
        </FormItem>
        <FormItem>
          <Flex justify={'end'}>
            <Button loading={isMutating} htmlType={'submit'}>
              Sign in
            </Button>
          </Flex>
        </FormItem>
      </Form>
    </div>
  );
};
