import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import { Suspense, lazy, useEffect, useState } from 'react';
import { IoArrowForward, IoSparkles } from 'react-icons/io5';

import { ArtistTiles, ArtistTilesSkeleton } from '@/components/ArtistTiles';
import { PageWrapper } from '@/components/PageWrapper';
import {
  RecentlyPlayed,
  RecentlyPlayedSkeleton,
} from '@/components/RecentlyPlayed';
import { SectionHeader } from '@/components/SectionHeader';
import { Shelf } from '@/components/Shelf';
import { Streaks } from '@/components/Streaks';
import { TopTracks, TrackListSkeleton } from '@/components/Tracks';
import { Skeleton } from '@/components/ui/skeleton';
import { tasteBreakdown } from '@/lib/insights';
import { spotifyQueries } from '@/lib/queries';
const ShareCard = lazy(() => import('@/components/ShareCard'));

const shelfTileClassName = 'w-[42vw] shrink-0 sm:w-[200px] xl:w-[220px]';
const heroClassName =
  'relative h-[340px] overflow-hidden rounded-[28px] md:h-[400px]';

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
    <PageWrapper className="flex flex-col gap-12">
      <Suspense fallback={<Skeleton className={heroClassName} />}>
        <Hero />
      </Suspense>

      <Shelf
        title="Your top artists"
        actions={
          <>
            <Suspense>
              <ShareCard card={{ variant: 'artists', range: 'long_term' }} />
            </Suspense>
            <Link
              to="/artists"
              search={{ range: 'long_term' }}
              className="link-subtle px-2"
            >
              See all
            </Link>
          </>
        }
      >
        <Suspense
          fallback={
            <ArtistTilesSkeleton count={8} className={shelfTileClassName} />
          }
        >
          <ArtistTiles
            range="long_term"
            limit={16}
            className={shelfTileClassName}
          />
        </Suspense>
      </Shelf>

      <Shelf
        title="Jump back in"
        actions={
          <Link to="/recentTracks" className="link-subtle px-2">
            See all
          </Link>
        }
      >
        <Suspense fallback={<RecentlyPlayedSkeleton />}>
          <RecentlyPlayed />
        </Suspense>
      </Shelf>

      <div className="grid gap-x-8 gap-y-12 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <section className="min-w-0">
          <SectionHeader title="Top tracks this month">
            <Link
              to="/tracks"
              search={{ range: 'short_term' }}
              className="link-subtle px-2"
            >
              See all
            </Link>
          </SectionHeader>
          <div className="card p-2">
            <Suspense fallback={<TrackListSkeleton count={6} ranked />}>
              <TopTracks range="short_term" limit={6} ranked />
            </Suspense>
          </div>
        </section>
        <section className="min-w-0">
          <SectionHeader title="Artists this month">
            <Link
              to="/artists"
              search={{ range: 'short_term' }}
              className="link-subtle px-2"
            >
              See all
            </Link>
          </SectionHeader>
          <div className="grid grid-cols-2 gap-4">
            <Suspense fallback={<ArtistTilesSkeleton count={4} />}>
              <ArtistTiles range="short_term" limit={4} />
            </Suspense>
          </div>
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Suspense>
          <TasteTeaser />
        </Suspense>
        <Streaks />
      </div>
    </PageWrapper>
  );
}

function useGreeting() {
  const [greeting, setGreeting] = useState('Welcome back');
  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 5
        ? 'Good evening'
        : hour < 12
          ? 'Good morning'
          : hour < 18
            ? 'Good afternoon'
            : 'Good evening'
    );
  }, []);
  return greeting;
}

function Hero() {
  const greeting = useGreeting();
  const { data: me } = useSuspenseQuery(spotifyQueries.me());
  const { data: artists } = useSuspenseQuery(
    spotifyQueries.topArtists('long_term')
  );
  const top = artists[0];
  const firstName = me.name.split(' ')[0];
  return (
    <section
      className={`${heroClassName} bg-fill ring-1 ring-inset ring-separator`}
    >
      {top?.image && (
        <img
          src={top.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_30%] md:left-auto md:w-[68%]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10 md:bg-gradient-to-r md:from-black md:via-black/80 md:to-transparent md:via-40%" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.08),transparent_60%)]" />
      <div className="relative flex h-full flex-col justify-end p-6 md:max-w-[60%] md:justify-center md:p-14">
        <p className="text-[13px] font-medium text-white/70">
          {greeting}, {firstName}
        </p>
        {top ? (
          <>
            <h1 className="mt-3 text-[40px] font-light leading-[1.02] tracking-[-0.035em] md:text-[64px]">
              Your number one,
              <br />
              <span className="font-normal">{top.name}.</span>
            </h1>
            <div className="mt-7 flex items-center gap-3">
              <Link
                to="/artists/$id"
                params={{ id: top.id }}
                className="btn-primary h-11 px-6"
              >
                View artist
              </Link>
              <Link
                to="/artists"
                search={{ range: 'long_term' }}
                className="btn-secondary glass h-11 px-5"
              >
                All top artists
              </Link>
            </div>
          </>
        ) : (
          <h1 className="mt-3 text-[40px] font-light leading-[1.02] tracking-[-0.035em] md:text-[64px]">
            Your music,
            <br />
            all in one place.
          </h1>
        )}
      </div>
    </section>
  );
}

function TasteTeaser() {
  const artists = useSuspenseQuery(
    spotifyQueries.topArtists('short_term')
  ).data;
  const tracks = useSuspenseQuery(spotifyQueries.topTracks('short_term')).data;
  const taste = tasteBreakdown(artists, tracks);
  const dominant = [...taste.decades].sort((a, b) => b.count - a.count)[0];
  if (!taste.genres[0] && !dominant) return null;
  return (
    <Link
      to="/taste"
      search={{ range: 'short_term' }}
      className="card group flex flex-col p-5 transition hover:bg-fill-strong"
    >
      <span className="flex items-center gap-1.5 text-[13px] font-medium text-label-secondary">
        <IoSparkles className="h-4 w-4 text-[#bf5af2]" />
        Your taste lately
      </span>
      <strong className="mt-2 block text-[24px] font-semibold capitalize tracking-[-0.02em]">
        {[taste.genres[0]?.name, dominant && `${dominant.decade}s`]
          .filter(Boolean)
          .join(' · ')}
      </strong>
      <span className="mt-auto flex items-center gap-1 pt-4 text-[13px] font-medium text-label-secondary transition group-hover:text-label">
        Explore your taste
        <IoArrowForward className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
