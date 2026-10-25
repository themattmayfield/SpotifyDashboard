import { Outlet, createFileRoute } from '@tanstack/react-router';
import { createIsomorphicFn } from '@tanstack/react-start';

import Nav from '@/components/Nav';
import SideNav from '@/components/SideNav';
import { ensureAuthenticated } from '@/lib/auth';
import { spotifyQueries } from '@/lib/queries';

const authenticateInitialRequest = createIsomorphicFn()
  .server(() => ensureAuthenticated())
  .client(() => true);

export const Route = createFileRoute('/_spotify')({
  beforeLoad: () => authenticateInitialRequest(),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(spotifyQueries.me()),
  component: SpotifyLayout,
});

function SpotifyLayout() {
  return (
    <div className="no-scrollbar flex h-screen overflow-hidden bg-transparent lg:pl-2 lg:pr-6">
      <SideNav />
      <main
        id="main"
        className="no-scrollbar flex min-h-screen min-w-0 flex-grow flex-col overflow-y-auto overflow-x-hidden pb-[120px] lg:pb-16"
      >
        <Nav />
        <Outlet />
      </main>
    </div>
  );
}
