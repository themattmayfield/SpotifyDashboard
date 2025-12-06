# TanStack Start Migration Guide: Spotify Dashboard

> **Important:** This is an incremental migration guide. Complete each phase fully before moving to the next. Each phase ends with a working (though possibly incomplete) application.

> **Official Reference:** This guide is based on the official TanStack Start migration documentation:
> https://tanstack.com/start/latest/docs/framework/react/migrate-from-next-js

## Table of Contents

1. [Overview](#overview)
2. [Pre-Migration Checklist](#pre-migration-checklist)
3. [Phase 1: Project Setup & Configuration](#phase-1-project-setup--configuration)
4. [Phase 2: Root Layout & Entry Points](#phase-2-root-layout--entry-points)
5. [Phase 3: Authentication System](#phase-3-authentication-system)
6. [Phase 4: Route Migration](#phase-4-route-migration)
7. [Phase 5: Server Actions & Data Mutations](#phase-5-server-actions--data-mutations)
8. [Phase 6: Loading & Error States](#phase-6-loading--error-states)
9. [Phase 7: Component Updates](#phase-7-component-updates)
10. [Phase 8: Final Polish & Deployment](#phase-8-final-polish--deployment)
11. [Troubleshooting](#troubleshooting)
12. [Reference: Concept Mapping](#reference-concept-mapping)

---

## Overview

### What We're Migrating

| Current Stack | Target Stack |
|---------------|--------------|
| Next.js 15 (App Router) | TanStack Start |
| React 19 | React 19 (no change) |
| Tailwind CSS (PostCSS) | Tailwind CSS (Vite plugin) |
| Vercel Hosting | Vercel Hosting (no change) |

### Key Architecture Changes

```
NEXT.JS                          TANSTACK START
─────────────────────────────────────────────────────────────────
page.tsx                    →    index.tsx or $param.tsx
layout.tsx                  →    __root.tsx + _layout routes
loading.tsx                 →    pendingComponent in route config
error.tsx                   →    errorComponent in route config
middleware.ts               →    beforeLoad hooks + server functions
Server Components           →    Route loaders + components
'use server' actions        →    createServerFn()
API routes (route.ts)       →    Server routes with handlers
cookies() from next/headers →    useSession() or getRequest()
redirect()                  →    throw redirect()
revalidatePath()            →    router.invalidate()
```

### Current Project Structure

```
src/
├── app/
│   ├── (auth)/                    # Auth route group
│   │   ├── api/
│   │   │   ├── callback/route.ts  # OAuth callback
│   │   │   └── refresh/route.ts   # Token refresh
│   │   └── login/page.tsx         # Login page
│   ├── (spotify)/                 # Main app route group
│   │   ├── (home)/page.tsx        # Home page at /
│   │   ├── artists/
│   │   │   ├── page.tsx           # /artists
│   │   │   └── [id]/              # /artists/:id
│   │   ├── tracks/
│   │   │   ├── page.tsx           # /tracks
│   │   │   └── [id]/              # /tracks/:id
│   │   ├── playlists/
│   │   │   ├── page.tsx           # /playlists
│   │   │   └── [id]/              # /playlists/:id
│   │   ├── recentTracks/page.tsx  # /recentTracks
│   │   └── layout.tsx             # Spotify layout (Nav + SideNav)
│   ├── layout.tsx                 # Root layout
│   └── error.client.tsx           # Error boundary
├── components/                     # Shared components
├── lib/                           # Utilities
├── styles/                        # Global styles
└── middleware.ts                  # Auth middleware
```

### Target Project Structure

```
src/
├── app/
│   ├── __root.tsx                 # Root layout
│   ├── index.tsx                  # Home page at /
│   ├── login.tsx                  # Login page
│   ├── api/
│   │   ├── callback.ts            # OAuth callback
│   │   └── refresh.ts             # Token refresh
│   ├── _authenticated.tsx         # Auth layout route
│   └── _authenticated/
│       ├── artists.tsx            # /artists
│       ├── artists.$id.tsx        # /artists/:id
│       ├── tracks.tsx             # /tracks
│       ├── tracks.$id.tsx         # /tracks/:id
│       ├── playlists.tsx          # /playlists
│       ├── playlists.$id.tsx      # /playlists/:id
│       └── recentTracks.tsx       # /recentTracks
├── components/                     # Shared components (minimal changes)
├── lib/                           # Utilities
│   ├── auth.ts                    # Converted auth functions
│   ├── session.ts                 # NEW: Session management
│   ├── spotify.ts                 # Spotify API (updated)
│   └── ...
├── styles/
│   └── globals.css                # Updated for Vite
├── router.tsx                     # NEW: Router configuration
└── start.ts                       # NEW: TanStack Start configuration
```

---

## Pre-Migration Checklist

Before starting, ensure you have:

- [ ] Committed all current changes to git
- [ ] Created a new branch for the migration: `git checkout -b tanstack-migration`
- [ ] Node.js 18+ installed
- [ ] Bun or npm available

### Backup Important Files

These files contain business logic that will be heavily referenced:

```bash
# Create a reference backup (optional but helpful)
mkdir -p .migration-reference
cp src/middleware.ts .migration-reference/
cp src/lib/auth.ts .migration-reference/
cp src/lib/spotify.ts .migration-reference/
cp src/lib/fetchWrapper.ts .migration-reference/
```

---

## Phase 1: Project Setup & Configuration

### Goal
Get a basic TanStack Start project running with Vite, ready for route migration.

### Step 1.1: Remove Next.js Dependencies

```bash
# Remove Next.js
bun remove next

# Remove PostCSS config (handled by Vite plugin)
rm -f postcss.config.js next.config.js
```

### Step 1.2: Install TanStack Start Dependencies

```bash
# Core TanStack packages
bun add @tanstack/react-router @tanstack/react-start

# Vite and related
bun add -D vite @vitejs/plugin-react vite-tsconfig-paths

# Tailwind for Vite
bun add -D @tailwindcss/vite
```

### Step 1.3: Update package.json

Edit `package.json`:

```json
{
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "start": "node .output/server/index.mjs",
    "type-check": "tsc --noEmit",
    "lint": "biome check .",
    "lint:fix": "biome check . --write",
    "format": "biome format . --write && biome check . --write --unsafe"
  }
}
```

### Step 1.4: Create Vite Configuration

Create `vite.config.ts` in the project root:

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart({
      srcDirectory: 'src',
      router: {
        routesDirectory: 'app',
      },
    }),
    viteReact(),
  ],
})
```

### Step 1.5: Create Router Configuration

Create `src/router.tsx`:

```typescript
// src/router.tsx
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function createAppRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>
  }
}
```

### Step 1.6: Create TanStack Start Configuration

Create `src/start.ts`:

```typescript
// src/start.ts
import { createStart } from '@tanstack/react-start'

export const startInstance = createStart(() => {
  return {
    // Global middleware will be added later
  }
})
```

### Step 1.7: Update TypeScript Configuration

Update `tsconfig.json` to include Vite types:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "types": ["vite/client"]
  },
  "include": ["**/*.ts", "**/*.tsx", ".tanstack/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Step 1.8: Update Environment Variables

Create or update `.env`:

```bash
# Server-only (no prefix needed)
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here

# Session encryption key (generate a random 32+ character string)
SESSION_SECRET=your-super-secret-session-key-here-min-32-chars

# App URL
VITE_APP_URL=http://localhost:3000
```

**Important:** Remove any `NEXT_PUBLIC_` prefixes. For client-exposed values, use `VITE_` prefix.

### Step 1.9: Update Tailwind CSS

Update `src/styles/globals.css`:

```css
@import 'tailwindcss';

/* Keep all your existing custom styles below */
/* ... */
```

### Step 1.10: Create Minimal Root Route (Placeholder)

Create `src/app/__root.tsx`:

```typescript
// src/app/__root.tsx
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import appCss from '../styles/globals.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Spotify | Dashboard' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/spotify.ico' },
    ],
  }),
  component: RootLayout,
})

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-neutral-900 text-white">
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
```

### Step 1.11: Create Minimal Index Route (Placeholder)

Create `src/app/index.tsx`:

```typescript
// src/app/index.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Spotify Dashboard</h1>
        <p className="mt-4 text-neutral-400">
          Migration in progress - TanStack Start is working!
        </p>
      </div>
    </div>
  )
}
```

### Step 1.12: First Test Run

```bash
bun run dev
```

**Expected Result:** The app should start on http://localhost:3000 and show "Spotify Dashboard - Migration in progress".

### Phase 1 Checkpoint

- [ ] `bun run dev` starts without errors
- [ ] Browser shows the placeholder page
- [ ] No TypeScript errors (run `bun run type-check`)
- [ ] Tailwind styles are working (text should be white on dark background)

**Commit your progress:**
```bash
git add .
git commit -m "Phase 1: TanStack Start project setup complete"
```

---

## Phase 2: Root Layout & Entry Points

### Goal
Set up the root layout with proper HTML structure and prepare for authenticated routes.

### Step 2.1: Enhance Root Layout

Update `src/app/__root.tsx` with the full layout structure:

```typescript
// src/app/__root.tsx
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import appCss from '../styles/globals.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Spotify | Dashboard' },
      { name: 'description', content: 'Spotify Dashboard - View your music stats' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/spotify.ico' },
    ],
  }),
  component: RootLayout,
  errorComponent: RootErrorComponent,
})

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
  )
}

