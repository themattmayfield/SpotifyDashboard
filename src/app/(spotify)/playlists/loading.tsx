import PlaylistLoading from '@/components/Loading/PlaylistLoading';
import PageRangeHeader from '@/components/PageRangeHeader';
import { PageWrapper } from '@/components/PageWrapper';

export default function Loading() {
  return (
    <PageWrapper>
      <PageRangeHeader title="Playlists" />
      <div className="px-2 grid grid-cols-2 place-items-center lg:grid-cols-3 2xl:grid-cols-5 gap-2 md:gap-6 no-scrollbar mb-[150px]">
        <PlaylistLoading count={50} />
      </div>
    </PageWrapper>
  );
}
