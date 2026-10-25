import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import { Fragment, useState } from 'react';

import { OpenInSpotify } from '@/components/OpenInSpotify';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDuration } from '@/lib/format';
import { pageTitle } from '@/lib/head';
import { cachedTrack, spotifyQueries } from '@/lib/queries';
import { playTrack } from '@/lib/spotify';

export const Route = createFileRoute('/_spotify/tracks/$id')({
  loader: ({ context: { queryClient }, params }) => {
    return queryClient.ensureQueryData({
      ...spotifyQueries.track(params.id),
      ...cachedTrack(queryClient, params.id),
    });
  },
  head: ({ loaderData }) => pageTitle(loaderData?.name ?? 'Track'),
  component: Page,
  pendingComponent: TrackSkeleton,
});

const containerClassName =
  'mx-auto flex w-full max-w-7xl flex-col items-center gap-10 px-2 pt-10 md:px-4 md:pt-12';
const headerClassName = 'flex flex-col items-center gap-3 md:flex-row md:gap-8';
const imageClassName = 'h-48 w-48 md:h-72 md:w-72';

function Page() {
  const queryClient = useQueryClient();
  const { id } = Route.useParams();
  const { data: track } = useSuspenseQuery(spotifyQueries.track(id));
  const [message, setMessage] = useState<string>();
  const play = async () => {
    const result = await playTrack({ data: id });
    if (result.ok)
      await queryClient.invalidateQueries({
        queryKey: spotifyQueries.playback().queryKey,
      });
    setMessage(
      result.ok
        ? undefined
        : result.reason === 'no-device'
          ? 'Open Spotify on a device to control playback.'
          : 'Playback control requires Spotify Premium.'
    );
  };
  return (
    <div className={containerClassName}>
      <div className={headerClassName}>
        <img
          className={`${imageClassName} bg-custom-darkgray`}
          src={track.image ?? undefined}
          alt={`${track.album.name} artwork`}
        />
        <div className="flex flex-col items-center gap-1 text-center text-custom-muted md:items-start md:gap-3 md:text-left">
          <h1 className="text-3xl text-white md:text-5xl">{track.name}</h1>
          <p className="md:text-2xl">
            {track.artists.map((artist, index) => (
              <Fragment key={artist.id}>
                {index > 0 && ', '}
                <Link
                  to="/artists/$id"
                  params={{ id: artist.id }}
                  className="hover:text-white hover:underline"
                >
                  {artist.name}
                </Link>
              </Fragment>
            ))}
          </p>
          <p className="md:text-lg">
            {track.album.url ? (
              <a
                href={track.album.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white hover:underline"
              >
                {track.album.name}
              </a>
            ) : (
              track.album.name
            )}
            {track.album.releaseDate && (
              <> &middot; {track.album.releaseDate.split('-')[0]}</>
            )}{' '}
            &middot; {formatDuration(track.durationMs)}
          </p>
          <OpenInSpotify url={track.url} />
          <button
            type="button"
            onClick={play}
            className="rounded-full bg-spotify-green px-6 py-2 text-white"
          >
            Play
          </button>
          {message && <p className="text-sm">{message}</p>}
        </div>
      </div>
      <section className="w-full max-w-2xl rounded-2xl bg-custom-darkgray p-6 text-white">
        <h2 className="mb-4 text-xl">Track details</h2>
        {track.popularity !== null && (
          <div>
            <div className="flex justify-between">
              <span>Popularity</span>
              <span>{track.popularity}/100</span>
            </div>
            <div className="mt-2 h-2 rounded bg-custom-gray">
              <div
                className="h-full rounded bg-spotify-green"
                style={{ width: `${track.popularity}%` }}
              />
            </div>
          </div>
        )}
        <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <Detail label="Duration" value={formatDuration(track.durationMs)} />
          <Detail
            label="Release date"
            value={track.album.releaseDate ?? 'Unknown'}
          />
          <Detail label="Explicit" value={track.explicit ? 'Yes' : 'No'} />
          <Detail label="Album type" value={track.album.type ?? 'Unknown'} />
          <Detail
            label="Track"
            value={
              track.trackNumber
                ? `${track.trackNumber}${track.album.totalTracks ? ` of ${track.album.totalTracks}` : ''}`
                : 'Unknown'
            }
          />
        </dl>
      </section>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-custom-muted">{label}</dt>
      <dd className="mt-1 capitalize">{value}</dd>
    </div>
  );
}

function TrackSkeleton() {
  return (
    <div className={containerClassName}>
      <div className={headerClassName}>
        <Skeleton className={`${imageClassName} rounded-none`} />
        <div className="flex flex-col items-center gap-2 md:items-start md:gap-3">
          <Skeleton className="h-9 w-48 md:h-12 md:w-80" />
          <Skeleton className="h-6 w-32 md:h-8" />
          <Skeleton className="h-6 w-40 md:h-7" />
        </div>
      </div>
    </div>
  );
}
