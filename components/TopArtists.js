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
                  }-3xl rounded-lg h-[45vw] w-[45vw] md:h-[16vw] md:w-[16vw] xl:h-48 xl:w-48 bg-custom-darkgray bg-cover bg-center cursor-pointer ${
                    !card.images.length && "p-12"
                  }`}
                >
                  <div
                    className="opacity-0 hover:opacity-100 rounded-xl w-full h-full flex flex-col items-center justify-center transition duration-300 ease-in-out pl-2 pb-2 md:pl-6 md:pb-3"
                    style={{ background: "rgba(0, 0, 0, 0.45)" }}
                  >
                    <div className="text-center text-2xl md:text-4xl text-white">
                      {card.name}
                    </div>
                  </div>
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
