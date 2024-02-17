import React from 'react';

import randomIntFromInterval from '@/lib/randomIntFromInterval';

import { Skeleton } from '../ui/skeleton';

const TrackLoading = ({ count }: { count: number }) => {
  return [...Array(count)].map((index) => {
    return (
      <div
        key={index}
        className="flex items-center justify-between cursor-pointer transition duration-150 ease-in-out hover:bg-custom-darkgray"
      >
        <div className="flex space-x-6 items-center w-full">
          <Skeleton className="w-20 h-20 shrink-0" />
          <div className="flex flex-col space-y-1 w-full">
            <Skeleton
              style={{
                width: `${randomIntFromInterval(50, 200)}px`,
              }}
              className={`h-6`}
            />
            <Skeleton
              style={{
                width: `${randomIntFromInterval(30, 100)}px`,
              }}
              className="h-6"
            />
            <Skeleton
              style={{
                width: `${randomIntFromInterval(30, 100)}px`,
              }}
              className="h-6"
            />
          </div>
        </div>
      </div>
    );
  });
};

export default TrackLoading;
