import React from 'react';
import { Skeleton } from '../ui/skeleton';
import randomIntFromInterval from '@/lib/randomIntFromInterval';

const PlaylistLoading = ({
  analytic = false,
  count,
}: {
  analytic?: boolean;
  count: number;
}) => {
  const imageClassess = `${
    analytic
      ? 'md:w-48 md:h-48 lg:w-52 lg:h-52 xl:w-80 xl:h-80'
      : 'lg:h-[25vw] lg:w-[25vw] 2xl:h-64 2xl:w-64'
  } overflow-hidden h-[45vw] w-[45vw] flex items-center justify-center`;

  return [...Array(count)].map(() => (
    <div className="inline-block max-w-min mx-auto">
      <Skeleton className={imageClassess} />
      <div className={`text-center mt-4 space-y-1`}>
        <Skeleton className="h-5 w-16 sm:w-32 md:48 mx-auto" />
        {analytic && <Skeleton className="h-5" />}
      </div>
    </div>
  ));
};

export default PlaylistLoading;
