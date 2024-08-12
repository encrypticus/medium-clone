'use client';
import type { MessageArgsProps } from 'antd';
import { App } from 'antd';

export const useMessage = (args: MessageArgsProps) => {
  const { message } = App.useApp();

  const showMessage = () => message.open({ ...args });

  return {
    showMessage,
  };
};
