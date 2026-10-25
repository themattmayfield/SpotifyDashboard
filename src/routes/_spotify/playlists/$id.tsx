import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

import PlaylistLoading from '@/components/Loading/PlaylistLoading';
import TrackLoading from '@/components/Loading/TrackLoading';
import { SinglePlaylist } from '@/components/Playlist';
import Track from '@/components/Track';
import { spotifyQueries } from '@/lib/queries';

export const Route = createFileRoute('/_spotify/playlists/$id')({
  loader: ({ context, params }) => {
    context.queryClient.prefetchQuery(spotifyQueries.playlist(params.id));
  },
  component: Playlist,
});
function Playlist() {
  const { id } = Route.useParams();
  return (
    <div className="no-scrollbar overflow-x-hidden w-full md:w-[1280px] mx-auto px-2 md:px-4 pt-10 md:pt-12">
      <div className="flex flex-col md:flex-row md:justify-center items-center md:items-start space-y-8 md:space-y-0 mb-[150px] md:space-x-16">
        <div className="flex flex-col items-center">
          <Suspense fallback={<PlaylistLoading analytic count={1} />}>
            <SinglePlaylist analytic id={id} />
          </Suspense>
        </div>
        <div className="flex flex-col gap-4 no-scrollbar text-white w-full md:min-w-[566px]s">
          <Suspense fallback={<TrackLoading count={12} />}>
            <Track withTrackDuration type="playlist" playlistId={id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
