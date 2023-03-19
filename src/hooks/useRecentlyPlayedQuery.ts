import spotifyApi from '@/lib/spotify';
import { useQuery } from '@tanstack/react-query';

const getData = async () => {
  const { body } = await spotifyApi
    .getMyRecentlyPlayedTracks({
      limit: 50,
    })
    .then((data: any) => data);

  return body;
};

const useRecentlyPlayedQuery = () => {
  return useQuery(
    ['recentlyPlayed'],
    () => getData().then((data) => data.items),
    {
      onError: (error) => {
        console.log('error: ', error);
      },
    }
  );
};

export default useRecentlyPlayedQuery;
