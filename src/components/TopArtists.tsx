import Subtitle from '@/components/Subtitle';
import Link from 'next/link';

const TopArtists = ({
  topArtists,
}: {
  topArtists: SpotifyApi.ArtistObjectFull[];
}) => {
  const Card = () => (
    <div className="grid grid-cols-2 gap-3 w-full">
      {topArtists.map((card) => (
        <Link key={card.id} href={`/artists/${card.id}`}>
          <div
            style={{
              backgroundImage: card.images.length
                ? `url(${card.images[0].url})`
                : 'none',
            }}
            className={`rounded-3xl h-[45vw] w-[45vw] lg:h-[16vw] xl:w-full bg-custom-darkgray bg-cover bg-center cursor-pointer ${
              !card.images.length && 'p-12'
            }`}
          >
            <div
              className="opacity-0 hover:opacity-100 rounded-xl w-full h-full flex flex-col items-center justify-center transition duration-300 ease-in-out pl-2 pb-2 lg:pl-6 lg:pb-3"
              style={{ background: 'rgba(0, 0, 0, 0.45)' }}
            >
              <div className="text-center text-2xl lg:text-4xl text-white">
                {card.name}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <>
      <div className="flexs flex-cols max-w-minzz lg:mx-auto">
        <Subtitle link="/artists" subtitle="Recent Artist" />
        <Card />
      </div>
    </>
  );
};

export default TopArtists;
