// src/app/_authenticated/playlists.$id.tsx
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import pluralize from 'pluralize';
import { IoMusicalNotesSharp } from 'react-icons/io5';

import PlaylistLoading from '@/components/Loading/PlaylistLoading';
import TrackLoading from '@/components/Loading/TrackLoading';
import { getPlaylist } from '@/lib/spotify';
import { millisToMinutesAndSeconds } from '@/lib/time';

export const Route = createFileRoute('/_authenticated/playlists/$id')({
  loader: async ({ params }) => {
    const playlist = await getPlaylist(params.id);
    return { playlist };
  },
  pendingComponent: PlaylistDetailLoading,
  errorComponent: PlaylistDetailError,
  component: PlaylistDetailPage,
});

function PlaylistDetailLoading() {
  return (
    <div className="no-scrollbar overflow-x-hidden w-full md:w-[1280px] mx-auto px-2 md:px-4 pt-10 md:pt-12">
      <div className="flex flex-col md:flex-row md:justify-center items-center md:items-start space-y-8 md:space-y-0 mb-[150px] md:space-x-16">
        <div className="flex flex-col items-center">
          <PlaylistLoading analytic count={1} />
        </div>
        <div className="flex flex-col gap-4 no-scrollbar text-white w-full md:min-w-[566px]">
          <TrackLoading count={12} />
        </div>
      </div>
    </div>
  );
}

function PlaylistDetailError({ error }: { error: Error }) {
  const router = useRouter();

  return (
    <div className="no-scrollbar overflow-x-hidden w-full md:w-[1280px] mx-auto px-2 md:px-4 pt-10 md:pt-12">
      <div className="flex flex-col items-center text-center space-y-4">
        <h2 className="text-xl font-semibold text-red-500">
          Failed to load playlist
        </h2>
        <p className="text-neutral-400">{error.message}</p>
        <div className="flex space-x-4">
          <Link
            to="/playlists"
            className="rounded-full border border-white px-6 py-2 font-medium text-white hover:bg-white/10"
          >
            Back to Playlists
          </Link>
          <button
            type="button"
            onClick={() => router.invalidate()}
            className="rounded-full bg-green-500 px-6 py-2 font-medium text-black hover:bg-green-400"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

function PlaylistDetailPage() {
  const { playlist } = Route.useLoaderData();

  return (
    <div className="no-scrollbar overflow-x-hidden w-full md:w-[1280px] mx-auto px-2 md:px-4 pt-10 md:pt-12">
      <div className="flex flex-col md:flex-row md:justify-center items-center md:items-start space-y-8 md:space-y-0 mb-[150px] md:space-x-16">
        <div className="flex flex-col items-center">
          <PlaylistHeader playlist={playlist} />
        </div>
        <div className="flex flex-col gap-4 no-scrollbar text-white w-full md:min-w-[566px]">
          {playlist.tracks.items.map(({ track }) =>
            track ? <TrackRow key={track.id} track={track} /> : null
          )}
        </div>
      </div>
    </div>
  );
}

function PlaylistHeader({
  playlist,
}: {
  playlist: SpotifyApi.SinglePlaylistResponse;
}) {
  const imageClasses =
    'md:w-48 md:h-48 lg:w-52 lg:h-52 xl:w-80 xl:h-80 cursor-pointer overflow-hidden bg-custom-darkgray bg-cover bg-center h-[45vw] w-[45vw] flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105';

  return (
    <div className="inline-block max-w-min mx-auto">
      {playlist.images?.length ? (
        <div
          style={{
            backgroundImage: `url(${playlist.images[0].url})`,
          }}
          className={imageClasses}
        />
      ) : (
        <div className={imageClasses}>
          <IoMusicalNotesSharp className="text-white h-24 w-24" />
        </div>
      )}

      <div className="text-center mt-4 space-y-2">
        <p className="text-white truncate overflow-hidden">{playlist.name}</p>
        <p className="text-white">By {playlist.owner.display_name}</p>
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

function TrackRow({ track }: { track: SpotifyApi.TrackObjectFull }) {
  return (
    <div className="overflow-x-hidden flex items-center justify-between cursor-pointer transition duration-150 ease-in-out hover:bg-custom-darkgray">
      <div className="flex space-x-4 items-center">
        <Link className="shrink-0" to="/tracks/$id" params={{ id: track.id }}>
          <img
            className="w-20 h-20"
            src={track.album?.images[0]?.url}
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
          <p className="md:hidden text-[#565656]">
            {millisToMinutesAndSeconds(track.duration_ms)}
          </p>
        </div>
      </div>

      <div className="hidden md:block text-[#565656]">
        {millisToMinutesAndSeconds(track.duration_ms)}
      </div>
    </div>
  );
}
