import { cn } from '@/lib/cn';
import { getTopArtists } from '@/lib/spotify';
import type { TTimeRange } from '@/types';
import Link from 'next/link';

export default async function Card({
  profile,
  imageClassName,
  limit,
  timeRange,
}: {
  profile?: boolean;
  imageClassName?: string;
  limit: string;
  timeRange: TTimeRange;
}) {
  const topArtists = await getTopArtists({ limit, timeRange });
  return topArtists.map((artist) => (
    <div key={artist.id}>
      <Link href={`/artists/${artist.id}`}>
        <div
          style={{
            backgroundImage: `url(${artist.images[1].url})`,
          }}
          className={cn(
            'cursor-pointer rounded-3xl h-[60vw]  md:h-[40vw]  lg:h-[40vw]  xl:h-96  overflow-hidden bg-custom-darkgray bg-cover bg-center flex items-center justify-center',
            !profile &&
              'transition duration-300 ease-in-out transform hover:scale-105',
            imageClassName
          )}
        >
          <div
            className="opacity-0 hover:opacity-100 rounded-xl w-full h-full flex flex-col items-center justify-center transition duration-300 ease-in-out pl-2 pb-2 md:pl-6 md:pb-3"
            style={{ background: 'rgba(0, 0, 0, 0.45)' }}
          >
            <div className="text-center text-2xl md:text-4xl text-white">
              {artist.name}
            </div>
          </div>
        </div>
      </Link>
    </div>
  ));
}
