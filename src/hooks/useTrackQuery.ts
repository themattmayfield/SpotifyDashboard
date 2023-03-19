import spotifyApi from '@/lib/spotify';
import { useQuery } from '@tanstack/react-query';

const getData = async (id: string) => {
  const { body } = await spotifyApi.getTrack(id).then((data: any) => data);
  console.log('body: ', body);

  return body;
};

const useTrackQuery = ({ id }: { id: string }) => {
  return useQuery(['track', id], () => getData(id).then((data) => data), {
    onError: (error) => {
      console.log('error: ', error);
    },
  });
};

export default useTrackQuery;
