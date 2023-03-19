import spotifyApi from '@/lib/spotify';
import { useQuery } from '@tanstack/react-query';

const getData = async () => {
  const { body } = await spotifyApi
    .getUserPlaylists()
    .then((data: any) => data);

  return body;
};

const usePlaylistsQuery = () => {
  return useQuery(['playlists'], () => getData().then((data) => data.items), {
    onError: (error) => {
      console.log('error: ', error);
    },
  });
};

export default usePlaylistsQuery;
