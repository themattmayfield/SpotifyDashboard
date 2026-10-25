import { setFollowing } from '@/lib/spotify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
export default function FollowButton({
  isFollowingArtist,
  id,
}: { isFollowingArtist: boolean; id: string }) {
  const client = useQueryClient();
  const key = ['spotify', 'following', { id }];
  const mutation = useMutation({
    mutationFn: (follow: boolean) => setFollowing({ data: { id, follow } }),
    onMutate: async (follow) => {
      await client.cancelQueries({ queryKey: key });
      client.setQueryData(key, follow);
    },
    onSettled: () => client.invalidateQueries({ queryKey: key }),
  });
  const following = mutation.isPending ? !isFollowingArtist : isFollowingArtist;
  return (
    <button
      type="button"
      onClick={() => mutation.mutate(!following)}
      className={`bg-transparent border text-white rounded w-[100px] py-1 cursor-pointer focus:outline-none hover:bg-custom-darkgray transition duration-300 ease-in-out ${following ? 'border-spotify-green' : 'border-custom-gray'}`}
    >
      {following ? 'Following' : 'Follow'}
    </button>
  );
}
