import { ReactNode } from 'react';
// import PageTransition from '@/components/PageTransition';
import SideNav from '@/components/SideNav';
import Nav from '@/components/Nav';
type TRootLayoutProps = {
  children: ReactNode;
};

export default async function SpotifyLayout({ children }: TRootLayoutProps) {
  return (
    <div className="flex bg-transparent lg:pr-6 lg:pl-2 h-full">
      <SideNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Nav />
        <main className="h-full no-scrollbar overflow-scroll">{children}</main>
      </div>
    </div>
  );
}
