import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';
import { getMovement } from '@/lib/persistence';
import { spotifyQueries } from '@/lib/queries';
import type { Artist, TTimeRange } from '@/types';

const tileClassName = 'aspect-square w-full rounded-2xl';

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
        'group relative block snap-start overflow-hidden bg-fill-strong shadow-[0_8px_30px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
        tileClassName,
        className
      )}
    >
      {artist.thumb && (
        <img
          src={artist.thumb}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/[0.85] via-black/20 to-transparent" />
      {movement !== undefined && movement !== rank && (
        <span
          className={cn(
            'glass absolute right-3 top-3 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums',
            movement === null || movement > (rank ?? 0)
              ? 'text-system-green'
              : 'text-system-red'
          )}
        >
          {movement === null
            ? 'NEW'
            : movement > (rank ?? 0)
              ? `▲ ${movement - (rank ?? 0)}`
              : `▼ ${(rank ?? 0) - movement}`}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="truncate text-[17px] font-semibold leading-tight tracking-[-0.01em] text-white">
          {artist.name}
        </p>
        {rank !== undefined && (
          <p className="mt-0.5 text-[12px] text-white/60">No. {rank}</p>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/[0.08]" />
    </Link>
  );
}
