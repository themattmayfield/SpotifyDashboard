import React from 'react';

import { cn } from '@/lib/cn';

import { Skeleton } from '../ui/skeleton';

const CardLoading = ({
  count,
  className,
}: {
  count: number;
  className?: string;
}) => {
  return [...Array(count)].map((idx) => {
    return (
      <div key={idx}>
        <Skeleton
          className={cn(
            'cursor-pointer rounded-3xl h-[60vw]  md:h-[40vw]  lg:h-[40vw]  xl:h-96  overflow-hidden bg-custom-darkgray bg-cover bg-center flex items-center justify-center',
            className,
          )}
        ></Skeleton>
      </div>
    );
  });
};

export default CardLoading;
