import { SiSpotify } from 'react-icons/si';

export function OpenInSpotify({ url }: { url: string | null }) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-secondary"
    >
      <SiSpotify className="h-4 w-4" />
      Open in Spotify
    </a>
  );
}
