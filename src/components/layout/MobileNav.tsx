import { Link, useLocation } from 'react-router-dom';

interface MobileNavItemProps {
  to: string;
  icon: string;
  label: string;
}

function MobileNavItem({ to, icon, label }: MobileNavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center flex-1 gap-1"
    >
      <span
        className={`material-symbols-outlined text-2xl transition-colors ${
          isActive ? 'text-indigo-400' : 'text-slate-500'
        }`}
        style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }}
      >
        {icon}
      </span>
      <span
        className={`text-[9px] font-bold tracking-widest uppercase transition-colors ${
          isActive ? 'text-indigo-400' : 'text-slate-500'
        }`}
      >
        {label}
      </span>
    </Link>
  );
}

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-950/90 backdrop-blur-xl border-t border-white/5 z-50">
      <div className="h-full flex items-center">
        <MobileNavItem to="/" icon="folder_open" label="Explore" />
        <MobileNavItem to="/library" icon="menu_book" label="Lib" />
        <MobileNavItem to="/playground" icon="play_circle" label="Code" />
      </div>
    </nav>
  );
}
