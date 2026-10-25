import { spotifyQuery } from '@/lib/queries';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { SiSpotify } from 'react-icons/si';
import NavClient from './NavClient';
export default function Nav() {
  const { data } = useSuspenseQuery(spotifyQuery('me'));
  return (
    <header className="z-50 flex justify-between lg:justify-end px-4 py-4 lg:p-6 sticky top-0 bg-spotify-black">
      <Link to="/">
        <SiSpotify className="lg:hidden w-10 h-10 text-[#1DB954]" />
      </Link>
      <NavClient user={data as SpotifyApi.CurrentUsersProfileResponse} />
    </header>
  );
}
