import Card from '@/components/Card';
// import StaggerChildren from '@/containers/StaggerChildren';
import handleServerSession from '@/lib/handleServerSession';
import { Suspense } from 'react';
import Loading from '@/app/loading';
import TimePeriodSelect from '@/components/TimePeriodSelect';
import { TTimeRange } from '@/types';

export default async function Artists({
  searchParams,
}: {
  searchParams: { range: TTimeRange };
}) {
  const { spotifyApi } = await handleServerSession();
  const { range } = searchParams;
  const activeRange = (range || 'long_term') satisfies TTimeRange;

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
      data: topArtistsLong ?? [],
    },
    {
      range: 'medium_term',
      data: topArtistsMedium ?? [],
    },
    {
      range: 'short_term',
      data: topArtistsShort ?? [],
    },
  ] satisfies {
    range: TTimeRange;
    data:
      | SpotifyApi.ArtistObjectFull[]
      | SpotifyApi.ArtistObjectFull[]
      | SpotifyApi.ArtistObjectFull[];
  }[];

  return (
    <div className="max-w-5xl mx-auto px-2 md:px-4 no-scrollbar">
      <div className="bg-spotify-black w-full text-white pb-6 select-none flex flex-col md:flex-row items-center justify-between space-y-2">
        <div className="w-full flex items-center justify-between">
          <div>
            <p className="text-xl sm:text-2xl font-semibold">Artists</p>
          </div>
          <TimePeriodSelect activeRange={activeRange} />
        </div>
      </div>
      <Suspense fallback={<Loading />}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 md:gap-6 no-scrollbar mb-[100px]">
          {terms
            .find(({ range }) => range === activeRange)
            ?.data.map((item, index: number) => (
              <Card key={index} info={item} />
            ))}
        </div>
      </Suspense>
    </div>
  );
}
