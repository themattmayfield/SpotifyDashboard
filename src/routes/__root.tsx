import type { QueryClient } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from '@tanstack/react-router';
import type { ReactNode } from 'react';
import '@/styles/globals.css';

function ErrorPage({ error }: { error?: unknown }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-spotify-dark text-white">
      <h1 className="text-4xl font-bold mb-4">
        Oops! Looks like Matt's been coding again...
      </h1>
      <p className="text-lg mb-8">
        Don't worry, he's been notified and sent back to debugging school.
      </p>
      <div className="text-sm text-gray-400 mb-8">
        Error details (for the nerds):{' '}
        {error instanceof Error ? error.message : 'Page not found'}
      </div>
      <Link
        to="/"
        className="tracking-widest focus:outline-none no-underline transition duration-300 ease-in-out hover:bg-[#1ed760] bg-spotify-green text-white py-3.5 px-8 uppercase rounded-full"
      >
        Take Me Home
      </Link>
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
        { title: 'Spotify | Wrapper' },
        { name: 'description', content: 'Spotify Wrapper' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      ],
      links: [{ rel: 'icon', href: '/spotify.ico' }],
    }),
    component: () => (
      <Document>
        <Outlet />
      </Document>
    ),
    errorComponent: ErrorPage,
  }
);
