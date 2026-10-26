import { getStreaks } from '@/lib/persistence';
import { useQuery } from '@tanstack/react-query';
import { IoFlame } from 'react-icons/io5';
import { useClientTimeZone } from './StoredHistory';

export function Streaks() {
  const timeZone = useClientTimeZone();
  const { data } = useQuery({
    queryKey: ['wrapper', 'streaks', timeZone],
    queryFn: () => getStreaks({ data: timeZone }),
  });
  if (!data?.length) return null;
  return (
    <section className="card p-5">
      <p className="flex items-center gap-1.5 text-[13px] font-medium text-label-secondary">
        <IoFlame className="h-4 w-4 text-[#ff9f0a]" />
        Streaks
      </p>
      <ol className="mt-3 divide-y divide-separator">
        {data.map((streak) => (
          <li
            key={streak.id}
            className="flex items-center justify-between gap-4 py-2.5"
          >
            <span className="min-w-0 truncate text-[15px] font-medium">
              {streak.name}
            </span>
            <span className="shrink-0 text-[13px] tabular-nums text-label-secondary">
              {streak.days} days
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
