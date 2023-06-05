import Nav from './Nav';
import SideNav from './SideNav';
import Head from 'next/head';
import PageTransition from './PageTransition';

export default function Layout({ children, profile }) {
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
          {profile && <Nav />}
          <main
            className={
              'h-full no-scrollbar ' + (!profile ? 'overflow-scroll ' : '')
            }
          >
            {children}
          </main>
        </div>
      </PageTransition>
    </>
  );
}
