import Card from '@/components/Card';
import RightSideBar from '@/components/RightSideBar';
import Subtitle from '@/components/Subtitle';
import TopTracks from '@/components/TopTracks';
import TopArtists from '@/components/TopArtists';

import Nav from '@/components/Nav';
import handleServerSession from '@/lib/handleServerSession';

export default async function Profile() {
  const { spotifyApi } = await handleServerSession();
  const [recentlyPlayed, topTracks, topArtistsLong, topArtistsShort] =
    await Promise.all([
      spotifyApi
        .getMyRecentlyPlayedTracks({
          limit: 6,
        })
        .then(({ body }) => body.items),
      spotifyApi
        .getMyTopTracks({
          limit: 6,
          time_range: 'long_term',
        })
        .then(({ body }) => body.items),
      spotifyApi
        .getMyTopArtists({
          limit: 16,
          time_range: 'long_term',
        })
        .then(({ body }) => body.items),
      spotifyApi
        .getMyTopArtists({
          limit: 4,
          time_range: 'short_term',
        })
        .then(({ body }) => body.items),
    ]);

  return (
    <div className="h-full overflow-hidden">
      <Nav />
      <div className="flex h-full">
        <div className="overflow-x-hidden lg:mr-4 overflow-y-scroll no-scrollbar">
          <div className="lg:hidden mb-16 px-2">
            <RightSideBar recentlyPlayed={recentlyPlayed} />
          </div>
          <div className="pl-2 pr-0 mb-16">
            <Subtitle link="/artists" subtitle="Top Artist" />
            <div className="flex flex-nowrap space-x-6 overflow-x-scroll no-scrollbar pl-2 lg:pl-0">
              {topArtistsLong.map((item, index) => (
                <Card profile key={index} info={item} />
              ))}
            </div>
          </div>
          <div className="px-2 lg:pl-2 flex flex-col xl:flex-row 2xl:flex-nowrap no-scrollbar gap-y-16 gap-x-8 pb-[192px]">
            <TopTracks topTracks={topTracks} />
            <TopArtists topArtists={topArtistsShort} />
          </div>
        </div>
        <div className="hidden lg:block">
          <RightSideBar recentlyPlayed={recentlyPlayed} />
        </div>
      </div>
    </div>
  );
}
