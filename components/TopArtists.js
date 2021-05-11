import Link from "next/link";
import Subtitle from "./Subtitle";

export default function TopArtists({ topArtistsShort }) {
  
  return (
    <>
      <div className="flex flex-col max-w-min md:mx-auto">
        <Subtitle link="/artists" subtitle="Recent Artist" />
        <div className="space-y-3">
          <div className="flex space-x-3 items-center">
            <Link href={`/artist/?id=${topArtistsShort.items[0].id}`}>
              <div
                style={{
                  backgroundImage: `url(${topArtistsShort.items[0].images[0].url})`,
                }}
                className="rounded-tl-3xl rounded-lg h-[45vw] w-[45vw] md:h-[16vw] md:w-[16vw] xl:h-48 xl:w-48 bg-cover bg-center"
              ></div>
            </Link>
            <Link href={`/artist/?id=${topArtistsShort.items[1].id}`}>
              <div
                style={{
                  backgroundImage: `url(${topArtistsShort.items[1].images[0].url})`,
                }}
                className="rounded-tr-3xl rounded-lg h-[45vw] w-[45vw] md:h-[16vw] md:w-[16vw] xl:h-48 xl:w-48 bg-cover bg-center"
              ></div>
            </Link>
          </div>
          <div className="flex space-x-3 items-center">
            <Link href={`/artist/?id=${topArtistsShort.items[2].id}`}>
              <div
                style={{
                  backgroundImage: `url(${topArtistsShort.items[2].images[0].url})`,
                }}
                className="rounded-bl-3xl rounded-lg h-[45vw] w-[45vw] md:h-[16vw] md:w-[16vw] xl:h-48 xl:w-48 bg-cover bg-center"
              ></div>
            </Link>
            <Link href={`/artist/?id=${topArtistsShort.items[3].id}`}>
              <div
                style={{
                  backgroundImage: `url(${topArtistsShort.items[3].images[0].url})`,
                }}
                className="rounded-br-3xl rounded-lg h-[45vw] w-[45vw] md:h-[16vw] md:w-[16vw] xl:h-48 xl:w-48 bg-cover bg-center"
              ></div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
