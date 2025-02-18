import type { ReactNode } from 'react';

import '@/styles/globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Spotify | Wrapper',
  description: 'Spotify Wrapper',
  icons: '/spotify.ico',
};
type TRootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: TRootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="no-scrollbar overflow-hidden">{children}</body>
    </html>
  );
}
