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
      <p className="mt-8 text-sm text-custom-muted">
        Compared with {compared}; nobody dropped off.
      </p>
    );
  return (
    <section className="mt-12 text-white">
      <h2 className="mb-4 text-xl font-semibold">
        Dropped off{' '}
        <span className="text-sm font-normal text-custom-muted">
          vs. {compared}
        </span>
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {dropped.map((item) => (
          <Link
            key={item.id}
            to={kind === 'artists' ? '/artists/$id' : '/tracks/$id'}
            params={{ id: item.id }}
            className="flex items-center gap-3 rounded-lg bg-custom-darkgray p-3"
          >
            {item.image && (
              <img src={item.image} alt="" className="h-12 w-12 object-cover" />
            )}
            <span>
              <strong className="block">{item.name}</strong>
              {item.subtitle && (
                <small className="text-custom-muted">{item.subtitle}</small>
              )}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
