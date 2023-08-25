'use client';

import { usePathname, useRouter } from 'next/navigation';

const SideNavLink = ({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const { push } = useRouter();

  const currentPath = pathname.split('/').at(1);
  const pathProp = path.split('/').at(1);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        push(path);
      }}
      className={`${
        currentPath === pathProp
          ? 'border-[#1DB954] bg-custom-darkgray'
          : 'border-transparent hover:bg-custom-darkgray'
      } group z-10 cursor-pointer w-full border-t-4 lg:border-t-0 lg:h-24 lg:border-l-4 flex items-center justify-center`}
    >
      {children}
    </button>
  );
};

export default SideNavLink;
