// src/app/callback.tsx
// OAuth callback route - handles Spotify OAuth redirect
import { createFileRoute, redirect } from '@tanstack/react-router';
import { exchangeCodeForTokens } from '@/lib/auth';

export const Route = createFileRoute('/callback')({
  validateSearch: (search: Record<string, unknown>) => ({
    code: search.code as string | undefined,
    error: search.error as string | undefined,
    state: search.state as string | undefined,
  }),
  loaderDeps: ({ search }) => ({
    code: search.code,
    error: search.error,
  }),
  loader: async ({ deps }) => {
    const { code, error } = deps;

    if (error) {
      console.error('OAuth error:', error);
      throw redirect({ to: '/login' });
    }

    if (!code) {
      console.error('No code provided');
      throw redirect({ to: '/login' });
    }

    try {
      await exchangeCodeForTokens(code);
      throw redirect({ to: '/' });
    } catch (err) {
      // Re-throw redirect errors
      if (err instanceof Error && 'redirect' in err) {
        throw err;
      }
      // Check if it's a redirect by TanStack
      if (
        typeof err === 'object' &&
        err !== null &&
        ('to' in err || 'href' in err)
      ) {
        throw err;
      }
      console.error('Token exchange error:', err);
      throw redirect({ to: '/login' });
    }
  },
  component: CallbackPage,
});

function CallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-neutral-400">Processing login...</p>
      </div>
    </div>
  );
}
