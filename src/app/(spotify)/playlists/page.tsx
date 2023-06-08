import spotifyApi from '@/lib/spotify';
import handleServerSession from '@/lib/handleServerSession';
import StaggerChildren from '@/containers/StaggerChildren';
import Playlist from '@/components/Playlist';

export default async function Playlists() {
  await handleServerSession();

  const { body } = await spotifyApi.getUserPlaylists();
  const playlists = body.items;

  return (
    <div className="no-scrollbar overflow-x-hidden max-w-7xl mx-auto px-2 md:px-4 pt-10 md:pt-24">
      <div className="bg-black w-full text-white pb-10 select-none flex flex-col md:flex-row items-center justify-between space-y-2">
        <div>
          <p className="text-2xl font-semibold">Your Playlists</p>
        </div>
      </div>

      <StaggerChildren className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 no-scrollbar mb-[100px]">
        {playlists.map((playlist, index) => (
          <Playlist key={index} playlist={playlist} />
        ))}
      </StaggerChildren>
    </div>
  );
}
