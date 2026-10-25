import { createPlaylistFromTracks } from '@/lib/spotify';
import { useState } from 'react';

export function SavePlaylistButton({
  name,
  trackIds,
}: { name: string; trackIds: string[] }) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ url?: string; reauth?: boolean }>();
  const save = async () => {
    if (pending) return;
    setPending(true);
    try {
      const response = await createPlaylistFromTracks({
        data: { name, trackIds, public: false },
      });
      setResult(response.ok ? { url: response.url } : { reauth: true });
    } finally {
      setPending(false);
    }
  };
  return (
    <div className="flex items-center gap-3 text-sm">
      <button
        type="button"
        disabled={pending || !trackIds.length}
        onClick={save}
        className="rounded-full bg-spotify-green px-5 py-2 font-semibold text-white disabled:opacity-50"
      >
        {pending ? 'Saving…' : 'Save as playlist'}
      </button>
      {result?.url && (
        <a
          className="text-spotify-green hover:underline"
          href={result.url}
          target="_blank"
          rel="noreferrer"
        >
          Open in Spotify
        </a>
      )}
      {result?.reauth && (
        <span>
          Log in again to allow playlist creation.{' '}
          <a className="underline" href="/api/login">
            Log in
          </a>
        </span>
      )}
    </div>
  );
}
