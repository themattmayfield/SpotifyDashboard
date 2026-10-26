import { useQueryClient } from '@tanstack/react-query';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { createIsomorphicFn } from '@tanstack/react-start';
import { useEffect } from 'react';

import Nav from '@/components/Nav';
import { NowPlaying } from '@/components/NowPlaying';
import SideNav from '@/components/SideNav';
import { ensureAuthenticated } from '@/lib/auth';
import { syncListening } from '@/lib/persistence';
import { spotifyQueries } from '@/lib/queries';

const authenticateInitialRequest = createIsomorphicFn()
  .server((path: string) => ensureAuthenticated({ data: path }))
  .client(() => true);

export const Route = createFileRoute('/_spotify')({
  beforeLoad: ({ location }) => authenticateInitialRequest(location.pathname),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(spotifyQueries.me()),
  component: SpotifyLayout,
});

function SpotifyLayout() {
  const queryClient = useQueryClient();
  useEffect(() => {
    void syncListening().then(() =>
      queryClient.invalidateQueries({ queryKey: ['wrapper'] })
    );
  }, [queryClient]);
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-canvas text-label">
      <div className="flex min-h-0 flex-1">
        <SideNav />
        <main
          id="main"
          className="no-scrollbar relative flex min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden pb-[170px] lg:pb-12"
        >
          <Nav />
          <Outlet />
        </main>
      </div>
      <NowPlaying />
    </div>
  );
}
