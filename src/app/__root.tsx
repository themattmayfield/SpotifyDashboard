// src/app/__root.tsx
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router';
import appCss from '../styles/globals.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Spotify | Dashboard' },
      {
        name: 'description',
        content: 'Spotify Dashboard - View your music stats',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/spotify.ico' },
    ],
  }),
  component: RootLayout,
  errorComponent: RootErrorComponent,
});

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-neutral-900 text-white antialiased">
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}

function RootErrorComponent({ error }: { error: Error }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-neutral-900 text-white antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold text-red-500">
            Something went wrong
          </h1>
          <p className="mt-2 text-neutral-400">{error.message}</p>
          <a
            href="/"
            className="mt-4 rounded-full bg-green-500 px-6 py-2 font-medium text-black hover:bg-green-400"
          >
            Take Me Home
          </a>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
