import { IoArrowUpOutline } from 'react-icons/io5';

export function OpenInSpotify({ url }: { url: string | null }) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-secondary"
    >
      Open in Spotify
      <IoArrowUpOutline className="h-4 w-4 rotate-45" />
    </a>
  );
}
