import Card from '@/components/Card';
import handleServerSession from '@/lib/handleServerSession';

import { TTimeRange } from '@/types';
import PageRangeHeader from '@/components/PageRangeHeader';
import { PageWrapper } from '@/components/PageWrapper';

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
    <PageWrapper>
      <PageRangeHeader title="Artists" activeRange={activeRange} />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6 no-scrollbar mb-[100px]">
        {terms
          .find(({ range }) => range === activeRange)
          ?.data.map((item, index: number) => (
            <Card key={index} info={item} />
          ))}
      </div>
    </PageWrapper>
  );
}