function RootErrorComponent({ error }: { error: Error }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-neutral-900 text-white antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold text-red-500">Something went wrong</h1>
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
  )
}
```

### Step 2.2: Create Login Page

Create `src/app/login.tsx`:

```typescript
// src/app/login.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">Spotify Dashboard</h1>
        <p className="mt-2 text-neutral-400">
          Login to view your Spotify stats
        </p>
        <form action="/api/auth/login" method="POST">
          <button
            type="submit"
            className="mt-6 rounded-full bg-green-500 px-8 py-3 font-semibold text-black transition hover:bg-green-400"
          >
            Login with Spotify
          </button>
        </form>
      </div>
    </main>
  )
}
```

**Note:** The form action points to an API route we'll create in Phase 3.

### Step 2.3: Create Authenticated Layout Route

Create `src/app/_authenticated.tsx`:

```typescript
// src/app/_authenticated.tsx
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    // TODO: Phase 3 - Add authentication check
    // For now, just render the outlet
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <div className="flex min-h-screen">
      {/* TODO: Add SideNav component */}
      <aside className="hidden w-64 bg-black p-4 lg:block">
        <p className="text-neutral-400">SideNav placeholder</p>
      </aside>
      
      <main className="flex-1">
        {/* TODO: Add Nav component */}
        <header className="border-b border-neutral-800 p-4">
          <p className="text-neutral-400">Nav placeholder</p>
        </header>
        
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
```

### Step 2.4: Create Authenticated Home Page

Create `src/app/_authenticated/index.tsx`:

```typescript
// src/app/_authenticated/index.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/')({
  component: AuthenticatedHomePage,
})

function AuthenticatedHomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
      <p className="mt-2 text-neutral-400">
        This is the authenticated home page. Content will be migrated in Phase 4.
      </p>
    </div>
  )
}
```

### Step 2.5: Update Public Index Route

Update `src/app/index.tsx` to redirect to authenticated area:

```typescript
// src/app/index.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    // Redirect to authenticated home
    // In Phase 3, this will check auth status first
    throw redirect({ to: '/_authenticated' })
  },
})
```

### Step 2.6: Test the Layout Structure

```bash
bun run dev
```

Navigate to:
- http://localhost:3000 → Should redirect to authenticated area
- http://localhost:3000/login → Should show login page

### Phase 2 Checkpoint

- [ ] Root layout renders with correct HTML structure
- [ ] Login page is accessible at /login
- [ ] Authenticated layout structure is visible
- [ ] Navigation between routes works

**Commit your progress:**
```bash
git add .
git commit -m "Phase 2: Root layout and basic route structure"
```

---

## Phase 3: Authentication System

### Goal
Implement the complete authentication flow with Spotify OAuth.

### Step 3.1: Create Session Management

Create `src/lib/session.ts`:

```typescript
// src/lib/session.ts
import { useSession } from '@tanstack/react-start/server'

export interface SpotifySession {
  accessToken?: string
  refreshToken?: string
  expiresAt?: number
  userId?: string
}

export function useSpotifySession() {
  return useSession<SpotifySession>({
    name: 'spotify-session',
    password: process.env.SESSION_SECRET!,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  })
}

// Helper to check if session is valid
export function isSessionValid(session: SpotifySession): boolean {
  if (!session.accessToken || !session.expiresAt) {
    return false
  }
  // Add 60 second buffer
  return Date.now() < session.expiresAt - 60000
}

