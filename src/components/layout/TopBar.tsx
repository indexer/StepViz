import { Link } from 'react-router-dom';

export function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="font-headline font-bold tracking-tighter text-indigo-400 text-xl">
            StepViz
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Search input - hidden on mobile */}
          <div className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 min-w-[240px]">
            <span className="material-symbols-outlined text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-slate-300 placeholder:text-slate-500 flex-1"
            />
          </div>

          {/* User avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
            U
          </div>
        </div>
      </div>
    </header>
  );
}
