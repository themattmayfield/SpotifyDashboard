import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { spotifyQueries } from '@/lib/queries';

const previewCount = 6;

export function RecentlyPlayed() {
  const { data } = useSuspenseQuery(spotifyQueries.recentlyPlayed());
  return (
    <Panel>
      {!data.length && <EmptyState />}
      {data.slice(0, previewCount).map(({ playedAt, track }) => {
        const artist = track.artists[0];
        return (
          <li key={playedAt} className="flex min-w-0 items-center gap-4">
            <Link
              to="/tracks/$id"
              params={{ id: track.id }}
              className="shrink-0"
            >
              <img
                className="h-8 w-8 rounded-full bg-custom-gray sm:h-12 sm:w-12 lg:h-16 lg:w-16"
                src={track.thumb ?? undefined}
                alt=""
              />
            </Link>
            <div className="flex min-w-0 flex-col">
              <Link
                className="truncate hover:underline"
                to="/tracks/$id"
                params={{ id: track.id }}
              >
                {track.name}
              </Link>
              {artist && (
                <Link
                  className="truncate text-xs text-custom-muted hover:underline"
                  to="/artists/$id"
                  params={{ id: artist.id }}
                >
                  {artist.name}
                </Link>
              )}
            </div>
          </li>
        );
      })}
    </Panel>
  );
}

const titleWidths = [46, 83, 127, 168, 104, 195] as const;

export function RecentlyPlayedSkeleton() {
  return (
    <Panel>
      {titleWidths.map((width, index) => (
        <li key={index} className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 shrink-0 rounded-full sm:h-12 sm:w-12 lg:h-16 lg:w-16" />
          <div className="flex min-w-0 flex-col gap-1">
            <Skeleton className="h-5 max-w-full" style={{ width }} />
            <Skeleton className="h-3 w-12" />
          </div>
        </li>
      ))}
    </Panel>
  );
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <section className="w-full rounded-3xl bg-custom-darkgray p-4 text-white lg:w-72">
      <h2 className="mb-6 text-xl">Recently Played</h2>
      <ul className="grid grid-cols-2 gap-x-2 gap-y-2 lg:grid-cols-1 lg:gap-y-6">
        {children}
      </ul>
      <Link
        className="mt-4 flex w-full justify-center rounded-3xl bg-custom-gray px-4 py-3 text-sm transition duration-300 ease-in-out hover:bg-custom-lightgray sm:py-4"
        to="/recentTracks"
      >
        View All
      </Link>
    </section>
  );
}
