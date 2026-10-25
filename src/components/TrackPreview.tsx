import { useEffect, useRef, useState } from 'react';

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
      className="relative"
      onMouseEnter={() => {
        timer.current = setTimeout(play, 300);
      }}
      onMouseLeave={stop}
    >
      <img
        className="h-20 w-20 bg-custom-darkgray"
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
          className="absolute bottom-1 right-1 rounded-full bg-black/75 px-2 py-1 text-xs text-white md:opacity-0 md:group-hover:opacity-100"
        >
          {playing ? '■' : '▶'}
        </button>
      )}
      {playing && (
        <span className="absolute bottom-0 left-0 h-1 w-full animate-pulse bg-spotify-green motion-reduce:animate-none" />
      )}
    </div>
  );
}
