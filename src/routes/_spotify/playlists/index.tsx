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
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4 2xl:grid-cols-6">
        <Suspense fallback={<PlaylistsSkeleton count={10} />}>
          <UserPlaylists />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
