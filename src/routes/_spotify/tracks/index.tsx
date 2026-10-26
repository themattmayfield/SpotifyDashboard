import { createFileRoute } from '@tanstack/react-router';
import { Suspense, lazy } from 'react';

import { DroppedOff } from '@/components/DroppedOff';
import { PageHeader } from '@/components/PageHeader';
import { PageWrapper } from '@/components/PageWrapper';
import {
  SaveTopTracks,
  TopTracks,
  TrackListSkeleton,
} from '@/components/Tracks';
import { pageTitle } from '@/lib/head';
import { spotifyQueries } from '@/lib/queries';
import { rangeSearch } from '@/lib/rangeSearch';
const ShareCard = lazy(() => import('@/components/ShareCard'));

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
        <Suspense>
          <ShareCard card={{ variant: 'tracks', range }} />
        </Suspense>
      </PageHeader>
      <div className="mb-6">
        <Suspense>
          <SaveTopTracks
            range={range}
            name={`Wrapper · Top Tracks · ${range.replace('_', ' ')} · ${new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date())}`}
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
