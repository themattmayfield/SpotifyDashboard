'use client';

import { useState } from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { logout } from '@/lib/auth';
import { AiFillCaretDown } from 'react-icons/ai';
import { RiUser6Fill } from 'react-icons/ri';

const Nav = ({ user }: { user: SpotifyApi.CurrentUsersProfileResponse }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {isOpen && (
        <div className="bg-spotify-black/80 w-screen h-screen absolute min-w-max inset-0" />
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
              href="https://ko-fi.com/P5P21JZUH"
              target="_blank"
              className="text-sm animate-bounce hover:underline cursor-pointer text-gray-400"
            >
              Support me by buy me a ☕
            </a>
            <form action={logout}>
              <button
                className="text-sm cursor-pointer hover:text-red-400 text-red-600"
                type="submit"
              >
                Logout
              </button>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default Nav;
