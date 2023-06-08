'use client';
import Link from 'next/link';
import { millisToMinutesAndSeconds } from '@/lib/time';
import { motion } from 'framer-motion';

let motionTrack = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export default function Track({
  track,
}: {
  track: SpotifyApi.TrackObjectFull | null;
}) {
  return (
    <motion.div
      variants={motionTrack}
      className="flex items-center justify-between  cursor-pointer transition duration-150 ease-in-out hover:bg-custom-darkgray"
    >
      <div className="flex space-x-6 items-center">
        <Link href={`/tracks/${track?.id}`}>
          <img className="w-20 h-20" src={track?.album?.images[0].url} />
        </Link>
        <div className="flex flex-col">
          <Link href={`/tracks/${track?.id}`}>
            <p className="hover:underline">{track?.name}</p>
          </Link>
          <div className="flex flex-col md:flex-row text-[#565656]">
            <Link href={`/artists/${track?.artists[0].id}`}>
              <p className="hover:underline">{track?.artists[0].name}</p>
            </Link>
            <span className="hidden md:block">&nbsp;&middot;&nbsp;&nbsp;</span>
            <p>{track?.album.name}</p>
          </div>
          <p className="md:hidden text-[#565656]">
            {track && millisToMinutesAndSeconds(track.duration_ms)}
          </p>
        </div>
      </div>

      <div className="hidden md:block text-[#565656]">
        {track && millisToMinutesAndSeconds(track?.duration_ms)}
      </div>
    </motion.div>
  );
}
