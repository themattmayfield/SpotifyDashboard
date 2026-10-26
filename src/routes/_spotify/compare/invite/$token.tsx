import { acceptInvite, getInvite } from '@/lib/compare';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_spotify/compare/invite/$token')({
  loader: ({ params }) => getInvite({ data: params.token }),
  component: Invite,
});
function Invite() {
  const invite = Route.useLoaderData();
  const { token } = Route.useParams();
  const navigate = useNavigate();
  if (!invite)
    return (
      <main className="mx-auto flex max-w-lg flex-col items-center px-6 py-20 text-center">
        <h1 className="large-title">This invite is no longer valid</h1>
        <p className="mt-3 text-[15px] text-label-secondary">
          Ask your friend to send you a new link.
        </p>
      </main>
    );
  return (
    <main className="mx-auto flex max-w-lg flex-col items-center gap-6 px-6 py-20 text-center">
      {invite.inviter.image && (
        <img
          src={invite.inviter.image}
          alt=""
          className="h-28 w-28 rounded-full object-cover shadow-[0_20px_50px_rgba(0,0,0,0.6)] ring-1 ring-white/10"
        />
      )}
      <h1 className="large-title">
        {invite.own
          ? 'Send this link to a friend'
          : `${invite.inviter.name} wants to compare`}
      </h1>
      {!invite.own && (
        <button
          type="button"
          className="btn-primary h-11 px-6"
          onClick={async () => {
            const id = await acceptInvite({ data: token });
            navigate({ to: '/compare/$friendId', params: { friendId: id } });
          }}
        >
          Accept &amp; compare
        </button>
      )}
    </main>
  );
}
