import SideNav from './SideNav';

import PageTransition from './PageTransition';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <Head>
        <title>Spotify | Wrapper</title>
        <meta name="description" content="Spotify Wrapper" />
        <link rel="icon" href="/spotify.ico" />
      </Head> */}
      <PageTransition>
        <SideNav />
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* {true && <Nav />} */}
          <main className="h-full no-scrollbar overflow-scroll">
            {children}
          </main>
        </div>
      </PageTransition>
    </>
  );
}
