import TrackLoading from '@/components/Loading/TrackLoading';
import PageRangeHeader from '@/components/PageRangeHeader';
import { PageWrapper } from '@/components/PageWrapper';
import React from 'react';

const loading = () => {
  return (
    <PageWrapper>
      <PageRangeHeader title="Tracks" activeRange="long_term" />
      <div className="flex flex-col gap-4 no-scrollbar text-white mb-[150px] px-2">
        <TrackLoading count={12} />
      </div>
    </PageWrapper>
  );
};

export default loading;
