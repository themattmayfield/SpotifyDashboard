import { useRouter } from 'next/navigation';
import { SiSpotify } from 'react-icons/si';
import { AiFillHome } from 'react-icons/ai';
import { GiMicrophone } from 'react-icons/gi';
import { BsMusicNoteBeamed } from 'react-icons/bs';
import { RiHistoryLine, RiPlayListFill } from 'react-icons/ri';
import Link from 'next/link';
import { headers } from 'next/headers';
import SideNavLink from '@/components/SideNavLink';

export default function SideNav() {
  return (
    <>
      {/* Mobile */}
      <div className="w-full flex lg:hidden bg-black text-white top-auto fixed bottom-0 right-0 h-[70px] z-50">
        {navItems.map(({ path, Icon, id }) => (
          <SideNavLink key={id} path={path}>
            <Icon className="hover:text-[#686868] transition duration-150 ease-in-out w-6 h-6 text-white" />
          </SideNavLink>
        ))}
      </div>

      {/* Desktop */}
      <div className="rounded-xl py-4 w-32 h-screen sticky top-0 hidden lg:flex flex-col space-y-6 items-center pt-12">
        <div className="mb-12">
          <SiSpotify className="w-14 h-14 text-[#1DB954]" />
        </div>
        <div className="w-full flex flex-col items-center">
          {navItems.map(({ path, Icon, id }) => (
            <SideNavLink key={id} path={path}>
              <Icon className="hover:text-[#686868] transition duration-150 ease-in-out w-6 h-6 text-white" />
            </SideNavLink>
          ))}
        </div>
      </div>
    </>
  );
}

const navItems = [
  {
    id: 0,
    path: '/',
    Icon: AiFillHome,
  },
  {
    id: 1,
    path: '/artists',
    Icon: GiMicrophone,
  },
  {
    id: 2,
    path: '/tracks',
    Icon: BsMusicNoteBeamed,
  },
  {
    id: 3,
    path: '/recentTracks',
    Icon: RiHistoryLine,
  },
  {
    id: 4,
    path: '/playlists',
    Icon: RiPlayListFill,
  },
];