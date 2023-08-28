import { ReactNode } from 'react';
import { DesktopNav, MobileNav } from '@/components/SideNav';
import Nav from '@/components/Nav';

type TRootLayoutProps = {
  children: ReactNode;
};

export default async function SpotifyLayout({ children }: TRootLayoutProps) {
  return (
    <div className="flex h-full bg-transparent lg:pr-6 lg:pl-2">
      <DesktopNav />
      <div className="flex flex-col min-h-screen overflow-x-hidden flex-grow no-scrollbar">
        <Nav />
        {children}
        <MobileNav />
      </div>
    </div>
  );
}
