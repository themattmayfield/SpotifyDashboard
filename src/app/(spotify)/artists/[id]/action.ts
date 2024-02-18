'use server';
import { spotifyApi } from '@/lib/spotify';
import { revalidatePath } from 'next/cache';
export const followHandler = async (isFollowingArtist: boolean, id: string) => {
  const { followArtist, unfollowArtists } = spotifyApi();
  isFollowingArtist ? await unfollowArtists([id]) : await followArtist([id]);

  // revalidatePath('/artists/[id]');
  revalidatePath(`/(spotify)/artists/[${id}]`, 'page');
};
