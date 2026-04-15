import { Link } from 'react-router-dom';
import { preloadAlgorithmDetail } from '../../data/algorithmDetails';
import type { AlgorithmSummary } from '../../types/algorithm';

export function AlgorithmListItem({ algorithm }: { algorithm: AlgorithmSummary }) {
  const handlePrefetch = () => {
    preloadAlgorithmDetail(algorithm.id);
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
      onMouseEnter={handlePrefetch}
      onFocus={handlePrefetch}
      onTouchStart={handlePrefetch}
    >
      <div className="group bg-surface-container border border-outline-variant rounded-xl p-5 hover:bg-surface-high transition-all duration-300 hover:-translate-y-0.5">
        <div className="flex items-center gap-6">
          {/* Icon */}
          <div className="w-14 h-14 bg-surface-highest rounded-xl border border-white/5 group-hover:border-primary/30 transition-colors duration-300 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-2xl">
              {algorithm.icon}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="font-headline text-xl font-bold text-on-surface">
                {algorithm.name}
              </h3>
              <span className="bg-surface-low px-2 py-1 rounded-md flex-shrink-0">
                <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">
                  {algorithm.id}
                </span>
              </span>
            </div>

            <p className="text-sm text-on-surface-variant line-clamp-1 mb-3 font-body">
              {algorithm.description}
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              {/* Category badge */}
              <span className="px-3 py-1 bg-surface-lowest rounded-full text-xs font-medium text-on-surface-variant border border-outline-variant">
                {algorithm.category}
              </span>

              {/* Difficulty */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-on-surface-variant font-body">Difficulty:</span>
                <span className={`text-xs font-bold ${getDifficultyColor(algorithm.difficulty)}`}>
                  {algorithm.difficulty}
                </span>
              </div>

              {/* Time Complexity */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-on-surface-variant font-body">Time:</span>
                <span className="text-xs font-mono text-on-surface">{algorithm.timeComplexity}</span>
              </div>
            </div>
          </div>

          {/* Arrow icon */}
          <div className="flex-shrink-0">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all duration-300">
              arrow_forward
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
