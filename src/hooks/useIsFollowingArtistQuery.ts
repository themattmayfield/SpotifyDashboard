import spotifyApi from '@/lib/spotify';
import { useQuery } from '@tanstack/react-query';

const getData = async (id: string) => {
  const { body } = await spotifyApi
    .isFollowingArtists([id])
    .then((data: any) => data);
  console.log('body: ', body);

  return body;
};

const useIsFollowingArtist = ({ id }: { id: string }) => {
  return useQuery(
    ['isFollowingArtist', id],
    () => getData(id).then((data) => data),
    {
      onError: (error) => {
        console.log('error: ', error);
      },
    }
  );
};

export default useIsFollowingArtist;
