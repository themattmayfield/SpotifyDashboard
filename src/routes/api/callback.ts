import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/callback')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const { validOAuthState, exchangeCode } = await import(
          '@/lib/auth.server'
        );
        const code = url.searchParams.get('code');
        if (!validOAuthState(url.searchParams.get('state')) || !code)
          return new Response('Invalid OAuth state', { status: 400 });
        await exchangeCode(code);
        return new Response(null, { status: 302, headers: { Location: '/' } });
      },
    },
  },
});
