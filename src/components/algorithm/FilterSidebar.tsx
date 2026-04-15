import type { Category, Difficulty } from '../../types/algorithm';

interface FilterSidebarProps {
  categories: Category[];
  selectedCategories: Category[];
  onCategoryToggle: (category: Category) => void;
  difficulties: Difficulty[];
  selectedDifficulties: Difficulty[];
  onDifficultyToggle: (difficulty: Difficulty) => void;
  categoryCounts: Record<Category, number>;
}

export function FilterSidebar({
  categories,
  selectedCategories,
  onCategoryToggle,
  difficulties,
  selectedDifficulties,
  onDifficultyToggle,
  categoryCounts,
}: FilterSidebarProps) {
  const getDifficultyLabel = (difficulty: Difficulty): string => {
    return difficulty === 'Medium' ? 'Intermediate' : difficulty;
  };

  return (
    <div className="bg-surface-container border border-outline-variant rounded-2xl p-6 sticky top-6">
      <div className="space-y-6">
        {/* Categories Section */}
        <div>
          <h3 className="text-[11px] font-bold tracking-widest uppercase text-outline mb-4 font-body">
            Categories
          </h3>
          <div className="space-y-2">
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category);
              const count = categoryCounts[category] || 0;

              return (
                <button
                  key={category}
                  onClick={() => onCategoryToggle(category)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200 font-body text-sm ${
                    isSelected
                      ? 'bg-surface-low text-indigo-400 font-medium'
                      : 'text-on-surface-variant hover:bg-white/5'
                  }`}
                >
                  <span>{category}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : 'bg-surface-highest text-on-surface-variant'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty Section */}
        <div>
          <h3 className="text-[11px] font-bold tracking-widest uppercase text-outline mb-4 font-body">
            Difficulty
          </h3>
          <div className="space-y-3">
            {difficulties.map((difficulty) => {
              const isSelected = selectedDifficulties.includes(difficulty);

              return (
                <label
                  key={difficulty}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onDifficultyToggle(difficulty)}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-outline-variant rounded bg-surface-highest peer-checked:bg-primary peer-checked:border-primary transition-all duration-200 flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-primary-fixed text-sm opacity-0 peer-checked:opacity-100 transition-opacity">
                        check
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors font-body">
                    {getDifficultyLabel(difficulty)}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Custom Benchmarks Promo */}
        <div className="mt-8 p-5 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-500/20 rounded-xl">
          <div className="flex items-start gap-3 mb-3">
            <span className="material-symbols-outlined text-indigo-400 text-xl">
              speed
            </span>
            <div>
              <h4 className="font-headline font-bold text-on-surface text-sm mb-1">
                Custom Benchmarks
              </h4>
              <p className="text-xs text-on-surface-variant font-body leading-relaxed">
                Compare algorithm performance with custom datasets and configurations.
              </p>
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-primary to-indigo-600 text-on-primary-fixed font-bold text-xs uppercase tracking-widest py-2.5 px-4 rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
}
