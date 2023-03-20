import useSpotify from '@/lib/useSpotify';
import { useQuery } from '@tanstack/react-query';

const useArtistQuery = ({ id }: { id: string }) => {
  const spotifyApi = useSpotify();
  return useQuery({
    queryKey: ['artist', id],
    queryFn: () => spotifyApi.getArtist(id).then(({ body }: any) => body),
    onError: (error) => {
      console.log('error: ', error);
    },
    enabled: !!spotifyApi.getAccessToken(),
  });
};

export default useArtistQuery;
