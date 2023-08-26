import React from 'react';
import TimePeriodSelect from './TimePeriodSelect';
import { TTimeRange } from '@/types';

const PageRangeHeader = ({
  activeRange,
  title,
}: {
  activeRange: TTimeRange;
  title: string;
}) => {
  return (
    <div className="w-full flex items-center justify-between pb-6 text-white pl-2">
      <p className="text-xl sm:text-2xl font-semibold">{title}</p>
      <TimePeriodSelect activeRange={activeRange} />
    </div>
  );
};

export default PageRangeHeader;
