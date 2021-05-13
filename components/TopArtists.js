import Link from "next/link";
import Subtitle from "./Subtitle";
import { RiUserVoiceLine } from "react-icons/ri";

const n = 2;

const TopArtists = ({ topArtistsShort }) => {
  const Card = () =>
    [...Array(n)].map((e, wrapperIndex) => (
      <div key={wrapperIndex} className="flex space-x-3 items-center">
        {topArtistsShort.items.map(
          (card, index) =>
            (((index == 2 || index == 3) && wrapperIndex === 1) ||
              ((index == 0 || index == 1) && wrapperIndex === 0)) && (
              <Link key={index} href={`/artist/?id=${card.id}`}>
                <div
                  style={{
                    backgroundImage: card.images.length
                      ? `url(${card.images[0].url})`
                      : "none",
                  }}
                  className={`rounded-${
                    (index == 0 && "tl") ||
                    (index == 1 && "tr") ||
                    (index == 2 && "bl") ||
                    (index == 3 && "br")
                  }-3xl rounded-lg h-[45vw] w-[45vw] md:h-[16vw] md:w-[16vw] xl:h-48 xl:w-48 bg-cover bg-center cursor-pointer ${
                    !card.images.length && "p-12"
                  }`}
                >
                  {!card.images.length && (
                    <RiUserVoiceLine className="text-[#686868] h-full w-full" />
                  )}
                </div>
              </Link>
            )
        )}
      </div>
    ));

  return (
    <>
      <div className="flex flex-col max-w-min md:mx-auto">
        <Subtitle link="/artists" subtitle="Recent Artist" />
        <div className="space-y-3">
          <Card />
        </div>
      </div>
    </>
  );
};

export default TopArtists;
