import { useDeferredValue, useMemo, useState } from 'react';
import { useAlgorithms, useCategories } from '../hooks/useAlgorithms';
import { AlgorithmGrid, AlgorithmList, FilterSidebar, Pagination } from '../components/algorithm';
import type { AlgorithmFilters, Category, Difficulty, ViewMode } from '../types/algorithm';

const DIFFICULTIES: Difficulty[] = ['Beginner', 'Medium', 'Advanced'];

export function LibraryPage() {
  const [filters, setFilters] = useState<AlgorithmFilters>({
    categories: [],
    difficulties: [],
    search: ''
  });
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const pageSize = 12;
  const deferredSearch = useDeferredValue(filters.search);
  const deferredFilters = useMemo<AlgorithmFilters>(
    () => ({
      ...filters,
      search: deferredSearch,
    }),
    [deferredSearch, filters],
  );

  const { data: algorithmsData, isLoading } = useAlgorithms(deferredFilters, page, pageSize);

  const { data: categoriesData } = useCategories();

  const handleCategoryToggle = (category: Category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
    setPage(1);
  };

  const handleDifficultyToggle = (difficulty: Difficulty) => {
    setFilters(prev => ({
      ...prev,
      difficulties: prev.difficulties.includes(difficulty)
        ? prev.difficulties.filter(d => d !== difficulty)
        : [...prev.difficulties, difficulty]
    }));
    setPage(1);
  };

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-surface-base">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="font-mono text-[10px] text-outline uppercase tracking-[0.2em] mb-3">
            Library &gt; Algorithms
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary-default">
              Algorithm Library
            </h1>

            {/* View Mode Toggle */}
            <div className="bg-surface-low p-1 rounded-xl inline-flex gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  viewMode === 'grid'
                    ? 'bg-surface-high text-primary-default shadow-sm'
                    : 'text-primary-muted hover:text-primary-default'
                }`}
              >
                <span className="material-symbols-outlined text-xl align-middle mr-1">
                  grid_view
                </span>
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  viewMode === 'list'
                    ? 'bg-surface-high text-primary-default shadow-sm'
                    : 'text-primary-muted hover:text-primary-default'
                }`}
              >
                <span className="material-symbols-outlined text-xl align-middle mr-1">
                  view_list
                </span>
                List
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary-muted text-xl">
                search
              </span>
              <input
                type="text"
                placeholder="Search algorithms..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-surface-low border border-outline-default rounded-xl text-primary-default placeholder:text-primary-muted focus:outline-none focus:ring-2 focus:ring-accent-default focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <FilterSidebar
              categories={categoriesData?.categories || []}
              selectedCategories={filters.categories}
              onCategoryToggle={handleCategoryToggle}
              difficulties={DIFFICULTIES}
              selectedDifficulties={filters.difficulties}
              onDifficultyToggle={handleDifficultyToggle}
              categoryCounts={categoriesData?.counts || {}}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {isLoading ? (
              // Loading Skeleton
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
              }>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-surface-low rounded-2xl p-6 animate-pulse"
                  >
                    <div className="h-6 bg-surface-high rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-surface-high rounded w-full mb-2"></div>
                    <div className="h-4 bg-surface-high rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <AlgorithmGrid algorithms={algorithmsData?.data || []} />
                ) : (
                  <AlgorithmList algorithms={algorithmsData?.data || []} />
                )}

                {/* Pagination */}
                {algorithmsData && algorithmsData.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={page}
                      totalPages={algorithmsData.totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
