import { SiSpotify } from 'react-icons/si';

export function OpenInSpotify({ url }: { url: string | null }) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-[34px] items-center gap-2 rounded border border-custom-gray px-3 text-sm text-white transition duration-300 ease-in-out hover:bg-custom-darkgray"
    >
      <SiSpotify className="h-4 w-4 text-spotify-green" />
      Open in Spotify
    </a>
  );
}
