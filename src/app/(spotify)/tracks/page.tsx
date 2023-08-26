// import StaggerChildren from '@/containers/StaggerChildren';
import Track from '@/components/Track';
import { Suspense } from 'react';
import LoadingComponent from '@/components/Loading';

import handleServerSession from '@/lib/handleServerSession';
import TimePeriodSelect from '@/components/TimePeriodSelect';
import { TTimeRange } from '@/types';

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
    <div className="max-w-6xl mx-auto px-2 md:px-6">
      <div className="bg-spotify-black w-full text-white pb-6 select-none flex flex-col md:flex-row items-center justify-between space-y-2">
        <div className="w-full flex items-center justify-between">
          <div>
            <p className="text-xl sm:text-2xl font-semibold">Tracks</p>
          </div>
          <TimePeriodSelect activeRange={activeRange} />
        </div>
      </div>
      <Suspense fallback={<LoadingComponent />}>
        <div className="flex flex-col gap-4 no-scrollbar text-white mb-[100px]">
          {terms
            .find(({ range }) => range === activeRange)
            ?.data.map((track, index) => (
              <Track key={index} track={track} />
            ))}
        </div>
      </Suspense>
    </div>
  );
}
