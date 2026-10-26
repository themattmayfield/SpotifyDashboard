import { Link, useRouterState } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import type { IconType } from 'react-icons';

import { cn } from '@/lib/cn';

export default function SideNavLink({
  path,
  label,
  Icon,
  variant,
}: {
  path:
    | '/'
    | '/artists'
    | '/tracks'
    | '/recentTracks'
    | '/playlists'
    | '/compare'
    | '/taste'
    | '/recap';
  label: string;
  Icon: IconType;
  variant: 'sidebar' | 'tabbar';
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const active = path === '/' ? pathname === '/' : pathname.startsWith(path);
  useEffect(() => {
    if (active && variant === 'tabbar' && window.innerWidth < 1024)
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
  }, [active, variant]);
  return (
    <Link
      ref={ref}
      to={path}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'transition duration-200 ease-out',
        variant === 'sidebar'
          ? 'flex h-10 items-center gap-3 rounded-xl px-3 text-[14px]'
          : 'flex flex-col items-center justify-center gap-1 text-[10px] font-medium',
        variant === 'sidebar' &&
          (active
            ? 'bg-fill-strong font-medium text-label'
            : 'text-label-secondary hover:bg-fill hover:text-label'),
        variant === 'tabbar' && (active ? 'text-label' : 'text-white/40')
      )}
    >
      <Icon
        className={cn(
          'pointer-events-none shrink-0',
          variant === 'sidebar' ? 'h-[19px] w-[19px]' : 'h-6 w-6'
        )}
      />
      <span>{label}</span>
    </Link>
  );
}
