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
      <SelectContent onClick={(e) => e.stopPropagation()}>
        <SelectItem value="long_term">All Time</SelectItem>
        <SelectItem value="medium_term">Last 6 Months</SelectItem>
        <SelectItem value="short_term">Last 4 weeks</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TimePeriodSelect;
