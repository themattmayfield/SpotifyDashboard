import { createInvite, getCompareHome, removeFriend } from '@/lib/compare';
import { Link, createFileRoute, useRouter } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/_spotify/compare/')({
  loader: () => getCompareHome(),
  component: Compare,
});

function Compare() {
  const data = Route.useLoaderData();
  const router = useRouter();
  const [link, setLink] = useState('');
  if (!data.enabled)
    return (
      <main className="p-8 text-white">
        <h1 className="text-3xl">Compare</h1>
        <p className="mt-4 text-custom-muted">
          Friend comparisons are unavailable right now.
        </p>
      </main>
    );
  const invite = async () =>
    setLink(`${location.origin}/compare/invite/${await createInvite()}`);
  return (
    <main className="p-6 text-white md:p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Compare with friends</h1>
        <button
          type="button"
          onClick={invite}
          className="rounded-full bg-spotify-green px-5 py-2"
        >
          Invite a friend
        </button>
      </div>
      {link && (
        <div className="mt-6 rounded-xl bg-custom-darkgray p-4">
          <p className="break-all">{link}</p>
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(link)}
            >
              Copy link
            </button>
            {navigator.share && (
              <button
                type="button"
                onClick={() => navigator.share({ url: link })}
              >
                Share
              </button>
            )}
          </div>
        </div>
      )}
      <div className="mt-8 grid gap-4">
        {data.friends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center gap-4 rounded-xl bg-custom-darkgray p-4"
          >
            <img
              src={friend.image ?? undefined}
              alt=""
              className="h-12 w-12 rounded-full bg-custom-gray"
            />
            <Link
              to="/compare/$friendId"
              params={{ friendId: friend.id }}
              className="min-w-0 flex-1"
            >
              <strong>{friend.name}</strong>
              <p className="text-custom-muted">{friend.score}% compatible</p>
            </Link>
            <button
              type="button"
              onClick={async () => {
                await removeFriend({ data: friend.id });
                await router.invalidate();
              }}
              className="text-sm text-custom-muted"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
