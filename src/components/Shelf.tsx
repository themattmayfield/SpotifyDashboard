import { type ReactNode, useRef } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

import { SectionHeader } from './SectionHeader';

/** A titled, horizontally scrolling row of cards. */
export function Shelf({
  title,
  actions,
  children,
}: {
  title: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const row = useRef<HTMLDivElement>(null);
  const scroll = (direction: 1 | -1) =>
    row.current?.scrollBy({
      left: direction * row.current.clientWidth * 0.8,
      behavior: 'smooth',
    });
  return (
    <section>
      <SectionHeader title={title}>
        {actions}
        <div className="ml-1 hidden items-center md:flex">
          <button
            type="button"
            aria-label="Scroll left"
            className="btn-icon h-8 w-8"
            onClick={() => scroll(-1)}
          >
            <IoChevronBack className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            className="btn-icon h-8 w-8"
            onClick={() => scroll(1)}
          >
            <IoChevronForward className="h-4 w-4" />
          </button>
        </div>
      </SectionHeader>
      <div
        ref={row}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 md:-mx-8 md:scroll-px-8 md:px-8"
      >
        {children}
      </div>
    </section>
  );
}
