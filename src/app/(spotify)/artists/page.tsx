import Card from '@/components/Card';
import PageRangeHeader from '@/components/PageRangeHeader';
import { PageWrapper } from '@/components/PageWrapper';
import { spotifyApi } from '@/lib/spotify';
import { type TTimeRange } from '@/types';

export default async function Artists({
  searchParams,
}: {
  searchParams: { range: TTimeRange };
}) {
  const { range } = searchParams;
  const activeRange = (range || 'long_term') satisfies TTimeRange;
  const { getTopArtists } = spotifyApi();

  const [topArtistsLong, topArtistsMedium, topArtistsShort] = await Promise.all(
    [
      getTopArtists({
        limit: '50',
        timeRange: 'long_term',
      }),
      getTopArtists({
        limit: '50',
        timeRange: 'medium_term',
      }),
      getTopArtists({
        limit: '50',
        timeRange: 'short_term',
      }),
    ],
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

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6 no-scrollbar mb-[150px]">
        {terms
          .find(({ range }) => range === activeRange)
          ?.data.map((item, index: number) => <Card key={index} info={item} />)}
      </div>
    </PageWrapper>
  );
}
