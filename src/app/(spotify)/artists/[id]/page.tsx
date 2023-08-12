import dynamic from 'next/dynamic';
import spotifyApi from '@/lib/spotify';

import handleServerSession from '@/lib/handleServerSession';
import numeral from 'numeral';
import { revalidatePath } from 'next/cache';

const Loading = dynamic(() => import('@/components/Loading'), { ssr: false });

export default async function Artist({ params }: { params: { id: string } }) {
  const { id } = params;

  await handleServerSession();

  const [{ body: artist }, { body: followingArtist }] = await Promise.all([
    spotifyApi.getArtist(id),
    spotifyApi.isFollowingArtists([id]),
  ]);

  const isFollowingArtist = followingArtist.at(0);

  const followHandler = async () => {
    'use server';

    await handleServerSession();

    isFollowingArtist
      ? await spotifyApi.unfollowArtists([id])
      : await spotifyApi.followArtists([id]);

    revalidatePath('/artists/[id]');
  };

  return (
    <div className="flex flex-col items-center text-center text-white pt-10 md:pt-24 space-y-4 md:space-y-8">
      <div
        className="rounded-full bg-cover bg-center w-40 h-40 md:w-80 md:h-80"
        style={{
          backgroundImage: `url(${artist.images[0].url})`,
        }}
      ></div>

      <p className="text-4xl md:text-7xl">{artist.name}</p>
      <form action={followHandler}>
        <button
          type="submit"
          className={`bg-transparent border text-white rounded px-4 py-1 cursor-pointer focus:outline-none hover:bg-custom-darkgray transition duration-300 ease-in-out ${
            isFollowingArtist ? 'border-white' : 'border-gray-900'
          }`}
        >
          {isFollowingArtist ? 'Following' : `Follow`}
        </button>
      </form>
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
