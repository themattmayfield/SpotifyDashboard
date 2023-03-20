import useSpotify from '@/lib/useSpotify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useIsFollowingMutation = ({
  isFollowingArtist,
  id,
}: {
  isFollowingArtist: boolean;
  id: string;
}) => {
  const queryClient = useQueryClient();
  const spotifyApi = useSpotify();
  return useMutation({
    mutationFn: async () => {
      if (isFollowingArtist) {
        return await spotifyApi.unfollowArtists([id]);
      } else {
        return await spotifyApi.followArtists([id]);
      }
    },
    onMutate: async () => {
      console.log('onMutate');

      await queryClient.cancelQueries(['isFollowingArtist', id]);
      const previousValue = queryClient.getQueryData(['isFollowingArtist', id]);
      console.log('previousValue: ', previousValue);

      queryClient.setQueryData(['isFollowingArtist', id], !isFollowingArtist);
      return { previousValue };
    },
    onError: (error, variables, context) => {
      console.log('error: ', error);
      queryClient.setQueryData(
        ['isFollowingArtist', id],
        context.previousValue
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(['isFollowingArtist', id]);
    },
  });
};

export default useIsFollowingMutation;
