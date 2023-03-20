'use client';
import { useRouter } from 'next/navigation';
import { SiSpotify } from 'react-icons/si';
import { AiFillHome } from 'react-icons/ai';
import { GiMicrophone } from 'react-icons/gi';
import { BsMusicNoteBeamed } from 'react-icons/bs';
import { RiHistoryLine, RiPlayListFill } from 'react-icons/ri';

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

export default function SideNav({ activeMobile, switchNavSong, track }) {
  const router = useRouter();
  return (
    <>
      {/* Mobile */}
      <div
        className={`w-full flex lg:hidden bg-black text-white top-auto fixed bottom-0 right-0 h-[70px] z-50 ${
          activeMobile == 'player' && ' hidden'
        }`}
      >
        {navItems.map(({ path, Icon, id }) => (
          <button
            key={id}
            onClick={() => router.push(path)}
            className={`${
              router.pathname == path
                ? 'border-[#1DB954] bg-custom-darkgray'
                : 'border-transparent hover:bg-custom-darkgray'
            } cursor-pointer w-full border-t-4 flex items-center justify-center`}
          >
            <Icon className="hover:text-[#686868] transition duration-150 ease-in-out w-6 h-6 text-white" />
          </button>
        ))}

        <img
          onClick={() => switchNavSong}
          className="h-full w-auto cursor-pointer"
          src={track?.albumUrl}
        />
      </div>

      {/* Desktop */}
      <div className="rounded-xl py-4 w-32 h-screen sticky top-0 hidden lg:flex flex-col space-y-6 items-center pt-12">
        <div className="mb-12">
          <SiSpotify className="w-14 h-14 text-[#1DB954]" />
        </div>
        <div className="w-full flex flex-col items-center">
          {navItems.map(({ path, Icon, id }) => (
            <button
              key={id}
              onClick={() => router.push(path)}
              className={`${
                router.pathname == path
                  ? 'border-[#1DB954] bg-custom-darkgray'
                  : 'border-transparent hover:bg-custom-darkgray'
              } cursor-pointer w-full h-24 border-l-4 flex items-center justify-center`}
            >
              <Icon className="hover:text-[#686868] transition duration-150 ease-in-out w-6 h-6 text-white" />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
