import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import spotifyApi from '@/lib/spotify';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import handleServerSession from '@/lib/handleServerSession';
const Loading = dynamic(() => import('@/components/Loading'), { ssr: false });

export default async function Artist({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { id } = searchParams;

  handleServerSession();

  const { body: artist } = await spotifyApi.getArtist(id);
  const { body: followingArtist } = await spotifyApi.isFollowingArtists([id]);

  const isFollowingArtist = followingArtist?.[0];

  // const { mutateAsync: handleFollow } = useIsFollowingMutation({
  //   id,
  //   isFollowingArtist,
  // });

  // const followHandler = async () => {
  //   await handleFollow();
  // };

  return (
    <div className="flex flex-col items-center text-center text-white pt-10 md:pt-24 space-y-4 md:space-y-8">
      <div
        className="rounded-full bg-cover bg-center w-40 h-40 md:w-80 md:h-80"
        style={{
          backgroundImage: `url(${artist.images[0].url})`,
        }}
      ></div>

      <p className="text-4xl md:text-7xl">{artist.name}</p>
      <button
        // onClick={() => followHandler()}
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
  );
}
