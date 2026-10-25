import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

import { PageHeader } from '@/components/PageHeader';
import { PageWrapper } from '@/components/PageWrapper';
import { TopTracks, TrackListSkeleton } from '@/components/Tracks';
import { pageTitle } from '@/lib/head';
import { spotifyQueries } from '@/lib/queries';
import { rangeSearch } from '@/lib/rangeSearch';

export const Route = createFileRoute('/_spotify/tracks/')({
  ...rangeSearch,
  loader: ({ context, deps }) => {
    context.queryClient.prefetchQuery(spotifyQueries.topTracks(deps.range));
  },
  head: () => pageTitle('Top Tracks'),
  component: Tracks,
});

function Tracks() {
  const { range } = Route.useSearch();
  return (
    <PageWrapper>
      <PageHeader title="Tracks" activeRange={range} />
      <div className="px-2 text-white">
        <Suspense
          key={range}
          fallback={<TrackListSkeleton count={12} ranked />}
        >
          <TopTracks range={range} ranked />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
