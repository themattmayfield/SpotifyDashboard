import type { TTimeRange } from '@/types';
import { useNavigate } from '@tanstack/react-router';
import { IoIosInfinite } from 'react-icons/io';
import { IoTimeOutline } from 'react-icons/io5';
import { MdOutlineBolt } from 'react-icons/md';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';

const data = [
  ['All Time', 'long_term'],
  ['Last 6 Months', 'medium_term'],
  ['Last 4 Weeks', 'short_term'],
] as const;
export default function TimePeriodSelect({
  activeRange,
}: { activeRange: TTimeRange }) {
  const navigate = useNavigate();
  return (
    <Select
      onValueChange={(range: TTimeRange) =>
        navigate({ to: '.', search: (previous) => ({ ...previous, range }) })
      }
      value={activeRange}
    >
      <SelectTrigger className="max-w-min border-none outline-none ring-0 focus:ring-0 pr-1">
        {activeRange === 'long_term' ? (
          <IoIosInfinite className="h-6 w-6 mr-2" />
        ) : activeRange === 'medium_term' ? (
          <IoTimeOutline className="h-6 w-6 mr-2" />
        ) : (
          <MdOutlineBolt className="h-6 w-6 mr-2" />
        )}
      </SelectTrigger>
      <SelectContent
        className="bg-custom-darkgray border-none"
        onClick={(e) => e.stopPropagation()}
      >
        {data.map(([label, value]) => (
          <SelectItem
            key={value}
            className="focus:bg-[#686868] text-white cursor-pointer"
            value={value}
          >
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
