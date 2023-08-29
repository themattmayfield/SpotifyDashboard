import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-2 md:px-4 pt-10 md:pt-12 pb-24 flex flex-col items-center">
      <div className="flex flex-col items-center md:flex-row md:space-x-8">
        <Skeleton className="w-48 h-48 md:w-72 md:h-72" />
        <div className="flex flex-col space-y-1 md:space-y-3 items-center md:items-left">
          <Skeleton className="h-9 md:h-12 mt-3 md:mt-0 w-[100px]" />
          <Skeleton className="h-6 md:h-8 w-[75px]" />
          <Skeleton className="h-6 md:h-7 w-[100px]" />
        </div>
      </div>
      {/* <div className="w-full md:max-w-xl">
    {audioFeatures && <Chart features={audioFeatures} type="" />}
  </div> */}
    </div>
  );
}
