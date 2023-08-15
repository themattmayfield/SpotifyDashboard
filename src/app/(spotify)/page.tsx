import Card from '@/components/Card';
import RightSideBar from '@/components/RightSideBar';
import Subtitle from '@/components/Subtitle';
import TopTracks from '@/components/TopTracks';
import TopArtists from '@/components/TopArtists';
import spotifyApi from '@/lib/spotify';
import handleServerSession from '@/lib/handleServerSession';
import Nav from '@/components/Nav';

export default async function Profile() {
  const session = await handleServerSession();

  const [
    { body: recentlyPlayedResponse },
    { body: topTracksResponse },
    { body: topArtistsLongResponse },
    { body: topArtistsShortResponse },
  ] =
    session &&
    (await Promise.all([
      spotifyApi.getMyRecentlyPlayedTracks({
        limit: 50,
      }),
      spotifyApi.getMyTopTracks({
        limit: 50,
        time_range: 'long_term',
      }),
      spotifyApi.getMyTopArtists({
        limit: 50,
        time_range: 'long_term',
      }),
      spotifyApi.getMyTopArtists({
        limit: 50,
        time_range: 'short_term',
      }),
    ]));

  const recentlyPlayed = recentlyPlayedResponse.items?.slice(0, 6);
  const topTracks = topTracksResponse.items?.slice(0, 6);
  const topArtists_LONG = topArtistsLongResponse.items?.slice(0, 16);
  const topArtists_SHORT = topArtistsShortResponse.items?.slice(0, 4);

  return (
    <div className="h-full overflow-hidden">
      {/* <Nav /> */}
      <div className="flex h-full">
        <div className="flex flex-col overflow-x-hidden lg:mr-4 overflow-y-scroll mb-[100px] no-scrollbar h-full">
          <div className="lg:hidden mb-16 px-2">
            <RightSideBar recentlyPlayed={recentlyPlayed} />
          </div>
          <div className="pl-2 pr-0 mb-16">
            <Subtitle link="/artists" subtitle="Top Artist" />
            <div className="flex flex-nowrap space-x-6 overflow-x-scroll no-scrollbar pl-2 lg:pl-0">
              {topArtists_LONG.map((item, index) => (
                <Card profile key={index} info={item} />
              ))}
            </div>
          </div>
          <div className="px-2 lg:pl-2 flex flex-col xl:flex-row 2xl:flex-nowrap no-scrollbar gap-y-16 gap-x-8">
            <TopTracks topTracks={topTracks} />
            <TopArtists topArtists={topArtists_SHORT} />
          </div>
        </div>
        <div className="hidden lg:block">
          <RightSideBar recentlyPlayed={recentlyPlayed} />
        </div>
      </div>
    </div>
  );
}
