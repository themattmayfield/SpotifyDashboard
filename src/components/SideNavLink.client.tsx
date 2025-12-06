import { Link, useLocation } from '@tanstack/react-router';

const SideNavLink = ({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) => {
  const location = useLocation();

  const currentPath = location.pathname.split('/').at(1);
  const pathProp = path.split('/').at(1);
  const isActive = currentPath === pathProp;

  return (
    <Link
      to={path}
      className={`${
        isActive
          ? 'border-[#1DB954] bg-custom-darkgray'
          : 'border-transparent hover:bg-custom-darkgray'
      } group z-10 cursor-pointer w-full border-t-4 lg:border-t-0 lg:h-24 lg:border-l-4 flex items-center justify-center`}
    >
      {children}
    </Link>
  );
};

export default SideNavLink;
