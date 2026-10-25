import type { TTimeRange } from '@/types';

import TimePeriodSelect from './TimePeriodSelect';

export function PageHeader({
  activeRange,
  title,
}: {
  activeRange?: TTimeRange;
  title: string;
}) {
  return (
    <div className="flex h-[60px] w-full items-center justify-between pb-6 pl-2 text-white">
      <h1 className="text-xl font-semibold sm:text-2xl">{title}</h1>
      {activeRange && <TimePeriodSelect activeRange={activeRange} />}
    </div>
  );
}
