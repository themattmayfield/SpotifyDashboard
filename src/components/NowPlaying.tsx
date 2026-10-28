import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import {
  IoMusicalNotes,
  IoPause,
  IoPlay,
  IoPlaySkipBack,
  IoPlaySkipForward,
} from 'react-icons/io5';

import { cn } from '@/lib/cn';
import { formatDuration } from '@/lib/format';
import { spotifyQueries } from '@/lib/queries';
import { setPlayback, skipPlayback } from '@/lib/spotify';
import type { Playback, PlaybackControlResult } from '@/types';

const messages = {
  'no-device': 'Open Spotify on a device to control playback.',
  'premium-required': 'Playback control requires Spotify Premium.',
};

export function NowPlaying() {
  const client = useQueryClient();
  const playbackQuery = spotifyQueries.playback();
  const { data } = useQuery({
    ...playbackQuery,
    refetchInterval: (query) => (query.state.data?.isPlaying ? 5_000 : 15_000),
    refetchIntervalInBackground: false,
  });
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<string>();
  useEffect(() => setProgress(data?.progressMs ?? 0), [data?.progressMs]);
  useEffect(() => {
    if (!data?.isPlaying) return;
    const timer = window.setInterval(
      () =>
        setProgress((value) => Math.min(value + 1_000, data.track.durationMs)),
      1_000
    );
    return () => window.clearInterval(timer);
  }, [data?.isPlaying, data?.track.durationMs]);

  const control = useMutation({
    mutationFn: (action: 'play' | 'pause' | 'next' | 'previous') =>
      action === 'play' || action === 'pause'
        ? setPlayback({ data: action === 'play' })
        : skipPlayback({ data: action }),
    onMutate: async (action) => {
      await client.cancelQueries({ queryKey: playbackQuery.queryKey });
      const previous = client.getQueryData<Playback | null>(
        playbackQuery.queryKey
      );
      if (previous && (action === 'play' || action === 'pause')) {
        client.setQueryData<Playback>(playbackQuery.queryKey, {
          ...previous,
          isPlaying: action === 'play',
        });
      }
      return { previous };
    },
    onSuccess: (result: PlaybackControlResult, _action, context) => {
      setMessage(result.ok ? undefined : messages[result.reason]);
      if (!result.ok)
        client.setQueryData(playbackQuery.queryKey, context.previous);
    },
    onError: (_error, _action, context) => {
      client.setQueryData(playbackQuery.queryKey, context?.previous);
      setMessage('Spotify couldn’t update playback. Try again.');
    },
    onSettled: () =>
      client.invalidateQueries({ queryKey: playbackQuery.queryKey }),
  });

  const track = data?.track;
  const artist = track?.artists[0];
  const percent = track
    ? Math.min(100, (progress / track.durationMs) * 100)
    : 0;

  return (
    <section
      aria-label="Now playing"
      className={cn(
        'glass fixed inset-x-2 bottom-[calc(68px+env(safe-area-inset-bottom))] z-40 flex items-center gap-3 overflow-hidden rounded-2xl p-2 pr-2 shadow-[0_12px_40px_rgba(0,0,0,0.5)] ring-1 ring-inset ring-white/10',
        'lg:static lg:z-auto lg:grid lg:h-[84px] lg:shrink-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)_minmax(0,1fr)] lg:gap-8 lg:overflow-visible lg:rounded-none lg:border-t lg:border-separator lg:bg-sidebar lg:px-6 lg:py-0 lg:shadow-none lg:ring-0 lg:backdrop-blur-none',
        !track && 'hidden lg:grid'
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {track ? (
          <Link to="/tracks/$id" params={{ id: track.id }} className="shrink-0">
            <img
              src={track.thumb ?? undefined}
              alt=""
              className="h-11 w-11 rounded-lg bg-fill-strong object-cover shadow-md lg:h-14 lg:w-14"
            />
          </Link>
        ) : (
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-fill-strong">
            <IoMusicalNotes className="h-5 w-5 text-label-tertiary" />
          </span>
        )}
        <div className="min-w-0">
          {track ? (
            <>
              <Link
                to="/tracks/$id"
                params={{ id: track.id }}
                className="block truncate text-[14px] font-medium hover:underline"
              >
                {track.name}
              </Link>
              {message ? (
                <p className="truncate text-[12px] text-label-secondary lg:hidden">
                  {message}
                </p>
              ) : null}
              {artist && (
                <Link
                  to="/artists/$id"
                  params={{ id: artist.id }}
                  className={cn(
                    'block truncate text-[13px] text-label-secondary hover:underline',
                    message && 'hidden lg:block'
                  )}
                >
                  {artist.name}
                </Link>
              )}
            </>
          ) : (
            <p className="text-[14px] text-label-secondary">Not playing</p>
          )}
        </div>
      </div>

      {track && data && (
        <div className="flex shrink-0 flex-col items-center gap-1.5">
          <div className="flex items-center gap-1 lg:gap-5">
            <button
              type="button"
              aria-label="Previous"
              aria-busy={control.isPending}
              disabled={control.isPending}
              onClick={() => control.mutate('previous')}
              className="btn-icon hidden text-label disabled:cursor-wait lg:inline-flex"
            >
              <IoPlaySkipBack className="h-[18px] w-[18px]" />
            </button>
            <button
              type="button"
              aria-label={data.isPlaying ? 'Pause' : 'Play'}
              aria-busy={control.isPending}
              disabled={control.isPending}
              onClick={() => control.mutate(data.isPlaying ? 'pause' : 'play')}
              className="flex h-10 w-10 items-center justify-center rounded-full text-label transition active:scale-95 disabled:cursor-wait lg:h-9 lg:w-9 lg:bg-white lg:text-black lg:hover:scale-105"
            >
              {data.isPlaying ? (
                <IoPause className="h-6 w-6 lg:h-[18px] lg:w-[18px]" />
              ) : (
                <IoPlay className="h-6 w-6 translate-x-[1px] lg:h-[18px] lg:w-[18px]" />
              )}
            </button>
            <button
              type="button"
              aria-label="Next"
              aria-busy={control.isPending}
              disabled={control.isPending}
              onClick={() => control.mutate('next')}
              className="btn-icon text-label disabled:cursor-wait"
            >
              <IoPlaySkipForward className="h-5 w-5 lg:h-[18px] lg:w-[18px]" />
            </button>
          </div>
          <div className="hidden w-full items-center gap-3 lg:flex">
            <span className="w-10 text-right text-[11px] tabular-nums text-label-tertiary">
              {formatDuration(progress)}
            </span>
            <ProgressBar percent={percent} className="flex-1" />
            <span className="w-10 text-[11px] tabular-nums text-label-tertiary">
              {formatDuration(track.durationMs)}
            </span>
          </div>
        </div>
      )}

      <p className="hidden truncate text-right text-[12px] text-label-tertiary lg:block">
        {message}
      </p>

      {track && (
        <ProgressBar
          percent={percent}
          className="absolute inset-x-4 bottom-0 lg:hidden"
        />
      )}
    </section>
  );
}

function ProgressBar({
  percent,
  className,
}: { percent: number; className?: string }) {
  return (
    <div
      className={cn(
        'h-[3px] overflow-hidden rounded-full bg-white/[0.15]',
        className
      )}
    >
      <div
        className="h-full rounded-full bg-white/90 transition-[width] duration-1000 ease-linear"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
