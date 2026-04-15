import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-950">
      <TopBar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 min-h-screen pt-16 p-8 md:pl-8 md:ml-64 pb-20 md:pb-8">
          <Outlet />
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
