import handleServerSession from '@/lib/handleServerSession';
import NavClient from './NavClient';
import { SiSpotify } from 'react-icons/si';

const Nav = async () => {
  const { spotifyApi } = await handleServerSession();
  const { body: user } = await spotifyApi.getMe();

  return (
    <header className="flex justify-between lg:justify-end px-2 py-4 lg:p-6">
      <SiSpotify className="lg:hidden w-10 h-10 text-[#1DB954]" />
      <NavClient user={user} />
    </header>
  );
};

export default Nav;
