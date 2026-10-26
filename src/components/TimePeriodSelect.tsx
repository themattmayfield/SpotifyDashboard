import { useNavigate, useRouter } from '@tanstack/react-router';

import { cn } from '@/lib/cn';
import type { TTimeRange } from '@/types';

const options: { range: TTimeRange; label: string }[] = [
  { range: 'short_term', label: '4 Weeks' },
  { range: 'medium_term', label: '6 Months' },
  { range: 'long_term', label: 'All Time' },
];

export default function TimePeriodSelect({
  activeRange,
}: { activeRange: TTimeRange }) {
  const navigate = useNavigate();
  const router = useRouter();

  // Warm a range on hover/focus so switching is instant.
  const preload = (range: TTimeRange) => {
    if (range === activeRange) return;
    router
      .preloadRoute({
        to: '.',
        search: (previous: object) => ({ ...previous, range }),
      })
      .catch(() => undefined);
  };

  return (
    <fieldset className="m-0 inline-flex min-w-0 rounded-full border-0 bg-fill-strong p-[3px] ring-1 ring-inset ring-separator">
      <legend className="sr-only">Time period</legend>
      {options.map(({ range, label }) => {
        const active = range === activeRange;
        return (
          <button
            key={range}
            type="button"
            aria-pressed={active}
            onMouseEnter={() => preload(range)}
            onFocus={() => preload(range)}
            onClick={() =>
              navigate({
                to: '.',
                search: (previous) => ({ ...previous, range }),
              })
            }
            className={cn(
              'h-8 whitespace-nowrap rounded-full px-4 text-[13px] font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
              active
                ? 'bg-[#636366] text-white shadow-[0_1px_4px_rgba(0,0,0,0.4)]'
                : 'text-label-secondary hover:text-label'
            )}
          >
            {label}
          </button>
        );
      })}
    </fieldset>
  );
}
