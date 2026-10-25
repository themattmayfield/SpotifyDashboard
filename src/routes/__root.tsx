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

const buttonClassName =
  'tracking-widest focus:outline-none no-underline transition duration-300 ease-in-out hover:bg-[#1ed760] bg-spotify-green text-white py-3.5 px-8 uppercase rounded-full';

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
    <div className="flex h-screen flex-col items-center justify-center bg-spotify-dark px-4 text-center text-white">
      <h1 className="mb-4 text-4xl font-bold">
        Oops! Looks like Matt's been coding again...
      </h1>
      <p className="mb-8 text-lg">
        Don't worry, he's been notified and sent back to debugging school.
      </p>
      <div className="mb-8 text-sm text-gray-400">
        Error details (for the nerds):{' '}
        {error instanceof Error ? error.message : 'Page not found'}
      </div>
      <div className="flex gap-4">
        {error !== undefined && (
          <button type="button" onClick={retry} className={buttonClassName}>
            Try Again
          </button>
        )}
        <Link to="/" className={buttonClassName}>
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
        { title: 'Spotify Wrapper' },
        { name: 'description', content: 'Spotify Wrapper' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'theme-color', content: '#121212' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
      ],
      links: [
        { rel: 'icon', href: '/spotify.ico' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'apple-touch-icon', href: '/icon-192.png' },
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
