import { Link, useLocation } from 'react-router-dom';

interface NavItemProps {
  to: string;
  icon: string;
  label: string;
}

function NavItem({ to, icon, label }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 px-4 py-3 text-[11px] font-semibold tracking-widest uppercase transition-colors
        ${
          isActive
            ? 'bg-indigo-500/10 text-indigo-400 border-r-2 border-indigo-500'
            : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
        }
      `}
    >
      <span className="material-symbols-outlined text-xl">
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 pt-16 bg-slate-950/50 backdrop-blur-lg border-r border-white/5">
      {/* Top section */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-indigo-400">
              folder_open
            </span>
          </div>
          <div className="flex-1">
            <h2 className="font-headline font-bold text-slate-200 text-sm">
              StepViz Engine
            </h2>
            <p className="text-[10px] text-slate-500 tracking-wider">
              v1.0.0
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <NavItem to="/" icon="folder_open" label="Explorer" />
        <NavItem to="/library" icon="menu_book" label="Library" />
        <NavItem to="/playground" icon="play_circle" label="Playground" />
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-white/5">
        <Link
          to="/playground"
          className="block w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-opacity text-center"
        >
          New Snippet
        </Link>
      </div>
    </aside>
  );
}
