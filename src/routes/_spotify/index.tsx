import Card from '@/components/Card';
import CardLoading from '@/components/Loading/CardLoading';
import RightSideBarLoading from '@/components/Loading/RightSideBarLoading';
import TopArtistsLoading from '@/components/Loading/TopArtistsLoading';
import TrackLoading from '@/components/Loading/TrackLoading';
import RightSideBar from '@/components/RightSideBar';
import Subtitle from '@/components/Subtitle';
import TopArtists from '@/components/TopArtists';
import Track from '@/components/Track';
import { spotifyQueries } from '@/lib/queries';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

export const Route = createFileRoute('/_spotify/')({
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(
      spotifyQueries.recentlyPlayed({ limit: '6' })
    );
    context.queryClient.prefetchQuery(
      spotifyQueries.topArtists({ limit: '16', timeRange: 'long_term' })
    );
    context.queryClient.prefetchQuery(
      spotifyQueries.topTracks({ limit: '6', timeRange: 'long_term' })
    );
    context.queryClient.prefetchQuery(
      spotifyQueries.topArtists({ limit: '4', timeRange: 'short_term' })
    );
  },
  component: Home,
});
function Home() {
  return (
    <div className="flex">
      <div className="overflow-x-hidden lg:mr-4 no-scrollbar">
        <div className="lg:hidden mb-16 px-2">
          <Suspense fallback={<RightSideBarLoading />}>
            <RightSideBar />
          </Suspense>
        </div>
        <div className="pl-2 pr-0 mb-16">
          <Subtitle link="/artists" subtitle="Top Artist" />
          <div className="flex flex-nowrap space-x-6 overflow-x-scroll no-scrollbar pl-2 lg:pl-0">
            <Suspense
              fallback={
                <CardLoading
                  count={16}
                  className="w-[45vw] md:w-[25vw] lg:w-[25vw] xl:w-64"
                />
              }
            >
              <Card
                imageClassName="w-[45vw] md:w-[25vw] lg:w-[25vw] xl:w-64"
                profile
                limit="16"
                timeRange="long_term"
              />
            </Suspense>
          </div>
        </div>
        <div className="px-2 lg:pl-2 flex flex-col xl:flex-row 2xl:flex-nowrap no-scrollbar gap-y-16 gap-x-8 pb-[192px]">
          <div className="space-y-6">
            <Subtitle link="/tracks" subtitle="Top Tracks of the Week" />
            <div className="rounded-3xl py-8 px-4 text-white bg-custom-darkgray2 2xl:w-[600px]">
              <div className="space-y-6">
                <Suspense fallback={<TrackLoading count={6} />}>
                  <Track
                    type="topTracks"
                    limit="6"
                    timeRange="long_term"
                    withTrackDuration={false}
                  />
                </Suspense>
              </div>
            </div>
          </div>
          <Suspense fallback={<TopArtistsLoading />}>
            <TopArtists />
          </Suspense>
        </div>
      </div>
      <div className="hidden lg:block">
        <Suspense fallback={<RightSideBarLoading />}>
          <RightSideBar />
        </Suspense>
      </div>
    </div>
  );
}
