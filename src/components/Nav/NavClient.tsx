'use client';
import { Popover, Transition } from '@headlessui/react';
import { signOut } from 'next-auth/react';
import React, { Fragment } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';
import { RiUser6Fill } from 'react-icons/ri';

const Nav = ({ user }: { user: SpotifyApi.CurrentUsersProfileResponse }) => {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button className="rounded-full h-10 lg:h-16 bg-custom-darkgray flex justify-between items-center space-x-2 lg:space-x-3 focus:outline-none">
            <AiFillCaretDown className="h-4 w-4 ml-4 text-[#686868]" />
            {/* {user && ( */}
            <>
              {user?.images?.length ? (
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
          </Popover.Button>
          <Popover.Overlay
            className={`${
              open ? 'opacity-90 fixed inset-0' : 'opacity-0'
            } bg-black`}
          />
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel
              static
              className="absolute z-10 w-screen max-w-sm px-4 mt-3 transform translate-x-1/4 right-20 lg:right-24 sm:px-0 "
            >
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-custom-darkgray">
                <div className="p-4">
                  <a
                    href="https://ko-fi.com/P5P21JZUH"
                    target="_blank"
                    className="cursor-pointer flow-root px-2 text-white py-2 transition duration-150 ease-in-out rounded-md hover:bg-[rgb(24,24,24)] focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                  >
                    Enjoying Spotify Dashboard?
                    <span className="text-gray-400"> Buy me a ☕</span>
                  </a>
                  <a
                    onClick={() => signOut()}
                    target="_blank"
                    className="cursor-pointer flow-root px-2 text-white py-2 transition duration-150 ease-in-out rounded-md hover:bg-[rgb(24,24,24)] focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                  >
                    Logout
                  </a>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default Nav;
