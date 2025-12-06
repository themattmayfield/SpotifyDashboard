import { Link } from '@tanstack/react-router';
import { SiSpotify } from 'react-icons/si';

import NavClient from './NavClient.client';

interface NavProps {
  user: SpotifyApi.CurrentUsersProfileResponse;
}

const Nav = ({ user }: NavProps) => {
  return (
    <header className="z-50 flex justify-between lg:justify-end px-4 py-4 lg:p-6 sticky top-0 bg-spotify-black">
      <Link to="/">
        <SiSpotify className="lg:hidden w-10 h-10 text-[#1DB954]" />
      </Link>
      <NavClient user={user} />
    </header>
  );
};

export default Nav;
