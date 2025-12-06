// src/app/_authenticated/playlists.tsx
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import pluralize from 'pluralize';
import { IoMusicalNotesSharp } from 'react-icons/io5';

import PlaylistLoading from '@/components/Loading/PlaylistLoading';
import PageRangeHeader from '@/components/PageRangeHeader';
import { PageWrapper } from '@/components/PageWrapper';
import { getUserPlaylists } from '@/lib/spotify';

export const Route = createFileRoute('/_authenticated/playlists')({
  loader: async () => {
    const playlists = await getUserPlaylists();
    return { playlists };
  },
  pendingComponent: PlaylistsLoading,
  errorComponent: PlaylistsError,
  component: PlaylistsPage,
});

function PlaylistsLoading() {
  return (
    <PageWrapper>
      <PageRangeHeader title="Playlists" />
      <div className="px-2 grid grid-cols-2 place-items-center lg:grid-cols-3 2xl:grid-cols-5 gap-2 md:gap-6 no-scrollbar mb-[150px]">
        <PlaylistLoading count={50} />
      </div>
    </PageWrapper>
  );
}

function PlaylistsError({ error }: { error: Error }) {
  const router = useRouter();

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold text-red-500">
          Failed to load playlists
        </h2>
        <p className="mt-2 text-neutral-400">{error.message}</p>
        <button
          type="button"
          onClick={() => router.invalidate()}
          className="mt-4 rounded-full bg-green-500 px-6 py-2 font-medium text-black hover:bg-green-400"
        >
          Try Again
        </button>
      </div>
    </PageWrapper>
  );
}

function PlaylistsPage() {
  const { playlists } = Route.useLoaderData();

  return (
    <PageWrapper>
      <PageRangeHeader title="Playlists" />

      <div className="px-2 grid grid-cols-2 place-items-center lg:grid-cols-3 2xl:grid-cols-5 gap-2 md:gap-6 no-scrollbar mb-[150px]">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </PageWrapper>
  );
}

function PlaylistCard({
  playlist,
}: {
  playlist: SpotifyApi.PlaylistObjectSimplified;
}) {
  const imageClasses =
    'lg:h-[25vw] lg:w-[25vw] 2xl:h-64 2xl:w-64 cursor-pointer overflow-hidden bg-custom-darkgray bg-cover bg-center h-[45vw] w-[45vw] flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105';

  return (
    <div className="inline-block max-w-min mx-auto">
      {playlist.images?.length ? (
        <Link
          to="/playlists/$id"
          params={{ id: playlist.id }}
          style={{
            backgroundImage: `url(${playlist.images[0].url})`,
          }}
          className={imageClasses}
        />
      ) : (
        <Link
          to="/playlists/$id"
          params={{ id: playlist.id }}
          className={imageClasses}
        >
          <IoMusicalNotesSharp className="text-white h-24 w-24" />
        </Link>
      )}

      <div className="text-center mt-4 w-[45vw] lg:w-[25vw] 2xl:w-64 mx-auto">
        <p className="text-white truncate overflow-hidden">{playlist.name}</p>
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
