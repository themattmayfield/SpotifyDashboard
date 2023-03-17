import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { catchErrors } from '@/utils/index';
import useSpotify from 'lib/useSpotify';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

const Loading = dynamic(() => import('@/components/Loading'), { ssr: false });

export default function Artist() {
  const { query } = useRouter();
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [artist, setArtist] = useState(null);
  const [followingArtist, setFollowingArtist] = useState(null);

  useEffect(() => {
    if (query && spotifyApi.getAccessToken()) {
      (async () => {
        const { body: artist } = await spotifyApi.getArtist(query.id);
        const { body: isFollowing } = await spotifyApi.isFollowingArtists([
          query.id,
        ]);

        setArtist(artist);
        setFollowingArtist(isFollowing[0]);
      })();
    }
  }, [session, spotifyApi, query]);

  const followHandler = () => {
    followingArtist
      ? spotifyApi.unfollowArtists([query.id])
      : spotifyApi.followArtists([query.id]);
    setFollowingArtist((prevState) => !prevState);
  };

  if (!artist) {
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
          onClick={() => catchErrors(followHandler())}
          className={`bg-transparent border text-white rounded px-4 py-1 cursor-pointer focus:outline-none hover:bg-custom-darkgray transition duration-300 ease-in-out ${
            followingArtist ? 'border-white' : 'border-gray-900'
          }`}
        >
          {followingArtist ? 'Following' : `Follow`}
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
