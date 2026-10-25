import { EmptyState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { PageWrapper } from '@/components/PageWrapper';
import { SavePlaylistButton } from '@/components/SavePlaylistButton';
import { useClientTimeZone } from '@/components/StoredHistory';
import { localMonth } from '@/lib/insights';
import { getRecap } from '@/lib/persistence';
import { useQuery } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import { Suspense, lazy } from 'react';
const ShareCard = lazy(() => import('@/components/ShareCard'));

export const Route = createFileRoute('/_spotify/recap')({
  component: CurrentRecap,
});

function CurrentRecap() {
  const timeZone = useClientTimeZone();
  return <Recap month={localMonth(new Date(), timeZone)} timeZone={timeZone} />;
}

export function Recap({
  month,
  timeZone: suppliedTimeZone,
}: { month: string; timeZone?: string }) {
  const clientTimeZone = useClientTimeZone();
  const timeZone = suppliedTimeZone ?? clientTimeZone;
  const { data, isPending } = useQuery({
    queryKey: ['wrapper', 'recap', month, timeZone],
    queryFn: () => getRecap({ data: { month, timeZone } }),
  });
  const recap = data?.recap;
  const monthIndex = data?.months.indexOf(month) ?? -1;
  const previous = monthIndex > 0 ? data?.months[monthIndex - 1] : undefined;
  const next =
    monthIndex >= 0 && monthIndex < (data?.months.length ?? 0) - 1
      ? data?.months[monthIndex + 1]
      : undefined;
  return (
    <PageWrapper>
      <PageHeader title={`Recap — ${month}`} />
      <div className="space-y-8 px-4 text-white">
        {isPending ? (
          <p>Loading recap…</p>
        ) : !data?.enabled ? (
          <p>Recaps are unavailable because storage is not configured.</p>
        ) : !recap ? (
          <EmptyState />
        ) : (
          <>
            <Suspense>
              <ShareCard card={{ variant: 'recap', month, timeZone }} />
            </Suspense>
            <SavePlaylistButton
              name={`Wrapper · ${month} Recap`}
              trackIds={recap.playlistTrackIds}
            />
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Plays" value={recap.totalPlays} />
              <Stat label="Minutes" value={recap.minutes} />
              <Stat label="Artists" value={recap.distinctArtists} />
            </div>
            <List
              title="Top artists"
              rows={recap.topArtists.map((x) => ({
                name: x.name,
                count: x.count,
              }))}
            />
            <div className="grid gap-3 md:grid-cols-2">
              <Highlight
                label="Top new artist"
                value={
                  recap.topNewArtist
                    ? `${recap.topNewArtist.name} — ${recap.topNewArtist.count} plays`
                    : 'None yet'
                }
              />
              <Highlight
                label="Biggest climber"
                value={
                  recap.biggestClimber
                    ? `${recap.biggestClimber.name} — ▲${recap.biggestClimber.improvement}`
                    : 'Not enough snapshots'
                }
              />
            </div>
            <List
              title="Top tracks"
              rows={recap.topTracks.map((x) => ({
                name: x.item.name,
                count: x.count,
              }))}
            />
          </>
        )}
        <div className="flex justify-between">
          {previous ? (
            <Link
              to="/recap/$month"
              params={{ month: previous }}
              className="underline"
            >
              ← Previous
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to="/recap/$month"
              params={{ month: next }}
              className="underline"
            >
              Next →
            </Link>
          )}
        </div>
        <p className="text-sm text-custom-muted">
          Based on plays we've recorded since you started using Wrapper — visit
          regularly so we don't miss any.
        </p>
      </div>
    </PageWrapper>
  );
}
function Highlight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-custom-darkgray p-4">
      <span className="block text-sm text-custom-muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-custom-darkgray p-4">
      <strong className="block text-2xl">{value}</strong>
      {label}
    </div>
  );
}
function List({
  title,
  rows,
}: { title: string; rows: { name: string; count: number }[] }) {
  return (
    <section>
      <h2 className="mb-3 text-xl">{title}</h2>
      <ol className="space-y-2">
        {rows.map((x) => (
          <li key={x.name}>
            {x.name} <span className="text-custom-muted">— {x.count}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
