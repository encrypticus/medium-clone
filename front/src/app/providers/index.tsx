'use client';
import type { FC } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { WithLoggedInProvider } from '@/src/app/providers/with-logged-in-provider';
import { WithAntdProvider } from '@/src/app/providers/with-antd-provider';
import type { WithProviderProps } from '@/src/shared/lib/auth-context';
import type { SWRConfiguration } from 'swr';
import { SWRConfig } from 'swr';

const config: SWRConfiguration = {
  revalidateOnFocus: false,
  shouldRetryOnError: false,
  refreshWhenHidden: false,
};

export const WithProviders: FC<WithProviderProps> = ({
  children,
  isLoggedIn,
}) => {
  return (
    <WithLoggedInProvider isLoggedIn={isLoggedIn}>
      <WithAntdProvider>
        <QueryClientProvider
          client={
            new QueryClient({
              defaultOptions: {
                queries: {
                  refetchOnWindowFocus: false,
                  refetchIntervalInBackground: false,
                },
              },
            })
          }
        >
          <SWRConfig value={config}>{children}</SWRConfig>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </WithAntdProvider>
    </WithLoggedInProvider>
  );
};
