import useSpotify from '@/lib/useSpotify';
import { useQuery } from '@tanstack/react-query';

const useIsFollowingArtist = ({ id }: { id: string }) => {
  const spotifyApi = useSpotify();
  return useQuery({
    queryKey: ['isFollowingArtist', id],
    queryFn: () =>
      spotifyApi.isFollowingArtists([id]).then(({ body }: any) => body),
    onError: (error) => {
      console.log('error: ', error);
    },
    enabled: !!spotifyApi.getAccessToken(),
  });
};

export default useIsFollowingArtist;
