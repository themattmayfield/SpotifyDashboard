import { spotifyApi } from '@/lib/spotify';
import Link from 'next/link';
import { SiSpotify } from 'react-icons/si';

import NavClient from './NavClient';

const Nav = async () => {
  const { getMe } = spotifyApi();
  const user = await getMe();

  return (
    <header className="z-50 flex justify-between lg:justify-end px-4 py-4 lg:p-6 sticky top-0 bg-spotify-black">
      <Link href="/">
        <SiSpotify className="lg:hidden w-10 h-10 text-[#1DB954]" />
      </Link>
      <NavClient user={user} />
    </header>
  );
};

export default Nav;
