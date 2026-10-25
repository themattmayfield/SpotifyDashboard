import { createFileRoute } from '@tanstack/react-router';

import { createLoginUrl, redirectUri } from '@/lib/auth.server';

function forwardedOrigin(request: Request) {
  const url = new URL(request.url);
  const host = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
  const protocol = request.headers
    .get('x-forwarded-proto')
    ?.split(',')[0]
    ?.trim();
  return host
    ? `${protocol || url.protocol.slice(0, -1)}://${host}`
    : url.origin;
}

export const Route = createFileRoute('/api/login')({
  server: {
    handlers: {
      GET: ({ request }) => {
        const canonicalOrigin = new URL(redirectUri()).origin;
        if (forwardedOrigin(request) !== canonicalOrigin) {
          return new Response(null, {
            status: 302,
            headers: { Location: `${canonicalOrigin}/api/login` },
          });
        }
        return new Response(null, {
          status: 302,
          headers: { Location: createLoginUrl() },
        });
      },
    },
  },
});
