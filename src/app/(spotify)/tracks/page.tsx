import PageRangeHeader from '@/components/PageRangeHeader';
import { PageWrapper } from '@/components/PageWrapper';
import Track from '@/components/Track';
import { spotifyApi } from '@/lib/spotify';
import type { TTimeRange } from '@/types';

export default async function Tracks({
  searchParams,
}: {
  searchParams: { range: TTimeRange };
}) {
  const { range } = searchParams;
  const activeRange = range || 'long_term';
  const { getTopTracks } = spotifyApi();

  const [long, medium, short] = await Promise.all([
    getTopTracks({
      limit: '50',
      timeRange: 'long_term',
    }),
    getTopTracks({
      limit: '50',
      timeRange: 'medium_term',
    }),
    getTopTracks({
      limit: '50',
      timeRange: 'short_term',
    }),
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

      <div className="flex flex-col gap-4 no-scrollbar text-white mb-[150px] px-2">
        {terms
          .find(({ range }) => range === activeRange)
          ?.data.map((track) => <Track key={track.id} track={track} />)}
      </div>
    </PageWrapper>
  );
}
