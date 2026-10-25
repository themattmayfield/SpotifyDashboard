import { AiFillHome } from 'react-icons/ai';
import { BsMusicNoteBeamed, BsPieChartFill } from 'react-icons/bs';
import { GiMicrophone } from 'react-icons/gi';
import {
  RiCalendarEventFill,
  RiHistoryLine,
  RiPlayListFill,
} from 'react-icons/ri';
import { RiTeamFill } from 'react-icons/ri';
import { SiSpotify } from 'react-icons/si';

import SideNavLink from '@/components/SideNavLink';

const navItems = [
  { path: '/', label: 'Home', Icon: AiFillHome },
  { path: '/artists', label: 'Artists', Icon: GiMicrophone },
  { path: '/tracks', label: 'Tracks', Icon: BsMusicNoteBeamed },
  { path: '/recentTracks', label: 'Recent', Icon: RiHistoryLine },
  { path: '/recap', label: 'Recap', Icon: RiCalendarEventFill },
  { path: '/playlists', label: 'Playlists', Icon: RiPlayListFill },
  { path: '/compare', label: 'Compare', Icon: RiTeamFill },
  { path: '/taste', label: 'Taste', Icon: BsPieChartFill },
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
      <nav
        className="fixed bottom-0 right-0 z-50 h-[70px] w-full overflow-x-auto border-x-8 border-spotify-black bg-spotify-black text-white shadow-[inset_18px_0_18px_-18px_#fff,inset_-18px_0_18px_-18px_#fff] lg:hidden"
        aria-label="Main navigation"
      >
        <NavLinks className="flex h-full min-w-[560px]" />
      </nav>
    </>
  );
}

const NavLinks = ({ className }: { className: string }) => (
  <div className={className}>
    {navItems.map(({ path, label, Icon }) => (
      <SideNavLink key={path} path={path} label={label}>
        <Icon className="pointer-events-none z-0 h-6 w-6 text-white transition duration-150 ease-in-out group-hover:text-custom-lightgray" />
        <span className="mt-1 text-[9px] lg:text-xs">{label}</span>
      </SideNavLink>
    ))}
  </div>
);
