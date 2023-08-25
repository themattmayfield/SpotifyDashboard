import { cn } from '@/lib/cn';
import Link from 'next/link';
import React from 'react';

const TimePeriodLink = ({
  activeRange,
  range,
  text,
}: {
  activeRange: string;
  range: string;
  text: string;
}) => {
  return (
    <Link
      className={cn(
        'border-b hover:text-spotify-green transition duration-300 ease-in-out',
        activeRange === range
          ? 'border-spotify-green text-spotify-green'
          : 'border-transparent'
      )}
      href={`/artists/?range=${range}`}
    >
      {text}
    </Link>
  );
};

export default TimePeriodLink;
