import spotifyApi from '@/lib/spotify';
import { useQuery } from '@tanstack/react-query';

const getData = async (id: string) => {
  const { body } = await spotifyApi.getPlaylist(id).then((data: any) => data);
  // console.log('body: ', body);

  return body;
};

const usePlaylistQuery = (id: string, opts) => {
  return useQuery({
    queryKey: ['playlist', id],
    queryFn: () => getData(id).then((data) => data),
    onError: (error) => {
      console.log('error: ', error);
    },
    ...opts,
  });
};

export default usePlaylistQuery;
