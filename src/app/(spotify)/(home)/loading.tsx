import CardLoading from '@/components/Loading/CardLoading';
import RightSideBarLoading from '@/components/Loading/RightSideBarLoading';
import TopArtistsLoading from '@/components/Loading/TopArtistsLoading';
import TrackLoading from '@/components/Loading/TrackLoading';
import Subtitle from '@/components/Subtitle';

export default function Loading() {
  return (
    <div className="h-full overflow-hidden">
      <div className="flex h-full">
        <div className="overflow-x-hidden lg:mr-4 overflow-y-scroll no-scrollbar">
          <div className="lg:hidden mb-16 px-2">
            <RightSideBarLoading />
          </div>
          <div className="pl-2 pr-0 mb-16">
            <Subtitle link="/artists" subtitle="Top Artist" />
            <div className="flex flex-nowrap space-x-6 overflow-x-scroll no-scrollbar pl-2 lg:pl-0">
              <CardLoading
                count={16}
                className="w-[45vw] md:w-[25vw] lg:w-[25vw] xl:w-64"
              />
            </div>
          </div>
          <div className="px-2 lg:pl-2 flex flex-col xl:flex-row 2xl:flex-nowrap no-scrollbar gap-y-16 gap-x-8 pb-[192px]">
            <div className="space-y-6">
              <div className="">
                <Subtitle link="/tracks" subtitle="Top Tracks of the Week" />
                <div className="rounded-3xl py-8 px-4 text-white bg-custom-darkgray2 2xl:w-[600px]">
                  <div className="space-y-6">
                    <TrackLoading count={6} />
                  </div>
                </div>
              </div>
            </div>
            <TopArtistsLoading />
          </div>
        </div>
        <div className="hidden lg:block">
          <RightSideBarLoading />
        </div>
      </div>
    </div>
  );
}
