import { Link, useRouter } from '@tanstack/react-router';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { SiSpotify } from 'react-icons/si';

import UserMenu from './UserMenu';

export default function Nav() {
  const router = useRouter();
  return (
    <header className="glass sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between px-4 md:px-8 lg:h-16">
      <Link
        to="/"
        aria-label="Home"
        className="flex items-center gap-2 text-[19px] font-semibold tracking-[-0.02em] lg:hidden"
      >
        <SiSpotify className="h-6 w-6" />
        AuxCheck
      </Link>
      <div className="hidden items-center gap-1 lg:flex">
        <button
          type="button"
          aria-label="Go back"
          className="btn-icon"
          onClick={() => router.history.back()}
        >
          <IoChevronBack className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Go forward"
          className="btn-icon"
          onClick={() => router.history.forward()}
        >
          <IoChevronForward className="h-5 w-5" />
        </button>
      </div>
      <div className="lg:hidden">
        <UserMenu variant="avatar" />
      </div>
    </header>
  );
}
