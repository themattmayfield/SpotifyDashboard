import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { FaPause, FaPlay, FaStepBackward, FaStepForward } from 'react-icons/fa';

import { spotifyQueries } from '@/lib/queries';
import { setPlayback, skipPlayback } from '@/lib/spotify';
import type { PlaybackControlResult } from '@/types';

const messages = {
  'no-device': 'Open Spotify on a device to control playback.',
  'premium-required': 'Playback control requires Spotify Premium.',
};

export function NowPlaying() {
  const client = useQueryClient();
  const { data } = useQuery({
    ...spotifyQueries.playback(),
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
    onSuccess: (result: PlaybackControlResult) => {
      setMessage(result.ok ? undefined : messages[result.reason]);
      client.invalidateQueries({
        queryKey: spotifyQueries.playback().queryKey,
      });
    },
  });

  if (!data)
    return (
      <p className="rounded-2xl bg-custom-darkgray p-4 text-sm text-custom-muted">
        Nothing playing
      </p>
    );
  const artist = data.track.artists[0];
  return (
    <section
      className="rounded-2xl bg-custom-darkgray p-4 text-white"
      aria-label="Now playing"
    >
      <div className="flex min-w-0 items-center gap-3">
        <Link
          to="/tracks/$id"
          params={{ id: data.track.id }}
          className="shrink-0"
        >
          <img
            src={data.track.thumb ?? undefined}
            alt=""
            className="h-14 w-14 bg-custom-gray"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            to="/tracks/$id"
            params={{ id: data.track.id }}
            className="block truncate hover:underline"
          >
            {data.track.name}
          </Link>
          {artist && (
            <Link
              to="/artists/$id"
              params={{ id: artist.id }}
              className="block truncate text-xs text-custom-muted hover:underline"
            >
              {artist.name}
            </Link>
          )}
        </div>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded bg-custom-gray">
        <div
          className="h-full bg-spotify-green"
          style={{
            width: `${Math.min(100, (progress / data.track.durationMs) * 100)}%`,
          }}
        />
      </div>
      <div className="mt-3 flex items-center justify-center gap-6">
        <Control label="Previous" onClick={() => control.mutate('previous')}>
          <FaStepBackward />
        </Control>
        <Control
          label={data.isPlaying ? 'Pause' : 'Play'}
          onClick={() => control.mutate(data.isPlaying ? 'pause' : 'play')}
        >
          {data.isPlaying ? <FaPause /> : <FaPlay />}
        </Control>
        <Control label="Next" onClick={() => control.mutate('next')}>
          <FaStepForward />
        </Control>
      </div>
      {message && (
        <p className="mt-2 text-center text-xs text-custom-muted">{message}</p>
      )}
    </section>
  );
}

function Control({
  label,
  onClick,
  children,
}: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="rounded-full p-2 hover:bg-custom-gray"
    >
      {children}
    </button>
  );
}
