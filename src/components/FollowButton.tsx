import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { spotifyQueries } from '@/lib/queries';
import { setFollowing } from '@/lib/spotify';

export default function FollowButton({ id }: { id: string }) {
  const client = useQueryClient();
  const options = spotifyQueries.following(id);
  const { data: following } = useSuspenseQuery(options);
  const mutation = useMutation({
    mutationFn: (follow: boolean) => setFollowing({ data: { id, follow } }),
    onMutate: async (follow) => {
      await client.cancelQueries({ queryKey: options.queryKey });
      const previous = client.getQueryData(options.queryKey);
      client.setQueryData(options.queryKey, follow);
      return { previous };
    },
    onError: (_error, _follow, context) =>
      client.setQueryData(options.queryKey, context?.previous),
    onSettled: () => client.invalidateQueries({ queryKey: options.queryKey }),
  });

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
