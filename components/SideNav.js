import Link from "next/link";
import { useRouter } from "next/router";

import { SiSpotify } from "react-icons/si";
import { AiFillHome } from "react-icons/ai";
import { GiMicrophone } from "react-icons/gi";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { RiHistoryLine, RiPlayListFill } from "react-icons/ri";

const linkClasses = {
  active:
    "hover:text-[#686868] transition duration-150 ease-in-out w-6 h-6 text-white",
  inactive:
    "hover:text-[#686868] transition duration-150 ease-in-out w-6 h-6 text-white",
};

const linkDivClassess = {
  active:
    "cursor-pointer w-full h-24 border-l-4 border-green-500 flex items-center justify-center bg-custom-darkgray",
  inactive:
    "cursor-pointer w-full h-24 border-l-4 border-transparent flex items-center justify-center hover:bg-custom-darkgray",
};
const linkDivClassessMobile = {
  active:
    "cursor-pointer w-full border-t-4 border-green-500 flex items-center justify-center bg-custom-darkgray",
  inactive:
    "cursor-pointer w-full border-t-4 border-transparent flex items-center justify-center hover:bg-custom-darkgray",
};
export default function SideNav({ activeMobile, switchNavSong, track}) {
  const router = useRouter();
  return (
    <>
      {/* <div
        className={`top-auto fixed bottom-0 z-20 w-full  ${
          activeMobile == "nav" && " invisible"
        }`}
      >
        <Player trackUri={track?.trackUri} />
      </div> */}

      {/* Mobile */}
      <div
        className={`w-full flex md:hidden bg-black text-white top-auto fixed bottom-0 right-0 h-[70px] z-50 ${
          activeMobile == "player" && " hidden"
        }`}
      >
        <Link href="/">
          <div
            className={
              router.pathname == "/"
                ? linkDivClassessMobile.active
                : linkDivClassessMobile.inactive
            }
          >
            <AiFillHome
              className={
                router.pathname == "/"
                  ? linkClasses.active
                  : linkClasses.inactive
              }
            />
          </div>
        </Link>
        <Link href="/artists">
          <div
            className={
              router.pathname == "/artists"
                ? linkDivClassessMobile.active
                : linkDivClassessMobile.inactive
            }
          >
            <GiMicrophone
              className={
                router.pathname == "/artists"
                  ? linkClasses.active
                  : linkClasses.inactive
              }
            />
          </div>
        </Link>
        <Link href="/tracks">
          <div
            className={
              router.pathname == "/tracks"
                ? linkDivClassessMobile.active
                : linkDivClassessMobile.inactive
            }
          >
            <BsMusicNoteBeamed
              className={
                router.pathname == "/tracks"
                  ? linkClasses.active
                  : linkClasses.inactive
              }
            />
          </div>
        </Link>
        <Link href="/recent">
          <div
            className={
              router.pathname == "/recent"
                ? linkDivClassessMobile.active
                : linkDivClassessMobile.inactive
            }
          >
            <RiHistoryLine
              className={
                router.pathname == "/recent"
                  ? linkClasses.active
                  : linkClasses.inactive
              }
            />
          </div>
        </Link>
        <Link href="/playlists">
          <div
            className={
              router.pathname == "/playlists"
                ? linkDivClassessMobile.active
                : linkDivClassessMobile.inactive
            }
          >
            <RiPlayListFill
              className={
                router.pathname == "/playlists"
                  ? linkClasses.active
                  : linkClasses.inactive
              }
            />
          </div>
        </Link>

        <img
          onClick={() => switchNavSong}
          className="h-full w-auto cursor-pointer"
          src={track?.albumUrl}
        />
      </div>

      {/* Desktop */}
      <div className="rounded-xl py-4 w-32 h-screen sticky top-0 hidden md:flex flex-col space-y-6 items-center pt-12">
        <div className="mb-12">
          <SiSpotify className="w-14 h-14 text-green-600" />
        </div>
        <div className="w-full flex flex-col items-center">
          <Link href="/">
            <div
              className={
                router.pathname == "/"
                  ? linkDivClassess.active
                  : linkDivClassess.inactive
              }
            >
              <AiFillHome
                className={
                  router.pathname == "/"
                    ? linkClasses.active
                    : linkClasses.inactive
                }
              />
            </div>
          </Link>
          <Link href="/artists">
            <div
              className={
                router.pathname == "/artists"
                  ? linkDivClassess.active
                  : linkDivClassess.inactive
              }
            >
              <GiMicrophone
                className={
                  router.pathname == "/artists"
                    ? linkClasses.active
                    : linkClasses.inactive
                }
              />
            </div>
          </Link>
          <Link href="/tracks">
            <div
              className={
                router.pathname == "/tracks"
                  ? linkDivClassess.active
                  : linkDivClassess.inactive
              }
            >
              <BsMusicNoteBeamed
                className={
                  router.pathname == "/tracks"
                    ? linkClasses.active
                    : linkClasses.inactive
                }
              />
            </div>
          </Link>
          <Link href="/recent">
            <div
              className={
                router.pathname == "/recent"
                  ? linkDivClassess.active
                  : linkDivClassess.inactive
              }
            >
              <RiHistoryLine
                className={
                  router.pathname == "/recent"
                    ? linkClasses.active
                    : linkClasses.inactive
                }
              />
            </div>
          </Link>
          <Link href="/playlists">
            <div
              className={
                router.pathname == "/playlists"
                  ? linkDivClassess.active
                  : linkDivClassess.inactive
              }
            >
              <RiPlayListFill
                className={
                  router.pathname == "/playlists"
                    ? linkClasses.active
                    : linkClasses.inactive
                }
              />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
