import handleServerSession from '@/lib/handleServerSession';
import spotifyApi from '@/lib/spotify';
import Link from 'next/link';
import Card from '@/components/Card';
import StaggerChildren from '../playlists/StaggerChildren';

const classes = {
  active: 'border-b border-white',
  inactive: 'border-b border-transparent',
};

export default async function Artists({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { range } = searchParams;
  const activeRange = range || 'long_term';
  await handleServerSession();

  const { body: topArtists_LONG } = await spotifyApi.getMyTopArtists({
    limit: 50,
    time_range: 'long_term',
  });
  const { body: topArtists_MEDIUM } = await spotifyApi.getMyTopArtists({
    limit: 50,
    time_range: 'medium_term',
  });
  const { body: topArtists_SHORT } = await spotifyApi.getMyTopArtists({
    limit: 50,
    time_range: 'short_term',
  });

  const terms = [
    {
      range: 'long_term',
      text: 'All Time',
      data: topArtists_LONG,
    },
    {
      range: 'medium_term',
      text: 'Last 6 Months',
      data: topArtists_MEDIUM,
    },
    {
      range: 'short_term',
      text: 'Last 4 Weeks',
      data: topArtists_SHORT,
    },
  ];

  return (
    <>
      <div className="max-w-5xl mx-auto px-2 md:px-4 no-scrollbar pt-10 md:pt-24">
        <div className="bg-black w-full text-white pb-10 select-none flex flex-col md:flex-row items-center justify-between space-y-2">
          <div>
            <p className="text-2xl font-semibold">Top Artists</p>
          </div>

          <div className="flex items-center justify-center space-x-4">
            {terms.map(({ text, range }) => (
              <Link href={`/artists/?range=${range}`}>
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
        <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 gap-y-2 md:gap-6 no-scrollbar mb-[100px]">
          {terms
            .find(({ range }) => range === activeRange)
            ?.data.items.map((item, index: string) => (
              <Card key={index} info={item} />
            ))}
        </StaggerChildren>
      </div>
    </>
  );
}
