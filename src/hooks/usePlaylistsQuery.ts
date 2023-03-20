import useSpotify from '@/lib/useSpotify';
import { useQuery } from '@tanstack/react-query';

const usePlaylistsQuery = () => {
  const spotifyApi = useSpotify();
  return useQuery({
    queryKey: ['playlists'],
    queryFn: () => {
      return spotifyApi.getUserPlaylists().then(({ body }: any) => body.items);
    },
    onError: (error) => {
      console.log('error: ', error);
    },
    enabled: !!spotifyApi.getAccessToken(),
  });
};

export default usePlaylistsQuery;
