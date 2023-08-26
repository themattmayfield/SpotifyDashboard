import React from 'react';
import Track from '@/components/Track';

import handleServerSession from '@/lib/handleServerSession';
import { PageWrapper } from '@/components/PageWrapper';

export default async function Recent() {
  const { spotifyApi } = await handleServerSession();
  const recentlyPlayed = await spotifyApi
    .getMyRecentlyPlayedTracks({
      limit: 50,
    })
    .then(({ body }) => body.items);

  return (
    <>
      <PageWrapper>
        <div className="bg-spotify-black w-full text-white pb-10 select-none flex flex-col md:flex-row items-center justify-between space-y-2">
          <p className="text-xl sm:text-2xl font-semibold">Recently Played</p>
        </div>

        <div className="flex flex-col gap-4 no-scrollbar text-white mb-[100px] px-2">
          {recentlyPlayed.map(({ track }, index) => (
            <Track key={index} track={track} />
          ))}
        </div>
      </PageWrapper>
    </>
  );
}
