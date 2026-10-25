import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/callback')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        if (url.searchParams.has('error')) {
          return new Response(null, {
            status: 302,
            headers: { Location: '/login' },
          });
        }
        const { validOAuthState, exchangeCode } = await import(
          '@/lib/auth.server'
        );
        const code = url.searchParams.get('code');
        if (!validOAuthState(url.searchParams.get('state')) || !code)
          return new Response(null, {
            status: 302,
            headers: { Location: '/login' },
          });
        try {
          await exchangeCode(code);
        } catch {
          return new Response(null, {
            status: 302,
            headers: { Location: '/login' },
          });
        }
        return new Response(null, { status: 302, headers: { Location: '/' } });
      },
    },
  },
});
