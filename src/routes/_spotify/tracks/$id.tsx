import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import { Fragment, Suspense } from 'react';

import { AudioFeatures } from '@/components/AudioFeatures';
import { OpenInSpotify } from '@/components/OpenInSpotify';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDuration } from '@/lib/format';
import { pageTitle } from '@/lib/head';
import { cachedTrack, spotifyQueries } from '@/lib/queries';

export const Route = createFileRoute('/_spotify/tracks/$id')({
  loader: ({ context: { queryClient }, params }) => {
    queryClient.prefetchQuery(spotifyQueries.audioFeatures(params.id));
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
  const { id } = Route.useParams();
  const { data: track } = useSuspenseQuery(spotifyQueries.track(id));
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
            {track.album.year && <> &middot; {track.album.year}</>} &middot;{' '}
            {formatDuration(track.durationMs)}
          </p>
          <OpenInSpotify url={track.url} />
        </div>
      </div>
      <Suspense fallback={null}>
        <TrackAudioFeatures id={id} />
      </Suspense>
    </div>
  );
}

function TrackAudioFeatures({ id }: { id: string }) {
  const { data } = useSuspenseQuery(spotifyQueries.audioFeatures(id));
  return data && <AudioFeatures features={data} />;
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
