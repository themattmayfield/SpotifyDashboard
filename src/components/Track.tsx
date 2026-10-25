import { spotifyQuery } from '@/lib/queries';
import { millisToMinutesAndSeconds } from '@/lib/time';
import type { TTimeRange } from '@/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
type Props = { withTrackDuration: boolean } & (
  | { type: 'playlist'; playlistId: string }
  | { type: 'topTracks'; limit: string; timeRange: TTimeRange }
  | { type: 'recent'; limit: string }
);
export default function Track(props: Props) {
  const query =
    props.type === 'playlist'
      ? spotifyQuery('playlist', { id: props.playlistId })
      : props.type === 'topTracks'
        ? spotifyQuery('topTracks', {
            limit: props.limit,
            timeRange: props.timeRange,
          })
        : spotifyQuery('recent', { limit: props.limit }, 30_000);
  const { data } = useSuspenseQuery(query);
  const tracks = (
    props.type === 'playlist'
      ? (data as SpotifyApi.SinglePlaylistResponse).tracks.items.map(
          (x) => x.track
        )
      : props.type === 'topTracks'
        ? data
        : (data as SpotifyApi.PlayHistoryObject[]).map((x) => x.track)
  ) as SpotifyApi.TrackObjectFull[];
  return tracks.map((track) => (
    <div
      key={track.id}
      className="overflow-x-hidden flex items-center justify-between cursor-pointer transition duration-150 ease-in-out hover:bg-custom-darkgray"
    >
      <div className="flex space-x-4 items-center">
        <Link className="shrink-0" to="/tracks/$id" params={{ id: track.id }}>
          <img
            className="w-20 h-20"
            src={track.album.images[0]?.url}
            alt={track.name}
          />
        </Link>
        <div className="flex flex-col">
          <Link to="/tracks/$id" params={{ id: track.id }}>
            <p className="hover:underline whitespace-nowrap truncate max-w-[300px]">
              {track.name}
            </p>
          </Link>
          <div className="flex flex-col md:flex-row text-[#565656]">
            <Link to="/artists/$id" params={{ id: track.artists[0].id }}>
              <p className="hover:underline whitespace-nowrap">
                {track.artists[0].name}
              </p>
            </Link>
            <span className="hidden md:block">&nbsp;&middot;&nbsp;&nbsp;</span>
            <p className="whitespace-nowrap">{track.album.name}</p>
          </div>
          {props.withTrackDuration && (
            <p className="md:hidden text-[#565656]">
              {millisToMinutesAndSeconds(track.duration_ms)}
            </p>
          )}
        </div>
      </div>
      {props.withTrackDuration && (
        <div className="hidden md:block text-[#565656]">
          {millisToMinutesAndSeconds(track.duration_ms)}
        </div>
      )}
    </div>
  ));
}
