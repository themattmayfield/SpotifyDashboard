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
      <PageHeader title="Your taste" activeRange={range} />
      <div className="mb-4 px-2">
        <Suspense>
          <ShareCard card={{ variant: 'taste', range }} />
        </Suspense>
      </div>
      <Suspense key={range} fallback={<Skeleton className="h-96 w-full" />}>
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
    <div className="grid gap-6 px-2 text-white md:grid-cols-2">
      {taste.genres.length > 0 && (
        <section className="rounded-2xl bg-custom-darkgray p-6">
          <h2 className="mb-4 text-xl">Genre mix</h2>
          <ol className="flex flex-wrap gap-2">
            {taste.genres.map((genre) => (
              <li
                className="rounded-full bg-custom-gray px-3 py-1 capitalize"
                key={genre.name}
              >
                {genre.name}
              </li>
            ))}
          </ol>
        </section>
      )}
      <section className="rounded-2xl bg-custom-darkgray p-6">
        <h2 className="mb-4 text-xl">Decades</h2>
        <div className="space-y-3">
          {taste.decades.map(({ decade, count }) => (
            <div key={decade}>
              <div className="flex justify-between text-sm">
                <span>{decade}s</span>
                <span>{count}</span>
              </div>
              <div className="h-2 bg-custom-gray">
                <div
                  className="h-full bg-spotify-green"
                  style={{ width: `${(count / maxDecade) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-2xl bg-custom-darkgray p-6 md:col-span-2">
        <h2 className="mb-4 text-xl">By the numbers</h2>
        <dl className="grid grid-cols-2 gap-5 md:grid-cols-5">
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
      <dt className="text-sm text-custom-muted">{label}</dt>
      <dd className="mt-1 text-lg">{value}</dd>
    </div>
  );
}