// Helper to check if session can be refreshed
export function canRefreshSession(session: SpotifySession): boolean {
  return !!session.refreshToken
}
```

### Step 3.2: Create Server Functions for Auth

Create `src/lib/auth.server.ts`:

```typescript
// src/lib/auth.server.ts
import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { useSpotifySession, isSessionValid, canRefreshSession } from './session'
import { generateRandomString } from './generateRandomString'

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize'
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'

const SCOPES = [
  'user-read-email',
  'user-read-private',
  'user-top-read',
  'user-read-recently-played',
  'user-library-read',
  'user-follow-read',
  'user-follow-modify',
  'playlist-read-private',
  'playlist-read-collaborative',
].join(' ')

// Server function to initiate login
export const loginFn = createServerFn({ method: 'POST' }).handler(async () => {
  const state = generateRandomString(16)
  const session = await useSpotifySession()
  
  // Store state in session for CSRF protection
  await session.update({ ...session.data, oauthState: state } as any)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    scope: SCOPES,
    redirect_uri: `${process.env.VITE_APP_URL}/api/callback`,
    state,
  })

  throw redirect({ href: `${SPOTIFY_AUTH_URL}?${params.toString()}` })
})

// Server function to handle logout
export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await useSpotifySession()
  await session.clear()
  throw redirect({ to: '/login' })
})

// Server function to get current user session (for route loaders)
export const getSessionFn = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await useSpotifySession()
  
  if (!session.data.accessToken) {
    return { authenticated: false as const }
  }

  // Check if token needs refresh
  if (!isSessionValid(session.data) && canRefreshSession(session.data)) {
    try {
      const newTokens = await refreshAccessToken(session.data.refreshToken!)
      await session.update({
        accessToken: newTokens.access_token,
        refreshToken: newTokens.refresh_token || session.data.refreshToken,
        expiresAt: Date.now() + newTokens.expires_in * 1000,
      })
    } catch (error) {
      console.error('Failed to refresh token:', error)
      await session.clear()
      return { authenticated: false as const }
    }
  }

  return {
    authenticated: true as const,
    accessToken: session.data.accessToken,
  }
})

// Server function to exchange code for tokens (called from callback route)
export const exchangeCodeForTokens = async (code: string) => {
  const session = await useSpotifySession()
  
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${process.env.VITE_APP_URL}/api/callback`,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Token exchange failed: ${error}`)
  }

  const tokens = await response.json()
  
  await session.update({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: Date.now() + tokens.expires_in * 1000,
  })

  return tokens
}

// Helper function to refresh access token
async function refreshAccessToken(refreshToken: string) {
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to refresh token')
  }

  return response.json()
}
```

### Step 3.3: Create Login API Route

Create `src/app/api/auth/login.ts`:

```typescript
// src/app/api/auth/login.ts
import { createFileRoute, redirect } from '@tanstack/react-router'
import { loginFn } from '@/lib/auth.server'

export const Route = createFileRoute('/api/auth/login')({
  server: {
    handlers: {
      POST: async () => {
        // This will redirect to Spotify
        return loginFn()
      },
    },
  },
})
```

### Step 3.4: Create Callback API Route

Create `src/app/api/callback.ts`:

```typescript
// src/app/api/callback.ts
import { createFileRoute, redirect } from '@tanstack/react-router'
import { exchangeCodeForTokens } from '@/lib/auth.server'
import { useSpotifySession } from '@/lib/session'

export const Route = createFileRoute('/api/callback')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const code = url.searchParams.get('code')
        const state = url.searchParams.get('state')
        const error = url.searchParams.get('error')

        if (error) {
          console.error('OAuth error:', error)
          throw redirect({ to: '/login' })
        }

        if (!code) {
          console.error('No code provided')
          throw redirect({ to: '/login' })
        }

        // TODO: Verify state matches session state for CSRF protection

        try {
          await exchangeCodeForTokens(code)
          throw redirect({ to: '/' })
        } catch (err) {
          console.error('Token exchange error:', err)
          throw redirect({ to: '/login' })
        }
      },
    },
  },
})
```

### Step 3.5: Create Logout API Route

Create `src/app/api/auth/logout.ts`:

```typescript
// src/app/api/auth/logout.ts
import { createFileRoute } from '@tanstack/react-router'
import { logoutFn } from '@/lib/auth.server'

export const Route = createFileRoute('/api/auth/logout')({
  server: {
    handlers: {
      POST: async () => {
        return logoutFn()
      },
    },
  },
})
```

### Step 3.6: Update Authenticated Layout with Auth Check

Update `src/app/_authenticated.tsx`:

```typescript
// src/app/_authenticated.tsx
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getSessionFn } from '@/lib/auth.server'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const session = await getSessionFn()
    
    if (!session.authenticated) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }

    return { session }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <div className="flex min-h-screen">
      {/* TODO: Add SideNav component */}
      <aside className="hidden w-64 bg-black p-4 lg:block">
        <p className="text-neutral-400">SideNav placeholder</p>
      </aside>
      
      <main className="flex-1">
        {/* TODO: Add Nav component */}
        <header className="border-b border-neutral-800 p-4">
          <p className="text-neutral-400">Nav placeholder</p>
          <form action="/api/auth/logout" method="POST" className="mt-2">
            <button
              type="submit"
              className="text-sm text-red-400 hover:text-red-300"
            >
              Logout
            </button>
          </form>
        </header>
        
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
```

### Step 3.7: Update Root Index to Check Auth

Update `src/app/index.tsx`:

```typescript
// src/app/index.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSessionFn } from '@/lib/auth.server'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const session = await getSessionFn()
    
    if (!session.authenticated) {
      throw redirect({ to: '/login' })
    }
    
    // Redirect authenticated users to the dashboard
    throw redirect({ to: '/_authenticated' })
  },
})
```

### Step 3.8: Update Spotify API Utilities

Update `src/lib/spotify.ts` to use the new session system:

```typescript
// src/lib/spotify.ts
import { useSpotifySession } from './session'

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

// Helper to make authenticated requests
export async function spotifyFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const session = await useSpotifySession()
  const accessToken = session.data.accessToken

  if (!accessToken) {
    throw new Error('No access token available')
  }

  const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired - this should be handled by the auth middleware
      throw new Error('Unauthorized - token may be expired')
    }
    throw new Error(`Spotify API error: ${response.status}`)
  }

  return response.json()
}

// Example API functions (convert your existing functions)
export async function getMe() {
  return spotifyFetch<SpotifyApi.CurrentUsersProfileResponse>('/me')
}

export async function getTopArtists(
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'long_term',
  limit = 50
) {
  return spotifyFetch<SpotifyApi.UsersTopArtistsResponse>(
    `/me/top/artists?time_range=${timeRange}&limit=${limit}`
  )
}

