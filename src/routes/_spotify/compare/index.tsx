import { createInvite, getCompareHome, removeFriend } from '@/lib/compare';
import { Link, createFileRoute, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { IoChevronForward, IoPersonAdd } from 'react-icons/io5';

import { PageHeader } from '@/components/PageHeader';
import { PageWrapper } from '@/components/PageWrapper';

export const Route = createFileRoute('/_spotify/compare/')({
  loader: () => getCompareHome(),
  component: Compare,
});

function Compare() {
  const data = Route.useLoaderData();
  const router = useRouter();
  const [link, setLink] = useState('');
  const [inviteError, setInviteError] = useState('');
  if (!data.enabled)
    return (
      <PageWrapper>
        <PageHeader title="Compare" />
        <p className="text-[15px] text-label-secondary">
          Friend comparisons are unavailable right now.
        </p>
      </PageWrapper>
    );
  const invite = async () => {
    setInviteError('');
    try {
      setLink(`${location.origin}/compare/invite/${await createInvite()}`);
    } catch {
      setInviteError(
        'You already have 20 active invites. Try again after one expires.'
      );
    }
  };
  return (
    <PageWrapper className="max-w-3xl">
      <PageHeader title="Compare with friends">
        <button type="button" onClick={invite} className="btn-primary">
          <IoPersonAdd className="h-4 w-4" />
          Invite a friend
        </button>
      </PageHeader>
      {inviteError && (
        <p className="mb-6 text-[13px] text-system-red">{inviteError}</p>
      )}
      {link && (
        <div className="card mb-8 p-5">
          <p className="text-[13px] font-medium text-label-secondary">
            Invite link
          </p>
          <p className="mt-1 break-all text-[15px]">{link}</p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="btn-secondary h-9 px-4 text-[13px]"
              onClick={() => navigator.clipboard.writeText(link)}
            >
              Copy link
            </button>
            {navigator.share && (
              <button
                type="button"
                className="btn-secondary h-9 px-4 text-[13px]"
                onClick={() => navigator.share({ url: link })}
              >
                Share
              </button>
            )}
          </div>
        </div>
      )}
      {data.friends.length > 0 ? (
        <div className="card divide-y divide-separator overflow-hidden">
          {data.friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center gap-4 px-4 py-3 transition hover:bg-fill"
            >
              <img
                src={friend.image ?? undefined}
                alt=""
                className="h-11 w-11 shrink-0 rounded-full bg-fill-strong object-cover"
              />
              <Link
                to="/compare/$friendId"
                params={{ friendId: friend.id }}
                className="min-w-0 flex-1"
              >
                <strong className="block truncate text-[15px] font-medium">
                  {friend.name}
                </strong>
                <p className="text-[13px] text-label-secondary">
                  {friend.score}% compatible
                </p>
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await removeFriend({ data: friend.id });
                  await router.invalidate();
                }}
                className="text-[13px] text-system-red transition hover:opacity-80"
              >
                Remove
              </button>
              <IoChevronForward className="h-4 w-4 shrink-0 text-label-tertiary" />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[15px] text-label-secondary">
          Invite a friend to see how your taste lines up.
        </p>
      )}
    </PageWrapper>
  );
}
