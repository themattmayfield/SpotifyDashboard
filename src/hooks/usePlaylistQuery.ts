import useSpotify from '@/lib/useSpotify';
import { useQuery } from '@tanstack/react-query';

const usePlaylistQuery = (id: string, opts?: any) => {
  const spotifyApi = useSpotify();
  return useQuery({
    queryKey: ['playlist', id],
    queryFn: () => spotifyApi.getPlaylist(id).then(({ body }) => body),
    onError: (error) => {
      console.log('error: ', error);
    },
    enabled: !!spotifyApi.getAccessToken() && !!id,
    ...opts,
  });
};

export default usePlaylistQuery;