export async function getTopTracks(
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'long_term',
  limit = 50
) {
  return spotifyFetch<SpotifyApi.UsersTopTracksResponse>(
    `/me/top/tracks?time_range=${timeRange}&limit=${limit}`
  )
}

export async function getArtist(id: string) {
  return spotifyFetch<SpotifyApi.SingleArtistResponse>(`/artists/${id}`)
}

export async function getTrack(id: string) {
  return spotifyFetch<SpotifyApi.SingleTrackResponse>(`/tracks/${id}`)
}

export async function getRecentlyPlayed(limit = 50) {
  return spotifyFetch<SpotifyApi.UsersRecentlyPlayedTracksResponse>(
    `/me/player/recently-played?limit=${limit}`
  )
}

export async function getPlaylists(limit = 50) {
  return spotifyFetch<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>(
    `/me/playlists?limit=${limit}`
  )
}

export async function getPlaylist(id: string) {
  return spotifyFetch<SpotifyApi.SinglePlaylistResponse>(`/playlists/${id}`)
}

export async function checkIfFollowingArtist(artistId: string) {
  const result = await spotifyFetch<boolean[]>(
    `/me/following/contains?type=artist&ids=${artistId}`
  )
  return result[0]
}

export async function followArtist(artistIds: string[]) {
  return spotifyFetch('/me/following?type=artist', {
    method: 'PUT',
    body: JSON.stringify({ ids: artistIds }),
  })
}

export async function unfollowArtist(artistIds: string[]) {
  return spotifyFetch('/me/following?type=artist', {
    method: 'DELETE',
    body: JSON.stringify({ ids: artistIds }),
  })
}
```

### Step 3.9: Test Authentication Flow

1. Start the dev server: `bun run dev`
2. Navigate to http://localhost:3000
3. You should be redirected to /login
4. Click "Login with Spotify"
5. Complete Spotify OAuth
6. You should be redirected back to the authenticated area

### Phase 3 Checkpoint

- [ ] Login redirects to Spotify OAuth
- [ ] Callback exchanges code for tokens
- [ ] Authenticated routes require login
- [ ] Logout clears session and redirects to login
- [ ] Session persists across page reloads

**Commit your progress:**
```bash
git add .
git commit -m "Phase 3: Authentication system complete"
```

---

## Phase 4: Route Migration

### Goal
Migrate all pages from Next.js to TanStack Start routes.

### Step 4.1: Migrate Artists Page

Create `src/app/_authenticated/artists.tsx`:

```typescript
// src/app/_authenticated/artists.tsx
import { createFileRoute } from '@tanstack/react-router'
import { getTopArtists } from '@/lib/spotify'
import { z } from 'zod'

// Optional: Use zod for search params validation
const searchSchema = z.object({
  range: z.enum(['short_term', 'medium_term', 'long_term']).optional().default('long_term'),
})

export const Route = createFileRoute('/_authenticated/artists')({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search }) => ({ range: search.range }),
  loader: async ({ deps }) => {
    const artists = await getTopArtists(deps.range, 50)
    return { artists: artists.items }
  },
  pendingComponent: () => <ArtistsLoading />,
  component: ArtistsPage,
})

function ArtistsLoading() {
  // Import your existing loading skeleton
  return <div className="animate-pulse">Loading artists...</div>
}

