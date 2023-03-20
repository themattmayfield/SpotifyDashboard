import useSpotify from '@/lib/useSpotify';
import { TTimeRange } from '@/types';
import { useQuery } from '@tanstack/react-query';

type UseTracksQueryProps = {
  time_range: TTimeRange;
};

const useTracksQuery = ({ time_range }: UseTracksQueryProps) => {
  const spotifyApi = useSpotify();
  return useQuery({
    queryKey: ['tracks', time_range],
    queryFn: () =>
      spotifyApi
        .getMyTopTracks({ limit: 50, time_range })
        .then(({ body }: any) => body.items),
    onError: (error) => {
      console.log('error: ', error);
    },
    enabled: !!spotifyApi.getAccessToken(),
  });
};

export default useTracksQuery;
