import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDuration } from '@/lib/format';
import { getMovement } from '@/lib/persistence';
import { spotifyQueries } from '@/lib/queries';
import type { TTimeRange, Track } from '@/types';
import { SavePlaylistButton } from './SavePlaylistButton';
import { TrackPreview } from './TrackPreview';

type ListOptions = { showDuration?: boolean; ranked?: boolean };

export function TopTracks({
  range,
  limit,
  ...options
}: { range: TTimeRange; limit?: number } & ListOptions) {
  const { data } = useSuspenseQuery(spotifyQueries.topTracks(range));
  const movement = useQuery({
    queryKey: ['wrapper', 'movement', 'tracks', range],
    queryFn: () => getMovement({ data: { kind: 'tracks', range } }),
  });
  return (
    <TrackList
      tracks={data.slice(0, limit)}
      movements={movement.data?.movements}
      {...options}
    />
  );
}

export function RecentTracks(options: ListOptions) {
  const { data } = useSuspenseQuery(spotifyQueries.recentlyPlayed());
  return <TrackList tracks={data.map(({ track }) => track)} {...options} />;
}

export function SaveTopTracks({
  range,
  name,
}: { range: TTimeRange; name: string }) {
  const { data } = useSuspenseQuery(spotifyQueries.topTracks(range));
  return (
    <SavePlaylistButton name={name} trackIds={data.map((track) => track.id)} />
  );
}

export function TrackList({
  tracks,
  showDuration = true,
  ranked = false,
  movements,
}: {
  tracks: Track[];
  movements?: Record<string, { previousRank?: number | null }>;
} & ListOptions) {
  if (!tracks.length) return <EmptyState />;
  return (
    <ol className="flex flex-col">
      {tracks.map((track, index) => {
        const previousRank = movements?.[track.id]?.previousRank;
        return (
          // The same track can appear more than once in history and playlists.
          <li
            key={`${track.id}-${index}`}
            className="group flex items-center gap-3 rounded-xl px-2 py-2 transition duration-150 ease-out hover:bg-fill md:gap-4 md:px-3"
          >
            {ranked && (
              <span className="w-6 shrink-0 text-right text-[15px] font-medium tabular-nums text-label-tertiary">
                {index + 1}
              </span>
            )}
            {ranked &&
              previousRank !== undefined &&
              previousRank !== index + 1 && (
                <span
                  className={`w-8 shrink-0 text-[11px] font-semibold tabular-nums ${previousRank === null || previousRank > index + 1 ? 'text-system-green' : 'text-system-red'}`}
                >
                  {previousRank === null
                    ? 'NEW'
                    : previousRank > index + 1
                      ? `▲${previousRank - index - 1}`
                      : `▼${index + 1 - previousRank}`}
                </span>
              )}
            <Link
              className="shrink-0"
              to="/tracks/$id"
              params={{ id: track.id }}
            >
              <TrackPreview
                url={track.previewUrl}
                image={track.thumb}
                alt={`${track.album.name} artwork`}
              />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <Link
                to="/tracks/$id"
                params={{ id: track.id }}
                className="truncate text-[15px] font-medium hover:underline"
              >
                {track.name}
              </Link>
              <div className="flex min-w-0 flex-col text-[13px] text-label-secondary md:flex-row">
                {track.artists[0] && (
                  <Link
                    to="/artists/$id"
                    params={{ id: track.artists[0].id }}
                    className="shrink-0 truncate hover:text-label hover:underline"
                  >
                    {track.artists[0].name}
                  </Link>
                )}
                {track.album.name && (
                  <>
                    <span className="hidden md:block">
                      &nbsp;&middot;&nbsp;
                    </span>
                    <span className="hidden truncate md:block">
                      {track.album.name}
                    </span>
                  </>
                )}
              </div>
            </div>
            {showDuration && (
              <span className="shrink-0 pr-1 text-[13px] tabular-nums text-label-tertiary">
                {formatDuration(track.durationMs)}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

const widths = {
  title: [94, 163, 121, 188, 76, 145],
  detail: [42, 87, 63, 96, 54, 75],
} as const;

export function TrackListSkeleton({
  count,
  ranked = false,
}: { count: number; ranked?: boolean }) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 px-2 py-2 md:gap-4 md:px-3"
        >
          {ranked && <span className="w-6 shrink-0" />}
          <Skeleton className="h-12 w-12 shrink-0 rounded-lg md:h-14 md:w-14" />
          <div className="flex flex-col gap-2">
            <Skeleton
              className="h-4 rounded-md"
              style={{ width: widths.title[index % widths.title.length] }}
            />
            <Skeleton
              className="h-3 rounded-md"
              style={{ width: widths.detail[index % widths.detail.length] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
