import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export const PageWrapper = ({
  children,
  className,
}: { children: ReactNode; className?: string }) => (
  <div
    className={cn(
      'mx-auto w-full max-w-[1600px] px-4 pt-2 md:px-8 md:pt-4',
      className
    )}
  >
    {children}
  </div>
);
