import { ReactNode } from 'react';
import Providers from '@/containers/Providers';
import '@/styles/globals.css';
import PageTransition from '@/components/PageTransition';
import SideNav from '@/components/SideNav';
import handleServerSession from '@/lib/handleServerSession';

type TRootLayoutProps = {
  children: ReactNode;
};

{
  /* <Head>
        <title>Spotify | Wrapper</title>
        <meta name="description" content="Spotify Wrapper" />
        <link rel="icon" href="/spotify.ico" />
      </Head> */
}

export default async function RootLayout({ children }: TRootLayoutProps) {
  await handleServerSession();
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <PageTransition>
          <SideNav />
          <div className="flex flex-1 flex-col overflow-hidden">
            <main className="h-full no-scrollbar overflow-scroll">
              <Providers>{children}</Providers>
            </main>
          </div>
        </PageTransition>
      </body>
    </html>
  );
}
