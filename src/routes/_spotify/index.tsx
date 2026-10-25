import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

import { ArtistTiles, ArtistTilesSkeleton } from '@/components/ArtistTiles';
import { NowPlaying } from '@/components/NowPlaying';
import {
  RecentlyPlayed,
  RecentlyPlayedSkeleton,
} from '@/components/RecentlyPlayed';
import { SectionHeader } from '@/components/SectionHeader';
import { Streaks } from '@/components/Streaks';
import { TopTracks, TrackListSkeleton } from '@/components/Tracks';
import { spotifyQueries } from '@/lib/queries';

const rowTileClassName = 'w-[45vw] shrink-0 md:w-[25vw] xl:w-64';

export const Route = createFileRoute('/_spotify/')({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(spotifyQueries.recentlyPlayed());
    queryClient.prefetchQuery(spotifyQueries.topArtists('long_term'));
    queryClient.prefetchQuery(spotifyQueries.topTracks('short_term'));
    queryClient.prefetchQuery(spotifyQueries.topArtists('short_term'));
  },
  component: Home,
});

function Home() {
  return (
    <div className="flex flex-col gap-16 lg:flex-row lg:gap-4">
      <aside className="flex flex-col gap-4 px-2 lg:order-last lg:w-72 lg:px-0">
        <NowPlaying />
        <Streaks />
        <Suspense fallback={<RecentlyPlayedSkeleton />}>
          <RecentlyPlayed />
        </Suspense>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col gap-16">
        <section className="pl-2">
          <SectionHeader title="Top Artists" to="/artists" />
          <div className="no-scrollbar flex gap-6 overflow-x-auto pl-2 lg:pl-0">
            <Suspense
              fallback={
                <ArtistTilesSkeleton count={8} className={rowTileClassName} />
              }
            >
              <ArtistTiles
                range="long_term"
                limit={16}
                className={rowTileClassName}
              />
            </Suspense>
          </div>
        </section>
        <div className="flex flex-col gap-x-8 gap-y-16 px-2 xl:flex-row">
          <section className="xl:w-[480px] xl:shrink-0 2xl:w-[600px]">
            <SectionHeader
              title="Top Tracks This Month"
              to="/tracks"
              range="short_term"
            />
            <div className="rounded-3xl bg-custom-darkgray2 px-4 py-8 text-white">
              <Suspense fallback={<TrackListSkeleton count={6} ranked />}>
                <TopTracks
                  range="short_term"
                  limit={6}
                  ranked
                  showDuration={false}
                />
              </Suspense>
            </div>
          </section>
          <section className="min-w-0 flex-1">
            <SectionHeader
              title="Artists This Month"
              to="/artists"
              range="short_term"
            />
            <div className="grid grid-cols-2 gap-3">
              <Suspense fallback={<ArtistTilesSkeleton count={4} />}>
                <ArtistTiles range="short_term" limit={4} />
              </Suspense>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
