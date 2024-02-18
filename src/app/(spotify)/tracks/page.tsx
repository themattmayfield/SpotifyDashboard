import { Suspense } from 'react';

import TrackLoading from '@/components/Loading/TrackLoading';
import PageRangeHeader from '@/components/PageRangeHeader';
import { PageWrapper } from '@/components/PageWrapper';
import Track from '@/components/Track';
import type { TTimeRange } from '@/types';

export default async function Tracks({
  searchParams,
}: {
  searchParams: { range: TTimeRange };
}) {
  const { range } = searchParams;
  const activeRange = range || 'long_term';

  return (
    <PageWrapper>
      <PageRangeHeader activeRange={activeRange} title="Tracks" />

      <div className="flex flex-col gap-4 no-scrollbar text-white mb-[150px] px-2">
        <Suspense fallback={<TrackLoading count={12} />}>
          <Track
            type="topTracks"
            limit="50"
            timeRange={activeRange}
            withTrackDuration
          />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
