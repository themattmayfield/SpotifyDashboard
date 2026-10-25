import { Suspense } from 'react';
import { createFileRoute, stripSearchParams } from '@tanstack/react-router';

import TrackLoading from '@/components/Loading/TrackLoading';
import PageRangeHeader from '@/components/PageRangeHeader';
import { PageWrapper } from '@/components/PageWrapper';
import Track from '@/components/Track';
import { spotifyQueries } from '@/lib/queries';
import type { TTimeRange } from '@/types';

const ranges = ['long_term', 'medium_term', 'short_term'] as const;
const defaultSearch = { range: 'long_term' as TTimeRange };

export const Route = createFileRoute('/_spotify/tracks/')({
  validateSearch: (search: Record<string, unknown>) => ({
    range: ranges.includes(search.range as TTimeRange)
      ? (search.range as TTimeRange)
      : defaultSearch.range,
  }),
  search: { middlewares: [stripSearchParams(defaultSearch)] },
  loaderDeps: ({ search }) => ({ range: search.range }),
  loader: ({ context, deps }) => {
    context.queryClient.prefetchQuery(
      spotifyQueries.topTracks({ limit: '50', timeRange: deps.range })
    );
  },
  component: Tracks,
});

function Tracks() {
  const { range } = Route.useSearch();
  return (
    <PageWrapper>
      <PageRangeHeader activeRange={range} title="Tracks" />
      <div className="flex flex-col gap-4 no-scrollbar text-white mb-[150px] px-2">
        <Suspense key={range} fallback={<TrackLoading count={12} />}>
          <Track
            type="topTracks"
            limit="50"
            timeRange={range}
            withTrackDuration
          />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
