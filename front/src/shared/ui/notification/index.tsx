'use client';
import type { NotificationArgsProps } from 'antd';
import { App } from 'antd';

export const useNotification = (args: NotificationArgsProps) => {
  const { notification } = App.useApp();

  const showNotification = () => notification.open({ ...args });

  return {
    showNotification,
  };
};
