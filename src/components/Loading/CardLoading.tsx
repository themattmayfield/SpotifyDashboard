import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/cn';

const CardLoading = ({
  count,
  className,
}: {
  count: number;
  className?: string;
}) => {
  return [...Array(count)].map((_, index) => {
    return (
      <div>
        <Skeleton
          className={cn(
            'cursor-pointer rounded-3xl h-[60vw]  md:h-[40vw]  lg:h-[40vw]  xl:h-96  overflow-hidden bg-custom-darkgray bg-cover bg-center flex items-center justify-center',
            className
          )}
        ></Skeleton>
      </div>
    );
  });
};

export default CardLoading;
