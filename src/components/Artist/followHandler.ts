'use server';

import handleServerSession from '@/lib/handleServerSession';
import spotifyApi from '@/lib/spotify';

const followHandler = async ({
  isFollowingArtist,
  id,
}: {
  isFollowingArtist: boolean;
  id: string;
}) => {
  await handleServerSession();
  // console.log('I ran');

  isFollowingArtist
    ? await spotifyApi.unfollowArtists([id])
    : await spotifyApi.followArtists([id]);
};

export default followHandler;
