import FollowButton from '@/components/FollowButton';
import ArtistLoading from '@/components/Loading/ArtistLoading';
import { spotifyQueries } from '@/lib/queries';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import numeral from 'numeral';

export const Route = createFileRoute('/_spotify/artists/$id')({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(spotifyQueries.artist(params.id)),
      context.queryClient.ensureQueryData(spotifyQueries.following(params.id)),
    ]),
  component: Page,
  pendingComponent: ArtistLoading,
});
function Page() {
  const { id } = Route.useParams();
  const { data: artistData } = useSuspenseQuery(spotifyQueries.artist(id));
  return (
    <div className="flex flex-col items-center text-center text-white pt-10 md:pt-24 space-y-4 md:space-y-8 no-scrollbar">
      <div
        className="rounded-full bg-cover bg-center w-40 h-40 md:w-80 md:h-80"
        style={{ backgroundImage: `url(${artistData.images[0]?.url})` }}
      />
      <p className="text-4xl md:text-7xl">{artistData.name}</p>
      <FollowButton id={id} />
      <div className="flex space-x-12 items-center justify-center">
        <div>
          <p className="text-xl md:text-3xl">
            {numeral(artistData.followers.total).format('0,0')}
          </p>
          <p className="text-sm text-[#565656]">Followers</p>
        </div>
        <div>
          <p className="text-xl md:text-3xl">{artistData.popularity}%</p>
          <p className="text-sm text-[#565656]">Popularity</p>
        </div>
      </div>
    </div>
  );
}
