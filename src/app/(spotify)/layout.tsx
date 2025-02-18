import type { ReactNode } from 'react';

import Nav from '@/components/Nav';
import SideNav from '@/components/SideNav';

type TRootLayoutProps = {
  children: ReactNode;
};

export default async function SpotifyLayout({ children }: TRootLayoutProps) {
  return (
    <div className="flex h-screen bg-transparent lg:pr-6 lg:pl-2 no-scrollbar overflow-hidden">
      <SideNav />
      <div className="flex flex-col min-h-screen overflow-x-hidden flex-grow no-scrollbar">
        <Nav />
        {children}
      </div>
    </div>
  );
}
