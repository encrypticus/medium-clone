import { Inter } from 'next/font/google';
import '@/src/app/globals.css';
import { MainLayout } from '@/src/app/layouts/main-layout';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { App } from 'antd';
import { WithProviders } from '@/src/app/providers';
import { getToken } from '@/src/shared/lib/get-token';
import type { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const token = getToken();

  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <WithProviders isLoggedIn={Boolean(token)}>
            <App>
              <MainLayout>{children}</MainLayout>
            </App>
          </WithProviders>
        </AntdRegistry>
      </body>
    </html>
  );
}
