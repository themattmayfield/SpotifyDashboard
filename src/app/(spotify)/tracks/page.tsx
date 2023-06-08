import handleServerSession from '@/lib/handleServerSession';
import spotifyApi from '@/lib/spotify';
import StaggerChildren from '@/containers/StaggerChildren';
import Link from 'next/link';
import Track from '@/components/Track';

const classes = {
  active: 'border-b border-white',
  inactive: 'border-b border-transparent',
};

export default async function Tracks({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { range } = searchParams;
  const activeRange = range || 'long_term';
  await handleServerSession();

  const { body: topTracks_LONG } = await spotifyApi.getMyTopTracks({
    limit: 50,
    time_range: 'long_term',
  });
  const { body: topTracks_MEDIUM } = await spotifyApi.getMyTopTracks({
    limit: 50,
    time_range: 'medium_term',
  });
  const { body: topTracks_SHORT } = await spotifyApi.getMyTopTracks({
    limit: 50,
    time_range: 'short_term',
  });

  const terms = [
    {
      range: 'long_term',
      text: 'All Time',
      data: topTracks_LONG,
    },
    {
      range: 'medium_term',
      text: 'Last 6 Months',
      data: topTracks_MEDIUM,
    },
    {
      range: 'short_term',
      text: 'Last 4 Weeks',
      data: topTracks_SHORT,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-2 md:px-6  pt-10 md:pt-24">
      <div className="bg-black w-full text-white pb-10 select-none flex flex-col md:flex-row items-center justify-between space-y-2">
        <div>
          <p className="text-2xl font-semibold">Top Tracks</p>
        </div>
        <div className="flex items-center justify-center space-x-4">
          {terms.map(({ text, range }) => (
            <Link href={`/tracks/?range=${range}`}>
              <p
                className={
                  'cursor-pointer ' +
                  (activeRange == range ? classes.active : classes.inactive)
                }
              >
                {text}
              </p>
            </Link>
          ))}
        </div>
      </div>
      <StaggerChildren className="flex flex-col gap-4 no-scrollbar text-white mb-[100px]">
        {terms
          .find(({ range }) => range === activeRange)
          ?.data.items.map((track, index) => (
            <Track key={index} track={track} />
          ))}
      </StaggerChildren>
    </div>
  );
}
