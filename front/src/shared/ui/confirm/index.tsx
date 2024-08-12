'use client';
import type { ModalFuncProps } from 'antd';
import { App } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export const useConfirm = (args?: ModalFuncProps) => {
  const { modal } = App.useApp();

  const showConfirm = () => {
    modal.confirm({
      title: 'Are you sure?',
      okText: 'OK',
      cancelText: 'Cancel',
      icon: <ExclamationCircleOutlined />,
      ...args,
    });
  };

  return { showConfirm };
};
