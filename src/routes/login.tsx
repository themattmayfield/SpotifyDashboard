import { createFileRoute } from '@tanstack/react-router';
import { SiSpotify } from 'react-icons/si';

export const Route = createFileRoute('/login')({ component: Login });
function Login() {
  return (
    <div className="relative flex h-[100dvh] flex-col items-center justify-center overflow-hidden bg-canvas px-6 text-center text-label">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.12),transparent_60%)]" />
      <div className="relative flex flex-col items-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-[22px] bg-gradient-to-b from-[#2c2c2e] to-[#1c1c1e] shadow-[0_20px_50px_rgba(0,0,0,0.6)] ring-1 ring-inset ring-white/10">
          <SiSpotify className="h-10 w-10" />
        </span>
        <h1 className="mt-8 text-[48px] font-semibold leading-none tracking-[-0.035em] md:text-[64px]">
          Wrapper
        </h1>
        <p className="mt-4 max-w-sm text-[17px] text-label-secondary">
          Your top artists, tracks, and listening history.
        </p>
        <form action="/api/login" method="get" className="mt-10">
          <button type="submit" className="btn-primary h-12 px-7 text-[15px]">
            <SiSpotify className="h-5 w-5" />
            Continue with Spotify
          </button>
        </form>
      </div>
    </div>
  );
}
