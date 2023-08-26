// import StaggerChildren from '@/containers/StaggerChildren';
import Playlist from '@/components/Playlist';
import handleServerSession from '@/lib/handleServerSession';

export default async function Playlists() {
  const { spotifyApi } = await handleServerSession();
  const playlists = await spotifyApi
    .getUserPlaylists()
    .then(({ body }) => body.items);

  return (
    <div className="no-scrollbar overflow-x-hidden max-w-7xl mx-auto px-2 md:px-4">
      <div className="bg-spotify-black w-full text-white pb-10 select-none flex flex-col md:flex-row items-center justify-between space-y-2">
        <div>
          <p className="text-xl sm:text-2xl font-semibold">Playlists</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 no-scrollbar mb-[100px]">
        {playlists.map((playlist, index) => (
          <Playlist key={index} playlist={playlist} />
        ))}
      </div>
    </div>
  );
}
