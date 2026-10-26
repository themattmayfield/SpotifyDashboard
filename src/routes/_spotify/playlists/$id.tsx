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
  'mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-4 pt-6 md:flex-row md:items-start md:gap-12 md:px-8 md:pt-10';
const coverClassName =
  'w-[64vw] max-w-[300px] shrink-0 md:w-56 lg:w-64 xl:w-80';

function Playlist() {
  const { id } = Route.useParams();
  const { data: playlist } = useSuspenseQuery(spotifyQueries.playlist(id));
  return (
    <div className={containerClassName}>
      <div className="flex flex-col items-center gap-2 text-center md:sticky md:top-24 md:items-start md:text-left">
        <PlaylistCover
          image={playlist.image}
          className={`${coverClassName} shadow-[0_24px_60px_rgba(0,0,0,0.6)]`}
        />
        <h1 className="mt-4 max-w-[80vw] text-[26px] font-semibold leading-tight tracking-[-0.025em] md:max-w-[20rem]">
          {playlist.name}
        </h1>
        {playlist.owner && (
          <p className="text-[15px] font-medium">{playlist.owner}</p>
        )}
        {playlist.trackCount !== null && (
          <p className="text-[13px] text-label-secondary">
            {formatCount(playlist.trackCount, 'song')}
          </p>
        )}
        <div className="mt-3">
          <OpenInSpotify url={playlist.url} />
        </div>
      </div>
      <div className="w-full min-w-0 flex-1">
        {playlist.tracks ? (
          <div className="card p-2">
            <TrackList tracks={playlist.tracks} />
          </div>
        ) : (
          <p className="card p-6 text-center text-[14px] text-label-secondary md:text-left">
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
      <div className="flex flex-col items-center gap-2 md:items-start">
        <Skeleton className={`${coverClassName} aspect-square rounded-2xl`} />
        <Skeleton className="mt-4 h-7 w-40" />
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="w-full min-w-0 flex-1">
        <TrackListSkeleton count={12} />
      </div>
    </div>
  );
}
