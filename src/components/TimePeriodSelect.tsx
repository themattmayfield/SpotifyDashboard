'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import type { TTimeRange } from '@/types';
import { useRouter } from 'next/navigation';
import { IoIosInfinite } from 'react-icons/io';
import { IoTimeOutline } from 'react-icons/io5';
import { MdOutlineBolt } from 'react-icons/md';

const data = [
  {
    label: 'All Time',
    value: 'long_term',
  },
  {
    label: 'Last 6 Months',
    value: 'medium_term',
  },
  {
    label: 'Last 4 Weeks',
    value: 'short_term',
  },
];
const TimePeriodSelect = ({ activeRange }: { activeRange: TTimeRange }) => {
  const { push } = useRouter();
  return (
    <Select
      onValueChange={(range: TTimeRange) => {
        push(`?range=${range}`);
      }}
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

        {/* <SelectValue /> */}
      </SelectTrigger>
      <SelectContent
        className="bg-custom-darkgray border-none"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {data.map(({ label, value }, idx) => (
          <SelectItem
            key={idx}
            className="focus:bg-[#686868] text-white cursor-pointer"
            value={value}
          >
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimePeriodSelect;
