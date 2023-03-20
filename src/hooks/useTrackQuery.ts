import useSpotify from '@/lib/useSpotify';
import { useQuery } from '@tanstack/react-query';

const useTrackQuery = (id) => {
  const spotifyApi = useSpotify();
  return useQuery({
    queryKey: ['track', id],
    queryFn: () => spotifyApi.getTrack(id).then(({ body }) => body),
    onError: (error) => {
      console.log('error: ', error);
    },
    enabled: !!spotifyApi.getAccessToken(),
  });
};

export default useTrackQuery;
