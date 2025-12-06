// src/app/login.tsx
import { createFileRoute } from '@tanstack/react-router';
import { loginFn } from '@/lib/auth';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">Spotify Dashboard</h1>
        <p className="mt-2 text-neutral-400">
          Login to view your Spotify stats
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await loginFn();
          }}
        >
          <button
            type="submit"
            className="mt-6 rounded-full bg-green-500 px-8 py-3 font-semibold text-black transition hover:bg-green-400"
          >
            Login with Spotify
          </button>
        </form>
      </div>
    </main>
  );
}
