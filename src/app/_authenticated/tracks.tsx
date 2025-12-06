// src/app/_authenticated/tracks.tsx
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { z } from 'zod';

import TrackLoading from '@/components/Loading/TrackLoading';
import PageRangeHeader from '@/components/PageRangeHeader';
import { PageWrapper } from '@/components/PageWrapper';
import { millisToMinutesAndSeconds } from '@/lib/time';
import { getTopTracks } from '@/lib/spotify';
import type { TTimeRange } from '@/types';

const searchSchema = z.object({
  range: z
    .enum(['short_term', 'medium_term', 'long_term'])
    .optional()
    .default('long_term'),
});

export const Route = createFileRoute('/_authenticated/tracks')({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search }) => ({ range: search.range }),
  loader: async ({ deps }) => {
    const tracks = await getTopTracks({
      limit: '50',
      timeRange: deps.range,
    });
    return { tracks };
  },
  pendingComponent: TracksLoading,
  errorComponent: TracksError,
  component: TracksPage,
});

function TracksLoading() {
  return (
    <PageWrapper>
      <PageRangeHeader title="Tracks" activeRange="long_term" />
      <div className="flex flex-col gap-4 no-scrollbar text-white mb-[150px] px-2">
        <TrackLoading count={12} />
      </div>
    </PageWrapper>
  );
}

function TracksError({ error }: { error: Error }) {
  const router = useRouter();

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold text-red-500">
          Failed to load tracks
        </h2>
        <p className="mt-2 text-neutral-400">{error.message}</p>
        <button
          type="button"
          onClick={() => router.invalidate()}
          className="mt-4 rounded-full bg-green-500 px-6 py-2 font-medium text-black hover:bg-green-400"
        >
          Try Again
        </button>
      </div>
    </PageWrapper>
  );
}

function TracksPage() {
  const { tracks } = Route.useLoaderData();
  const { range } = Route.useSearch();
  const activeRange = (range || 'long_term') as TTimeRange;

  return (
    <PageWrapper>
      <PageRangeHeader activeRange={activeRange} title="Tracks" />

      <div className="flex flex-col gap-4 no-scrollbar text-white mb-[150px] px-2">
        {tracks.map((track) => (
          <TrackRow key={track.id} track={track} withTrackDuration />
        ))}
      </div>
    </PageWrapper>
  );
}

function TrackRow({
  track,
  withTrackDuration,
}: {
  track: SpotifyApi.TrackObjectFull;
  withTrackDuration: boolean;
}) {
  return (
    <div className="overflow-x-hidden flex items-center justify-between cursor-pointer transition duration-150 ease-in-out hover:bg-custom-darkgray">
      <div className="flex space-x-4 items-center">
        <Link className="shrink-0" to="/tracks/$id" params={{ id: track.id }}>
          <img
            className="w-20 h-20"
            src={track.album?.images[0]?.url}
            alt={track.name}
          />
        </Link>
        <div className="flex flex-col">
          <Link to="/tracks/$id" params={{ id: track.id }}>
            <p className="hover:underline whitespace-nowrap truncate max-w-[300px]">
              {track.name}
            </p>
          </Link>
          <div className="flex flex-col md:flex-row text-[#565656]">
            <Link to="/artists/$id" params={{ id: track.artists[0].id }}>
              <p className="hover:underline whitespace-nowrap">
                {track.artists[0].name}
              </p>
            </Link>
            <span className="hidden md:block">&nbsp;&middot;&nbsp;&nbsp;</span>
            <p className="whitespace-nowrap">{track.album.name}</p>
          </div>
          {withTrackDuration && (
            <p className="md:hidden text-[#565656]">
              {millisToMinutesAndSeconds(track.duration_ms)}
            </p>
          )}
        </div>
      </div>

      {withTrackDuration && (
        <div className="hidden md:block text-[#565656]">
          {millisToMinutesAndSeconds(track.duration_ms)}
        </div>
      )}
    </div>
  );
}
