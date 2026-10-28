import { useSuspenseQuery } from '@tanstack/react-query';
import { type ReactNode, useEffect, useState } from 'react';
import { IoChevronDown, IoPersonCircle } from 'react-icons/io5';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { logout } from '@/lib/auth';
import { cn } from '@/lib/cn';
import { deleteWrapperData } from '@/lib/persistence';
import { spotifyQueries } from '@/lib/queries';

const rowClassName =
  'flex h-10 w-full items-center justify-between rounded-xl px-3 text-left text-[14px] transition hover:bg-fill-strong';

export default function UserMenu({ variant }: { variant: 'avatar' | 'row' }) {
  const { data: user } = useSuspenseQuery(spotifyQueries.me());
  const [isOpen, setIsOpen] = useState(false);
  const [previews, setPreviews] = useState(true);
  useEffect(
    () => setPreviews(localStorage.getItem('hover-previews') !== 'off'),
    []
  );
  const togglePreviews = () => {
    setPreviews(!previews);
    localStorage.setItem('hover-previews', previews ? 'off' : 'on');
  };
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {variant === 'avatar' ? (
          <button
            type="button"
            aria-label="Account menu"
            className="flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <Avatar image={user.image} name={user.name} className="h-8 w-8" />
          </button>
        ) : (
          <button
            type="button"
            aria-label="Account menu"
            className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-fill focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <Avatar image={user.image} name={user.name} className="h-8 w-8" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium">
                {user.name}
              </span>
              <span className="block text-[11px] text-label-tertiary">
                Account
              </span>
            </span>
            <IoChevronDown className="h-4 w-4 text-label-tertiary" />
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent
        align={variant === 'avatar' ? 'end' : 'start'}
        side={variant === 'avatar' ? 'bottom' : 'top'}
      >
        <div className="flex items-center gap-3 px-3 pb-3 pt-2.5">
          <Avatar image={user.image} name={user.name} className="h-10 w-10" />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold">
              Hello {user.name} 👋🏿
            </p>
            <p className="text-[12px] text-label-secondary">
              Hope you enjoy exploring your favorites
            </p>
          </div>
        </div>
        <Separator />
        <button
          type="button"
          role="switch"
          aria-checked={previews}
          onClick={togglePreviews}
          className={rowClassName}
        >
          Hover previews
          <span
            className={cn(
              'relative h-[22px] w-[38px] rounded-full transition-colors duration-200',
              previews ? 'bg-system-green' : 'bg-white/20'
            )}
          >
            <span
              className={cn(
                'absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white shadow transition-transform duration-200',
                previews ? 'translate-x-[18px]' : 'translate-x-[2px]'
              )}
            />
          </span>
        </button>
        <a
          href="https://ko-fi.com/P5P21JZUH"
          target="_blank"
          rel="noreferrer"
          className={rowClassName}
        >
          Buy me a coffee
          <span aria-hidden>☕</span>
        </a>
        <Separator />
        <form action={logout.url} method="post">
          <button className={rowClassName} type="submit">
            Log out
          </button>
        </form>
        <MenuDanger
          onClick={async () => {
            if (confirm('Delete all data AuxCheck has stored for you?')) {
              await deleteWrapperData();
              setIsOpen(false);
            }
          }}
        >
          Delete my AuxCheck data
        </MenuDanger>
      </PopoverContent>
    </Popover>
  );
}

function MenuDanger({
  onClick,
  children,
}: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(rowClassName, 'text-system-red')}
    >
      {children}
    </button>
  );
}

function Separator() {
  return <div className="mx-3 my-1 h-px bg-separator" />;
}

function Avatar({
  image,
  name,
  className,
}: { image: string | null; name: string; className: string }) {
  return image ? (
    <img
      src={image}
      alt={name}
      className={cn(
        'shrink-0 rounded-full object-cover ring-1 ring-white/10',
        className
      )}
    />
  ) : (
    <IoPersonCircle className={cn('shrink-0 text-label-tertiary', className)} />
  );
}
