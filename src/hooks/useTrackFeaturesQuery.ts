import spotifyApi from '@/lib/spotify';
import { useQuery } from '@tanstack/react-query';

const getData = async (id: string) => {
  const { body } = await spotifyApi
    .getAudioFeaturesForTrack(id)
    .then((data: any) => data);

  return body;
};

const useTrackFeaturesQuery = ({ id }: { id: string }) => {
  return useQuery(['features', id], () => getData(id).then((data) => data), {
    onError: (error) => {
      console.log('error: ', error);
    },
  });
};

export default useTrackFeaturesQuery;
