import Link from "next/link";

export default function RightSideBar({ recentlyPlayed }) {
  return (
    <>
      {/* Mobile */}
      <div className="md:hidden">
        <div className="h-full rounded-3xl bg-custom-darkgray pt-6 pb-4 w-full text-white px-4">
          <p className="text-xl mb-6">Recently Played</p>
          <div className="">
            {recentlyPlayed ? (
              <div className="grid grid-cols-2 gap-x-2">
                {recentlyPlayed.items.map(
                  (item, index) =>
                    index < 6 && (
                      <div key={index} className="flex">
                        <div className="mr-4">
                          <Link
                            href={`/artist/?id=${item.track.artists[0].id}`}
                          >
                            <div
                              className="rounded-full bg-cover bg-center w-8 h-8"
                              style={{
                                backgroundImage: `url(${item.track.album.images[0].url})`,
                              }}
                            ></div>
                          </Link>
                        </div>

                        <div className="overflow-hidden">
                          <div className="truncate">
                            {item.track.artists[0].name}
                          </div>
                          <Link href={`/track/?id=${item.track.id}`}>
                            <p className="text-xs text-[#565656] truncate">
                              {item.track.name}
                            </p>
                          </Link>
                        </div>
                      </div>
                    )
                )}
              </div>
            ) : (
              <p>Loading</p>
            )}
          </div>

          <div className="w-full px-8 mt-6">
            <Link href="/recent">
              <button className="bg-[#383838] hover:bg-[#686868] transition duration-150 ease-in-out text-sm rounded-3xl px-4 py-4 w-full focus:outline-none">
                View All
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block ">
        <div className="rounded-3xl bg-custom-darkgray pt-6 pb-4 w-80 text-white">
          <p className="text-xl mb-6 pl-8">Recently Played</p>
          <div className="pl-8 pr-1">
            {recentlyPlayed ? (
              <div className="flex flex-col space-y-8">
                {recentlyPlayed.items.map(
                  (item, index) =>
                    index < 6 && (
                      <div key={index} className="flex">
                        <div className="mr-4">
                          <Link
                            href={`/artist/?id=${item.track.artists[0].id}`}
                          >
                            <div
                              className="rounded-full bg-cover bg-center w-16 h-16 cursor-pointer"
                              style={{
                                backgroundImage: `url(${item.track.album.images[0].url})`,
                              }}
                            ></div>
                          </Link>
                        </div>

                        <div>
                          <Link
                            href={`/artist/?id=${item.track.artists[0].id}`}
                          >
                            <div className="overflow-hidden truncate w-48 cursor-pointer hover:underline">
                              {item.track.artists[0].name}
                            </div>
                          </Link>
                          <Link href={`/track/?id=${item.track.id}`}>
                            <p className="text-xs text-[#565656] overflow-hidden truncate w-48 hover:underline cursor-pointer">
                              {item.track.name}
                            </p>
                          </Link>
                        </div>
                      </div>
                    )
                )}
              </div>
            ) : (
              <p>Loading</p>
            )}
          </div>

          <div className="w-full px-8 mt-6">
            <Link href="/recent">
              <button className="bg-[#383838] hover:bg-[#686868] transition duration-150 ease-in-out text-sm rounded-3xl px-4 py-4 w-full focus:outline-none">
                View All
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
