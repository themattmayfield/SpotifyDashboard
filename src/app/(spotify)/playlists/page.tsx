import { Suspense } from 'react';

import PlaylistLoading from '@/components/Loading/PlaylistLoading';
import PageRangeHeader from '@/components/PageRangeHeader';
import { PageWrapper } from '@/components/PageWrapper';
import { UserPlaylists } from '@/components/Playlist';

export default async function Playlists() {
  return (
    <PageWrapper>
      <PageRangeHeader title="Playlists" />

      <div className="px-2 grid grid-cols-2 place-items-center lg:grid-cols-3 2xl:grid-cols-5 gap-2 md:gap-6 no-scrollbar mb-[150px]">
        <Suspense fallback={<PlaylistLoading count={50} />}>
          <UserPlaylists />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
