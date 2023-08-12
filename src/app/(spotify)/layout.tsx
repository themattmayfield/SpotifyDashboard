import { ReactNode } from 'react';
import PageTransition from '@/components/PageTransition';
import SideNav from '@/components/SideNav';
import handleServerSession from '@/lib/handleServerSession';

type TRootLayoutProps = {
  children: ReactNode;
  params: {
    id: string;
  };
};

export default async function SpotifyLayout({
  children,
  params,
}: TRootLayoutProps) {
  await handleServerSession();

  return (
    <PageTransition>
      <SideNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="h-full no-scrollbar overflow-scroll">{children}</main>
      </div>
    </PageTransition>
  );
}
