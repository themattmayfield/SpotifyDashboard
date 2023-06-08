import Link from 'next/link';

export default function RightSideBar({
  recentlyPlayed,
}: {
  recentlyPlayed: SpotifyApi.PlayHistoryObject[];
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

                <div className="overflow-hidden">
                  <Link href={`/artists/${item.track.artists[0].id}`}>
                    <div className="overflow-hidden truncate lg:w-48 cursor-pointer hover:underline">
                      {item.track.artists[0].name}
                    </div>
                  </Link>
                  <Link href={`/tracks/${item.track.id}`}>
                    <p className="text-xs text-[#565656] overflow-hidden truncate lg:w-48 hover:underline cursor-pointer">
                      {item.track.name}
                    </p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full mt-4">
          <Link href="/recentTracks">
            <button className="bg-[#383838] hover:bg-[#686868] transition duration-150 ease-in-out text-sm rounded-3xl px-4 py-3 sm:py-4 w-full focus:outline-none">
              View All
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
