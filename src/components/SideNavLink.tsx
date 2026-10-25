import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

export default function SideNavLink({
  path,
  label,
  children,
}: {
  path: '/' | '/artists' | '/tracks' | '/recentTracks' | '/playlists';
  label: string;
  children: ReactNode;
}) {
  return (
    <Link
      to={path}
      aria-label={label}
      title={label}
      activeOptions={{ exact: path === '/' }}
      activeProps={{ className: 'border-spotify-green bg-custom-darkgray' }}
      inactiveProps={{
        className: 'border-transparent hover:bg-custom-darkgray',
      }}
      className="group z-10 flex w-full cursor-pointer items-center justify-center border-t-4 lg:h-24 lg:border-l-4 lg:border-t-0"
    >
      {children}
    </Link>
  );
}
