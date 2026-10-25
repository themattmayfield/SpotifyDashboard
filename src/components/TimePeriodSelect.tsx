import { useNavigate, useRouter } from '@tanstack/react-router';
import { IoIosInfinite } from 'react-icons/io';
import { IoTimeOutline } from 'react-icons/io5';
import { MdOutlineBolt } from 'react-icons/md';

import { type TTimeRange, timeRanges } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';

const options = {
  long_term: { label: 'All Time', Icon: IoIosInfinite },
  medium_term: { label: 'Last 6 Months', Icon: IoTimeOutline },
  short_term: { label: 'Last 4 Weeks', Icon: MdOutlineBolt },
} satisfies Record<TTimeRange, { label: string; Icon: unknown }>;

export default function TimePeriodSelect({
  activeRange,
}: { activeRange: TTimeRange }) {
  const navigate = useNavigate();
  const router = useRouter();
  const { label, Icon } = options[activeRange];

  // Warm the other ranges as soon as the menu opens so switching is instant.
  const preloadRanges = (open: boolean) => {
    if (!open) return;
    for (const range of timeRanges) {
      if (range !== activeRange)
        router
          .preloadRoute({
            to: '.',
            search: (previous: object) => ({ ...previous, range }),
          })
          .catch(() => undefined);
    }
  };

  return (
    <Select
      value={activeRange}
      onOpenChange={preloadRanges}
      onValueChange={(range: TTimeRange) =>
        navigate({ to: '.', search: (previous) => ({ ...previous, range }) })
      }
    >
      <SelectTrigger
        aria-label="Time period"
        className="max-w-min gap-2 border-none pr-1 outline-none ring-0 focus:ring-0"
      >
        <Icon className="h-6 w-6" />
        <span className="hidden whitespace-nowrap sm:inline">{label}</span>
      </SelectTrigger>
      <SelectContent
        className="border-none bg-custom-darkgray"
        onClick={(e) => e.stopPropagation()}
      >
        {timeRanges.map((range) => (
          <SelectItem
            key={range}
            className="cursor-pointer text-white focus:bg-custom-lightgray"
            value={range}
          >
            {options[range].label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
