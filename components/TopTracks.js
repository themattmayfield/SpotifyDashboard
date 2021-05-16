import Subtitle from "./Subtitle";
import Link from "next/link";

export default function TopTracks({ topTracksShort }) {
  return (
    <>
      <div className="">
        <Subtitle link="/tracks" subtitle="Top Tracks of the Week" />
        <div className="rounded-3xl p-8 text-white bg-custom-darkgray2 2xl:w-[600px]">
          <div className="space-y-10">
            {topTracksShort.items.map(
              (item, index) =>
                index < 6 && (
                  <div key={index} className="flex justify-between">
                    <div className="flex items-center space-x-4">
                      <Link href={`/track/?id=${item.id}`}>
                        <img
                          className="w-20 h-20 cursor-pointer"
                          src={item.album.images[0].url}
                        ></img>
                      </Link>
                      <div className="flex flex-col">
                        <Link href={`/track/?id=${item.id}`}>
                          <p className="text-xl cursor-pointer hover:underline">
                            {item.name}
                          </p>
                        </Link>
                        <p className="text-sm text-[#B6B6B6]">
                          {item.album.name}
                        </p>
                        <p className="lg:hidden text-sm text-[#B6B6B6]">
                          something
                        </p>
                      </div>
                    </div>

                    {/* <div className="hidden lg:block">somethings</div> */}
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
