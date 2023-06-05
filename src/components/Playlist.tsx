'use client';
import Link from 'next/link';
import { IoMusicalNotesSharp } from 'react-icons/io5';
import { motion } from 'framer-motion';

let motionPlaylist = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export default function Playlist({
  playlist,
  analytic = false,
}: {
  playlist: SpotifyApi.PlaylistObjectSimplified;
  analytic?: boolean;
}) {
  const imageClassess = `${
    analytic
      ? 'md:w-48 md:h-48 lg:w-52 lg:h-52 xl:w-80 xl:h-80'
      : 'lg:h-[25vw] lg:w-[25vw] xl:h-96 xl:w-96'
  } cursor-pointer overflow-hidden bg-custom-darkgray bg-cover bg-center h-[40vw] w-[40vw] flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105`;
  return (
    <motion.div
      variants={motionPlaylist}
      className="inline-block max-w-min mx-auto "
    >
      <Link href={`/playlists/${playlist.id}`}>
        {playlist.images.length ? (
          <div
            style={{
              backgroundImage: `url(${playlist.images[0].url})`,
            }}
            className={imageClassess}
          ></div>
        ) : (
          <div className={imageClassess}>
            <IoMusicalNotesSharp className="text-white h-24 w-24 " />
          </div>
        )}
      </Link>
      <div className={`text-center mt-4 ${analytic && 'space-y-2'}`}>
        <p className="text-white">{playlist.name}</p>
        {analytic && (
          <p className="text-white">By {playlist.owner.display_name}</p>
        )}
        <p className="text-xs text-[#565656] break-words">
          {playlist.tracks.total} TRACKS
        </p>
      </div>
    </motion.div>
  );
}
