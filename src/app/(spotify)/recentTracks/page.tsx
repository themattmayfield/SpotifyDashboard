import Track from '@/components/Track';

import handleServerSession from '@/lib/handleServerSession';
import { PageWrapper } from '@/components/PageWrapper';
import PageRangeHeader from '@/components/PageRangeHeader';

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
        <PageRangeHeader title="Recently Played" />
        <div className="flex flex-col gap-4 no-scrollbar text-white mb-[100px] px-2">
          {recentlyPlayed.map(({ track }, index) => (
            <Track key={index} track={track} />
          ))}
        </div>
      </PageWrapper>
    </>
  );
}
