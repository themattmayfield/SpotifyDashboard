import Track from '@/components/Track';
import handleServerSession from '@/lib/handleServerSession';
import { TTimeRange } from '@/types';
import PageRangeHeader from '@/components/PageRangeHeader';
import { PageWrapper } from '@/components/PageWrapper';
import TrackLoading from '@/components/Loading/TrackLoading';
import { Suspense } from 'react';

export default async function Tracks({
  searchParams,
}: {
  searchParams: { range: TTimeRange };
}) {
  const { range } = searchParams;
  const activeRange = range || 'long_term';
  const { spotifyApi } = await handleServerSession();

  const [long, medium, short] = await Promise.all([
    spotifyApi
      .getMyTopTracks({
        limit: 50,
        time_range: 'long_term',
      })
      .then(({ body }) => body.items),
    spotifyApi
      .getMyTopTracks({
        limit: 50,
        time_range: 'medium_term',
      })
      .then(({ body }) => body.items),
    spotifyApi
      .getMyTopTracks({
        limit: 50,
        time_range: 'short_term',
      })
      .then(({ body }) => body.items),
  ]);

  const terms = [
    {
      range: 'long_term',
      data: long ?? [],
    },
    {
      range: 'medium_term',
      data: medium ?? [],
    },
    {
      range: 'short_term',
      data: short ?? [],
    },
  ];

  return (
    <PageWrapper>
      <PageRangeHeader activeRange={activeRange} title="Tracks" />

      <div className="flex flex-col gap-4 no-scrollbar text-white mb-[100px] px-2">
        {terms
          .find(({ range }) => range === activeRange)
          ?.data.map((track, index) => (
            <Track key={index} track={track} />
          ))}
      </div>
    </PageWrapper>
  );
}
