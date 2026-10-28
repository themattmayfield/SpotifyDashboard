import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import {
  IoCalendarClearOutline,
  IoHomeOutline,
  IoListOutline,
  IoMicOutline,
  IoMusicalNotes,
  IoMusicalNotesOutline,
  IoPeopleOutline,
  IoPieChartOutline,
  IoTimeOutline,
} from 'react-icons/io5';
import { SiSpotify } from 'react-icons/si';

import SideNavLink from '@/components/SideNavLink';
import { formatCount } from '@/lib/format';
import { spotifyQueries } from '@/lib/queries';
import UserMenu from './Nav/UserMenu';

const libraryItems = [
  { path: '/', label: 'Home', Icon: IoHomeOutline },
  { path: '/artists', label: 'Artists', Icon: IoMicOutline },
  { path: '/tracks', label: 'Tracks', Icon: IoMusicalNotesOutline },
  { path: '/recentTracks', label: 'Recent', Icon: IoTimeOutline },
  { path: '/playlists', label: 'Playlists', Icon: IoListOutline },
] as const;

const insightItems = [
  { path: '/recap', label: 'Recap', Icon: IoCalendarClearOutline },
  { path: '/taste', label: 'Taste', Icon: IoPieChartOutline },
  { path: '/compare', label: 'Compare', Icon: IoPeopleOutline },
] as const;

const allItems = [...libraryItems, ...insightItems];

export default function SideNav() {
  return (
    <>
      <nav
        className="hidden w-[248px] shrink-0 flex-col border-r border-separator bg-sidebar px-3 pb-3 pt-6 lg:flex"
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className="mb-7 flex items-center gap-2.5 px-3 text-[21px] font-semibold tracking-[-0.02em]"
        >
          <SiSpotify className="h-6 w-6" />
          AuxCheck
        </Link>
        <div className="flex flex-col gap-0.5">
          {libraryItems.map((item) => (
            <SideNavLink key={item.path} variant="sidebar" {...item} />
          ))}
        </div>
        <GroupLabel>Insights</GroupLabel>
        <div className="flex flex-col gap-0.5">
          {insightItems.map((item) => (
            <SideNavLink key={item.path} variant="sidebar" {...item} />
          ))}
        </div>
        <SidebarPlaylists />
        <div className="mt-auto border-t border-separator pt-3">
          <UserMenu variant="row" />
        </div>
      </nav>
      <nav
        className="glass fixed inset-x-0 bottom-0 z-50 border-t border-separator pb-[env(safe-area-inset-bottom)] lg:hidden"
        aria-label="Main navigation"
      >
        <div className="no-scrollbar grid h-[60px] auto-cols-[minmax(64px,1fr)] grid-flow-col overflow-x-auto">
          {allItems.map((item) => (
            <SideNavLink key={item.path} variant="tabbar" {...item} />
          ))}
        </div>
      </nav>
    </>
  );
}

function GroupLabel({ children }: { children: string }) {
  return (
    <h2 className="mb-1.5 mt-6 px-3 text-[12px] font-medium text-label-tertiary">
      {children}
    </h2>
  );
}

function SidebarPlaylists() {
  const { data } = useQuery(spotifyQueries.playlists());
  if (!data?.length) return null;
  return (
    <>
      <GroupLabel>Your playlists</GroupLabel>
      <div className="no-scrollbar -mx-1 flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-1 pb-3">
        {data.map((playlist) => (
          <Link
            key={playlist.id}
            to="/playlists/$id"
            params={{ id: playlist.id }}
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-fill"
            activeProps={{ className: 'bg-fill-strong' }}
          >
            {playlist.image ? (
              <img
                src={playlist.image}
                alt=""
                loading="lazy"
                className="h-9 w-9 shrink-0 rounded-md bg-fill object-cover"
              />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-fill-strong">
                <IoMusicalNotes className="h-4 w-4 text-label-tertiary" />
              </span>
            )}
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-medium">
                {playlist.name}
              </span>
              {playlist.trackCount !== null && (
                <span className="block truncate text-[11px] text-label-tertiary">
                  {formatCount(playlist.trackCount, 'song')}
                </span>
              )}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
