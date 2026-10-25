import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { spotifyQuery } from '@/lib/queries';
import { getYear } from '@/lib/time';
import AudioFeaturesChart from '@/components/AudioFeaturesChart';
import { Skeleton } from '@/components/ui/skeleton';
export const Route = createFileRoute('/_spotify/tracks/$id')({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(
        spotifyQuery('track', { id: params.id })
      ),
      context.queryClient.ensureQueryData(
        spotifyQuery('audio', { id: params.id })
      ),
    ]),
  component: Page,
  pendingComponent: () => (
    <div className="max-w-7xl mx-auto px-2 md:px-4 pt-10 md:pt-12 pb-24 flex flex-col items-center">
      <Skeleton className="w-48 h-48 md:w-72 md:h-72" />
    </div>
  ),
});
function Page() {
  const { id } = Route.useParams();
  const { data: t } = useSuspenseQuery(spotifyQuery('track', { id }));
  const { data: features } = useSuspenseQuery(spotifyQuery('audio', { id }));
  const track = t as SpotifyApi.SingleTrackResponse;
  return (
    <div className="no-scrollbar overflow-x-hidden max-w-7xl px-2 md:px-4 pt-10 md:pt-12 pb-24 flex flex-col items-center mb-[150px]">
      <div className="max-auto flex flex-col items-center md:flex-row text-[#565656] md:space-x-8">
        <img
          className="w-48 h-48 md:w-72 md:h-72"
          src={track.album.images[0]?.url}
          alt="Album Artwork"
        />
        <div className="flex flex-col space-y-1 md:space-y-3 text-center md:text-left">
          <p className="text-white text-3xl md:text-5xl mt-3 md:mt-0">
            {track.name}
          </p>
          <div className="md:text-2xl">
            {track.artists.map(({ name, id }, i) => (
              <span key={id}>
                {name}
                {i === track.artists.length - 1 ? '' : ','}&nbsp;
              </span>
            ))}
          </div>
          <div className="md:text-lg">
            <a
              href={track.album.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              {track.album.name}
            </a>{' '}
            &middot; {getYear(track.album.release_date)}
          </div>
        </div>
      </div>
      {features && (
        <div className="w-400 h-[800px] mt-6">
          <AudioFeaturesChart
            features={features as SpotifyApi.AudioFeaturesResponse}
          />
        </div>
      )}
    </div>
  );
}
