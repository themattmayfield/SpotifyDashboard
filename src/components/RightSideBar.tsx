import { spotifyQueries } from '@/lib/queries';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

export default function RightSideBar() {
  const { data } = useSuspenseQuery(
    spotifyQueries.recentlyPlayed({ limit: '6' })
  );
  return (
    <div className="rounded-3xl bg-custom-darkgray py-4 w-full lg:w-72 text-white px-4">
      <p className="text-xl mb-6 ">Recently Played</p>
      <div>
        <div className="grid grid-cols-2 lg:flex flex-col gap-x-2 lg:gap-x-0 gap-y-2 lg:space-y-6">
          {data.map((item, index) => (
            <div key={`${item.played_at}-${index}`} className="flex">
              <div className="mr-4">
                <Link
                  to="/artists/$id"
                  params={{ id: item.track.artists[0].id }}
                >
                  <div
                    className="rounded-full bg-cover bg-custom-darkgray bg-center w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 cursor-pointer"
                    style={{
                      backgroundImage: `url(${item.track.album.images[0]?.url})`,
                    }}
                  />
                </Link>
              </div>
              <div className="overflow-hidden flex flex-col">
                <Link
                  className="overflow-hidden truncate lg:w-48 cursor-pointer hover:underline"
                  to="/artists/$id"
                  params={{ id: item.track.artists[0].id }}
                >
                  {item.track.artists[0].name}
                </Link>
                <Link
                  className="text-xs text-[#565656] overflow-hidden truncate lg:w-48 hover:underline cursor-pointer"
                  to="/tracks/$id"
                  params={{ id: item.track.id }}
                >
                  {item.track.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full mt-4">
        <Link
          className="bg-custom-gray flex justify-center hover:bg-[#686868] transition duration-300 ease-in-out text-sm rounded-3xl px-4 py-3 sm:py-4 w-full focus:outline-none"
          to="/recentTracks"
        >
          View All
        </Link>
      </div>
    </div>
  );
}
