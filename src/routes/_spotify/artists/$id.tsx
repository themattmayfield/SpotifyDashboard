import { FollowButton, FollowButtonSkeleton } from '@/components/FollowButton';
import { OpenInSpotify } from '@/components/OpenInSpotify';
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

const ranges: { range: TTimeRange; label: string }[] = [
  { range: 'short_term', label: 'Last 4 weeks' },
  { range: 'medium_term', label: 'Last 6 months' },
  { range: 'long_term', label: 'All time' },
];

function Page() {
  const { id } = Route.useParams();
  const { data: artist } = useSuspenseQuery(spotifyQueries.artist(id));
  return (
    <div className="mx-auto w-full max-w-7xl space-y-12 px-4 pb-16 text-white">
      <header className="flex flex-col items-center gap-4 pt-10 text-center md:pt-20">
        <img
          className="h-40 w-40 rounded-full bg-custom-darkgray object-cover md:h-64 md:w-64"
          src={artist.image ?? undefined}
          alt={artist.name}
        />
        <h1 className="text-4xl md:text-6xl">{artist.name}</h1>
        <div className="flex gap-3">
          <Suspense fallback={<FollowButtonSkeleton />}>
            <FollowButton id={id} />
          </Suspense>
          <OpenInSpotify url={artist.url} />
        </div>
        {artist.genres.length > 0 && (
          <ul className="flex flex-wrap justify-center gap-2">
            {artist.genres.map((genre) => (
              <li
                key={genre}
                className="rounded-full border border-custom-gray px-3 py-1 text-xs capitalize text-custom-muted"
              >
                {genre}
              </li>
            ))}
          </ul>
        )}
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
    </div>
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
      <h2 className="mb-4 text-2xl">Your ranks</h2>
      <div className="grid gap-3 md:grid-cols-3">
        {ranges.map(({ label }, index) => {
          const rank = lists[index].findIndex(
            (artist) => artist.id === artistId
          );
          return (
            <div key={label} className="rounded-xl bg-custom-darkgray p-4">
              <strong>
                {rank >= 0 ? `#${rank + 1}` : 'Not in your top 50'}
              </strong>
              <span className="block text-sm text-custom-muted">{label}</span>
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
      <h2 className="mb-4 text-2xl">Your top tracks by {name}</h2>
      <TrackList tracks={tracks} ranked />
    </section>
  );
}

function Discography({ artistId }: { artistId: string }) {
  const { data } = useSuspenseQuery(spotifyQueries.artistAlbums(artistId));
  if (!data.length) return null;
  return (
    <section>
      <h2 className="mb-4 text-2xl">Discography</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {data.map((album) => (
          <a
            key={album.id}
            href={album.url ?? undefined}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-custom-darkgray p-3 hover:bg-custom-gray"
          >
            <img
              src={album.image ?? undefined}
              alt=""
              className="aspect-square w-full bg-custom-gray object-cover"
            />
            <strong className="mt-2 block truncate">{album.name}</strong>
            <span className="text-sm capitalize text-custom-muted">
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
      <h2 className="mb-4 text-2xl">Your history</h2>
      <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
    <div className="rounded-xl bg-custom-darkgray p-4">
      <dt className="text-sm text-custom-muted">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
function SectionSkeleton() {
  return <Skeleton className="h-32 w-full" />;
}
function ArtistSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 pt-20">
      <Skeleton className="h-64 w-64 rounded-full" />
      <Skeleton className="h-14 w-80" />
    </div>
  );
}
