import { getStreaks } from '@/lib/persistence';
import { useQuery } from '@tanstack/react-query';
import { useClientTimeZone } from './StoredHistory';

export function Streaks() {
  const timeZone = useClientTimeZone();
  const { data } = useQuery({
    queryKey: ['wrapper', 'streaks', timeZone],
    queryFn: () => getStreaks({ data: timeZone }),
  });
  if (!data?.length) return null;
  return (
    <section className="rounded-3xl bg-custom-darkgray2 p-5 text-white">
      <h2 className="mb-3 text-xl font-semibold">Streaks</h2>
      <ol className="space-y-2">
        {data.map((streak) => (
          <li key={streak.id}>
            🔥 {streak.days} days — {streak.name}
          </li>
        ))}
      </ol>
    </section>
  );
}
