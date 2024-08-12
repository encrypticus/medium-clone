'use client';
import type { FC } from 'react';
import type { SegmentedProps } from 'antd';
import { Popover } from 'antd';
import { Button, Segmented } from 'antd';
import {
  HomeOutlined,
  LoginOutlined,
  UserAddOutlined,
  SettingOutlined,
  EditOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { Routes } from '@/src/shared/routes';

import { useUserLogOut } from '@/src/features/log-out';
import { useAuth } from '@/src/shared/lib/auth-context';

export const HeaderMenu: FC = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, login } = useAuth();
  const { trigger, isMutating } = useUserLogOut();

  const unloggedOptions = [
    { label: 'Home', value: Routes.client.home, icon: <HomeOutlined /> },
    { label: 'Sign in', value: Routes.client.signIn, icon: <LoginOutlined /> },
    {
      label: 'Sign up',
      value: Routes.client.signUp,
      icon: <UserAddOutlined />,
    },
  ];

  const loggedOptions = [
    {
      label: 'Settings',
      value: Routes.client.settings,
      icon: <SettingOutlined />,
    },
    {
      label: 'New article',
      value: Routes.client.articles.create,
      icon: <EditOutlined />,
    },
  ];

  const handleUnloggedControls: SegmentedProps['onChange'] = (value) => {
    switch (value) {
      case unloggedOptions[0].value:
        push(Routes.client.home);
        break;
      case unloggedOptions[1].value:
        push(Routes.client.signIn);
        break;
      case unloggedOptions[2].value:
        push(Routes.client.signUp);
        break;
    }
  };

  const handleLoggedControls: SegmentedProps['onChange'] = (value) => {
    switch (value) {
      case loggedOptions[0].value:
        push(Routes.client.settings);
        break;
      case loggedOptions[1].value:
        push(Routes.client.articles.create);
        break;
    }
  };

  const handleLogOut = () => {
    trigger().then(() => {
      login?.(false);
      push(Routes.client.home);
    });
  };

  const renderLoggedIn = (
    <div>
      <Segmented
        value={pathname as string}
        options={loggedOptions}
        onChange={handleLoggedControls}
      />
      <Popover title={'Log out'}>
        <Button
          loading={isMutating}
          type={'text'}
          icon={<LogoutOutlined />}
          onClick={handleLogOut}
        />
      </Popover>
    </div>
  );

  const renderLoggedOut = (
    <Segmented
      value={pathname as string}
      options={unloggedOptions}
      onChange={handleUnloggedControls}
    />
  );

  return <div>{isLoggedIn ? renderLoggedIn : renderLoggedOut}</div>;
};
