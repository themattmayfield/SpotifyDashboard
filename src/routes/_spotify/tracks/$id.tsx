import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { spotifyQueries } from '@/lib/queries';
import { getYear } from '@/lib/time';
import AudioFeaturesChart from '@/components/AudioFeaturesChart';
import TrackDetailLoading from '@/components/Loading/TrackDetailLoading';
export const Route = createFileRoute('/_spotify/tracks/$id')({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(spotifyQueries.track(params.id)),
      context.queryClient.ensureQueryData(
        spotifyQueries.audioFeatures(params.id)
      ),
    ]),
  component: Page,
  pendingComponent: TrackDetailLoading,
});
function Page() {
  const { id } = Route.useParams();
  const { data: t } = useSuspenseQuery(spotifyQueries.track(id));
  const { data: features } = useSuspenseQuery(spotifyQueries.audioFeatures(id));
  return (
    <div className="no-scrollbar overflow-x-hidden max-w-7xl px-2 md:px-4 pt-10 md:pt-12 pb-24 flex flex-col items-center mb-[150px]">
      <div className="max-auto flex flex-col items-center md:flex-row text-[#565656] md:space-x-8">
        <img
          className="w-48 h-48 md:w-72 md:h-72"
          src={t.album.images[0]?.url}
          alt="Album Artwork"
        />
        <div className="flex flex-col space-y-1 md:space-y-3 text-center md:text-left">
          <p className="text-white text-3xl md:text-5xl mt-3 md:mt-0">
            {t.name}
          </p>
          <div className="md:text-2xl">
            {t.artists.map(({ name, id }, i) => (
              <span key={id}>
                {name}
                {i === t.artists.length - 1 ? '' : ','}&nbsp;
              </span>
            ))}
          </div>
          <div className="md:text-lg">
            <a
              href={t.album.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.album.name}
            </a>{' '}
            &middot; {getYear(t.album.release_date)}
          </div>
        </div>
      </div>
      {features && (
        <div className="w-400 h-[800px] mt-6">
          <AudioFeaturesChart features={features} />
        </div>
      )}
    </div>
  );
}
