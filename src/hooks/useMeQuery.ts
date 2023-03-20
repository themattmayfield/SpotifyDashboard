import useSpotify from '@/lib/useSpotify';
import { useQuery } from '@tanstack/react-query';

const useTracksQuery = () => {
  const spotifyApi = useSpotify();
  return useQuery({
    queryKey: ['me'],
    queryFn: () => spotifyApi.getMe().then(({ body }: any) => body),
    onError: (error) => {
      console.log('error: ', error);
    },
    enabled: !!spotifyApi.getAccessToken(),
  });
};

export default useTracksQuery;
