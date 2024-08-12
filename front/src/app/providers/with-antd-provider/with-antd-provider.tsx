'use client';

import { ConfigProvider, theme } from 'antd';
import type { FC } from 'react';
import type { WithProviderProps } from '@/src/shared/lib/auth-context';

export const WithAntdProvider: FC<WithProviderProps> = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
};
