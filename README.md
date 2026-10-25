# Spotify | Wrapper

A Spotify analytics dashboard built with TanStack Start, TanStack Router, TanStack Query, React, Vite, Tailwind CSS, and Nitro.

## Development

Install dependencies with `bun install`, then run `bun run dev`. The app is served at `http://127.0.0.1:3002`.

Create `.env.local` with:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REDIRECT_URI=http://127.0.0.1:3002/api/callback` (recommended), or `WEB_URL=http://127.0.0.1:3002`
- `SESSION_SECRET`

`NEXT_PUBLIC_WEB_URL` remains a backward-compatible fallback, but should be replaced because the redirect base is server-only.

## Vercel

Set the same environment variables in Vercel and run `bun run build`. Nitro automatically detects the Vercel preset when `VERCEL=1` and writes Build Output API artifacts to `.vercel/output`.

`vercel.json` pins the framework preset to TanStack Start, so the project's dashboard preset doesn't matter.

Nitro is pinned to an exact beta version so deploy output does not change unexpectedly between installs.
# Wrapper

## Production setup

1. Create a Convex project and production deployment.
2. Generate a random `CONVEX_SERVER_SECRET`, set it on the production deployment with `npx convex env set CONVEX_SERVER_SECRET <value>`, and set the same value plus `CONVEX_DEPLOY_KEY` in Vercel.
3. Set the Vercel build command to `npx convex deploy --cmd 'bun run build'`. Convex deploy injects `CONVEX_URL` into the build; `--cmd-url-env-var-name CONVEX_URL` may be supplied explicitly.
4. Existing users must log in again to grant the `playlist-modify-private` Spotify scope.

Spotify Development Mode has an authorized-user cap. Friends using comparison features must first be added to the app's user allowlist in the Spotify developer dashboard.
