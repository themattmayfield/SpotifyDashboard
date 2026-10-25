import { Link } from '@tanstack/react-router';

import type { TTimeRange } from '@/types';

export function SectionHeader({
  title,
  to,
  range,
}: {
  title: string;
  to: '/artists' | '/tracks';
  range?: TTimeRange;
}) {
  return (
    <div className="mb-5 flex w-full items-center justify-between px-2">
      <h2 className="text-white lg:text-2xl">{title}</h2>
      <Link
        to={to}
        search={{ range: range ?? 'long_term' }}
        className="flex h-9 items-center whitespace-nowrap rounded-full border border-custom-gray px-4 text-xs text-white transition duration-150 ease-in-out hover:bg-custom-gray focus:outline-none"
      >
        See All
      </Link>
    </div>
  );
}
