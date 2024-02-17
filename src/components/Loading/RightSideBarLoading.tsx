// import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';
import randomIntFromInterval from '@/lib/randomIntFromInterval';

export default function RightSideBarLoading() {
  return (
    <>
      <div className="rounded-3xl bg-custom-darkgray py-4 w-full lg:w-72 text-white px-4">
        <p className="text-xl mb-6 ">Recently Played</p>
        <div className="">
          <div className="grid grid-cols-2 lg:flex flex-col gap-x-2 lg:gap-x-0 gap-y-2 lg:space-y-6">
            {[...Array(6)].map((num) => (
              <div key={num} className="flex">
                <div className="mr-4">
                  <Skeleton className="rounded-full bg-custom-gray w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
                </div>
                <div className={cn('overflow-hidden flex flex-col space-y-1')}>
                  <Skeleton
                    style={{
                      width: `${randomIntFromInterval(30, 200)}px`,
                    }}
                    className="h-6 bg-custom-gray"
                  />
                  <Skeleton className="bg-custom-gray h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full mt-4">
          <Skeleton className="bg-custom-gray w-full rounded-3xl h-[44px] sm:h-[52px]" />
        </div>
      </div>
    </>
  );
}
