'use client';
import { useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';
import dynamic from 'next/dynamic';
import useArtistQuery from '@/hooks/useArtistQuery';
import useIsFollowingArtist from '@/hooks/useIsFollowingArtistQuery';
import useIsFollowingMutation from '@/hooks/useIsFollowingMutation';
const Loading = dynamic(() => import('@/components/Loading'), { ssr: false });

export default function Artist() {
  const searchParams = useSearchParams();
  const id = searchParams?.get('id') as string;

  const { data: artist } = useArtistQuery({
    id,
  });
  const { data: followingArtist } = useIsFollowingArtist({
    id,
  });

  const isFollowingArtist = followingArtist && followingArtist[0];

  const { mutateAsync: handleFollow } = useIsFollowingMutation({
    id,
    isFollowingArtist,
  });

  const followHandler = async () => {
    await handleFollow();
  };

  if (!artist || !followingArtist) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col items-center text-center text-white pt-10 md:pt-24 space-y-4 md:space-y-8">
        <div
          className="rounded-full bg-cover bg-center w-40 h-40 md:w-80 md:h-80"
          style={{
            backgroundImage: `url(${artist.images[0].url})`,
          }}
        ></div>

        <p className="text-4xl md:text-7xl">{artist.name}</p>
        <button
          onClick={() => followHandler()}
          className={`bg-transparent border text-white rounded px-4 py-1 cursor-pointer focus:outline-none hover:bg-custom-darkgray transition duration-300 ease-in-out ${
            isFollowingArtist ? 'border-white' : 'border-gray-900'
          }`}
        >
          {isFollowingArtist ? 'Following' : `Follow`}
        </button>
        <div className="flex space-x-12 items-center justify-center">
          <div>
            <p className="text-xl md:text-3xl">{artist.followers.total}</p>
            <p className="text-sm text-[#565656]">Followers</p>
          </div>
          <div>
            <p className="text-xl md:text-3xl">{artist.popularity}</p>
            <p className="text-sm text-[#565656]">Popularity</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
