import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { SiSpotify } from 'react-icons/si';

import { spotifyQueries } from '@/lib/queries';
import UserMenu from './UserMenu';

export default function Nav() {
  const { data } = useSuspenseQuery(spotifyQueries.me());
  return (
    <header className="sticky top-0 z-50 flex justify-between bg-spotify-black px-4 py-4 lg:justify-end lg:p-6">
      <Link to="/" aria-label="Home" className="lg:hidden">
        <SiSpotify className="h-10 w-10 text-spotify-green" />
      </Link>
      <UserMenu user={data} />
    </header>
  );
}
