import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { IoCheckmark } from 'react-icons/io5';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';
import { spotifyQueries } from '@/lib/queries';
import { setFollowing } from '@/lib/spotify';

const buttonClassName = 'h-10 w-[120px] rounded-full';

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
        following ? 'btn-secondary' : 'btn-primary',
        buttonClassName,
        'px-0 disabled:cursor-wait'
      )}
    >
      {following && <IoCheckmark className="h-4 w-4" />}
      {following ? 'Following' : 'Follow'}
    </button>
  );
}

export function FollowButtonSkeleton() {
  return <Skeleton className={buttonClassName} />;
}
