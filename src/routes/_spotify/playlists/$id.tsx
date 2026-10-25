import { createFileRoute } from '@tanstack/react-router';
import { SinglePlaylist } from '@/components/Playlist';
import Track from '@/components/Track';
export const Route = createFileRoute('/_spotify/playlists/$id')({
  component: Page,
});
function Page() {
  const { id } = Route.useParams();
  return (
    <div className="no-scrollbar overflow-x-hidden w-full md:w-[1280px] mx-auto px-2 md:px-4 pt-10 md:pt-12">
      <div className="flex flex-col md:flex-row md:justify-center items-center md:items-start space-y-8 md:space-y-0 mb-[150px] md:space-x-16">
        <div className="flex flex-col items-center">
          <SinglePlaylist analytic id={id} />
        </div>
        <div className="flex flex-col gap-4 no-scrollbar text-white w-full md:min-w-[566px]s">
          <Track withTrackDuration type="playlist" playlistId={id} />
        </div>
      </div>
    </div>
  );
}
