import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { IoMusicalNotesSharp } from 'react-icons/io5';

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
      className="group flex min-w-0 flex-col text-center"
    >
      <PlaylistCover
        image={playlist.image}
        className="transition duration-300 ease-in-out group-hover:scale-105"
      />
      <p className="mt-4 truncate text-white">{playlist.name}</p>
      {playlist.trackCount !== null && (
        <p className="text-xs uppercase text-custom-muted">
          {formatCount(playlist.trackCount, 'track')}
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
        'flex aspect-square w-full items-center justify-center overflow-hidden bg-custom-darkgray',
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
        <IoMusicalNotesSharp className="h-1/3 w-1/3 text-white" />
      )}
    </div>
  );
}

export function PlaylistsSkeleton({ count }: { count: number }) {
  return Array.from({ length: count }, (_, index) => (
    <div key={index} className="flex flex-col items-center">
      <Skeleton className="aspect-square w-full rounded-none" />
      <Skeleton className="mt-4 h-5 w-2/3" />
      <Skeleton className="mt-1 h-3 w-1/4" />
    </div>
  ));
}
