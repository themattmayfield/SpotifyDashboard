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
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
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
  const monthLabel = formatMonth(month);
  return (
    <PageWrapper>
      <PageHeader eyebrow="Monthly recap" title={monthLabel}>
        {recap && (
          <Suspense>
            <ShareCard card={{ variant: 'recap', month, timeZone }} />
          </Suspense>
        )}
        <div className="flex items-center">
          {previous ? (
            <Link
              to="/recap/$month"
              params={{ month: previous }}
              aria-label="Previous month"
              className="btn-icon bg-fill-strong"
            >
              <IoChevronBack className="h-4 w-4" />
            </Link>
          ) : (
            <span className="btn-icon pointer-events-none bg-fill opacity-30">
              <IoChevronBack className="h-4 w-4" />
            </span>
          )}
          <span className="w-2" />
          {next ? (
            <Link
              to="/recap/$month"
              params={{ month: next }}
              aria-label="Next month"
              className="btn-icon bg-fill-strong"
            >
              <IoChevronForward className="h-4 w-4" />
            </Link>
          ) : (
            <span className="btn-icon pointer-events-none bg-fill opacity-30">
              <IoChevronForward className="h-4 w-4" />
            </span>
          )}
        </div>
      </PageHeader>
      <div className="space-y-10">
        {isPending ? (
          <p className="text-[14px] text-label-tertiary">Loading recap…</p>
        ) : !data?.enabled ? (
          <p className="text-[14px] text-label-secondary">
            Recaps are unavailable because storage is not configured.
          </p>
        ) : !recap ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Plays" value={recap.totalPlays} />
              <Stat label="Minutes" value={recap.minutes} />
              <Stat label="Artists" value={recap.distinctArtists} />
            </div>
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
            <div className="grid gap-x-6 gap-y-10 lg:grid-cols-2">
              <List
                title="Top artists"
                rows={recap.topArtists.map((x) => ({
                  name: x.name,
                  count: x.count,
                }))}
              />
              <List
                title="Top tracks"
                rows={recap.topTracks.map((x) => ({
                  name: x.item.name,
                  count: x.count,
                }))}
              />
            </div>
            <SavePlaylistButton
              name={`AuxCheck · ${month} Recap`}
              trackIds={recap.playlistTrackIds}
            />
          </>
        )}
        <p className="text-[13px] text-label-tertiary">
          Based on plays we've recorded since you started using AuxCheck — visit
          regularly so we don't miss any.
        </p>
      </div>
    </PageWrapper>
  );
}

function formatMonth(month: string) {
  const date = new Date(`${month}-01T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return month;
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
function Highlight({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <span className="block text-[13px] font-medium text-label-secondary">
        {label}
      </span>
      <strong className="mt-1 block text-[17px] font-semibold">{value}</strong>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-5">
      <strong className="block text-[28px] font-semibold tabular-nums tracking-[-0.03em] md:text-[40px]">
        {value.toLocaleString('en-US')}
      </strong>
      <span className="text-[13px] font-medium text-label-secondary">
        {label}
      </span>
    </div>
  );
}
function List({
  title,
  rows,
}: { title: string; rows: { name: string; count: number }[] }) {
  return (
    <section>
      <h2 className="section-title mb-3">{title}</h2>
      <ol className="card divide-y divide-separator overflow-hidden">
        {rows.map((x, index) => (
          <li
            key={x.name}
            className="flex items-center gap-4 px-5 py-3.5 text-[15px]"
          >
            <span className="w-5 text-right font-medium tabular-nums text-label-tertiary">
              {index + 1}
            </span>
            <span className="min-w-0 flex-1 truncate font-medium">
              {x.name}
            </span>
            <span className="shrink-0 text-[13px] tabular-nums text-label-secondary">
              {x.count} plays
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
