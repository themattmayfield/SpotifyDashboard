import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { IoMusicalNotes } from 'react-icons/io5';

import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';
import { formatCount } from '@/lib/format';
import { spotifyQueries } from '@/lib/queries';
import type { Playlist } from '@/types';

export function UserPlaylists() {
  const { data } = useSuspenseQuery(spotifyQueries.playlists());
  if (!data.length) return <EmptyState />;
  return data.map((playlist) => (
    <PlaylistCard key={playlist.id} playlist={playlist} />
  ));
}

function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <Link
      to="/playlists/$id"
      params={{ id: playlist.id }}
      className="group flex min-w-0 flex-col"
    >
      <PlaylistCover
        image={playlist.image}
        className="transition duration-500 ease-out group-hover:scale-[1.02] group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
      />
      <p className="mt-3 truncate text-[15px] font-medium">{playlist.name}</p>
      {playlist.trackCount !== null && (
        <p className="text-[13px] text-label-secondary">
          {formatCount(playlist.trackCount, 'song')}
        </p>
      )}
    </Link>
  );
}

export function PlaylistCover({
  image,
  className,
}: { image: string | null; className?: string }) {
  return (
    <div
      className={cn(
        'relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-fill-strong shadow-[0_8px_30px_rgba(0,0,0,0.35)]',
        className
      )}
    >
      {image ? (
        <img
          src={image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <IoMusicalNotes className="h-1/4 w-1/4 text-label-tertiary" />
      )}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/[0.08]" />
    </div>
  );
}

export function PlaylistsSkeleton({ count }: { count: number }) {
  return Array.from({ length: count }, (_, index) => (
    <div key={index} className="flex flex-col">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <Skeleton className="mt-3 h-4 w-2/3 rounded-md" />
      <Skeleton className="mt-1.5 h-3 w-1/4 rounded-md" />
    </div>
  ));
}
