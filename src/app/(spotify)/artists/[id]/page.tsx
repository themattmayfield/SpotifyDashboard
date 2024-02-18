import { spotifyApi } from '@/lib/spotify';
import numeral from 'numeral';

import FollowButton from './FollowButton';

export default async function Artist({ params }: { params: { id: string } }) {
  const { id } = params;
  const { getArtist, getIsFollowingArtists } = spotifyApi();
  const [artist, isFollowingArtist] = await Promise.all([
    getArtist(id),
    getIsFollowingArtists({ type: 'artist', id: id }),
  ]);

  return (
    <div className="flex flex-col items-center text-center text-white pt-10 md:pt-24 space-y-4 md:space-y-8 no-scrollbar">
      <div
        className="rounded-full bg-cover bg-center w-40 h-40 md:w-80 md:h-80"
        style={{
          backgroundImage: `url(${artist.images[0].url})`,
        }}
      />

      <p className="text-4xl md:text-7xl">{artist.name}</p>
      <FollowButton isFollowingArtist={!!isFollowingArtist} id={id} />
      <div className="flex space-x-12 items-center justify-center">
        <div>
          <p className="text-xl md:text-3xl">
            {numeral(artist.followers.total).format('0,0')}
          </p>
          <p className="text-sm text-[#565656]">Followers</p>
        </div>
        <div>
          <p className="text-xl md:text-3xl">{artist.popularity}%</p>
          <p className="text-sm text-[#565656]">Popularity</p>
        </div>
      </div>
    </div>
  );
}
