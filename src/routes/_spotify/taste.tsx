import { PageHeader } from '@/components/PageHeader';
import { PageWrapper } from '@/components/PageWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDuration } from '@/lib/format';
import { pageTitle } from '@/lib/head';
import { tasteBreakdown } from '@/lib/insights';
import { spotifyQueries } from '@/lib/queries';
import { rangeSearch } from '@/lib/rangeSearch';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense, lazy } from 'react';

const ShareCard = lazy(() => import('@/components/ShareCard'));

export const Route = createFileRoute('/_spotify/taste')({
  ...rangeSearch,
  loader: ({ context, deps }) => {
    context.queryClient.prefetchQuery(spotifyQueries.topArtists(deps.range));
    context.queryClient.prefetchQuery(spotifyQueries.topTracks(deps.range));
  },
  head: () => pageTitle('Taste'),
  component: Taste,
});

function Taste() {
  const { range } = Route.useSearch();
  return (
    <PageWrapper>
      <PageHeader title="Your Taste" activeRange={range}>
        <Suspense>
          <ShareCard card={{ variant: 'taste', range }} />
        </Suspense>
      </PageHeader>
      <Suspense
        key={range}
        fallback={<Skeleton className="h-96 w-full rounded-2xl" />}
      >
        <Breakdown range={range} />
      </Suspense>
    </PageWrapper>
  );
}

function Breakdown({
  range,
}: { range: 'long_term' | 'medium_term' | 'short_term' }) {
  const { data: artists } = useSuspenseQuery(spotifyQueries.topArtists(range));
  const { data: tracks } = useSuspenseQuery(spotifyQueries.topTracks(range));
  const taste = tasteBreakdown(artists, tracks);
  const maxDecade = Math.max(...taste.decades.map((item) => item.count), 1);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {taste.genres.length > 0 && (
        <section className="card p-6">
          <h2 className="section-title mb-4">Genre mix</h2>
          <ol className="flex flex-wrap gap-2">
            {taste.genres.map((genre) => (
              <li
                className="rounded-full bg-fill-strong px-3.5 py-1.5 text-[13px] font-medium capitalize"
                key={genre.name}
              >
                {genre.name}
              </li>
            ))}
          </ol>
        </section>
      )}
      <section className="card p-6">
        <h2 className="section-title mb-4">Decades</h2>
        <div className="space-y-4">
          {taste.decades.map(({ decade, count }) => (
            <div key={decade}>
              <div className="mb-1.5 flex justify-between text-[13px]">
                <span className="font-medium">{decade}s</span>
                <span className="tabular-nums text-label-secondary">
                  {count}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: `${(count / maxDecade) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="card p-6 md:col-span-2">
        <h2 className="section-title mb-5">By the numbers</h2>
        <dl className="grid grid-cols-2 gap-6 md:grid-cols-5">
          <Stat
            label="Fresh vs. classic"
            value={`${taste.freshPercent}% fresh`}
          />
          <Stat
            label="Average release year"
            value={taste.averageYear?.toString() ?? 'Unknown'}
          />
          <Stat
            label="Artist loyalty"
            value={`${tracks.length} tracks from ${taste.uniqueArtists} artists`}
          />
          <Stat label="Explicit" value={`${taste.explicitPercent}%`} />
          <Stat
            label="Average length"
            value={formatDuration(taste.averageDurationMs)}
          />
        </dl>
      </section>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[13px] font-medium text-label-secondary">{label}</dt>
      <dd className="mt-1 text-[20px] font-semibold tracking-[-0.02em]">
        {value}
      </dd>
    </div>
  );
}
