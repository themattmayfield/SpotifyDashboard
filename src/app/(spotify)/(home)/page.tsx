import Card from '@/components/Card';
import RightSideBar from '@/components/RightSideBar';
import Subtitle from '@/components/Subtitle';
import TopArtists from '@/components/TopArtists';
import handleServerSession from '@/lib/handleServerSession';
import Track from '@/components/Track';
import Loading from './loading';

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
    <div className="flex-grow">
      <div className="flex">
        <div className="overflow-x-hidden lg:mr-4 no-scrollbar">
          <div className="lg:hidden mb-16 px-2">
            <RightSideBar recentlyPlayed={recentlyPlayed} />
          </div>
          <div className="pl-2 pr-0 mb-16">
            <Subtitle link="/artists" subtitle="Top Artist" />
            <div className="flex flex-nowrap space-x-6 overflow-x-scroll no-scrollbar pl-2 lg:pl-0">
              {topArtistsLong.map((item, index) => (
                <Card
                  imageClassName="w-[45vw] md:w-[25vw] lg:w-[25vw] xl:w-64"
                  profile
                  key={index}
                  info={item}
                />
              ))}
            </div>
          </div>
          <div className="px-2 lg:pl-2 flex flex-col xl:flex-row 2xl:flex-nowrap no-scrollbar gap-y-16 gap-x-8 pb-[192px]">
            <div className="space-y-6">
              <div className="">
                <Subtitle link="/tracks" subtitle="Top Tracks of the Week" />
                <div className="rounded-3xl py-8 px-4 text-white bg-custom-darkgray2 2xl:w-[600px]">
                  <div className="space-y-6">
                    {topTracks?.map((item) => (
                      <Track track={item} withTrackDuration={false} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
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
