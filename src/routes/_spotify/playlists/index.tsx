import { spotifyQuery } from '@/lib/queries';
import { createFileRoute } from '@tanstack/react-router';
import PageRangeHeader from '@/components/PageRangeHeader';
import { PageWrapper } from '@/components/PageWrapper';
import { UserPlaylists } from '@/components/Playlist';
export const Route = createFileRoute('/_spotify/playlists/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(spotifyQuery('playlists')),
  component: () => (
    <PageWrapper>
      <PageRangeHeader title="Playlists" />
      <div className="px-2 grid grid-cols-2 place-items-center lg:grid-cols-3 2xl:grid-cols-5 gap-2 md:gap-6 no-scrollbar mb-[150px]">
        <UserPlaylists />
      </div>
    </PageWrapper>
  ),
});
