import { createPlaylistFromTracks } from '@/lib/spotify';
import { useState } from 'react';
import { IoAdd } from 'react-icons/io5';

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
    <div className="flex flex-wrap items-center gap-3 text-[13px]">
      <button
        type="button"
        disabled={pending || !trackIds.length}
        onClick={save}
        className="btn-primary"
      >
        <IoAdd className="h-4 w-4" />
        {pending ? 'Saving…' : 'Save as playlist'}
      </button>
      {result?.url && (
        <a
          className="font-medium text-label hover:underline"
          href={result.url}
          target="_blank"
          rel="noreferrer"
        >
          Open in Spotify
        </a>
      )}
      {result?.reauth && (
        <span className="text-label-secondary">
          Log in again to allow playlist creation.{' '}
          <a className="text-label underline" href="/api/login">
            Log in
          </a>
        </span>
      )}
    </div>
  );
}
