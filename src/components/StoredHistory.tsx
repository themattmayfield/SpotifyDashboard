import { dayGroups } from '@/lib/insights';
import { getStoredPlays } from '@/lib/persistence';
import type { Track } from '@/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { RecentTracks, TrackList } from './Tracks';

export function useClientTimeZone() {
  const [timeZone, setTimeZone] = useState('UTC');
  useEffect(
    () =>
      setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'),
    []
  );
  return timeZone;
}

export function StoredHistory() {
  const timeZone = useClientTimeZone();
  const query = useInfiniteQuery({
    queryKey: ['wrapper', 'history'],
    queryFn: ({ pageParam }) => getStoredPlays({ data: { cursor: pageParam } }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (page) => page.nextCursor,
  });
  if (query.isPending)
    return <p className="text-[14px] text-label-tertiary">Loading history…</p>;
  const items = query.data?.pages.flatMap((page) => page.items) ?? [];
  if (!query.data?.pages[0]?.enabled || !items.length)
    return (
      <div className="card p-2">
        <RecentTracks />
      </div>
    );
  return (
    <div className="space-y-10">
      {dayGroups(items, timeZone).map((group) => (
        <section key={group.day}>
          <h2 className="section-title mb-3">{group.label}</h2>
          <div className="card p-2">
            <TrackList
              tracks={group.items.map(
                ({ track }) =>
                  ({
                    ...track,
                    thumb: track.image,
                    album: {
                      name: '',
                      url: null,
                      releaseDate: null,
                      type: null,
                      totalTracks: null,
                    },
                    popularity: null,
                    explicit: false,
                    trackNumber: null,
                    uri: `spotify:track:${track.id}`,
                    url: null,
                    previewUrl: null,
                  }) satisfies Track
              )}
            />
          </div>
        </section>
      ))}
      {query.hasNextPage && (
        <button
          type="button"
          disabled={query.isFetchingNextPage}
          onClick={() => query.fetchNextPage()}
          className="btn-secondary"
        >
          {query.isFetchingNextPage ? 'Loading…' : 'Load more'}
        </button>
      )}
    </div>
  );
}
