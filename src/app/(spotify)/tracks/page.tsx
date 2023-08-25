import StaggerChildren from '@/containers/StaggerChildren';
import Link from 'next/link';
import Track from '@/components/Track';
import { Suspense } from 'react';
import LoadingComponent from '@/components/Loading';

import { cn } from '@/lib/cn';
import handleServerSession from '@/lib/handleServerSession';
import TimePeriodLink from '@/components/TimePeriodLink';

export default async function Tracks({
  searchParams,
}: {
  searchParams: { range: string };
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
      text: 'All Time',
      data: long ?? [],
    },
    {
      range: 'medium_term',
      text: 'Last 6 Months',
      data: medium ?? [],
    },
    {
      range: 'short_term',
      text: 'Last 4 Weeks',
      data: short ?? [],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-2 md:px-6  pt-10 md:pt-24">
      <div className="bg-spotify-black w-full text-white pb-10 select-none flex flex-col md:flex-row items-center justify-between space-y-2">
        <div>
          <p className="text-2xl font-semibold">Tracks</p>
        </div>
        <div className="flex items-center justify-center space-x-4">
          {terms.map(({ text, range }) => (
            <TimePeriodLink
              activeRange={activeRange}
              range={range}
              text={text}
            />
          ))}
        </div>
      </div>
      <Suspense fallback={<LoadingComponent />}>
        <StaggerChildren className="flex flex-col gap-4 no-scrollbar text-white mb-[100px]">
          {terms
            .find(({ range }) => range === activeRange)
            ?.data.map((track, index) => (
              <Track key={index} track={track} />
            ))}
        </StaggerChildren>
      </Suspense>
    </div>
  );
}
