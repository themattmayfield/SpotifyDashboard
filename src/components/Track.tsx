import Link from 'next/link';
import { millisToMinutesAndSeconds } from '@/lib/time';

export default function Track({
  track,
  withTrackDuration = true,
}: {
  track: SpotifyApi.TrackObjectFull | null;
  withTrackDuration?: boolean;
}) {
  return (
    <div className="overflow-x-hidden flex items-center justify-between  cursor-pointer transition duration-150 ease-in-out hover:bg-custom-darkgray">
      <div className="flex space-x-4 items-center">
        <Link className="shrink-0" href={`/tracks/${track?.id}`}>
          <img className="w-20 h-20" src={track?.album?.images[0].url} />
        </Link>
        <div className="flex flex-col">
          <Link href={`/tracks/${track?.id}`}>
            <p className="hover:underline whitespace-nowrap">{track?.name}</p>
          </Link>
          <div className="flex flex-col md:flex-row text-[#565656]">
            <Link href={`/artists/${track?.artists[0].id}`}>
              <p className="hover:underline whitespace-nowrap">
                {track?.artists[0].name}
              </p>
            </Link>
            <span className="hidden md:block">&nbsp;&middot;&nbsp;&nbsp;</span>
            <p className="whitespace-nowrap">{track?.album.name}</p>
          </div>
          {withTrackDuration && (
            <p className="md:hidden text-[#565656]">
              {track && millisToMinutesAndSeconds(track.duration_ms)}
            </p>
          )}
        </div>
      </div>

      {withTrackDuration && (
        <div className="hidden md:block text-[#565656]">
          {track && millisToMinutesAndSeconds(track?.duration_ms)}
        </div>
      )}
    </div>
  );
}
