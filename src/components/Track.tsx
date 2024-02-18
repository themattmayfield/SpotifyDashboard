import { getPlaylist, getRecentlyPlayed, getTopTracks } from '@/lib/spotify';
import { millisToMinutesAndSeconds } from '@/lib/time';
import type { TTimeRange } from '@/types';
import Link from 'next/link';

type TCommon = {
  withTrackDuration: boolean;
};
type TConditionalProps =
  | {
      type: 'playlist';
      playlistId: string;
    }
  | {
      type: 'topTracks';
      limit: string;
      timeRange: TTimeRange;
    }
  | {
      type: 'recent';
      limit: string;
    };
export default async function Track(props: TCommon & TConditionalProps) {
  const topTracks =
    props.type === 'playlist'
      ? await getPlaylist(props.playlistId).then((data) =>
          data.tracks.items.map(({ track }) => track),
        )
      : props.type === 'topTracks'
      ? await getTopTracks({ limit: props.limit, timeRange: props.timeRange })
      : await getRecentlyPlayed({
          limit: props.limit,
        }).then((data) => data.map(({ track }) => track));

  return topTracks.map((track) => (
    <div
      key={track?.id}
      className="overflow-x-hidden flex items-center justify-between  cursor-pointer transition duration-150 ease-in-out hover:bg-custom-darkgray"
    >
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
          {props.withTrackDuration && (
            <p className="md:hidden text-[#565656]">
              {track && millisToMinutesAndSeconds(track.duration_ms)}
            </p>
          )}
        </div>
      </div>

      {props.withTrackDuration && (
        <div className="hidden md:block text-[#565656]">
          {track && millisToMinutesAndSeconds(track?.duration_ms)}
        </div>
      )}
    </div>
  ));
}
