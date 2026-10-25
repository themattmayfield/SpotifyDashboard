import { createFileRoute, Outlet } from '@tanstack/react-router';
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
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(spotifyQueries.me());
  },
  component: SpotifyLayout,
});

function SpotifyLayout() {
  return (
    <div className="flex h-screen bg-transparent lg:pr-6 lg:pl-2 no-scrollbar overflow-hidden">
      <SideNav />
      <div className="flex flex-col min-h-screen overflow-x-hidden flex-grow no-scrollbar">
        <Nav />
        <Outlet />
      </div>
    </div>
  );
}
