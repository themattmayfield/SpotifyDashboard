import CardLoading from '@/components/Loading/CardLoading';
import PageRangeHeader from '@/components/PageRangeHeader';
import { PageWrapper } from '@/components/PageWrapper';
import React from 'react';

const loading = () => {
  return (
    <PageWrapper>
      <PageRangeHeader title="Artists" activeRange="long_term" />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6 no-scrollbar mb-[150px]">
        <CardLoading count={50} />
      </div>
    </PageWrapper>
  );
};

export default loading;
