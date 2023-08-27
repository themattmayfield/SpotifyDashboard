import { ReactNode } from 'react';
import SideNav from '@/components/SideNav';
import Nav from '@/components/Nav';

type TRootLayoutProps = {
  children: ReactNode;
};

export default async function SpotifyLayout({ children }: TRootLayoutProps) {
  return (
    <div className="flex bg-transparent lg:pr-6 lg:pl-2 h-full">
      <SideNav />
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <Nav />
        {children}
      </div>
    </div>
  );
}
