import PageRangeHeader from '@/components/PageRangeHeader';
import { PageWrapper } from '@/components/PageWrapper';
import Track from '@/components/Track';
import { getRecentlyPlayed } from '@/lib/spotify';

export default async function Recent() {
  const recentlyPlayed = await getRecentlyPlayed({
    limit: '50',
  });

  return (
    <>
      <PageWrapper>
        <PageRangeHeader title="Recently Played" />
        <div className="flex flex-col gap-4 no-scrollbar text-white mb-[150px] px-2">
          {recentlyPlayed.map(({ track }, index) => (
            <Track key={index} track={track} />
          ))}
        </div>
      </PageWrapper>
    </>
  );
}
