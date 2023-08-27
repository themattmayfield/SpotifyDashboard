'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { ImInfinite } from 'react-icons/im';
import { IoIosInfinite } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { IoTimeOutline } from 'react-icons/io5';
import { MdOutlineBolt } from 'react-icons/md';
import { TTimeRange } from '@/types';

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
      onValueChange={(range) => {
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
        onClick={(e) => e.stopPropagation()}
      >
        {data.map(({ label, value }) => (
          <SelectItem
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
