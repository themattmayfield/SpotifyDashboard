import PageRangeHeader from '@/components/PageRangeHeader';
import { PageWrapper } from '@/components/PageWrapper';
import Track from '@/components/Track';

export default async function Recent() {
  return (
    <>
      <PageWrapper>
        <PageRangeHeader title="Recently Played" />
        <div className="flex flex-col gap-4 no-scrollbar text-white mb-[150px] px-2">
          <Track withTrackDuration={true} type="recent" limit="50" />
        </div>
      </PageWrapper>
    </>
  );
}
