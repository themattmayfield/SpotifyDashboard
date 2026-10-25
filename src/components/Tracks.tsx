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
    <ol className="flex flex-col gap-4">
      {tracks.map((track, index) => (
        // The same track can appear more than once in history and playlists.
        <li
          key={`${track.id}-${index}`}
          className="group flex items-center gap-4 rounded-md transition duration-150 ease-in-out hover:bg-custom-darkgray"
        >
          {ranked && (
            <span className="w-6 shrink-0 text-right text-sm tabular-nums text-custom-muted">
              {index + 1}
            </span>
          )}
          {ranked &&
            movements?.[track.id]?.previousRank !== undefined &&
            movements[track.id].previousRank !== index + 1 && (
              <span
                className={`w-10 text-xs ${movements[track.id].previousRank === null || (movements[track.id].previousRank ?? 0) > index + 1 ? 'text-green-400' : 'text-red-400'}`}
              >
                {movements[track.id].previousRank === null
                  ? 'NEW'
                  : (movements[track.id].previousRank ?? 0) > index + 1
                    ? `▲${(movements[track.id].previousRank ?? 0) - index - 1}`
                    : `▼${index + 1 - (movements[track.id].previousRank ?? 0)}`}
              </span>
            )}
          <Link className="shrink-0" to="/tracks/$id" params={{ id: track.id }}>
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
              className="truncate hover:underline"
            >
              {track.name}
            </Link>
            <div className="flex min-w-0 flex-col text-custom-muted md:flex-row">
              {track.artists[0] && (
                <Link
                  to="/artists/$id"
                  params={{ id: track.artists[0].id }}
                  className="shrink-0 truncate hover:underline"
                >
                  {track.artists[0].name}
                </Link>
              )}
              <span className="hidden md:block">&nbsp;&middot;&nbsp;</span>
              <span className="truncate">{track.album.name}</span>
            </div>
            {showDuration && (
              <span className="text-custom-muted md:hidden">
                {formatDuration(track.durationMs)}
              </span>
            )}
          </div>
          {showDuration && (
            <span className="hidden shrink-0 pr-2 tabular-nums text-custom-muted md:block">
              {formatDuration(track.durationMs)}
            </span>
          )}
        </li>
      ))}
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
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-center gap-4">
          {ranked && <span className="w-6 shrink-0" />}
          <Skeleton className="h-20 w-20 shrink-0 rounded-none" />
          <div className="flex flex-col gap-2">
            <Skeleton
              className="h-5"
              style={{ width: widths.title[index % widths.title.length] }}
            />
            <Skeleton
              className="h-4"
              style={{ width: widths.detail[index % widths.detail.length] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
