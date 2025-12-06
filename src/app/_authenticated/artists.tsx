// src/app/_authenticated/artists.tsx
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { z } from 'zod';

import CardLoading from '@/components/Loading/CardLoading';
import PageRangeHeader from '@/components/PageRangeHeader';
import { PageWrapper } from '@/components/PageWrapper';
import { cn } from '@/lib/cn';
import { getTopArtists } from '@/lib/spotify';
import type { TTimeRange } from '@/types';

const searchSchema = z.object({
  range: z
    .enum(['short_term', 'medium_term', 'long_term'])
    .optional()
    .default('long_term'),
});

export const Route = createFileRoute('/_authenticated/artists')({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search }) => ({ range: search.range }),
  loader: async ({ deps }) => {
    const artists = await getTopArtists({
      limit: '50',
      timeRange: deps.range,
    });
    return { artists };
  },
  pendingComponent: ArtistsLoading,
  errorComponent: ArtistsError,
  component: ArtistsPage,
});

function ArtistsLoading() {
  return (
    <PageWrapper>
      <PageRangeHeader title="Artists" activeRange="long_term" />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6 no-scrollbar mb-[150px]">
        <CardLoading count={50} />
      </div>
    </PageWrapper>
  );
}

function ArtistsError({ error }: { error: Error }) {
  const router = useRouter();

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold text-red-500">
          Failed to load artists
        </h2>
        <p className="mt-2 text-neutral-400">{error.message}</p>
        <button
          type="button"
          onClick={() => router.invalidate()}
          className="mt-4 rounded-full bg-green-500 px-6 py-2 font-medium text-black hover:bg-green-400"
        >
          Try Again
        </button>
      </div>
    </PageWrapper>
  );
}

function ArtistsPage() {
  const { artists } = Route.useLoaderData();
  const { range } = Route.useSearch();
  const activeRange = (range || 'long_term') as TTimeRange;

  return (
    <PageWrapper>
      <PageRangeHeader title="Artists" activeRange={activeRange} />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6 no-scrollbar mb-[150px]">
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </PageWrapper>
  );
}

function ArtistCard({ artist }: { artist: SpotifyApi.ArtistObjectFull }) {
  return (
    <div>
      <a href={`/artists/${artist.id}`}>
        <div
          style={{
            backgroundImage: `url(${artist.images[1]?.url})`,
          }}
          className={cn(
            'cursor-pointer rounded-3xl h-[60vw] md:h-[40vw] lg:h-[40vw] xl:h-96 overflow-hidden bg-custom-darkgray bg-cover bg-center flex items-center justify-center',
            'transition duration-300 ease-in-out transform hover:scale-105'
          )}
        >
          <div
            className="opacity-0 hover:opacity-100 rounded-xl w-full h-full flex flex-col items-center justify-center transition duration-300 ease-in-out pl-2 pb-2 md:pl-6 md:pb-3"
            style={{ background: 'rgba(0, 0, 0, 0.45)' }}
          >
            <div className="text-center text-2xl md:text-4xl text-white">
              {artist.name}
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
