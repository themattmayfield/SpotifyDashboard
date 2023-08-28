import { ReactNode } from 'react';
import SideNav from '@/components/SideNav';
import Nav from '@/components/Nav';

type TRootLayoutProps = {
  children: ReactNode;
};

export default async function SpotifyLayout({ children }: TRootLayoutProps) {
  return (
    <div className="flex h-screen bg-transparent lg:pr-6 lg:pl-2">
      <SideNav />
      <div className="flex flex-col min-h-screen overflow-x-hidden flex-grow">
        <Nav />
        {children}
      </div>
    </div>
  );
}
