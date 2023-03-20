import useSpotify from '@/lib/useSpotify';
import { useQuery } from '@tanstack/react-query';

const useRecentlyPlayedQuery = () => {
  const spotifyApi = useSpotify();
  return useQuery({
    queryKey: ['recentlyPlayed'],
    queryFn: () =>
      spotifyApi
        .getMyRecentlyPlayedTracks({ limit: 50 })
        .then(({ body }: any) => body.items),
    onError: (error) => {
      console.log('error: ', error);
    },
    enabled: !!spotifyApi.getAccessToken(),
  });
};

export default useRecentlyPlayedQuery;
