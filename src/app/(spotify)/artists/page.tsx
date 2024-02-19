import { Suspense } from 'react';

import Card from '@/components/Card';
import CardLoading from '@/components/Loading/CardLoading';
import PageRangeHeader from '@/components/PageRangeHeader';
import { PageWrapper } from '@/components/PageWrapper';
import { type TTimeRange } from '@/types';

export default async function Artists({
  searchParams,
}: {
  searchParams: { range: TTimeRange };
}) {
  const { range } = searchParams;
  const activeRange = (range || 'long_term') satisfies TTimeRange;

  return (
    <PageWrapper>
      <PageRangeHeader title="Artists" activeRange={activeRange} />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6 no-scrollbar mb-[150px]">
        <Suspense key={range} fallback={<CardLoading count={50} />}>
          <Card timeRange={activeRange} limit="50" />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
