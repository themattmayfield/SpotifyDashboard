import { Skeleton } from '../ui/skeleton';

const widths = {
  title: [94, 163, 121, 188, 76, 145],
  detail: [42, 87, 63, 96, 54, 75],
} as const;

const TrackLoading = ({ count }: { count: number }) => {
  return [...Array(count)].map((_, index) => {
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
                width: `${widths.title[index % widths.title.length]}px`,
              }}
              className={'h-6'}
            />
            <Skeleton
              style={{
                width: `${widths.detail[index % widths.detail.length]}px`,
              }}
              className="h-6"
            />
            <Skeleton
              style={{
                width: `${widths.detail[(index + 2) % widths.detail.length]}px`,
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
