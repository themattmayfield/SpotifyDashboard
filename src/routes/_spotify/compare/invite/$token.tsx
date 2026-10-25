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
      <main className="p-10 text-white">
        <h1 className="text-3xl">This invite is no longer valid</h1>
      </main>
    );
  return (
    <main className="mx-auto flex max-w-lg flex-col items-center gap-5 p-10 text-center text-white">
      {invite.inviter.image && (
        <img
          src={invite.inviter.image}
          alt=""
          className="h-28 w-28 rounded-full"
        />
      )}
      <h1 className="text-3xl font-bold">
        {invite.own
          ? 'Send this link to a friend'
          : `${invite.inviter.name} wants to compare`}
      </h1>
      {!invite.own && (
        <button
          type="button"
          className="rounded-full bg-spotify-green px-6 py-3"
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
