import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';
import { spotifyQueries } from '@/lib/queries';
import { setFollowing } from '@/lib/spotify';

const buttonClassName = 'h-[34px] w-[100px] rounded';

export function FollowButton({ id }: { id: string }) {
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

  // Spotify no longer exposes follow state to this app.
  if (following === null) return null;

  return (
    <button
      type="button"
      aria-pressed={following}
      disabled={mutation.isPending}
      onClick={() => mutation.mutate(!following)}
      className={cn(
        buttonClassName,
        'border bg-transparent text-white transition duration-300 ease-in-out hover:bg-custom-darkgray focus:outline-none disabled:cursor-wait',
        following ? 'border-spotify-green' : 'border-custom-gray'
      )}
    >
      {following ? 'Following' : 'Follow'}
    </button>
  );
}

export function FollowButtonSkeleton() {
  return <Skeleton className={buttonClassName} />;
}
