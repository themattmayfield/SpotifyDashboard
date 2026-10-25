import { spotifyQuery } from '@/lib/queries';
import { createFileRoute } from '@tanstack/react-router';
import Track from '@/components/Track';
import PageRangeHeader from '@/components/PageRangeHeader';
import { PageWrapper } from '@/components/PageWrapper';
export const Route = createFileRoute('/_spotify/recentTracks')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      spotifyQuery('recent', { limit: '50' }, 30_000)
    ),
  component: () => (
    <PageWrapper>
      <PageRangeHeader title="Recently Played" />
      <div className="flex flex-col gap-4 no-scrollbar text-white mb-[150px] px-2">
        <Track withTrackDuration type="recent" limit="50" />
      </div>
    </PageWrapper>
  ),
});
