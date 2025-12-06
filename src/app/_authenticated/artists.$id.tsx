// src/app/_authenticated/artists.$id.tsx
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import numeral from 'numeral';

import { FollowButton } from '@/components/FollowButton';
import { getArtist, getIsFollowingArtists } from '@/lib/spotify';

export const Route = createFileRoute('/_authenticated/artists/$id')({
  loader: async ({ params }) => {
    const [artist, isFollowingArtist] = await Promise.all([
      getArtist(params.id),
      getIsFollowingArtists({ type: 'artist', id: params.id }),
    ]);
    return { artist, isFollowingArtist: !!isFollowingArtist };
  },
  pendingComponent: ArtistDetailLoading,
  errorComponent: ArtistDetailError,
  component: ArtistDetailPage,
});

function ArtistDetailLoading() {
  return (
    <div className="flex flex-col items-center text-center text-white pt-10 md:pt-24 space-y-4 md:space-y-8 no-scrollbar">
      <div className="rounded-full bg-custom-darkgray w-40 h-40 md:w-80 md:h-80 animate-pulse" />
      <div className="h-12 w-64 bg-custom-darkgray animate-pulse rounded" />
      <div className="h-10 w-24 bg-custom-darkgray animate-pulse rounded" />
    </div>
  );
}

function ArtistDetailError({ error }: { error: Error }) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center text-center text-white pt-10 md:pt-24 space-y-4 md:space-y-8 no-scrollbar">
      <h2 className="text-xl font-semibold text-red-500">
        Failed to load artist
      </h2>
      <p className="text-neutral-400">{error.message}</p>
      <div className="flex space-x-4">
        <Link
          to="/artists"
          className="rounded-full border border-white px-6 py-2 font-medium text-white hover:bg-white/10"
        >
          Back to Artists
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
  );
}

function ArtistDetailPage() {
  const { artist, isFollowingArtist } = Route.useLoaderData();
  const { id } = Route.useParams();

  return (
    <div className="flex flex-col items-center text-center text-white pt-10 md:pt-24 space-y-4 md:space-y-8 no-scrollbar">
      <div
        className="rounded-full bg-cover bg-center w-40 h-40 md:w-80 md:h-80"
        style={{
          backgroundImage: `url(${artist.images[0]?.url})`,
        }}
      />

      <p className="text-4xl md:text-7xl">{artist.name}</p>
      <FollowButton artistId={id} isFollowing={isFollowingArtist} />
      <div className="flex space-x-12 items-center justify-center">
        <div>
          <p className="text-xl md:text-3xl">
            {numeral(artist.followers.total).format('0,0')}
          </p>
          <p className="text-sm text-[#565656]">Followers</p>
        </div>
        <div>
          <p className="text-xl md:text-3xl">{artist.popularity}%</p>
          <p className="text-sm text-[#565656]">Popularity</p>
        </div>
      </div>
    </div>
  );
}
