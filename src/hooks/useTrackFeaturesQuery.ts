import useSpotify from '@/lib/useSpotify';
import { useQuery } from '@tanstack/react-query';

const useTrackFeaturesQuery = ({ id }: { id: string }) => {
  const spotifyApi = useSpotify();
  return useQuery({
    queryKey: ['trackFeatures', id],
    queryFn: () => {
      return spotifyApi
        .getAudioFeaturesForTrack(id)
        .then(({ body }: any) => body);
    },
    onError: (error) => {
      console.log('error: ', error);
    },
    enabled: !!spotifyApi.getAccessToken(),
  });
};

export default useTrackFeaturesQuery;
