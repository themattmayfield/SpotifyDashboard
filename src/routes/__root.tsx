import {
  type QueryClient,
  useQueryErrorResetBoundary,
} from '@tanstack/react-query';
import {
  type ErrorComponentProps,
  HeadContent,
  Link,
  Navigate,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  isRedirect,
  useRouter,
} from '@tanstack/react-router';
import type { ReactNode } from 'react';
import '@/styles/globals.css';

function ErrorPage({ error, reset }: Partial<ErrorComponentProps>) {
  const router = useRouter();
  const queryErrorBoundary = useQueryErrorResetBoundary();
  if (isRedirect(error)) return <Navigate {...error.options} />;

  const retry = () => {
    queryErrorBoundary.reset();
    reset?.();
    router.invalidate();
  };

  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center bg-canvas px-6 text-center text-label">
      <h1 className="large-title max-w-2xl">
        Oops! Looks like Matt's been coding again...
      </h1>
      <p className="mt-3 max-w-xl text-[17px] text-label-secondary">
        Don't worry, he's been notified and sent back to debugging school.
      </p>
      <div className="card mt-8 max-w-xl px-4 py-3 font-mono text-[12px] text-label-tertiary">
        Error details (for the nerds):{' '}
        {error instanceof Error ? error.message : 'Page not found'}
      </div>
      <div className="mt-8 flex gap-3">
        {error !== undefined && (
          <button
            type="button"
            onClick={retry}
            className="btn-secondary h-11 px-6"
          >
            Try Again
          </button>
        )}
        <Link to="/" className="btn-primary h-11 px-6">
          Take Me Home
        </Link>
      </div>
    </div>
  );
}

function Document({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="no-scrollbar overflow-hidden">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { title: 'AuxCheck' },
        {
          name: 'description',
          content:
            'Your top artists, tracks, and listening history for Spotify.',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
        },
        { name: 'theme-color', content: '#000000' },
        { name: 'color-scheme', content: 'dark' },
        {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'black-translucent',
        },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
      ],
      links: [
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'icon', href: '/icon-192.png', type: 'image/png' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://i.scdn.co' },
      ],
    }),
    component: () => (
      <Document>
        <Outlet />
      </Document>
    ),
    errorComponent: ErrorPage,
    notFoundComponent: () => <ErrorPage />,
  }
);
