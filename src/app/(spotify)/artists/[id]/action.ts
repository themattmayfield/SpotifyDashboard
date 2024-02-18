'use server';
import { followArtist, unfollowArtists } from '@/lib/spotify';
import { revalidatePath } from 'next/cache';
export const followHandler = async (isFollowingArtist: boolean, id: string) => {
  isFollowingArtist ? await unfollowArtists([id]) : await followArtist([id]);

  // revalidatePath('/artists/[id]');
  revalidatePath(`/(spotify)/artists/[${id}]`, 'page');
};
