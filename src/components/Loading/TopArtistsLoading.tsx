import Subtitle from '@/components/Subtitle';
import { Skeleton } from '../ui/skeleton';

const TopArtistsLoading = () => {
  const Card = () => (
    <div className="grid grid-cols-2 gap-3 w-full">
      {[...Array(4)].map((_, index) => (
        <Skeleton
          className={`rounded-3xl h-[45vw] w-[45vw] lg:w-[26vw] lg:h-[26vw] xl:w-full `}
        />
      ))}
    </div>
  );

  return (
    <>
      <div className="flex flex-col lg:mx-auto w-full">
        <Subtitle link="/artists" subtitle="Recent Artist" />
        <Card />
      </div>
    </>
  );
};

export default TopArtistsLoading;
