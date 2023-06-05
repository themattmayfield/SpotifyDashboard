import React from 'react';
import Track from '@/components/Track';
import dynamic from 'next/dynamic';
import StaggerChildren from '../playlists/StaggerChildren';
import spotifyApi from '@/lib/spotify';
import handleServerSession from '@/lib/handleServerSession';
const Loading = dynamic(() => import('@/components/Loading'), { ssr: false });

export default async function Recent() {
  await handleServerSession();
  const { body } = await spotifyApi.getMyRecentlyPlayedTracks({
    limit: 50,
  });
  const recentlyPlayed = body.items;

  return (
    <>
      <div className="max-w-6xl mx-auto px-2 md:px-6 pt-10 md:pt-24">
        <div className="bg-black w-full text-white pb-10 select-none flex flex-col md:flex-row items-center justify-between space-y-2">
          <p className="text-2xl font-semibold">Recently Played Tracks</p>
        </div>

        <StaggerChildren className="flex flex-col gap-4 no-scrollbar text-white mb-[100px]">
          {recentlyPlayed.map((track, index) => (
            <Track key={index} track={track} />
          ))}
        </StaggerChildren>
      </div>
    </>
  );
}
