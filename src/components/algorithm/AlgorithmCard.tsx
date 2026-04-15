import { Link, useNavigate } from 'react-router-dom';
import { preloadAlgorithmDetail } from '../../data/algorithmDetails';
import type { AlgorithmSummary } from '../../types/algorithm';

export function AlgorithmCard({ algorithm }: { algorithm: AlgorithmSummary }) {
  const navigate = useNavigate();
  const handlePrefetch = () => {
    preloadAlgorithmDetail(algorithm.id);
  };

  const handleVisualize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/algorithm/${algorithm.id}?visualize=true`);
  };

  const handleCodeView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/algorithm/${algorithm.id}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-primary-container';
      case 'Medium':
        return 'text-tertiary';
      case 'Advanced':
        return 'text-error';
      default:
        return 'text-on-surface-variant';
    }
  };

  return (
    <Link
      to={`/algorithm/${algorithm.id}`}
      className="block"
      onMouseEnter={handlePrefetch}
      onFocus={handlePrefetch}
      onTouchStart={handlePrefetch}
    >
      <div className="group relative bg-surface-container border border-outline-variant rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

        <div className="relative z-10">
          {/* Top section: Icon and ID badge */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-surface-highest rounded-xl border border-white/5 group-hover:border-primary/30 transition-colors duration-300 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-2xl">
                {algorithm.icon}
              </span>
            </div>
            <div className="bg-surface-low px-2 py-1 rounded-md">
              <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">
                {algorithm.id}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">
            {algorithm.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-on-surface-variant line-clamp-2 mb-4 font-body">
            {algorithm.description}
          </p>

          {/* Stats section */}
          <div className="space-y-3">
            {/* Time Complexity */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant font-body">Time Complexity</span>
              <span className="text-xs font-mono text-on-surface">{algorithm.timeComplexity}</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-surface-lowest rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${algorithm.complexityScore * 100}%` }}
              />
            </div>

            {/* Difficulty */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant font-body">Difficulty</span>
              <span className={`text-xs font-bold ${getDifficultyColor(algorithm.difficulty)}`}>
                {algorithm.difficulty}
              </span>
            </div>
          </div>

          {/* Bottom: Visualize button and code icon */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={handleVisualize}
              className="flex-1 bg-gradient-to-r from-primary to-indigo-600 text-on-primary-fixed font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
            >
              Visualize
            </button>
            <button
              onClick={handleCodeView}
              className="w-12 h-12 bg-surface-highest hover:bg-surface-high border border-outline-variant rounded-xl flex items-center justify-center transition-colors duration-300 group/code"
            >
              <span className="material-symbols-outlined text-on-surface-variant group-hover/code:text-primary transition-colors">
                code
              </span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
