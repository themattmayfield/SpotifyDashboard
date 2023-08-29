'use client';

import { signOut } from 'next-auth/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { AiFillCaretDown } from 'react-icons/ai';
import { RiUser6Fill } from 'react-icons/ri';
import { useState } from 'react';
const Nav = ({ user }: { user: SpotifyApi.CurrentUsersProfileResponse }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {isOpen && (
        <div className="bg-spotify-black/50 w-screen h-screen absolute" />
      )}
      <Popover
        open={isOpen}
        onOpenChange={() => setIsOpen((prevState) => !prevState)}
      >
        <PopoverTrigger asChild>
          <button className="rounded-full h-10 lg:h-16 bg-custom-darkgray flex justify-between items-center space-x-2 lg:space-x-3 focus:outline-none">
            <AiFillCaretDown className="h-4 w-4 ml-4 text-[#686868]" />
            {/* {user && ( */}
            <>
              {user?.images?.[0]?.url ? (
                <img
                  className="h-10 w-10 lg:h-16 lg:w-16 rounded-full"
                  src={user.images[0].url}
                />
              ) : (
                <div className="bg-custom-darkgray h-10 w-10 lg:h-16 lg:w-16 rounded-full py-2 pr-4 lg:py-4 lg:pr-5">
                  <RiUser6Fill className="text-[#686868] h-full w-full" />
                </div>
              )}
            </>
            {/* )} */}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="bg-custom-darkgray border-0 ring-4 ring-black ring-opacity-5 max-w-sm"
          align="end"
        >
          <div className="flex flex-col space-y-2 text-left text-gray-400">
            <h3 className="text-lg font-semibold text-white">Hello 👋🏿</h3>
            <p className="text-gray-500">
              Hope you enjoy exploring your Spotify favorites
            </p>
            <a
              href="https:ko-fi.com/P5P21JZUH"
              target="_blank"
              className="text-sm animate-bounce hover:underline cursor-pointer text-gray-400"
            >
              Support me by buy me a ☕
            </a>
            <a
              onClick={() => signOut()}
              target="_blank"
              className="text-sm cursor-pointer hover:text-white text-red-600"
            >
              Logout
            </a>
          </div>
        </PopoverContent>
      </Popover>
    </>
    // <Popover className="relative">
    //   {({ open }) => (
    //     <>
    //       <Popover.Button className="rounded-full h-10 lg:h-16 bg-custom-darkgray flex justify-between items-center space-x-2 lg:space-x-3 focus:outline-none">
    //         <AiFillCaretDown className="h-4 w-4 ml-4 text-[#686868]" />
    //         {/* {user && ( */}
    //         <>
    //           {user?.images?.[0]?.url ? (
    //             <img
    //               className="h-10 w-10 lg:h-16 lg:w-16 rounded-full"
    //               src={user.images[0].url}
    //             />
    //           ) : (
    //             <div className="bg-custom-darkgray h-10 w-10 lg:h-16 lg:w-16 rounded-full py-2 pr-4 lg:py-4 lg:pr-5">
    //               <RiUser6Fill className="text-[#686868] h-full w-full" />
    //             </div>
    //           )}
    //         </>
    //         {/* )} */}
    //       </Popover.Button>
    //       <Popover.Overlay
    //         className={`${
    //           open
    //             ? 'opacity-90 fixed inset-0 pointer-events-none'
    //             : 'opacity-0'
    //         } bg-spotify-black`}
    //       />
    //       <Transition
    //         show={open}
    //         as={Fragment}
    //         enter="transition ease-out duration-200"
    //         enterFrom="opacity-0 translate-y-1"
    //         enterTo="opacity-100 translate-y-0"
    //         leave="transition ease-in duration-150"
    //         leaveFrom="opacity-100 translate-y-0"
    //         leaveTo="opacity-0 translate-y-1"
    //       >
    //         <Popover.Panel
    //           static
    //           className="absolute z-10 w-screen max-w-sm px-4 mt-3 transform translate-x-1/4 right-20 lg:right-24 sm:px-0 "
    //         >
    //           <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-custom-darkgray">
    //             <div className="p-4">
    //               <a
    //                 href="https://ko-fi.com/P5P21JZUH"
    //                 target="_blank"
    //                 className="cursor-pointer flow-root px-2 text-white py-2 transition duration-150 ease-in-out rounded-md hover:bg-[rgb(24,24,24)] focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
    //               >
    //                 Enjoying Spotify Dashboard?
    //                 <span className="text-gray-400"> Buy me a ☕</span>
    //               </a>
    //               <a
    //                 onClick={() => signOut()}
    //                 target="_blank"
    //                 className="cursor-pointer flow-root px-2 text-white py-2 transition duration-150 ease-in-out rounded-md hover:bg-[rgb(24,24,24)] focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
    //               >
    //                 Logout
    //               </a>
    //             </div>
    //           </div>
    //         </Popover.Panel>
    //       </Transition>
    //     </>
    //   )}
    // </Popover>
  );
};

export default Nav;
