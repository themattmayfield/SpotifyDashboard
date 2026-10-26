import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import { Fragment, useState } from 'react';
import { IoPlay } from 'react-icons/io5';

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
  'mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 pt-6 md:px-8 md:pt-10';
const headerClassName =
  'flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:gap-10 md:text-left';
const imageClassName = 'h-56 w-56 shrink-0 rounded-2xl md:h-72 md:w-72';

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
          className={`${imageClassName} bg-fill-strong object-cover shadow-[0_24px_60px_rgba(0,0,0,0.6)] ring-1 ring-white/[0.08]`}
          src={track.image ?? undefined}
          alt={`${track.album.name} artwork`}
        />
        <div className="flex min-w-0 flex-col items-center gap-2 md:items-start">
          <p className="text-[13px] font-medium text-label-secondary">Song</p>
          <h1 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[52px]">
            {track.name}
          </h1>
          <p className="text-[17px] font-medium md:text-[20px]">
            {track.artists.map((artist, index) => (
              <Fragment key={artist.id}>
                {index > 0 && ', '}
                <Link
                  to="/artists/$id"
                  params={{ id: artist.id }}
                  className="hover:underline"
                >
                  {artist.name}
                </Link>
              </Fragment>
            ))}
          </p>
          <p className="text-[14px] text-label-secondary">
            {track.album.url ? (
              <a
                href={track.album.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-label hover:underline"
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
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={play} className="btn-primary px-6">
              <IoPlay className="h-4 w-4" />
              Play
            </button>
            <OpenInSpotify url={track.url} />
          </div>
          {message && (
            <p className="text-[13px] text-label-secondary">{message}</p>
          )}
        </div>
      </div>
      <section>
        <h2 className="section-title mb-3">Details</h2>
        <div className="card overflow-hidden">
          {track.popularity !== null && (
            <div className="px-5 py-4">
              <div className="flex justify-between text-[15px]">
                <span>Popularity</span>
                <span className="tabular-nums text-label-secondary">
                  {track.popularity}/100
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: `${track.popularity}%` }}
                />
              </div>
            </div>
          )}
          <dl className="divide-y divide-separator border-t border-separator [&:first-child]:border-t-0">
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
        </div>
      </section>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5 text-[15px]">
      <dt>{label}</dt>
      <dd className="capitalize text-label-secondary">{value}</dd>
    </div>
  );
}

function TrackSkeleton() {
  return (
    <div className={containerClassName}>
      <div className={headerClassName}>
        <Skeleton className={imageClassName} />
        <div className="flex flex-col items-center gap-3 md:items-start">
          <Skeleton className="h-10 w-48 md:h-14 md:w-80" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-40" />
        </div>
      </div>
    </div>
  );
}
