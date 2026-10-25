import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

import TrackLoading from '@/components/Loading/TrackLoading';
import PageRangeHeader from '@/components/PageRangeHeader';
import { PageWrapper } from '@/components/PageWrapper';
import Track from '@/components/Track';
import { spotifyQueries } from '@/lib/queries';

export const Route = createFileRoute('/_spotify/recentTracks')({
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(
      spotifyQueries.recentlyPlayed({ limit: '50' })
    );
  },
  component: Recent,
});
function Recent() {
  return (
    <PageWrapper>
      <PageRangeHeader title="Recently Played" />
      <div className="flex flex-col gap-4 no-scrollbar text-white mb-[150px] px-2">
        <Suspense fallback={<TrackLoading count={12} />}>
          <Track withTrackDuration type="recent" limit="50" />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
