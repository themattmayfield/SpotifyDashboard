import { useEffect, useState } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';
import { RiUser6Fill } from 'react-icons/ri';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { logout } from '@/lib/auth';
import { deleteWrapperData } from '@/lib/persistence';
import type { User } from '@/types';

export default function UserMenu({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const [previews, setPreviews] = useState(true);
  useEffect(
    () => setPreviews(localStorage.getItem('hover-previews') !== 'off'),
    []
  );
  return (
    <>
      {isOpen && (
        <div className="absolute inset-0 h-screen w-screen min-w-max bg-spotify-black/80" />
      )}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Account menu"
            className="flex h-10 items-center justify-between space-x-2 rounded-full bg-custom-darkgray focus:outline-none lg:h-16 lg:space-x-3"
          >
            <AiFillCaretDown className="ml-4 h-4 w-4 text-custom-lightgray" />
            {user.image ? (
              <img
                className="h-10 w-10 rounded-full lg:h-16 lg:w-16"
                src={user.image}
                alt={user.name}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-custom-darkgray py-2 pr-4 lg:h-16 lg:w-16 lg:py-4 lg:pr-5">
                <RiUser6Fill className="h-full w-full text-custom-lightgray" />
              </div>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="max-w-sm border-0 bg-custom-darkgray ring-4 ring-black ring-opacity-5"
          align="end"
        >
          <div className="flex flex-col space-y-2 text-left text-gray-400">
            <h3 className="text-lg font-semibold text-white">
              Hello {user.name} 👋🏿
            </h3>
            <p className="text-gray-500">
              Hope you enjoy exploring your Spotify favorites
            </p>
            <label className="flex items-center gap-2 text-sm text-white">
              <input
                type="checkbox"
                checked={previews}
                onChange={(event) => {
                  setPreviews(event.target.checked);
                  localStorage.setItem(
                    'hover-previews',
                    event.target.checked ? 'on' : 'off'
                  );
                }}
              />{' '}
              Hover previews
            </label>
            <a
              href="https://ko-fi.com/P5P21JZUH"
              target="_blank"
              className="animate-bounce cursor-pointer text-sm text-gray-400 hover:underline"
              rel="noreferrer"
            >
              Support me by buy me a ☕
            </a>
            <form action={logout.url} method="post">
              <button
                className="cursor-pointer text-sm text-red-600 hover:text-red-400"
                type="submit"
              >
                Logout
              </button>
            </form>
            <button
              className="text-left text-sm text-red-600 hover:text-red-400"
              type="button"
              onClick={async () => {
                if (confirm('Delete all data Wrapper has stored for you?')) {
                  await deleteWrapperData();
                  setIsOpen(false);
                }
              }}
            >
              Delete my Wrapper data
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
