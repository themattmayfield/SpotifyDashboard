import Link from 'next/link';
import { IoMusicalNotesSharp } from 'react-icons/io5';
import pluralize from 'pluralize';

export default function Playlist({
  playlist,
  analytic = false,
}: {
  playlist:
    | SpotifyApi.SinglePlaylistResponse
    | SpotifyApi.PlaylistObjectSimplified;
  analytic?: boolean;
}) {
  const imageClassess = `${
    analytic
      ? 'md:w-48 md:h-48 lg:w-52 lg:h-52 xl:w-80 xl:h-80'
      : 'lg:h-[25vw] lg:w-[25vw] 2xl:h-64 2xl:w-64'
  } cursor-pointer overflow-hidden bg-custom-darkgray bg-cover bg-center h-[45vw] w-[45vw] flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105`;
  return (
    <div className="inline-block max-w-min mx-auto">
      {playlist.images.length ? (
        <Link
          style={{
            backgroundImage: `url(${playlist.images[0].url})`,
          }}
          className={imageClassess}
          href={`/playlists/${playlist.id}`}
        />
      ) : (
        <Link href={`/playlists/${playlist.id}`} className={imageClassess}>
          <IoMusicalNotesSharp className="text-white h-24 w-24 " />
        </Link>
      )}

      <div
        className={`text-center mt-4 w-[45vw] lg:w-[25vw] 2xl:w-64 ${
          analytic && 'space-y-2'
        }`}
      >
        <p className="text-white truncate overflow-hidden">{playlist.name}</p>
        {analytic && (
          <p className="text-white">By {playlist.owner.display_name}</p>
        )}
        <p className="text-xs text-[#565656] break-words">
          {`${playlist.tracks.total} ${pluralize(
            'TRACK',
            playlist.tracks.total
          )}`}
        </p>
      </div>
    </div>
  );
}
