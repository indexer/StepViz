import { lazy, Suspense, useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useAlgorithm } from '../hooks/useAlgorithms';
import { getLanguageLabel } from '../components/algorithm/codeLanguages';

const StepByStepVisualizer = lazy(async () => ({
  default: (await import('../components/algorithm/StepByStepVisualizer')).StepByStepVisualizer,
}));

const CodeHighlighter = lazy(async () => ({
  default: (await import('../components/algorithm/CodeHighlighter')).CodeHighlighter,
}));

function CodeBlockFallback({ code }: { code: string }) {
  return (
    <pre className="font-mono text-[13px] leading-6 text-on-surface-variant whitespace-pre overflow-x-auto">
      <code>{code}</code>
    </pre>
  );
}

function VisualizerFallback() {
  return (
    <div className="bg-surface-low rounded-2xl border border-white/5 p-6 animate-pulse">
      <div className="h-6 w-56 bg-surface-high rounded mb-6" />
      <div className="grid lg:grid-cols-[1fr_300px] gap-4">
        <div className="h-[420px] bg-surface-high rounded-xl" />
        <div className="h-[420px] bg-surface-high rounded-xl" />
      </div>
    </div>
  );
}

export function AlgorithmDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const autoVisualize = searchParams.get('visualize') === 'true';
  const { data: algorithm, isLoading } = useAlgorithm(id ?? '');
  const [activeLanguage, setActiveLanguage] = useState(0);
  const [showVisualizer, setShowVisualizer] = useState(autoVisualize);
  const firstStepLanguageIndex = useMemo(
    () => algorithm?.codeExamples.findIndex((ex) => ex.steps && ex.steps.length > 0) ?? -1,
    [algorithm?.codeExamples],
  );

  useEffect(() => {
    if (autoVisualize) {
      setSearchParams({}, { replace: true });
    }
  }, [autoVisualize, setSearchParams]);

  const effectiveActiveLanguage = useMemo(() => {
    if (!algorithm) {
      return activeLanguage;
    }

    const currentExample = algorithm.codeExamples[activeLanguage];
    const currentHasSteps = Boolean(currentExample?.steps && currentExample.steps.length > 0);

    if ((showVisualizer || autoVisualize) && !currentHasSteps && firstStepLanguageIndex !== -1) {
      return firstStepLanguageIndex;
    }

    return activeLanguage;
  }, [activeLanguage, algorithm, autoVisualize, firstStepLanguageIndex, showVisualizer]);

  const handleOpenVisualizer = useCallback(() => {
    // If the currently selected language has no steps, switch to one that does
    if (algorithm) {
      const currentExample = algorithm.codeExamples[activeLanguage];
      const currentHasSteps = currentExample?.steps && currentExample.steps.length > 0;
      if (!currentHasSteps) {
        const fallbackIndex = algorithm.codeExamples.findIndex(
          (ex) => ex.steps && ex.steps.length > 0
        );
        if (fallbackIndex !== -1) {
          setActiveLanguage(fallbackIndex);
        }
      }
    }
    setShowVisualizer(true);
    // Scroll to visualizer after a tick
    setTimeout(() => {
      document.getElementById('visualizer-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  }, [algorithm, activeLanguage]);

  const handleCloseVisualizer = useCallback(() => {
    setShowVisualizer(false);
  }, []);

  const isVisualizerOpen = showVisualizer || autoVisualize;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-4 w-64 bg-surface-low rounded animate-pulse mb-8" />
          <div className="mb-8">
            <div className="h-10 w-10 bg-surface-low rounded-full animate-pulse mb-4" />
            <div className="h-12 w-96 bg-surface-low rounded animate-pulse mb-4" />
            <div className="flex gap-2 mb-4">
              <div className="h-6 w-24 bg-surface-low rounded-full animate-pulse" />
              <div className="h-6 w-24 bg-surface-low rounded-full animate-pulse" />
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-surface-low rounded-2xl animate-pulse" />
              <div className="h-96 bg-surface-low rounded-2xl animate-pulse" />
            </div>
            <div className="lg:col-span-1">
              <div className="h-64 bg-surface-low rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!algorithm) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-error mb-4 block">
              error
            </span>
            <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">
              Algorithm Not Found
            </h1>
            <p className="text-on-surface-variant mb-8">
              The algorithm you're looking for doesn't exist.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-medium rounded-full hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
              Back to Library
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-tertiary/20 text-tertiary border-tertiary/30';
      case 'Medium':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'Advanced':
        return 'bg-error/20 text-error border-error/30';
      default:
        return 'bg-surface-high text-on-surface border-outline-variant';
    }
  };

  const activeExample = algorithm.codeExamples[effectiveActiveLanguage];
  const anyHasSteps = firstStepLanguageIndex !== -1;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 font-mono text-[10px] text-outline uppercase tracking-[0.2em]">
            <li>
              <Link to="/" className="hover:text-primary transition-colors">Library</Link>
            </li>
            <li><span className="material-symbols-outlined text-xs">chevron_right</span></li>
            <li>
              <Link to="/" className="hover:text-primary transition-colors">Algorithms</Link>
            </li>
            <li><span className="material-symbols-outlined text-xs">chevron_right</span></li>
            <li className="text-on-surface">{algorithm.name}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6 group"
          >
            <span className="material-symbols-outlined text-2xl group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            <span className="font-medium">Back to Library</span>
          </Link>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-4xl text-on-primary-container">
                {algorithm.icon}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="font-headline text-4xl md:text-5xl font-bold text-on-surface mb-4">
                {algorithm.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-surface-high text-on-surface text-sm font-medium rounded-full border border-white/5">
                  {algorithm.category}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getDifficultyColor(algorithm.difficulty)}`}>
                  {algorithm.difficulty}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {algorithm.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-surface-container text-on-surface-variant text-xs font-mono rounded-md border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step-by-Step Visualizer - shown when active */}
            {isVisualizerOpen && (
              <div id="visualizer-section">
                <Suspense fallback={<VisualizerFallback />}>
                  <StepByStepVisualizer
                    codeExample={activeExample}
                    algorithmName={algorithm.name}
                    onClose={handleCloseVisualizer}
                  />
                </Suspense>
              </div>
            )}

            {/* CTA Banner when visualizer is NOT open */}
            {!isVisualizerOpen && (
              <button
                onClick={handleOpenVisualizer}
                className="w-full group bg-gradient-to-r from-primary-container/30 to-tertiary-container/20 rounded-2xl p-6 border border-primary/20 hover:border-primary/40 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary-container rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-3xl text-on-primary-container">
                      play_circle
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-headline text-lg font-bold text-on-surface mb-1">
                      Understand Step by Step
                    </h3>
                    <p className="text-sm text-on-surface-variant">
                      {anyHasSteps
                        ? `Walk through ${algorithm.codeExamples[firstStepLanguageIndex].steps!.length} steps with line-by-line code highlighting and detailed explanations.`
                        : 'Interactive code walkthrough for this algorithm.'}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-2xl text-primary group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </button>
            )}

            {/* Overview */}
            <div className="bg-surface-low rounded-2xl p-6 border border-white/5">
              <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">About</h2>
              <p className="text-on-surface-variant leading-relaxed">
                {algorithm.longDescription}
              </p>
            </div>

            {/* Key Insights */}
            <div className="bg-surface-low rounded-2xl p-6 border border-white/5">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">lightbulb</span>
                <h2 className="font-headline text-2xl font-bold text-on-surface">Key Insights</h2>
              </div>
              <div className="space-y-3">
                {algorithm.keyInsights.map((insight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-surface-container rounded-xl border border-white/5"
                  >
                    <span className="material-symbols-outlined text-primary text-xl mt-0.5 flex-shrink-0">
                      check_circle
                    </span>
                    <p className="text-on-surface leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* When to Use */}
            <div className="bg-surface-low rounded-2xl p-6 border border-white/5">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-tertiary text-2xl">tips_and_updates</span>
                <h2 className="font-headline text-2xl font-bold text-on-surface">When to Use</h2>
              </div>
              <ul className="space-y-3">
                {algorithm.whenToUse.map((useCase, index) => (
                  <li key={index} className="flex items-start gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-tertiary text-xl mt-0.5 flex-shrink-0">
                      arrow_right
                    </span>
                    <span className="leading-relaxed">{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Code Examples */}
            <div className="bg-surface-low rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl">code</span>
                  <h2 className="font-headline text-2xl font-bold text-on-surface">Implementation</h2>
                </div>
                {!isVisualizerOpen && anyHasSteps && (
                  <button
                    onClick={handleOpenVisualizer}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors uppercase tracking-wider"
                  >
                    <span className="material-symbols-outlined text-sm">play_circle</span>
                    Step through
                  </button>
                )}
              </div>

              {/* Language Tabs */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {algorithm.codeExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveLanguage(index)}
                    className={`px-4 py-2 font-mono text-sm rounded-lg transition-colors whitespace-nowrap ${
                      effectiveActiveLanguage === index
                        ? 'bg-primary text-on-primary font-medium'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-high'
                    }`}
                  >
                    {getLanguageLabel(example.language)}
                  </button>
                ))}
              </div>

              {/* Code Display */}
              <div className="relative bg-surface-lowest rounded-xl p-4 overflow-x-auto border border-white/5">
                <Suspense fallback={<CodeBlockFallback code={algorithm.codeExamples[activeLanguage]?.code ?? ''} />}>
                  <CodeHighlighter
                    code={algorithm.codeExamples[effectiveActiveLanguage]?.code ?? ''}
                    language={algorithm.codeExamples[effectiveActiveLanguage]?.language ?? 'typescript'}
                  />
                </Suspense>
              </div>
            </div>

            {/* Practice Problems */}
            {algorithm.leetcodeProblems.length > 0 && (
              <div className="bg-surface-low rounded-2xl p-6 border border-white/5">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary text-2xl">psychology</span>
                  <h2 className="font-headline text-2xl font-bold text-on-surface">LeetCode Practice</h2>
                </div>
                <div className="space-y-3">
                  {algorithm.leetcodeProblems.map((problem, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-surface-container rounded-xl border border-white/5 hover:border-primary/30 transition-colors group cursor-pointer"
                    >
                      <span className="text-on-surface font-medium">{problem}</span>
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                        open_in_new
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Complexity Card */}
            <div className="bg-surface-low rounded-2xl p-6 border border-white/5 sticky top-24">
              <h3 className="font-headline text-xl font-bold text-on-surface mb-6">
                Complexity Analysis
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-on-surface-variant font-medium">Time Complexity</span>
                    <span className="font-mono text-sm text-primary font-bold">{algorithm.timeComplexity}</span>
                  </div>
                  <div className="h-1 bg-surface-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${algorithm.complexityScore * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-on-surface-variant font-medium">Space Complexity</span>
                    <span className="font-mono text-sm text-tertiary font-bold">{algorithm.spaceComplexity}</span>
                  </div>
                  <div className="h-1 bg-surface-highest rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary w-1/2" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-on-surface-variant font-medium">Difficulty</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getDifficultyColor(algorithm.difficulty)}`}>
                      {algorithm.difficulty}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-on-surface-variant font-medium">Complexity Score</span>
                    <span className="font-mono text-sm text-on-surface font-bold">
                      {Math.round(algorithm.complexityScore * 100)}/100
                    </span>
                  </div>
                  <div className="h-2 bg-surface-highest rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-tertiary via-primary to-error rounded-full transition-all"
                      style={{ width: `${algorithm.complexityScore * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant font-mono uppercase tracking-wider">Algorithm ID</span>
                  <span className="text-xs text-on-surface font-mono">{algorithm.id}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-surface-low rounded-2xl p-6 border border-white/5">
              <h3 className="font-headline text-xl font-bold text-on-surface mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleOpenVisualizer}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-container to-primary/80 text-on-primary-container font-bold text-xs uppercase tracking-widest rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/10"
                >
                  <span className="material-symbols-outlined">play_arrow</span>
                  {showVisualizer ? 'Viewing Steps' : 'Visualize Algorithm'}
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-surface-container text-on-surface font-medium rounded-xl hover:bg-surface-high transition-colors border border-white/5">
                  <span className="material-symbols-outlined">share</span>
                  Share
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-surface-container text-on-surface font-medium rounded-xl hover:bg-surface-high transition-colors border border-white/5">
                  <span className="material-symbols-outlined">bookmark</span>
                  Bookmark
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
