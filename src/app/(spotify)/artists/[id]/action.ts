'use server';
import handleServerSession from '@/lib/handleServerSession';
import { revalidatePath } from 'next/cache';

export const followHandler = async (isFollowingArtist: boolean, id: string) => {
  console.log(id);

  const { spotifyApi } = await handleServerSession();
  isFollowingArtist
    ? await spotifyApi.unfollowArtists([id])
    : await spotifyApi.followArtists([id]);

  revalidatePath('/artists/[id]');
};
