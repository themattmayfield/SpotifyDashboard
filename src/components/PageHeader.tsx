import type { ReactNode } from 'react';

import type { TTimeRange } from '@/types';

import TimePeriodSelect from './TimePeriodSelect';

export function PageHeader({
  activeRange,
  title,
  eyebrow,
  children,
}: {
  activeRange?: TTimeRange;
  title: ReactNode;
  eyebrow?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-4 pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1 text-[13px] font-medium text-label-secondary">
            {eyebrow}
          </p>
        )}
        <h1 className="large-title">{title}</h1>
      </div>
      {(activeRange || children) && (
        <div className="flex flex-wrap items-center gap-2">
          {children}
          {activeRange && <TimePeriodSelect activeRange={activeRange} />}
        </div>
      )}
    </div>
  );
}
