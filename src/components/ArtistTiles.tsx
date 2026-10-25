import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';
import { getMovement } from '@/lib/persistence';
import { spotifyQueries } from '@/lib/queries';
import type { Artist, TTimeRange } from '@/types';

const tileClassName = 'aspect-square w-full rounded-3xl';

type Props = { range: TTimeRange; limit?: number; className?: string };

export function ArtistTiles({ range, limit, className }: Props) {
  const { data } = useSuspenseQuery(spotifyQueries.topArtists(range));
  const movement = useQuery({
    queryKey: ['wrapper', 'movement', 'artists', range],
    queryFn: () => getMovement({ data: { kind: 'artists', range } }),
  });
  if (!data.length) return <EmptyState />;
  return data
    .slice(0, limit)
    .map((artist) => (
      <ArtistTile
        key={artist.id}
        artist={artist}
        className={className}
        movement={movement.data?.movements[artist.id]?.previousRank}
        rank={data.findIndex((x) => x.id === artist.id) + 1}
      />
    ));
}

export function ArtistTilesSkeleton({
  count,
  className,
}: { count: number; className?: string }) {
  return Array.from({ length: count }, (_, index) => (
    <Skeleton key={index} className={cn(tileClassName, className)} />
  ));
}

function ArtistTile({
  artist,
  className,
  movement,
  rank,
}: {
  artist: Artist;
  className?: string;
  movement?: number | null;
  rank?: number;
}) {
  return (
    <Link
      to="/artists/$id"
      params={{ id: artist.id }}
      className={cn(
        'group relative block overflow-hidden bg-custom-darkgray',
        tileClassName,
        className
      )}
    >
      {artist.thumb && (
        <img
          src={artist.thumb}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 ease-in-out group-hover:scale-105"
        />
      )}
      {movement !== undefined && movement !== rank && (
        <span
          className={`absolute right-3 top-3 rounded bg-black/80 px-2 py-1 text-xs ${movement === null || movement > (rank ?? 0) ? 'text-green-400' : 'text-red-400'}`}
        >
          {movement === null
            ? 'NEW'
            : movement > (rank ?? 0)
              ? `▲${movement - (rank ?? 0)}`
              : `▼${(rank ?? 0) - movement}`}
        </span>
      )}
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/75 via-black/10 to-transparent p-4 transition duration-300 ease-in-out [@media(hover:hover)]:opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 lg:p-6">
        <p className="truncate text-lg text-white lg:text-2xl">{artist.name}</p>
      </div>
    </Link>
  );
}
