import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

import { FollowButton, FollowButtonSkeleton } from '@/components/FollowButton';
import { OpenInSpotify } from '@/components/OpenInSpotify';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNumber } from '@/lib/format';
import { pageTitle } from '@/lib/head';
import { cachedArtist, spotifyQueries } from '@/lib/queries';

export const Route = createFileRoute('/_spotify/artists/$id')({
  loader: ({ context: { queryClient }, params }) => {
    queryClient.prefetchQuery(spotifyQueries.following(params.id));
    return queryClient.ensureQueryData({
      ...spotifyQueries.artist(params.id),
      ...cachedArtist(queryClient, params.id),
    });
  },
  head: ({ loaderData }) => pageTitle(loaderData?.name ?? 'Artist'),
  component: Page,
  pendingComponent: ArtistSkeleton,
});

const containerClassName =
  'flex flex-col items-center space-y-4 pt-10 text-center text-white md:space-y-8 md:pt-24';
const imageClassName = 'h-40 w-40 rounded-full md:h-80 md:w-80';

function Page() {
  const { id } = Route.useParams();
  const { data: artist } = useSuspenseQuery(spotifyQueries.artist(id));
  const stats = [
    artist.followers !== null && {
      label: 'Followers',
      value: formatNumber(artist.followers),
    },
    artist.popularity !== null && {
      label: 'Popularity',
      value: `${artist.popularity}%`,
    },
  ].filter((stat) => !!stat);

  return (
    <div className={containerClassName}>
      <img
        className={`${imageClassName} bg-custom-darkgray object-cover`}
        src={artist.image ?? undefined}
        alt={artist.name}
      />
      <h1 className="text-4xl md:text-7xl">{artist.name}</h1>
      <div className="flex items-center gap-3">
        <Suspense fallback={<FollowButtonSkeleton />}>
          <FollowButton id={id} />
        </Suspense>
        <OpenInSpotify url={artist.url} />
      </div>
      {stats.length > 0 && (
        <dl className="flex items-center justify-center space-x-12">
          {stats.map(({ label, value }) => (
            <div key={label} className="flex flex-col-reverse">
              <dt className="text-sm text-custom-muted">{label}</dt>
              <dd className="text-xl md:text-3xl">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {artist.genres.length > 0 && (
        <ul className="flex max-w-xl flex-wrap justify-center gap-2 px-4">
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
    </div>
  );
}

function ArtistSkeleton() {
  return (
    <div className={containerClassName}>
      <Skeleton className={imageClassName} />
      <Skeleton className="h-10 w-64 md:h-[72px] md:w-96" />
      <FollowButtonSkeleton />
    </div>
  );
}
