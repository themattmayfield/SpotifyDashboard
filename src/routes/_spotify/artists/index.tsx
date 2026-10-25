import Card from '@/components/Card';
import PageRangeHeader from '@/components/PageRangeHeader';
import { PageWrapper } from '@/components/PageWrapper';
import type { TTimeRange } from '@/types';
import { spotifyQuery } from '@/lib/queries';
import { createFileRoute } from '@tanstack/react-router';
const ranges = ['long_term', 'medium_term', 'short_term'] as const;
export const Route = createFileRoute('/_spotify/artists/')({
  validateSearch: (s: Record<string, unknown>) => ({
    range: ranges.includes(s.range as TTimeRange)
      ? (s.range as TTimeRange)
      : 'long_term',
  }),
  loaderDeps: ({ search }) => ({ range: search.range }),
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(
      spotifyQuery('topArtists', { limit: '50', timeRange: deps.range })
    ),
  component: Page,
});
function Page() {
  const { range } = Route.useSearch();
  return (
    <PageWrapper>
      <PageRangeHeader title="Artists" activeRange={range} />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6 no-scrollbar mb-[150px]">
        <Card timeRange={range} limit="50" />
      </div>
    </PageWrapper>
  );
}
