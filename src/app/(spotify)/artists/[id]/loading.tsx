import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col items-center text-center pt-10 md:pt-24 space-y-4 md:space-y-8 no-scrollbar">
      <Skeleton className="rounded-full w-40 h-40 md:w-80 md:h-80" />

      <Skeleton className="h-10 md:h-[72px]" />
      <Skeleton className="w-[100pz] h-[34px]" />
      <div className="flex space-x-12 items-center justify-center">
        <div>
          <Skeleton className="h-7 md:h-9" />
          <p className="text-sm text-[#565656]">Followers</p>
        </div>
        <div>
          <Skeleton className="h-7 md:h-9" />
          <p className="text-sm text-[#565656]">Popularity</p>
        </div>
      </div>
    </div>
  );
}
