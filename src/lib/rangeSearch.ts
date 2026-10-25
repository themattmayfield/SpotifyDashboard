import { stripSearchParams } from '@tanstack/react-router';

import { type TTimeRange, timeRanges } from '@/types';

type RangeSearch = { range: TTimeRange };
const defaultSearch: RangeSearch = { range: 'long_term' };

/** Route options for pages filtered by a `?range=` time period. */
export const rangeSearch = {
  validateSearch: (search: Record<string, unknown>): RangeSearch => ({
    range: timeRanges.includes(search.range as TTimeRange)
      ? (search.range as TTimeRange)
      : defaultSearch.range,
  }),
  search: { middlewares: [stripSearchParams<RangeSearch>(defaultSearch)] },
  loaderDeps: ({ search }: { search: RangeSearch }) => ({
    range: search.range,
  }),
};
