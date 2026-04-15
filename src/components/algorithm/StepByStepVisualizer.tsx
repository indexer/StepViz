import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import type { CodeExample, CodeStep } from "../../types/algorithm";
import { CodeHighlighter } from "./CodeHighlighter";

interface StepByStepVisualizerProps {
  codeExample: CodeExample;
  algorithmName: string;
  onClose: () => void;
}

export function StepByStepVisualizer({
  codeExample,
  algorithmName,
  onClose,
}: StepByStepVisualizerProps) {
  const steps = codeExample.steps ?? [];
  const [currentStep, setCurrentStep] = useState(-1); // -1 = overview, 0+ = steps
  const [isPlaying, setIsPlaying] = useState(false);
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null);

  const totalSteps = steps.length;
  const activeStep: CodeStep | null = currentStep >= 0 && currentStep < totalSteps ? steps[currentStep] : null;

  const highlightedLines = useMemo(
    () => activeStep?.lines ?? [],
    [activeStep]
  );

  const goNext = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev < totalSteps - 1) return prev + 1;
      setIsPlaying(false);
      return prev;
    });
  }, [totalSteps]);

  const goPrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(-1, prev - 1));
    setIsPlaying(false);
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (currentStep >= totalSteps - 1) {
      setCurrentStep(-1);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [currentStep, totalSteps]);

  const reset = useCallback(() => {
    setCurrentStep(-1);
    setIsPlaying(false);
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setTimeout(() => {
        goNext();
      }, 2500);
    }
    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [isPlaying, currentStep, goNext]);

  // Scroll to highlighted line
  useEffect(() => {
    if (activeStep && codeContainerRef.current) {
      const firstLine = activeStep.lines[0];
      if (firstLine) {
        const lineEl = codeContainerRef.current.querySelector(
          `[data-line="${firstLine}"]`
        );
        if (lineEl) {
          lineEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  }, [activeStep]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, onClose]);

  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  if (steps.length === 0) {
    return (
      <div className="bg-surface-low rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">
              play_circle
            </span>
            <h2 className="font-headline text-xl font-bold text-on-surface">
              Step-by-Step Walkthrough
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              close
            </span>
          </button>
        </div>
        <div className="p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-outline mb-4 block">
            construction
          </span>
          <p className="text-on-surface-variant text-lg mb-2">
            Step-by-step walkthrough coming soon
          </p>
          <p className="text-outline text-sm">
            This algorithm's interactive walkthrough is being prepared.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-low rounded-2xl border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary-container text-xl">
                play_circle
              </span>
            </div>
            <div>
              <h2 className="font-headline text-lg md:text-xl font-bold text-on-surface">
                Step-by-Step: {algorithmName}
              </h2>
              <p className="text-xs text-on-surface-variant font-mono">
                {codeExample.language} implementation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              close
            </span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-surface-highest rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-tertiary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(progress, 0)}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] font-mono text-outline uppercase tracking-widest">
            {currentStep < 0
              ? "Overview"
              : `Step ${currentStep + 1} of ${totalSteps}`}
          </span>
          <span className="text-[10px] font-mono text-outline">
            {Math.round(Math.max(progress, 0))}% complete
          </span>
        </div>
      </div>

      {/* Main content: code + explanation side by side */}
      <div className="flex flex-col lg:flex-row">
        {/* Code panel */}
        <div
          className="flex-1 overflow-auto max-h-[560px] border-b lg:border-b-0 lg:border-r border-white/5 p-1"
          ref={codeContainerRef}
        >
          <CodeHighlighter
            code={codeExample.code}
            language={codeExample.language}
            highlightedLines={highlightedLines}
            dimNonHighlighted={currentStep >= 0}
          />
        </div>

        {/* Explanation panel */}
        <div className="w-full lg:w-[300px] flex-shrink-0 flex flex-col">
          {/* Step explanation */}
          <div className="flex-1 p-5">
            {currentStep < 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 bg-primary-container/20 rounded-2xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    touch_app
                  </span>
                </div>
                <h3 className="font-headline text-lg font-bold text-on-surface mb-2">
                  Ready to explore
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                  Press <kbd className="px-2 py-0.5 bg-surface-highest rounded text-xs font-mono text-primary border border-white/10">Next</kbd> or <kbd className="px-2 py-0.5 bg-surface-highest rounded text-xs font-mono text-primary border border-white/10">Play</kbd> to
                  walk through the code step by step. Each step highlights the
                  relevant lines and explains what happens.
                </p>
                <div className="flex items-center gap-4 text-[10px] text-outline font-mono uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      keyboard
                    </span>
                    Arrow keys
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      space_bar
                    </span>
                    Space = Next
                  </span>
                </div>
              </div>
            ) : activeStep ? (
              <div>
                {/* Step badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary text-on-primary-fixed text-xs font-bold">
                    {currentStep + 1}
                  </span>
                  <h3 className="font-headline text-base font-bold text-on-surface">
                    {activeStep.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm text-on-surface-variant leading-relaxed mb-5">
                  {activeStep.description}
                </p>

                {/* Variables state */}
                {activeStep.variables &&
                  Object.keys(activeStep.variables).length > 0 && (
                    <div className="bg-surface-lowest rounded-xl p-4 border border-white/5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-tertiary text-sm">
                          data_object
                        </span>
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                          Variable State
                        </span>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(activeStep.variables).map(
                          ([varName, varValue]) => (
                            <div
                              key={varName}
                              className="flex items-center justify-between gap-3"
                            >
                              <code className="text-xs font-mono text-primary">
                                {varName}
                              </code>
                              <code className="text-xs font-mono text-tertiary bg-surface-container px-2 py-0.5 rounded">
                                {varValue}
                              </code>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Line reference */}
                <div className="mt-4 flex items-center gap-2 text-[10px] text-outline font-mono">
                  <span className="material-symbols-outlined text-xs">
                    code
                  </span>
                  Lines {activeStep.lines.join(", ")}
                </div>
              </div>
            ) : null}
          </div>

          {/* Step indicators (dots) */}
          <div className="px-5 pb-3">
            <div className="flex items-center gap-1 flex-wrap">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToStep(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentStep
                      ? "bg-primary w-6"
                      : i < currentStep
                      ? "bg-primary/40"
                      : "bg-surface-highest"
                  }`}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-white/5 bg-surface-container/50">
        <div className="flex items-center justify-between">
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-base">
              restart_alt
            </span>
            Reset
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              disabled={currentStep <= -1}
              className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:text-on-surface bg-surface-highest hover:bg-surface-bright rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-lg">
                arrow_back
              </span>
              Prev
            </button>

            <button
              onClick={togglePlay}
              className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${
                isPlaying
                  ? "bg-tertiary/20 text-tertiary border border-tertiary/30"
                  : "bg-gradient-to-r from-primary-container to-primary/80 text-on-primary-container shadow-lg shadow-primary/10"
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {isPlaying ? "pause" : "play_arrow"}
              </span>
              {isPlaying
                ? "Pause"
                : currentStep >= totalSteps - 1
                ? "Replay"
                : "Play"}
            </button>

            <button
              onClick={goNext}
              disabled={currentStep >= totalSteps - 1}
              className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:text-on-surface bg-surface-highest hover:bg-surface-bright rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
              <span className="material-symbols-outlined text-lg">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="text-[10px] font-mono text-outline hidden md:block">
            <kbd className="px-1.5 py-0.5 bg-surface-highest rounded border border-white/10">
              Esc
            </kbd>{" "}
            close
          </div>
        </div>
      </div>
    </div>
  );
}
