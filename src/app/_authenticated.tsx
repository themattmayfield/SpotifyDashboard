// src/app/_authenticated.tsx
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useRouter,
} from '@tanstack/react-router';
import { getSessionFn } from '@/lib/auth';
import { getMe } from '@/lib/spotify';
import Nav from '@/components/Nav';
import SideNav from '@/components/SideNav';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const session = await getSessionFn();

    if (!session.authenticated) {
      throw redirect({ to: '/login' });
    }

    return { session };
  },
  loader: async () => {
    const user = await getMe();
    return { user };
  },
  pendingComponent: AuthenticatedLoading,
  errorComponent: AuthenticatedError,
  component: AuthenticatedLayout,
});

function AuthenticatedLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-600 border-t-green-500 mx-auto" />
        <p className="mt-4 text-neutral-400">Loading...</p>
      </div>
    </div>
  );
}

function AuthenticatedError({ error }: { error: Error }) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center max-w-md px-4">
        <h2 className="text-2xl font-semibold text-red-500">
          Something went wrong
        </h2>
        <p className="mt-2 text-neutral-400">{error.message}</p>
        <div className="mt-6 flex justify-center space-x-4">
          <Link
            to="/login"
            className="rounded-full border border-white px-6 py-2 font-medium text-white hover:bg-white/10"
          >
            Go to Login
          </Link>
          <button
            type="button"
            onClick={() => router.invalidate()}
            className="rounded-full bg-green-500 px-6 py-2 font-medium text-black hover:bg-green-400"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

function AuthenticatedLayout() {
  const { user } = Route.useLoaderData();

  return (
    <div className="flex min-h-screen bg-spotify-black">
      <SideNav />

      <main className="flex-1 pb-[70px] lg:pb-0">
        <Nav user={user} />

        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
