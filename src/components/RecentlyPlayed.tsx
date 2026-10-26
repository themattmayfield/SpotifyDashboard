import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { spotifyQueries } from '@/lib/queries';

const previewCount = 10;
const cardClassName = 'w-[240px] shrink-0 snap-start xl:w-[260px]';

/** Compact "Jump back in" cards for the home shelf. */
export function RecentlyPlayed() {
  const { data } = useSuspenseQuery(spotifyQueries.recentlyPlayed());
  if (!data.length) return <EmptyState />;
  return data.slice(0, previewCount).map(({ playedAt, track }) => {
    const artist = track.artists[0];
    return (
      <div
        key={playedAt}
        className={`${cardClassName} card flex items-center gap-3 p-2 pr-4 transition hover:bg-fill-strong`}
      >
        <Link to="/tracks/$id" params={{ id: track.id }} className="shrink-0">
          <img
            className="h-12 w-12 rounded-lg bg-fill-strong object-cover"
            src={track.thumb ?? undefined}
            alt=""
            loading="lazy"
          />
        </Link>
        <div className="flex min-w-0 flex-col">
          <Link
            className="truncate text-[14px] font-medium hover:underline"
            to="/tracks/$id"
            params={{ id: track.id }}
          >
            {track.name}
          </Link>
          {artist && (
            <Link
              className="truncate text-[13px] text-label-secondary hover:underline"
              to="/artists/$id"
              params={{ id: artist.id }}
            >
              {artist.name}
            </Link>
          )}
        </div>
      </div>
    );
  });
}

export function RecentlyPlayedSkeleton() {
  return Array.from({ length: 6 }, (_, index) => (
    <Skeleton key={index} className={`${cardClassName} h-16 rounded-2xl`} />
  ));
}
