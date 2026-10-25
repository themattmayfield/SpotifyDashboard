import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

import { ArtistTiles, ArtistTilesSkeleton } from '@/components/ArtistTiles';
import { DroppedOff } from '@/components/DroppedOff';
import { PageHeader } from '@/components/PageHeader';
import { PageWrapper } from '@/components/PageWrapper';
import { pageTitle } from '@/lib/head';
import { spotifyQueries } from '@/lib/queries';
import { rangeSearch } from '@/lib/rangeSearch';

export const Route = createFileRoute('/_spotify/artists/')({
  ...rangeSearch,
  loader: ({ context, deps }) => {
    context.queryClient.prefetchQuery(spotifyQueries.topArtists(deps.range));
  },
  head: () => pageTitle('Top Artists'),
  component: Artists,
});

function Artists() {
  const { range } = Route.useSearch();
  return (
    <PageWrapper>
      <PageHeader title="Artists" activeRange={range} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 xl:grid-cols-4 2xl:grid-cols-5">
        <Suspense key={range} fallback={<ArtistTilesSkeleton count={20} />}>
          <ArtistTiles range={range} />
        </Suspense>
      </div>
      <DroppedOff kind="artists" range={range} />
    </PageWrapper>
  );
}
