import { ReactNode } from 'react';
import Providers from './providers';
import '../styles/globals.css';
import Layout from '@/components/Layout';

type TRootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: TRootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <Layout profile={true}>
          <Providers>{children}</Providers>
        </Layout>
      </body>
    </html>
  );
}
