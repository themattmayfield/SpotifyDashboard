import Track from '@/components/Track';
import PageRangeHeader from '@/components/PageRangeHeader';
import { PageWrapper } from '@/components/PageWrapper';
import type { TTimeRange } from '@/types';
import { createFileRoute } from '@tanstack/react-router';
const ranges = ['long_term', 'medium_term', 'short_term'] as const;
export const Route = createFileRoute('/_spotify/tracks/')({
  validateSearch: (s: Record<string, unknown>) => ({
    range: ranges.includes(s.range as TTimeRange)
      ? (s.range as TTimeRange)
      : 'long_term',
  }),
  component: Page,
});
function Page() {
  const { range } = Route.useSearch();
  return (
    <PageWrapper>
      <PageRangeHeader activeRange={range} title="Tracks" />
      <div className="flex flex-col gap-4 no-scrollbar text-white mb-[150px] px-2">
        <Track
          type="topTracks"
          limit="50"
          timeRange={range}
          withTrackDuration
        />
      </div>
    </PageWrapper>
  );
}
