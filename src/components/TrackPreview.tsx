import { useEffect, useRef, useState } from 'react';
import { IoPlay, IoStop } from 'react-icons/io5';

import { cn } from '@/lib/cn';

let audio: HTMLAudioElement | undefined;
let stopCurrent: (() => void) | undefined;

export function TrackPreview({
  url,
  image,
  alt,
}: { url: string | null; image: string | null; alt: string }) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [playing, setPlaying] = useState(false);
  const stop = () => {
    if (timer.current) clearTimeout(timer.current);
    if (audio?.src === url) {
      audio.pause();
      audio.currentTime = 0;
    }
    setPlaying(false);
  };
  const play = () => {
    if (!url || localStorage.getItem('hover-previews') === 'off') return;
    stopCurrent?.();
    audio ??= new Audio();
    audio.volume = 0.5;
    audio.src = url;
    void audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => {});
    stopCurrent = stop;
  };
  // The listener intentionally belongs to this mounted preview instance.
  // biome-ignore lint/correctness/useExhaustiveDependencies: cleanup must use this render's stop function
  useEffect(() => {
    const hidden = () => {
      if (document.hidden) stop();
    };
    document.addEventListener('visibilitychange', hidden);
    return () => {
      document.removeEventListener('visibilitychange', hidden);
      stop();
    };
  }, []);
  return (
    <div
      className="relative h-12 w-12 overflow-hidden rounded-lg shadow-md md:h-14 md:w-14"
      onMouseEnter={() => {
        timer.current = setTimeout(play, 300);
      }}
      onMouseLeave={stop}
    >
      <img
        className="h-full w-full bg-fill-strong object-cover"
        src={image ?? undefined}
        alt={alt}
        loading="lazy"
      />
      {url && (
        <button
          type="button"
          aria-label={playing ? 'Stop preview' : 'Play preview'}
          onClick={(event) => {
            event.preventDefault();
            playing ? stop() : play();
          }}
          className={cn(
            'absolute bottom-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white transition duration-200',
            'md:inset-0 md:h-auto md:w-auto md:rounded-none md:bg-black/[0.45] md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100',
            playing && 'md:opacity-100'
          )}
        >
          {playing ? (
            <IoStop className="h-2.5 w-2.5 md:h-4 md:w-4" />
          ) : (
            <IoPlay className="h-2.5 w-2.5 translate-x-[0.5px] md:h-5 md:w-5" />
          )}
        </button>
      )}
      {playing && (
        <span className="absolute bottom-0 left-0 h-[3px] w-full animate-pulse bg-white motion-reduce:animate-none" />
      )}
    </div>
  );
}
