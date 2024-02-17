import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';
import Link from 'next/link';

export default function RightSideBar({
  isLoading,
  recentlyPlayed,
}: {
  isLoading?: boolean;
  recentlyPlayed?: SpotifyApi.PlayHistoryObject[];
}) {
  return (
    <>
      <div className="rounded-3xl bg-custom-darkgray py-4 w-full lg:w-72 text-white px-4">
        <p className="text-xl mb-6 ">Recently Played</p>
        <div className="">
          <div className="grid grid-cols-2 lg:flex flex-col gap-x-2 lg:gap-x-0 gap-y-2 lg:space-y-6">
            {recentlyPlayed?.map((item, index) => (
              <div key={index} className="flex">
                <div className="mr-4">
                  <Link href={`/artists/${item.track.artists[0].id}`}>
                    <div
                      className="rounded-full bg-cover bg-custom-darkgray bg-center w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 cursor-pointer"
                      style={{
                        backgroundImage: `url(${item.track.album.images[0].url})`,
                      }}
                    ></div>
                  </Link>
                </div>

                <div
                  className={cn(
                    'overflow-hidden flex flex-col',
                    isLoading && 'space-y-1',
                  )}
                >
                  {isLoading ? (
                    <Skeleton className="h-6 bg-custom-gray w-12" />
                  ) : (
                    <Link
                      className="overflow-hidden truncate lg:w-48 cursor-pointer hover:underline"
                      href={`/artists/${item.track.artists[0].id}`}
                    >
                      {item.track.artists[0].name}
                    </Link>
                  )}

                  {isLoading ? (
                    <Skeleton className="bg-custom-gray h-3" />
                  ) : (
                    <Link
                      className="text-xs text-[#565656] overflow-hidden truncate lg:w-48 hover:underline cursor-pointer"
                      href={`/tracks/${item.track.id}`}
                    >
                      {item.track.name}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full mt-4">
          {isLoading ? (
            <Skeleton className="bg-custom-gray w-full rounded-3xl h-[44px] sm:h-[52px]" />
          ) : (
            <Link
              className="bg-custom-gray flex justify-center hover:bg-[#686868] transition duration-300 ease-in-out text-sm rounded-3xl px-4 py-3 sm:py-4 w-full focus:outline-none"
              href="/recentTracks"
            >
              View All
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
