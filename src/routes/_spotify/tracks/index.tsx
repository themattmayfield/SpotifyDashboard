import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

import { DroppedOff } from '@/components/DroppedOff';
import { PageHeader } from '@/components/PageHeader';
import { PageWrapper } from '@/components/PageWrapper';
import ShareCard from '@/components/ShareCard';
import {
  SaveTopTracks,
  TopTracks,
  TrackListSkeleton,
} from '@/components/Tracks';
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
      <PageHeader title="Top Tracks" activeRange={range}>
        <ShareCard card={{ variant: 'tracks', range }} />
      </PageHeader>
      <div className="mb-6">
        <Suspense>
          <SaveTopTracks
            range={range}
            name={`AuxCheck · Top Tracks · ${range.replace('_', ' ')} · ${new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date())}`}
          />
        </Suspense>
      </div>
      <div className="card p-2">
        <Suspense
          key={range}
          fallback={<TrackListSkeleton count={12} ranked />}
        >
          <TopTracks range={range} ranked />
        </Suspense>
      </div>
      <DroppedOff kind="tracks" range={range} />
    </PageWrapper>
  );
}
