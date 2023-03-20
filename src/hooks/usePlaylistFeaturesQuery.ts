import useSpotify from '@/lib/useSpotify';
import { useQuery } from '@tanstack/react-query';

const usePlaylistFeaturesQuery = (id, tracks: any, opts?: any) => {
  const spotifyApi = useSpotify();
  return useQuery({
    queryKey: ['playlistFeatures', id],
    queryFn: () => {
      return spotifyApi
        .getAudioFeaturesForTracks(tracks)
        .then(({ body }: any) => body.audio_features);
    },
    onError: (error) => {
      console.log('error: ', error);
    },
    enabled: !!spotifyApi.getAccessToken() && opts.enabled,
    ...opts,
  });
};

export default usePlaylistFeaturesQuery;
