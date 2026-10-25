import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

import { PageHeader } from '@/components/PageHeader';
import { PageWrapper } from '@/components/PageWrapper';
import { RecentTracks, TrackListSkeleton } from '@/components/Tracks';
import { pageTitle } from '@/lib/head';
import { spotifyQueries } from '@/lib/queries';

export const Route = createFileRoute('/_spotify/recentTracks')({
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(spotifyQueries.recentlyPlayed());
  },
  head: () => pageTitle('Recently Played'),
  component: Recent,
});

function Recent() {
  return (
    <PageWrapper>
      <PageHeader title="Recently Played" />
      <div className="px-2 text-white">
        <Suspense fallback={<TrackListSkeleton count={12} />}>
          <RecentTracks />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
