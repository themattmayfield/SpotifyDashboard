import { FollowButton, FollowButtonSkeleton } from '@/components/FollowButton';
import { OpenInSpotify } from '@/components/OpenInSpotify';
import { PageWrapper } from '@/components/PageWrapper';
import { SectionHeader } from '@/components/SectionHeader';
import { TrackList, TrackListSkeleton } from '@/components/Tracks';
import { Skeleton } from '@/components/ui/skeleton';
import { artistTopTracks } from '@/lib/insights';
import { getArtistHistory } from '@/lib/persistence';
import { cachedArtist, spotifyQueries } from '@/lib/queries';
import type { TTimeRange } from '@/types';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

export const Route = createFileRoute('/_spotify/artists/$id')({
  loader: ({ context: { queryClient }, params }) => {
    queryClient.prefetchQuery(spotifyQueries.following(params.id));
    queryClient.prefetchQuery(spotifyQueries.artistAlbums(params.id));
    return queryClient.ensureQueryData({
      ...spotifyQueries.artist(params.id),
      ...cachedArtist(queryClient, params.id),
    });
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.name ?? 'Artist'} | Spotify Profile` }],
  }),
  component: Page,
  pendingComponent: ArtistSkeleton,
});

const heroClassName =
  'relative h-[380px] overflow-hidden rounded-[28px] bg-fill ring-1 ring-inset ring-separator md:h-[480px]';

const ranges: { range: TTimeRange; label: string }[] = [
  { range: 'short_term', label: 'Last 4 weeks' },
  { range: 'medium_term', label: 'Last 6 months' },
  { range: 'long_term', label: 'All time' },
];

function Page() {
  const { id } = Route.useParams();
  const { data: artist } = useSuspenseQuery(spotifyQueries.artist(id));
  return (
    <PageWrapper className="space-y-14">
      <header className={heroClassName}>
        {artist.image && (
          <img
            className="absolute inset-0 h-full w-full object-cover object-[center_25%]"
            src={artist.image}
            alt={artist.name}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/0" />
        <div className="relative flex h-full flex-col justify-end gap-5 p-6 md:p-12">
          <div>
            {artist.genres.length > 0 && (
              <p className="mb-2 text-[13px] font-medium capitalize text-white/70">
                {artist.genres.slice(0, 3).join(' · ')}
              </p>
            )}
            <h1 className="text-[44px] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[80px]">
              {artist.name}
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Suspense fallback={<FollowButtonSkeleton />}>
              <FollowButton id={id} />
            </Suspense>
            <OpenInSpotify url={artist.url} />
          </div>
        </div>
      </header>
      <Suspense fallback={<SectionSkeleton />}>
        <Ranks artistId={id} />
      </Suspense>
      <Suspense fallback={<TrackListSkeleton count={3} />}>
        <PersonalTracks artistId={id} name={artist.name} />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Discography artistId={id} />
      </Suspense>
      <History artistId={id} />
    </PageWrapper>
  );
}

function Ranks({ artistId }: { artistId: string }) {
  const short = useSuspenseQuery(spotifyQueries.topArtists('short_term')).data;
  const medium = useSuspenseQuery(
    spotifyQueries.topArtists('medium_term')
  ).data;
  const long = useSuspenseQuery(spotifyQueries.topArtists('long_term')).data;
  const lists = [short, medium, long];
  return (
    <section>
      <SectionHeader title="Your ranks" />
      <div className="grid gap-3 sm:grid-cols-3">
        {ranges.map(({ label }, index) => {
          const rank = lists[index].findIndex(
            (artist) => artist.id === artistId
          );
          return (
            <div key={label} className="card p-5">
              <span className="block text-[13px] font-medium text-label-secondary">
                {label}
              </span>
              <strong
                className={
                  rank >= 0
                    ? 'mt-1 block text-[34px] font-semibold tracking-[-0.03em]'
                    : 'mt-3 block text-[15px] font-medium text-label-tertiary'
                }
              >
                {rank >= 0 ? `No. ${rank + 1}` : 'Not in your top 50'}
              </strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PersonalTracks({
  artistId,
  name,
}: { artistId: string; name: string }) {
  const short = useSuspenseQuery(spotifyQueries.topTracks('short_term')).data;
  const medium = useSuspenseQuery(spotifyQueries.topTracks('medium_term')).data;
  const long = useSuspenseQuery(spotifyQueries.topTracks('long_term')).data;
  const lists = [
    { range: 'short_term' as const, tracks: short },
    { range: 'medium_term' as const, tracks: medium },
    { range: 'long_term' as const, tracks: long },
  ];
  const tracks = artistTopTracks(artistId, lists).map((entry) => entry.track);
  if (!tracks.length) return null;
  return (
    <section>
      <SectionHeader title={`Your top tracks by ${name}`} />
      <div className="card p-2">
        <TrackList tracks={tracks} ranked />
      </div>
    </section>
  );
}

function Discography({ artistId }: { artistId: string }) {
  const { data } = useSuspenseQuery(spotifyQueries.artistAlbums(artistId));
  if (!data.length) return null;
  return (
    <section>
      <SectionHeader title="Discography" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6">
        {data.map((album) => (
          <a
            key={album.id}
            href={album.url ?? undefined}
            target="_blank"
            rel="noreferrer"
            className="group min-w-0"
          >
            <img
              src={album.image ?? undefined}
              alt=""
              loading="lazy"
              className="aspect-square w-full rounded-xl bg-fill-strong object-cover shadow-[0_8px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.08] transition duration-500 ease-out group-hover:scale-[1.02]"
            />
            <strong className="mt-3 block truncate text-[14px] font-medium">
              {album.name}
            </strong>
            <span className="text-[13px] capitalize text-label-secondary">
              {album.releaseDate?.slice(0, 4) ?? 'Unknown'} ·{' '}
              {album.type ?? 'release'}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function History({ artistId }: { artistId: string }) {
  const { data, isPending } = useQuery({
    queryKey: ['wrapper', 'artistHistory', artistId],
    queryFn: () => getArtistHistory({ data: artistId }),
  });
  if (isPending) return <SectionSkeleton />;
  if (!data?.enabled || (!data.totalPlays && !data.topSince)) return null;
  const date = (value: string | null) =>
    value
      ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
          new Date(value)
        )
      : 'Unknown';
  return (
    <section>
      <SectionHeader title="Your history" />
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <HistoryStat label="Stored plays" value={String(data.totalPlays)} />
        <HistoryStat label="First stored play" value={date(data.firstPlayed)} />
        <HistoryStat
          label="In your top 50 since"
          value={data.topSince ?? 'Not recorded'}
        />
        <HistoryStat label="Last played" value={date(data.lastPlayed)} />
      </dl>
    </section>
  );
}
function HistoryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <dt className="text-[13px] font-medium text-label-secondary">{label}</dt>
      <dd className="mt-1 text-[20px] font-semibold tracking-[-0.02em]">
        {value}
      </dd>
    </div>
  );
}
function SectionSkeleton() {
  return <Skeleton className="h-32 w-full rounded-2xl" />;
}
function ArtistSkeleton() {
  return (
    <PageWrapper>
      <Skeleton className="h-[380px] w-full rounded-[28px] md:h-[480px]" />
    </PageWrapper>
  );
}
