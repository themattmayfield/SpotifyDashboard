import spotifyApi from '@/lib/spotify';
import { dehydrate, Hydrate } from '@tanstack/react-query';
import getQueryClient from '../getQueryClient';
import ArtistCards from './ArtistCards';

export default async function HydratedArtists() {
  // const queryClient = getQueryClient();
  // await queryClient.prefetchQuery(
  //   ['artists'],
  //   spotifyApi.getMyTopArtists({
  //     limit: 50,
  //     time_range: 'long_term',
  //   })
  // );
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <ArtistCards />
    </Hydrate>
  );
}
