import spotifyApi from '@/lib/spotify';
import { useQuery } from '@tanstack/react-query';

const getData = async (tracks: any) => {
  const { body } = await spotifyApi
    .getAudioFeaturesForTracks(tracks)
    .then((data: any) => data);
  console.log('body: ', body);

  return body;
};

const usePlaylistFeaturesQuery = (id, tracks: any, opts?: any) => {
  return useQuery({
    queryKey: ['playlistFeatures', id],
    queryFn: () => getData(tracks).then((data) => data.audio_features),
    onError: (error) => {
      console.log('error: ', error);
    },
    ...opts,
  });
};

export default usePlaylistFeaturesQuery;
