import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

import { PageHeader } from '@/components/PageHeader';
import { PageWrapper } from '@/components/PageWrapper';
import { PlaylistsSkeleton, UserPlaylists } from '@/components/Playlists';
import { pageTitle } from '@/lib/head';
import { spotifyQueries } from '@/lib/queries';

export const Route = createFileRoute('/_spotify/playlists/')({
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(spotifyQueries.playlists());
  },
  head: () => pageTitle('Playlists'),
  component: Playlists,
});

function Playlists() {
  return (
    <PageWrapper>
      <PageHeader title="Playlists" />
      <div className="grid grid-cols-2 gap-4 px-2 md:gap-6 lg:grid-cols-3 2xl:grid-cols-5">
        <Suspense fallback={<PlaylistsSkeleton count={10} />}>
          <UserPlaylists />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
