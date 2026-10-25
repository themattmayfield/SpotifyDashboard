import { Link, useRouterState } from '@tanstack/react-router';
import { type ReactNode, useEffect, useRef } from 'react';

export default function SideNavLink({
  path,
  label,
  children,
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
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const active = path === '/' ? pathname === '/' : pathname.startsWith(path);
  useEffect(() => {
    if (active && window.innerWidth < 1024)
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
  }, [active]);
  return (
    <Link
      ref={ref}
      to={path}
      aria-label={label}
      title={label}
      activeOptions={{ exact: path === '/' }}
      activeProps={{ className: 'border-spotify-green bg-custom-darkgray' }}
      inactiveProps={{
        className: 'border-transparent hover:bg-custom-darkgray',
      }}
      className="group z-10 flex w-full cursor-pointer flex-col items-center justify-center border-t-4 lg:h-24 lg:border-l-4 lg:border-t-0"
    >
      {children}
    </Link>
  );
}