function ArtistsPage() {
  const { artists } = Route.useLoaderData()
  const { range } = Route.useSearch()
  const navigate = Route.useNavigate()

  const handleRangeChange = (newRange: string) => {
    navigate({
      search: { range: newRange as 'short_term' | 'medium_term' | 'long_term' },
    })
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Top Artists</h1>
        {/* Add your TimePeriodSelect component here */}
        <select
          value={range}
          onChange={(e) => handleRangeChange(e.target.value)}
          className="rounded bg-neutral-800 px-3 py-2"
        >
          <option value="short_term">Last 4 weeks</option>
          <option value="medium_term">Last 6 months</option>
          <option value="long_term">All time</option>
        </select>
      </div>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {artists.map((artist, index) => (
          <a
            key={artist.id}
            href={`/artists/${artist.id}`}
            className="group rounded-lg bg-neutral-800 p-4 transition hover:bg-neutral-700"
          >
            <img
              src={artist.images[0]?.url}
              alt={artist.name}
              className="aspect-square w-full rounded-full object-cover"
            />
            <p className="mt-3 truncate font-medium">{artist.name}</p>
            <p className="text-sm text-neutral-400">#{index + 1}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
```

### Step 4.2: Migrate Artist Detail Page

Create `src/app/_authenticated/artists.$id.tsx`:

```typescript
// src/app/_authenticated/artists.$id.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { getArtist, checkIfFollowingArtist } from '@/lib/spotify'

export const Route = createFileRoute('/_authenticated/artists/$id')({
  loader: async ({ params }) => {
    const [artist, isFollowing] = await Promise.all([
      getArtist(params.id),
      checkIfFollowingArtist(params.id),
    ])
    return { artist, isFollowing }
  },
  pendingComponent: () => <ArtistDetailLoading />,
  component: ArtistDetailPage,
})

function ArtistDetailLoading() {
  return <div className="animate-pulse">Loading artist...</div>
}

function ArtistDetailPage() {
  const { artist, isFollowing } = Route.useLoaderData()
  const { id } = Route.useParams()

  return (
    <div>
      <Link
        to="/artists"
        className="mb-4 inline-block text-neutral-400 hover:text-white"
      >
        ← Back to Artists
      </Link>
      
      <div className="flex gap-6">
        <img
          src={artist.images[0]?.url}
          alt={artist.name}
          className="h-48 w-48 rounded-full object-cover"
        />
        <div>
          <h1 className="text-4xl font-bold">{artist.name}</h1>
          <p className="mt-2 text-neutral-400">
            {artist.followers.total.toLocaleString()} followers
          </p>
          <div className="mt-4 flex gap-2">
            {artist.genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="rounded-full bg-neutral-800 px-3 py-1 text-sm"
              >
                {genre}
              </span>
            ))}
          </div>
          {/* TODO: Add FollowButton component */}
          <p className="mt-4 text-sm text-neutral-400">
            {isFollowing ? 'Following' : 'Not following'}
          </p>
        </div>
      </div>
    </div>
  )
}
```

### Step 4.3: Migrate Tracks Page

Create `src/app/_authenticated/tracks.tsx`:

```typescript
// src/app/_authenticated/tracks.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { getTopTracks } from '@/lib/spotify'
import { z } from 'zod'

const searchSchema = z.object({
  range: z.enum(['short_term', 'medium_term', 'long_term']).optional().default('long_term'),
})

export const Route = createFileRoute('/_authenticated/tracks')({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search }) => ({ range: search.range }),
  loader: async ({ deps }) => {
    const tracks = await getTopTracks(deps.range, 50)
    return { tracks: tracks.items }
  },
  pendingComponent: () => <TracksLoading />,
  component: TracksPage,
})

function TracksLoading() {
  return <div className="animate-pulse">Loading tracks...</div>
}

function TracksPage() {
  const { tracks } = Route.useLoaderData()
  const { range } = Route.useSearch()
  const navigate = Route.useNavigate()

  const handleRangeChange = (newRange: string) => {
    navigate({
      search: { range: newRange as 'short_term' | 'medium_term' | 'long_term' },
    })
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Top Tracks</h1>
        <select
          value={range}
          onChange={(e) => handleRangeChange(e.target.value)}
          className="rounded bg-neutral-800 px-3 py-2"
        >
          <option value="short_term">Last 4 weeks</option>
          <option value="medium_term">Last 6 months</option>
          <option value="long_term">All time</option>
        </select>
      </div>
      
      <div className="space-y-2">
        {tracks.map((track, index) => (
          <Link
            key={track.id}
            to="/tracks/$id"
            params={{ id: track.id }}
            className="flex items-center gap-4 rounded-lg bg-neutral-800 p-3 transition hover:bg-neutral-700"
          >
            <span className="w-8 text-center text-neutral-400">{index + 1}</span>
            <img
              src={track.album.images[0]?.url}
              alt={track.name}
              className="h-12 w-12 rounded"
            />
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-medium">{track.name}</p>
              <p className="truncate text-sm text-neutral-400">
                {track.artists.map((a) => a.name).join(', ')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

### Step 4.4: Migrate Track Detail Page

Create `src/app/_authenticated/tracks.$id.tsx`:

```typescript
// src/app/_authenticated/tracks.$id.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { getTrack } from '@/lib/spotify'

export const Route = createFileRoute('/_authenticated/tracks/$id')({
  loader: async ({ params }) => {
    const track = await getTrack(params.id)
    return { track }
  },
  pendingComponent: () => <TrackDetailLoading />,
  component: TrackDetailPage,
})

function TrackDetailLoading() {
  return <div className="animate-pulse">Loading track...</div>
}

function TrackDetailPage() {
  const { track } = Route.useLoaderData()

  return (
    <div>
      <Link
        to="/tracks"
        className="mb-4 inline-block text-neutral-400 hover:text-white"
      >
        ← Back to Tracks
      </Link>
      
      <div className="flex gap-6">
        <img
          src={track.album.images[0]?.url}
          alt={track.name}
          className="h-48 w-48 rounded object-cover"
        />
        <div>
          <h1 className="text-4xl font-bold">{track.name}</h1>
          <p className="mt-2 text-xl text-neutral-400">
            {track.artists.map((a) => a.name).join(', ')}
          </p>
          <p className="mt-1 text-neutral-500">{track.album.name}</p>
          <p className="mt-4 text-sm text-neutral-400">
            Popularity: {track.popularity}%
          </p>
        </div>
      </div>
    </div>
  )
}
```

### Step 4.5: Migrate Playlists Page

Create `src/app/_authenticated/playlists.tsx`:

```typescript
// src/app/_authenticated/playlists.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { getPlaylists } from '@/lib/spotify'

export const Route = createFileRoute('/_authenticated/playlists')({
  loader: async () => {
    const playlists = await getPlaylists(50)
    return { playlists: playlists.items }
  },
  pendingComponent: () => <PlaylistsLoading />,
  component: PlaylistsPage,
})

function PlaylistsLoading() {
  return <div className="animate-pulse">Loading playlists...</div>
}

function PlaylistsPage() {
  const { playlists } = Route.useLoaderData()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Your Playlists</h1>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {playlists.map((playlist) => (
          <Link
            key={playlist.id}
            to="/playlists/$id"
            params={{ id: playlist.id }}
            className="group rounded-lg bg-neutral-800 p-4 transition hover:bg-neutral-700"
          >
            <img
              src={playlist.images[0]?.url}
              alt={playlist.name}
              className="aspect-square w-full rounded object-cover"
            />
            <p className="mt-3 truncate font-medium">{playlist.name}</p>
            <p className="text-sm text-neutral-400">
              {playlist.tracks.total} tracks
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

### Step 4.6: Migrate Playlist Detail Page

Create `src/app/_authenticated/playlists.$id.tsx`:

```typescript
// src/app/_authenticated/playlists.$id.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { getPlaylist } from '@/lib/spotify'

export const Route = createFileRoute('/_authenticated/playlists/$id')({
  loader: async ({ params }) => {
    const playlist = await getPlaylist(params.id)
    return { playlist }
  },
  pendingComponent: () => <PlaylistDetailLoading />,
  component: PlaylistDetailPage,
})

function PlaylistDetailLoading() {
  return <div className="animate-pulse">Loading playlist...</div>
}

function PlaylistDetailPage() {
  const { playlist } = Route.useLoaderData()

  return (
    <div>
      <Link
        to="/playlists"
        className="mb-4 inline-block text-neutral-400 hover:text-white"
      >
        ← Back to Playlists
      </Link>
      
      <div className="flex gap-6">
        <img
          src={playlist.images[0]?.url}
          alt={playlist.name}
          className="h-48 w-48 rounded object-cover"
        />
        <div>
          <h1 className="text-4xl font-bold">{playlist.name}</h1>
          <p className="mt-2 text-neutral-400">
            {playlist.tracks.total} tracks • By {playlist.owner.display_name}
          </p>
          {playlist.description && (
            <p className="mt-2 text-neutral-500">{playlist.description}</p>
          )}
        </div>
      </div>
      
      <div className="mt-8 space-y-2">
        {playlist.tracks.items.map((item, index) => (
          <div
            key={item.track?.id || index}
            className="flex items-center gap-4 rounded-lg bg-neutral-800 p-3"
          >
            <span className="w-8 text-center text-neutral-400">{index + 1}</span>
            <img
              src={item.track?.album?.images[0]?.url}
              alt={item.track?.name}
              className="h-12 w-12 rounded"
            />
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-medium">{item.track?.name}</p>
              <p className="truncate text-sm text-neutral-400">
                {item.track?.artists.map((a) => a.name).join(', ')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Step 4.7: Migrate Recent Tracks Page

Create `src/app/_authenticated/recentTracks.tsx`:

```typescript
// src/app/_authenticated/recentTracks.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { getRecentlyPlayed } from '@/lib/spotify'

export const Route = createFileRoute('/_authenticated/recentTracks')({
  loader: async () => {
    const recent = await getRecentlyPlayed(50)
    return { tracks: recent.items }
  },
  pendingComponent: () => <RecentTracksLoading />,
  component: RecentTracksPage,
})

function RecentTracksLoading() {
  return <div className="animate-pulse">Loading recent tracks...</div>
}

function RecentTracksPage() {
  const { tracks } = Route.useLoaderData()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Recently Played</h1>
      
      <div className="space-y-2">
        {tracks.map((item, index) => (
          <Link
            key={`${item.track.id}-${item.played_at}`}
            to="/tracks/$id"
            params={{ id: item.track.id }}
            className="flex items-center gap-4 rounded-lg bg-neutral-800 p-3 transition hover:bg-neutral-700"
          >
            <img
              src={item.track.album.images[0]?.url}
              alt={item.track.name}
              className="h-12 w-12 rounded"
            />
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-medium">{item.track.name}</p>
              <p className="truncate text-sm text-neutral-400">
                {item.track.artists.map((a) => a.name).join(', ')}
              </p>
            </div>
            <span className="text-xs text-neutral-500">
              {new Date(item.played_at).toLocaleTimeString()}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

### Step 4.8: Update Authenticated Home Page

Update `src/app/_authenticated/index.tsx`:

```typescript
// src/app/_authenticated/index.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { getMe, getTopArtists, getTopTracks, getRecentlyPlayed } from '@/lib/spotify'

export const Route = createFileRoute('/_authenticated/')({
  loader: async () => {
    const [user, topArtists, topTracks, recentTracks] = await Promise.all([
      getMe(),
      getTopArtists('short_term', 10),
      getTopTracks('short_term', 10),
      getRecentlyPlayed(10),
    ])
    
    return {
      user,
      topArtists: topArtists.items,
      topTracks: topTracks.items,
      recentTracks: recentTracks.items,
    }
  },
  component: DashboardPage,
})

function DashboardPage() {
  const { user, topArtists, topTracks, recentTracks } = Route.useLoaderData()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user.display_name}!</h1>
        <p className="text-neutral-400">Here's your Spotify overview</p>
      </div>

      {/* Top Artists Preview */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Top Artists (This Month)</h2>
          <Link to="/artists" className="text-sm text-green-400 hover:text-green-300">
            See all →
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {topArtists.map((artist) => (
            <Link
              key={artist.id}
              to="/artists/$id"
              params={{ id: artist.id }}
              className="flex-shrink-0"
            >
              <img
                src={artist.images[0]?.url}
                alt={artist.name}
                className="h-24 w-24 rounded-full object-cover"
              />
              <p className="mt-2 w-24 truncate text-center text-sm">{artist.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Tracks Preview */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Top Tracks (This Month)</h2>
          <Link to="/tracks" className="text-sm text-green-400 hover:text-green-300">
            See all →
          </Link>
        </div>
        <div className="space-y-2">
          {topTracks.slice(0, 5).map((track, index) => (
            <Link
              key={track.id}
              to="/tracks/$id"
              params={{ id: track.id }}
              className="flex items-center gap-3 rounded bg-neutral-800 p-2 hover:bg-neutral-700"
            >
              <span className="w-6 text-center text-neutral-400">{index + 1}</span>
              <img
                src={track.album.images[0]?.url}
                alt={track.name}
                className="h-10 w-10 rounded"
              />
              <div className="overflow-hidden">
                <p className="truncate text-sm font-medium">{track.name}</p>
                <p className="truncate text-xs text-neutral-400">
                  {track.artists.map((a) => a.name).join(', ')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Tracks Preview */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recently Played</h2>
          <Link to="/recentTracks" className="text-sm text-green-400 hover:text-green-300">
            See all →
          </Link>
        </div>
        <div className="space-y-2">
          {recentTracks.slice(0, 5).map((item) => (
            <Link
              key={`${item.track.id}-${item.played_at}`}
              to="/tracks/$id"
              params={{ id: item.track.id }}
              className="flex items-center gap-3 rounded bg-neutral-800 p-2 hover:bg-neutral-700"
            >
              <img
                src={item.track.album.images[0]?.url}
                alt={item.track.name}
                className="h-10 w-10 rounded"
              />
              <div className="overflow-hidden">
                <p className="truncate text-sm font-medium">{item.track.name}</p>
                <p className="truncate text-xs text-neutral-400">
                  {item.track.artists.map((a) => a.name).join(', ')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
```

### Phase 4 Checkpoint

- [ ] All routes are accessible
- [ ] Data loads correctly on each page
- [ ] Navigation between routes works
- [ ] Search params (time range) work on artists/tracks pages
- [ ] Dynamic routes ($id) load correct data

**Commit your progress:**
```bash
git add .
git commit -m "Phase 4: All routes migrated"
```

---

## Phase 5: Server Actions & Data Mutations

### Goal
Migrate server actions like follow/unfollow to TanStack server functions.

### Step 5.1: Create Follow/Unfollow Server Functions

Create `src/lib/actions.server.ts`:

```typescript
// src/lib/actions.server.ts
import { createServerFn } from '@tanstack/react-start'
import { followArtist, unfollowArtist } from './spotify'

export const followArtistFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { artistId: string }) => data)
  .handler(async ({ data }) => {
    await followArtist([data.artistId])
    return { success: true }
  })

export const unfollowArtistFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { artistId: string }) => data)
  .handler(async ({ data }) => {
    await unfollowArtist([data.artistId])
    return { success: true }
  })
```

### Step 5.2: Create Follow Button Component

Create `src/components/FollowButton.tsx`:

```typescript
// src/components/FollowButton.tsx
import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { followArtistFn, unfollowArtistFn } from '@/lib/actions.server'

interface FollowButtonProps {
  artistId: string
  isFollowing: boolean
}

export function FollowButton({ artistId, isFollowing: initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleClick = async () => {
    setIsLoading(true)
    try {
      if (isFollowing) {
        await unfollowArtistFn({ data: { artistId } })
        setIsFollowing(false)
      } else {
        await followArtistFn({ data: { artistId } })
        setIsFollowing(true)
      }
      // Optionally invalidate the route to refresh data
      router.invalidate()
    } catch (error) {
      console.error('Failed to update follow status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`rounded-full px-6 py-2 font-medium transition ${
        isFollowing
          ? 'border border-white bg-transparent text-white hover:bg-white/10'
          : 'bg-green-500 text-black hover:bg-green-400'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  )
}
```

### Step 5.3: Update Artist Detail Page to Use Follow Button

Update `src/app/_authenticated/artists.$id.tsx`:

```typescript
// Add import
import { FollowButton } from '@/components/FollowButton'

// In the component, replace the placeholder with:
<FollowButton artistId={id} isFollowing={isFollowing} />
```

### Phase 5 Checkpoint

- [ ] Follow button appears on artist detail page
- [ ] Clicking follow/unfollow updates the state
- [ ] The change persists after page reload

**Commit your progress:**
```bash
git add .
git commit -m "Phase 5: Server actions migrated"
```

---

## Phase 6: Loading & Error States

### Goal
Add proper loading and error states to all routes.

### Step 6.1: Create Skeleton Components

Ensure your existing skeleton components in `src/components/Loading/` work. If not, create simplified versions:

```typescript
// src/components/Loading/CardLoading.tsx
export function CardLoading({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square rounded-lg bg-neutral-800" />
          <div className="mt-3 h-4 w-3/4 rounded bg-neutral-800" />
          <div className="mt-2 h-3 w-1/2 rounded bg-neutral-800" />
        </div>
      ))}
    </div>
  )
}
```

### Step 6.2: Update Routes with Loading Components

Update each route to use proper pending components. Example for artists:

```typescript
// src/app/_authenticated/artists.tsx
import { CardLoading } from '@/components/Loading/CardLoading'

export const Route = createFileRoute('/_authenticated/artists')({
  // ... existing config
  pendingComponent: () => (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Top Artists</h1>
        <div className="h-10 w-32 animate-pulse rounded bg-neutral-800" />
      </div>
      <CardLoading count={20} />
    </div>
  ),
  // ...
})
```

### Step 6.3: Add Error Components

Add error handling to routes:

```typescript
export const Route = createFileRoute('/_authenticated/artists')({
  // ... existing config
  errorComponent: ({ error }) => (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-xl font-semibold text-red-500">Failed to load artists</h2>
      <p className="mt-2 text-neutral-400">{error.message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 rounded-full bg-green-500 px-6 py-2 font-medium text-black"
      >
        Try Again
      </button>
    </div>
  ),
  // ...
})
```

### Phase 6 Checkpoint

- [ ] Loading skeletons appear during data fetching
- [ ] Error states display when API calls fail
- [ ] Users can recover from errors

**Commit your progress:**
```bash
git add .
git commit -m "Phase 6: Loading and error states added"
```

---

## Phase 7: Component Updates

### Goal
Update all components to work with TanStack Router.

### Step 7.1: Update Navigation Components

Update `src/components/Nav/index.tsx`:

```typescript
// src/components/Nav/index.tsx
import { Link } from '@tanstack/react-router'
import { getMe } from '@/lib/spotify'

export async function Nav() {
  // Note: This will be called during SSR via the layout
  // We'll pass user data from the layout loader instead
  return <NavClient />
}
```

Update `src/components/Nav/NavClient.client.tsx`:

```typescript
// src/components/Nav/NavClient.client.tsx
'use client' // Remove this directive - not needed in TanStack

import { useRouteContext } from '@tanstack/react-router'

export function NavClient() {
  // Get user from route context if needed
  // Or pass as props from layout
  
  return (
    <header className="border-b border-neutral-800 p-4">
      {/* Your nav content */}
    </header>
  )
}
```

### Step 7.2: Update SideNav Component

Update `src/components/SideNav.tsx`:

```typescript
// src/components/SideNav.tsx
import { Link, useLocation } from '@tanstack/react-router'

const navItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/artists', label: 'Artists', icon: '🎤' },
  { href: '/tracks', label: 'Tracks', icon: '🎵' },
  { href: '/playlists', label: 'Playlists', icon: '📋' },
  { href: '/recentTracks', label: 'Recent', icon: '🕐' },
]

export function SideNav() {
  const location = useLocation()

  return (
    <aside className="hidden w-64 bg-black p-4 lg:block">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-green-500">Spotify Dashboard</h1>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== '/' && location.pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition ${
                isActive
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
```

### Step 7.3: Update Authenticated Layout with Components

Update `src/app/_authenticated.tsx`:

```typescript
// src/app/_authenticated.tsx
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getSessionFn } from '@/lib/auth.server'
import { getMe } from '@/lib/spotify'
import { SideNav } from '@/components/SideNav'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const session = await getSessionFn()
    
    if (!session.authenticated) {
      throw redirect({ to: '/login' })
    }

    return { session }
  },
  loader: async () => {
    const user = await getMe()
    return { user }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { user } = Route.useLoaderData()

  return (
    <div className="flex min-h-screen">
      <SideNav />
      
      <main className="flex-1">
        <header className="flex items-center justify-between border-b border-neutral-800 p-4">
          <div />
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-400">{user.display_name}</span>
            {user.images?.[0]?.url && (
              <img
                src={user.images[0].url}
                alt={user.display_name}
                className="h-8 w-8 rounded-full"
              />
            )}
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="text-sm text-neutral-400 hover:text-white"
              >
                Logout
              </button>
            </form>
          </div>
        </header>
        
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
```

### Step 7.4: Images (Optional)

If you're using `next/image`, consider using [Unpic](https://unpic.pics/) as a near drop-in replacement:

```bash
bun add @unpic/react
```

```typescript
// Before (Next.js)
import Image from 'next/image'

// After (TanStack Start with Unpic)
import { Image } from '@unpic/react'

function Component() {
  return (
    <Image
      src="/path/to/image.jpg"
      alt="Description"
      width={600}  // Note: number instead of string
      height={400}
    />
  )
}
```

### Step 7.5: Fonts (Optional)

Instead of `next/font`, use Tailwind CSS's CSS-first approach with [Fontsource](https://fontsource.org/):

```bash
bun add -D @fontsource-variable/inter
```

Update `src/styles/globals.css`:

```css
@import 'tailwindcss';

@import '@fontsource-variable/inter';

@theme inline {
  --font-sans: 'Inter Variable', sans-serif;
  /* ... */
}
```

### Step 7.6: Remove Next.js-Specific Code

Search for and update any remaining Next.js imports:

```bash
# Find remaining next imports
grep -r "from 'next" src/
grep -r 'from "next' src/
```

Replace:
- `import Link from 'next/link'` → `import { Link } from '@tanstack/react-router'`
- `import { useRouter } from 'next/navigation'` → `import { useRouter } from '@tanstack/react-router'`
- `import { usePathname } from 'next/navigation'` → `import { useLocation } from '@tanstack/react-router'`
- `router.push('/path')` → `router.navigate({ to: '/path' })`
- `router.refresh()` → `router.invalidate()`

### Phase 7 Checkpoint

- [ ] All components render correctly
- [ ] Navigation works between all pages
- [ ] User info displays in header
- [ ] No Next.js imports remain

**Commit your progress:**
```bash
git add .
git commit -m "Phase 7: All components updated"
```

---

## Phase 8: Final Polish & Deployment

### Goal
Prepare for production deployment.

### Step 8.1: Clean Up Old Files

Remove unused Next.js files:

```bash
rm -f src/middleware.ts
rm -rf src/app/\(auth\)/
rm -rf src/app/\(spotify\)/
rm -f src/app/layout.tsx
rm -f src/app/error.client.tsx
rm -rf .migration-reference/  # If you created backup
```

### Step 8.2: Verify All Routes

Test each route manually:
- [ ] / → Redirects to dashboard
- [ ] /login → Shows login page
- [ ] OAuth flow → Works end-to-end
- [ ] /artists → Shows artist grid
- [ ] /artists/:id → Shows artist detail
- [ ] /tracks → Shows track list
- [ ] /tracks/:id → Shows track detail
- [ ] /playlists → Shows playlist grid
- [ ] /playlists/:id → Shows playlist detail
- [ ] /recentTracks → Shows recent tracks
- [ ] Logout → Clears session, redirects to login

### Step 8.3: Production Build Test

```bash
bun run build
bun run start
```

Test the production build locally before deploying.

### Step 8.4: Vercel Deployment

Create `vercel.json` if needed:

```json
{
  "buildCommand": "bun run build",
  "outputDirectory": ".output",
  "framework": null
}
```

Update environment variables in Vercel:
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SESSION_SECRET`
- `VITE_APP_URL` (set to your production URL)

### Step 8.5: Update Spotify App Settings

In the Spotify Developer Dashboard, add your production callback URL:
- `https://your-domain.com/api/callback`

### Phase 8 Checkpoint

- [ ] Production build succeeds
- [ ] All routes work in production build
- [ ] Deployment to Vercel succeeds
- [ ] OAuth works in production

**Final commit:**
```bash
git add .
git commit -m "Phase 8: Migration complete, ready for production"
git checkout main
git merge tanstack-migration
```

---

## Estimated Timeline

| Phase | Description | Estimated Time |
|-------|-------------|----------------|
| 1 | Project Setup & Configuration | 1-2 hours |
| 2 | Root Layout & Entry Points | 1 hour |
| 3 | Authentication System | 3-4 hours |
| 4 | Route Migration | 4-5 hours |
| 5 | Server Actions & Data Mutations | 1 hour |
| 6 | Loading & Error States | 1 hour |
| 7 | Component Updates | 2 hours |
| 8 | Final Polish & Deployment | 2-3 hours |
| **Total** | | **15-20 hours** |

---

## Troubleshooting

### Common Issues

#### "Module not found" errors
- Run `bun install` to ensure all dependencies are installed
- Check that path aliases are correctly configured in `tsconfig.json`

#### Session not persisting
- Ensure `SESSION_SECRET` is at least 32 characters
- Check that cookies are being set (inspect in browser dev tools)
- Verify `VITE_APP_URL` matches the actual URL

#### OAuth callback failing
- Verify callback URL in Spotify Developer Dashboard
- Check that `VITE_APP_URL` is correct
- Look for error messages in the server console

#### Type errors with route tree
- Run the dev server to generate `.tanstack/routeTree.gen.ts`
- Ensure all route files export a `Route` constant

#### Loader data not available
- Ensure you're using `Route.useLoaderData()` (capital R)
- Check that the loader function is returning data correctly

### Getting Help

- **Official Next.js Migration Guide**: https://tanstack.com/start/latest/docs/framework/react/migrate-from-next-js
- TanStack Start Docs: https://tanstack.com/start/latest/docs
- TanStack Discord: https://tlinz.com/discord
- GitHub Issues: https://github.com/tanstack/router/issues
- Example Migration Repository: https://github.com/nrjdalal/next-to-start

---

## Reference: Concept Mapping

### Routing Patterns

| Next.js Pattern | TanStack Start Pattern |
|-----------------|------------------------|
| `page.tsx` | `index.tsx` or `route.tsx` |
| `[param]/page.tsx` | `$param.tsx` |
| `[...slug]/page.tsx` | `$.tsx` (splat route) |
| `(group)/` | No direct equivalent; use layout routes |
| `layout.tsx` | `__root.tsx` or `_layout.tsx` |
| `loading.tsx` | `pendingComponent` |
| `error.tsx` | `errorComponent` |
| `not-found.tsx` | `notFoundComponent` |
| `api/endpoint/route.ts` | `api/endpoint.ts` with `server.handlers` |

**Accessing Route Parameters:**

```typescript
// Dynamic route: /artists/$id
const { id } = Route.useParams()

// Catch-all route: /posts/$.tsx (matches /posts/a/b/c)
const { _splat } = Route.useParams()  // _splat = "a/b/c"

// Search params
const { page, filter } = Route.useSearch()
```

### Data Fetching

| Next.js Pattern | TanStack Start Pattern |
|-----------------|------------------------|
| Server Component async | Route `loader` function |
| `fetch` in component | `loader` with `spotifyFetch` |
| `searchParams` | `Route.useSearch()` |
| `params` | `Route.useParams()` |
| `revalidatePath` | `router.invalidate()` |

### Navigation

| Next.js Pattern | TanStack Start Pattern |
|-----------------|------------------------|
| `<Link href="">` | `<Link to="">` |
| `useRouter()` | `useRouter()` |
| `router.push()` | `router.navigate()` |
| `router.replace()` | `router.navigate({ replace: true })` |
| `router.refresh()` | `router.invalidate()` |
| `usePathname()` | `useLocation().pathname` |
| `useSearchParams()` | `Route.useSearch()` |

### Server Functions

| Next.js Pattern | TanStack Start Pattern |
|-----------------|------------------------|
| `'use server'` | `createServerFn()` |
| `cookies()` | `useSession()` or `getRequest()` |
| `headers()` | `getRequest()` |
| `redirect()` | `throw redirect()` |
| API Route `route.ts` | Server route with `handlers` |

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 2024 | Initial migration guide |

