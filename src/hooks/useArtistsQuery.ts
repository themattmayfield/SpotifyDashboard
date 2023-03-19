import spotifyApi from '@/lib/spotify';
import { TTimeRange } from '@/types';
import { useQuery } from '@tanstack/react-query';

const getData = async (time_range: string) => {
  const { body } = await spotifyApi
    .getMyTopArtists({
      limit: 50,
      time_range,
    })
    .then((data: any) => data);

  return body;
};

type UseArtistsQueryProps = {
  time_range: TTimeRange;
};

const useArtistsQuery = ({ time_range }: UseArtistsQueryProps) => {
  return useQuery(
    ['artists', time_range],
    () => getData(time_range).then((data) => data.items),
    {
      onError: (error) => {
        console.log('error: ', error);
      },
    }
  );
};

export default useArtistsQuery;
