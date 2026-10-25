import Nav from '@/components/Nav';
import SideNav from '@/components/SideNav';
import { ensureAuthenticated } from '@/lib/auth';
import { createFileRoute, Outlet } from '@tanstack/react-router';
export const Route = createFileRoute('/_spotify')({
  beforeLoad: () => ensureAuthenticated(),
  component: () => (
    <div className="flex h-screen bg-transparent lg:pr-6 lg:pl-2 no-scrollbar overflow-hidden">
      <SideNav />
      <div className="flex flex-col min-h-screen overflow-x-hidden flex-grow no-scrollbar">
        <Nav />
        <Outlet />
      </div>
    </div>
  ),
});
