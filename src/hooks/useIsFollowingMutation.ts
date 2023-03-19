import spotifyApi from '@/lib/spotify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useIsFollowingMutation = ({
  isFollowingArtist,
  id,
}: {
  isFollowingArtist: boolean;
  id: string;
}) => {
  const queryClient = useQueryClient();
  console.log('here', id);

  return useMutation({
    mutationFn: async () => {
      if (isFollowingArtist) {
        console.log('isFollowingArtist: ', isFollowingArtist);

        console.log('following');
        return await spotifyApi.unfollowArtists([id]);
      } else {
        console.log('not following');

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
