import Link from "next/link";
import { useRouter } from "next/router";

import { SiSpotify } from "react-icons/si";
import { AiFillHome } from "react-icons/ai";
import { GiMicrophone } from "react-icons/gi";
import { BsMusicNoteBeamed } from 'react-icons/bs'
import { RiHistoryLine, RiPlayListFill } from 'react-icons/ri'

const linkClasses = {
  active:
    "cursor-pointer hover:text-[#686868] transition duration-150 ease-in-out w-6 h-6 text-white",
  inactive:
    "cursor-pointer hover:text-[#686868] transition duration-150 ease-in-out w-6 h-6 text-white",
};

const linkDivClassess = {
    active: 'w-full h-16 border-l-4 border-green-500 flex items-center justify-center',
    inactive: 'w-full h-16 flex items-center justify-center'
}
export default function SideNav(props) {
  const router = useRouter();
  return (
    <div className="rounded-xl py-4 w-32 h-full flex flex-col space-y-6 items-center pt-12">
      <div className="mb-12">
        <SiSpotify className="w-14 h-14 text-green-600" />
      </div>
      <div className="w-full flex flex-col space-y-8 items-center">
        <div className={
                router.pathname == "/"
                  ? linkDivClassess.active
                  : linkDivClassess.inactive
              }>
          <Link href="/">
            <AiFillHome
              className={
                router.pathname == "/"
                  ? linkClasses.active
                  : linkClasses.inactive
              }
            />
          </Link>
        </div>
        <div className={
                router.pathname == "/artists"
                  ? linkDivClassess.active
                  : linkDivClassess.inactive
              }>
          <Link href="/artists">
            <GiMicrophone
              className={
                router.pathname == "/artists"
                  ? linkClasses.active
                  : linkClasses.inactive
              }
            />
          </Link>
        </div>
        <div className={
                router.pathname == "/tracks"
                  ? linkDivClassess.active
                  : linkDivClassess.inactive
              }>
          <Link href="/tracks">
            <BsMusicNoteBeamed
              className={
                router.pathname == "/tracks"
                  ? linkClasses.active
                  : linkClasses.inactive
              }
            />
          </Link>
        </div>
        <div className={
                router.pathname == "/recent"
                  ? linkDivClassess.active
                  : linkDivClassess.inactive
              }>
          <Link href="/recent">
            <RiHistoryLine
              className={
                router.pathname == "/recent"
                  ? linkClasses.active
                  : linkClasses.inactive
              }
            />
          </Link>
        </div>
        <div className={
                router.pathname == "/playlists"
                  ? linkDivClassess.active
                  : linkDivClassess.inactive
              }>
          <Link href="/playlists">
            <RiPlayListFill
              className={
                router.pathname == "/playlists"
                  ? linkClasses.active
                  : linkClasses.inactive
              }
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
