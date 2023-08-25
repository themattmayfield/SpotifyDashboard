import React from 'react';
import Track from '@/components/Track';
import StaggerChildren from '@/containers/StaggerChildren';

import handleServerSession from '@/lib/handleServerSession';

export default async function Recent() {
  const { spotifyApi } = await handleServerSession();
  const recentlyPlayed = await spotifyApi
    .getMyRecentlyPlayedTracks({
      limit: 50,
    })
    .then(({ body }) => body.items);

  return (
    <>
      <div className="max-w-6xl mx-auto px-2 md:px-6 pt-10 md:pt-24">
        <div className="bg-spotify-black w-full text-white pb-10 select-none flex flex-col md:flex-row items-center justify-between space-y-2">
          <p className="text-2xl font-semibold">Recently Played Tracks</p>
        </div>

        <StaggerChildren className="flex flex-col gap-4 no-scrollbar text-white mb-[100px]">
          {recentlyPlayed.map(({ track }, index) => (
            <Track key={index} track={track} />
          ))}
        </StaggerChildren>
      </div>
    </>
  );
}
