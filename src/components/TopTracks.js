import Subtitle from './Subtitle';
import Link from 'next/link';

export default function TopTracks({ topTracksShort }) {
  return (
    <>
      <div className="">
        <Subtitle link="/tracks" subtitle="Top Tracks of the Week" />
        <div className="rounded-3xl py-8 px-4 text-white bg-custom-darkgray2 2xl:w-[600px]">
          <div className="space-y-6">
            {topTracksShort?.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div className="flex items-center space-x-4">
                  <Link href={`/tracks/${item.id}`}>
                    <img
                      className="w-20 h-20 cursor-pointer"
                      src={item.album.images[0].url}
                    ></img>
                  </Link>
                  <div className="flex flex-col">
                    <Link href={`/tracks/${item.id}`}>
                      <p className="sm:text-xl xl:text-lg cursor-pointer hover:underline">
                        {item.name}
                      </p>
                    </Link>
                    <p className="text-xs text-[#B6B6B6]">{item.album.name}</p>
                    <p className="lg:hidden text-xs text-[#B6B6B6]">
                      something
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
