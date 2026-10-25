import { AiFillHome } from 'react-icons/ai';
import { BsMusicNoteBeamed } from 'react-icons/bs';
import { GiMicrophone } from 'react-icons/gi';
import { RiHistoryLine, RiPlayListFill } from 'react-icons/ri';
import { SiSpotify } from 'react-icons/si';

import SideNavLink from '@/components/SideNavLink';

const navItems = [
  { path: '/', label: 'Home', Icon: AiFillHome },
  { path: '/artists', label: 'Top artists', Icon: GiMicrophone },
  { path: '/tracks', label: 'Top tracks', Icon: BsMusicNoteBeamed },
  { path: '/recentTracks', label: 'Recently played', Icon: RiHistoryLine },
  { path: '/playlists', label: 'Playlists', Icon: RiPlayListFill },
] as const;

export default function SideNav() {
  return (
    <>
      <nav className="sticky top-0 hidden h-screen w-32 shrink-0 flex-col items-center space-y-6 rounded-xl py-4 pt-12 lg:flex">
        <div className="mb-12">
          <SiSpotify className="h-14 w-14 text-spotify-green" />
        </div>
        <NavLinks className="flex w-full flex-col items-center" />
      </nav>
      <nav className="fixed bottom-0 right-0 z-50 h-[70px] w-full bg-spotify-black text-white lg:hidden">
        <NavLinks className="flex h-full w-full" />
      </nav>
    </>
  );
}

const NavLinks = ({ className }: { className: string }) => (
  <div className={className}>
    {navItems.map(({ path, label, Icon }) => (
      <SideNavLink key={path} path={path} label={label}>
        <Icon className="pointer-events-none z-0 h-6 w-6 text-white transition duration-150 ease-in-out group-hover:text-custom-lightgray" />
      </SideNavLink>
    ))}
  </div>
);
