import { Suspense } from 'react';
import { createFileRoute, stripSearchParams } from '@tanstack/react-router';

import Card from '@/components/Card';
import CardLoading from '@/components/Loading/CardLoading';
import PageRangeHeader from '@/components/PageRangeHeader';
import { PageWrapper } from '@/components/PageWrapper';
import { spotifyQueries } from '@/lib/queries';
import type { TTimeRange } from '@/types';

const ranges = ['long_term', 'medium_term', 'short_term'] as const;
const defaultSearch = { range: 'long_term' as TTimeRange };

export const Route = createFileRoute('/_spotify/artists/')({
  validateSearch: (search: Record<string, unknown>) => ({
    range: ranges.includes(search.range as TTimeRange)
      ? (search.range as TTimeRange)
      : defaultSearch.range,
  }),
  search: { middlewares: [stripSearchParams(defaultSearch)] },
  loaderDeps: ({ search }) => ({ range: search.range }),
  loader: ({ context, deps }) => {
    context.queryClient.prefetchQuery(
      spotifyQueries.topArtists({ limit: '50', timeRange: deps.range })
    );
  },
  component: Artists,
});

function Artists() {
  const { range } = Route.useSearch();
  return (
    <PageWrapper>
      <PageRangeHeader title="Artists" activeRange={range} />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6 no-scrollbar mb-[150px]">
        <Suspense key={range} fallback={<CardLoading count={50} />}>
          <Card timeRange={range} limit="50" />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
