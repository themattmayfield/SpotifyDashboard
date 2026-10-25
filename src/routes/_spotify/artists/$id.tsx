import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { spotifyQuery } from '@/lib/queries';
import FollowButton from '@/components/FollowButton';
import numeral from 'numeral';
import { Skeleton } from '@/components/ui/skeleton';
export const Route = createFileRoute('/_spotify/artists/$id')({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(
        spotifyQuery('artist', { id: params.id })
      ),
      context.queryClient.ensureQueryData(
        spotifyQuery('following', { id: params.id })
      ),
    ]),
  component: Page,
  pendingComponent: Loading,
});
function Page() {
  const { id } = Route.useParams();
  const { data: artistData } = useSuspenseQuery(spotifyQuery('artist', { id }));
  const { data: following } = useSuspenseQuery(
    spotifyQuery('following', { id })
  );
  const artist = artistData as SpotifyApi.SingleArtistResponse;
  return (
    <div className="flex flex-col items-center text-center text-white pt-10 md:pt-24 space-y-4 md:space-y-8 no-scrollbar">
      <div
        className="rounded-full bg-cover bg-center w-40 h-40 md:w-80 md:h-80"
        style={{ backgroundImage: `url(${artist.images[0]?.url})` }}
      />
      <p className="text-4xl md:text-7xl">{artist.name}</p>
      <FollowButton isFollowingArtist={!!following} id={id} />
      <div className="flex space-x-12 items-center justify-center">
        <div>
          <p className="text-xl md:text-3xl">
            {numeral(artist.followers.total).format('0,0')}
          </p>
          <p className="text-sm text-[#565656]">Followers</p>
        </div>
        <div>
          <p className="text-xl md:text-3xl">{artist.popularity}%</p>
          <p className="text-sm text-[#565656]">Popularity</p>
        </div>
      </div>
    </div>
  );
}
function Loading() {
  return (
    <div className="flex flex-col items-center text-center pt-10 md:pt-24 space-y-4 md:space-y-8 no-scrollbar">
      <Skeleton className="rounded-full w-40 h-40 md:w-80 md:h-80" />
      <Skeleton className="h-10 md:h-[72px]" />
    </div>
  );
}
