// src/app/_authenticated/tracks.$id.tsx
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';

import Chart from '@/components/Chart.client';
import { getAudioFeaturesForTrack, getTrack } from '@/lib/spotify';
import { getYear } from '@/lib/time';

export const Route = createFileRoute('/_authenticated/tracks/$id')({
  loader: async ({ params }) => {
    const [track, audioFeatures] = await Promise.all([
      getTrack(params.id),
      getAudioFeaturesForTrack(params.id),
    ]);
    return { track, audioFeatures };
  },
  pendingComponent: TrackDetailLoading,
  errorComponent: TrackDetailError,
  component: TrackDetailPage,
});

function TrackDetailLoading() {
  return (
    <div className="no-scrollbar overflow-x-hidden max-w-7xl px-2 md:px-4 pt-10 md:pt-12 pb-24 flex flex-col items-center mb-[150px]">
      <div className="max-auto flex flex-col items-center md:flex-row text-[#565656] md:space-x-8">
        <div className="w-48 h-48 md:w-72 md:h-72 bg-custom-darkgray animate-pulse" />
        <div className="flex flex-col space-y-3 text-center md:text-left">
          <div className="h-12 w-64 bg-custom-darkgray animate-pulse rounded mt-3 md:mt-0" />
          <div className="h-8 w-48 bg-custom-darkgray animate-pulse rounded" />
          <div className="h-6 w-40 bg-custom-darkgray animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}

function TrackDetailError({ error }: { error: Error }) {
  const router = useRouter();

  return (
    <div className="no-scrollbar overflow-x-hidden max-w-7xl px-2 md:px-4 pt-10 md:pt-12 pb-24 flex flex-col items-center mb-[150px]">
      <div className="flex flex-col items-center text-center space-y-4">
        <h2 className="text-xl font-semibold text-red-500">
          Failed to load track
        </h2>
        <p className="text-neutral-400">{error.message}</p>
        <div className="flex space-x-4">
          <Link
            to="/tracks"
            search={{ range: 'long_term' }}
            className="rounded-full border border-white px-6 py-2 font-medium text-white hover:bg-white/10"
          >
            Back to Tracks
          </Link>
          <button
            type="button"
            onClick={() => router.invalidate()}
            className="rounded-full bg-green-500 px-6 py-2 font-medium text-black hover:bg-green-400"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

function TrackDetailPage() {
  const { track, audioFeatures } = Route.useLoaderData();

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
                {track.artists.length > 0 && i === track.artists.length - 1
                  ? ''
                  : ','}
                &nbsp;
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

      <div className="w-400 h-[800px] mt-6">
        <Chart features={audioFeatures} />
      </div>
    </div>
  );
}
