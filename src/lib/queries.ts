import { queryOptions } from '@tanstack/react-query';
import { spotifyData } from './spotify';
import type { TTimeRange } from '@/types';
export const spotifyQuery = (
  kind: string,
  args: { id?: string; limit?: string; timeRange?: TTimeRange } = {},
  staleTime = 300_000
) =>
  queryOptions({
    queryKey: ['spotify', kind, args],
    queryFn: () => spotifyData({ data: { kind, ...args } }),
    staleTime,
  });
