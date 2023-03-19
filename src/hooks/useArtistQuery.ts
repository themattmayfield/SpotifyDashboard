import spotifyApi from '@/lib/spotify';
import { useQuery } from '@tanstack/react-query';

const getData = async (id: string) => {
  const { body } = await spotifyApi.getArtist(id).then((data: any) => data);
  return body;
};

const useArtistQuery = ({ id }: { id: string }) => {
  return useQuery(['artist', id], () => getData(id).then((data) => data), {
    onError: (error) => {
      console.log('error: ', error);
    },
  });
};

export default useArtistQuery;
