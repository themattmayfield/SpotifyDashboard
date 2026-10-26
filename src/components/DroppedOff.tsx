import { getMovement } from '@/lib/persistence';
import type { TTimeRange } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

export function DroppedOff({
  kind,
  range,
}: { kind: 'artists' | 'tracks'; range: TTimeRange }) {
  const { data } = useQuery({
    queryKey: ['wrapper', 'movement', kind, range],
    queryFn: () => getMovement({ data: { kind, range } }),
  });
  if (!data) return null;
  const current = new Set(data.currentItems.map((item) => item.id));
  const dropped = data.previousItems.filter((item) => !current.has(item.id));
  const compared = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${data.comparedTo}T12:00:00Z`));
  if (!dropped.length)
    return (
      <p className="mt-10 text-[13px] text-label-tertiary">
        Compared with {compared}; nobody dropped off.
      </p>
    );
  return (
    <section className="mt-14">
      <h2 className="section-title mb-4">
        Dropped off{' '}
        <span className="text-[13px] font-normal tracking-normal text-label-tertiary">
          vs. {compared}
        </span>
      </h2>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {dropped.map((item) => (
          <Link
            key={item.id}
            to={kind === 'artists' ? '/artists/$id' : '/tracks/$id'}
            params={{ id: item.id }}
            className="card flex items-center gap-3 p-2 pr-4 transition hover:bg-fill-strong"
          >
            {item.image && (
              <img
                src={item.image}
                alt=""
                className="h-12 w-12 shrink-0 rounded-lg object-cover"
              />
            )}
            <span className="min-w-0">
              <strong className="block truncate text-[14px] font-medium">
                {item.name}
              </strong>
              {item.subtitle && (
                <small className="block truncate text-[13px] text-label-secondary">
                  {item.subtitle}
                </small>
              )}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
