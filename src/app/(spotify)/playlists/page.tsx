import PageRangeHeader from '@/components/PageRangeHeader';
import { PageWrapper } from '@/components/PageWrapper';
import Playlist from '@/components/Playlist';
import handleServerSession from '@/lib/handleServerSession';

export default async function Playlists() {
  const { spotifyApi } = await handleServerSession();
  const playlists = await spotifyApi
    .getUserPlaylists()
    .then(({ body }) => body.items);

  return (
    <PageWrapper>
      <PageRangeHeader title="Playlists" />

      <div className="grid grid-cols-2 place-items-center lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-7 gap-2 md:gap-6 no-scrollbar mb-[100px]">
        {playlists.map((playlist, index) => (
          <Playlist key={index} playlist={playlist} />
        ))}
      </div>
    </PageWrapper>
  );
}
