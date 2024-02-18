import { Suspense } from 'react';

import TrackLoading from '@/components/Loading/TrackLoading';
import PageRangeHeader from '@/components/PageRangeHeader';
import { PageWrapper } from '@/components/PageWrapper';
import Track from '@/components/Track';

export default async function Recent() {
  return (
    <>
      <PageWrapper>
        <PageRangeHeader title="Recently Played" />
        <div className="flex flex-col gap-4 no-scrollbar text-white mb-[150px] px-2">
          <Suspense fallback={<TrackLoading count={12} />}>
            <Track withTrackDuration={true} type="recent" limit="50" />
          </Suspense>
        </div>
      </PageWrapper>
    </>
  );
}
