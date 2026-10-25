import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

import { spotifyQueries } from '@/lib/queries';
import { millisToMinutesAndSeconds } from '@/lib/time';
import type { TTimeRange } from '@/types';

type Props = { withTrackDuration: boolean } & (
  | { type: 'playlist'; playlistId: string }
  | { type: 'topTracks'; limit: string; timeRange: TTimeRange }
  | { type: 'recent'; limit: string }
);

export default function Track(props: Props) {
  if (props.type === 'playlist') return <PlaylistTracks {...props} />;
  if (props.type === 'topTracks') return <TopTracks {...props} />;
  return <RecentTracks {...props} />;
}

function PlaylistTracks(props: Extract<Props, { type: 'playlist' }>) {
  const { data } = useSuspenseQuery(spotifyQueries.playlist(props.playlistId));
  return (
    <TrackList
      tracks={data.tracks.items.flatMap(({ track }) => (track ? [track] : []))}
      withTrackDuration={props.withTrackDuration}
    />
  );
}

function TopTracks(props: Extract<Props, { type: 'topTracks' }>) {
  const { data } = useSuspenseQuery(
    spotifyQueries.topTracks({ limit: props.limit, timeRange: props.timeRange })
  );
  return (
    <TrackList tracks={data} withTrackDuration={props.withTrackDuration} />
  );
}

function RecentTracks(props: Extract<Props, { type: 'recent' }>) {
  const { data } = useSuspenseQuery(
    spotifyQueries.recentlyPlayed({ limit: props.limit })
  );
  return (
    <TrackList
      tracks={data.map(({ track }) => track)}
      withTrackDuration={props.withTrackDuration}
    />
  );
}

function TrackList({
  tracks,
  withTrackDuration,
}: { tracks: SpotifyApi.TrackObjectFull[]; withTrackDuration: boolean }) {
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
          {withTrackDuration && (
            <p className="md:hidden text-[#565656]">
              {millisToMinutesAndSeconds(track.duration_ms)}
            </p>
          )}
        </div>
      </div>
      {withTrackDuration && (
        <div className="hidden md:block text-[#565656]">
          {millisToMinutesAndSeconds(track.duration_ms)}
        </div>
      )}
    </div>
  ));
}
