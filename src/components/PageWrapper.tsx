import type { ReactNode } from 'react';

export const PageWrapper = ({ children }: { children: ReactNode }) => (
  <div className="w-full overflow-x-hidden px-2 md:px-4 xl:mx-auto xl:max-w-[2000px]">
    {children}
  </div>
);
