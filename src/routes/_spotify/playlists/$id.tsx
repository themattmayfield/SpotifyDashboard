import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { OpenInSpotify } from '@/components/OpenInSpotify';
import { PlaylistCover } from '@/components/Playlists';
import { TrackList, TrackListSkeleton } from '@/components/Tracks';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCount } from '@/lib/format';
import { pageTitle } from '@/lib/head';
import { spotifyQueries } from '@/lib/queries';

export const Route = createFileRoute('/_spotify/playlists/$id')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(spotifyQueries.playlist(params.id)),
  head: ({ loaderData }) => pageTitle(loaderData?.name ?? 'Playlist'),
  component: Playlist,
  pendingComponent: PlaylistSkeleton,
});

const containerClassName =
  'mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8 px-2 pt-10 md:flex-row md:items-start md:justify-center md:gap-16 md:px-4 md:pt-12';
const coverClassName = 'w-[60vw] shrink-0 md:w-48 lg:w-52 xl:w-80';

function Playlist() {
  const { id } = Route.useParams();
  const { data: playlist } = useSuspenseQuery(spotifyQueries.playlist(id));
  return (
    <div className={containerClassName}>
      <div className="flex flex-col items-center gap-2 text-center text-white">
        <PlaylistCover image={playlist.image} className={coverClassName} />
        <h1 className="mt-2 max-w-[60vw] text-xl md:max-w-[20rem]">
          {playlist.name}
        </h1>
        {playlist.owner && <p>By {playlist.owner}</p>}
        {playlist.trackCount !== null && (
          <p className="text-xs uppercase text-custom-muted">
            {formatCount(playlist.trackCount, 'track')}
          </p>
        )}
        <OpenInSpotify url={playlist.url} />
      </div>
      <div className="w-full min-w-0 flex-1 text-white">
        {playlist.tracks ? (
          <TrackList tracks={playlist.tracks} />
        ) : (
          <p className="pt-4 text-center text-custom-muted md:text-left">
            Spotify only shares tracks for playlists you own or collaborate on.
          </p>
        )}
      </div>
    </div>
  );
}

function PlaylistSkeleton() {
  return (
    <div className={containerClassName}>
      <div className="flex flex-col items-center gap-2">
        <Skeleton className={`${coverClassName} aspect-square rounded-none`} />
        <Skeleton className="mt-2 h-7 w-40" />
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="w-full min-w-0 flex-1">
        <TrackListSkeleton count={12} />
      </div>
    </div>
  );
}
