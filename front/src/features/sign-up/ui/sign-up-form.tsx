'use client';
import type { FC } from 'react';
import styles from './sign-up-form.module.css';
import type { FormProps } from 'antd';
import { Button, Form, Input, Typography } from 'antd';
import FormItem from 'antd/lib/form/FormItem';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Routes } from '@/src/shared/routes';
import { Api } from '@/src/shared/endpoints';
import type { UserSignUpDto } from '@/src/entities/user';
import { useUserSignUp } from '../model/use-user-sign-up';
import { useAuth } from '@/src/shared/lib/auth-context';

export const SignUpForm: FC = () => {
  const { trigger, isMutating } = useUserSignUp();
  const { push } = useRouter();
  const { login } = useAuth();

  const onSubmit: FormProps<UserSignUpDto>['onFinish'] = (values) => {
    trigger(values).then(() => {
      login?.(true);
      push(Api.home);
    });
  };

  return (
    <div className={styles.layout}>
      <Typography.Title>Sign up</Typography.Title>

      <Link className={styles.link} href={Routes.client.signIn}>
        or sign in
      </Link>

      <Form className={styles.form} onFinish={onSubmit}>
        <FormItem
          className={styles.inputs}
          name={'username'}
          rules={[{ required: true, message: 'Please input username!' }]}
        >
          <Input size={'large'} placeholder={'username'} allowClear />
        </FormItem>
        <FormItem
          className={styles.inputs}
          name={'email'}
          rules={[{ required: true, message: 'Please input email!' }]}
        >
          <Input size={'large'} placeholder={'email'} allowClear />
        </FormItem>
        <FormItem
          className={styles.inputs}
          name={'password'}
          rules={[{ required: true, message: 'Please input password!' }]}
        >
          <Input size={'large'} placeholder={'password'} allowClear />
        </FormItem>
        <FormItem>
          <Button loading={isMutating} htmlType={'submit'}>
            Sign up
          </Button>
        </FormItem>
      </Form>
    </div>
  );
};
