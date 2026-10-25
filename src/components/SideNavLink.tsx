import { Link } from '@tanstack/react-router';
export default function SideNavLink({
  path,
  children,
}: { path: string; children: React.ReactNode }) {
  return (
    <Link
      to={path}
      activeOptions={{ exact: path === '/' }}
      activeProps={{ className: 'border-[#1DB954] bg-custom-darkgray' }}
      inactiveProps={{
        className: 'border-transparent hover:bg-custom-darkgray',
      }}
      className="group z-10 cursor-pointer w-full border-t-4 lg:border-t-0 lg:h-24 lg:border-l-4 flex items-center justify-center"
    >
      {children}
    </Link>
  );
}
