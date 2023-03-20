import useSpotify from '@/lib/useSpotify';
import { TTimeRange } from '@/types';
import { useQuery } from '@tanstack/react-query';

type UseArtistsQueryProps = {
  time_range: TTimeRange;
};

const useArtistsQuery = ({ time_range }: UseArtistsQueryProps) => {
  const spotifyApi = useSpotify();
  return useQuery({
    queryKey: ['artists', time_range],
    queryFn: () =>
      spotifyApi
        .getMyTopArtists({ limit: 50, time_range })
        .then(({ body }: any) => body.items),
    onError: (error) => {
      console.log('error: ', error);
    },
    enabled: !!spotifyApi.getAccessToken(),
  });
};

export default useArtistsQuery;
