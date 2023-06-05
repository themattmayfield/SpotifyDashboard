'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SideNavLink = ({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <Link
      className={`${
        pathname == path
          ? 'border-[#1DB954] bg-custom-darkgray'
          : 'border-transparent hover:bg-custom-darkgray'
      } cursor-pointer w-full border-t-4 lg:border-t-0 lg:h-24 lg:border-l-4 flex items-center justify-center`}
      href={path}
    >
      {children}
    </Link>
  );
};

export default SideNavLink;
