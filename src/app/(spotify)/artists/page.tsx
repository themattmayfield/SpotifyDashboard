import Link from 'next/link';
import Card from '@/components/Card';
import StaggerChildren from '@/containers/StaggerChildren';
import { cn } from '@/lib/cn';
import handleServerSession from '@/lib/handleServerSession';

export default async function Artists({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { spotifyApi } = await handleServerSession();
  const { range } = searchParams;
  const activeRange = range || 'long_term';

  const [topArtistsLong, topArtistsMedium, topArtistsShort] = await Promise.all(
    [
      spotifyApi
        .getMyTopArtists({
          limit: 50,
          time_range: 'long_term',
        })
        .then(({ body }) => body.items),
      spotifyApi
        .getMyTopArtists({
          limit: 50,
          time_range: 'medium_term',
        })
        .then(({ body }) => body.items),
      spotifyApi
        .getMyTopArtists({
          limit: 50,
          time_range: 'short_term',
        })
        .then(({ body }) => body.items),
    ]
  );

  const terms = [
    {
      range: 'long_term',
      text: 'All Time',
      data: topArtistsLong,
    },
    {
      range: 'medium_term',
      text: 'Last 6 Months',
      data: topArtistsMedium,
    },
    {
      range: 'short_term',
      text: 'Last 4 Weeks',
      data: topArtistsShort,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-2 md:px-4 no-scrollbar pt-10 md:pt-24">
      <div className="bg-black w-full text-white pb-10 select-none flex flex-col md:flex-row items-center justify-between space-y-2">
        <div>
          <p className="text-2xl font-semibold">Top Artists</p>
        </div>

        <div className="flex items-center justify-center space-x-4">
          {terms.map(({ text, range }) => (
            <Link
              className={cn(
                'border-b hover:text-spotify-green transition duration-300 ease-in-out',
                activeRange === range
                  ? 'border-white hover:border-spotify-green'
                  : 'border-transparent'
              )}
              href={`/artists/?range=${range}`}
            >
              {text}
            </Link>
          ))}
        </div>
      </div>
      <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 gap-y-2 md:gap-6 no-scrollbar mb-[100px]">
        {terms
          .find(({ range }) => range === activeRange)
          ?.data.map((item, index: number) => (
            <Card key={index} info={item} />
          ))}
      </StaggerChildren>
    </div>
  );
}
