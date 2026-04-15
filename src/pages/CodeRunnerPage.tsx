import {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import {
  interpret,
  type ExecSnapshot,
} from "../engine/interpreter";
import {
  PLAYGROUND_EXAMPLES,
  type PlaygroundExample,
} from "../engine/playgroundExamples";

type Lang = "typescript" | "python" | "kotlin";
const LANGUAGES: { key: Lang; label: string }[] = [
  { key: "typescript", label: "TypeScript" },
  { key: "python", label: "Python" },
  { key: "kotlin", label: "Kotlin" },
];

function escHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function CodeRunnerPage() {
  /* ── state ──────────────────────────────────────────── */
  const [language, setLanguage] = useState<Lang>("typescript");
  const [mode, setMode] = useState<"edit" | "run">("edit");
  const [code, setCode] = useState(PLAYGROUND_EXAMPLES[0].code.typescript);
  const [states, setStates] = useState<ExecSnapshot[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [error, setError] = useState<string | null>(null);
  const [examplesOpen, setExamplesOpen] = useState(false);

  const playTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codeDisplayRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);

  /* ── derived ────────────────────────────────────────── */
  const currentState: ExecSnapshot | null = states[currentStep] ?? null;
  const totalSteps = states.length;

  const varNames = useMemo(() => {
    if (!currentState) return [];
    return Object.keys(currentState.vars).filter(
      (k) => !currentState.arrays[k]
    );
  }, [currentState]);

  const arrayNames = useMemo(
    () => (currentState ? Object.keys(currentState.arrays) : []),
    [currentState]
  );

  const prevState: ExecSnapshot | null =
    currentStep > 0 ? states[currentStep - 1] : null;

  /* ── actions ────────────────────────────────────────── */

  const stopPlay = useCallback(() => {
    setPlaying(false);
    if (playTimer.current) clearTimeout(playTimer.current);
  }, []);

  const switchToEdit = useCallback(() => {
    setMode("edit");
    stopPlay();
    setStates([]);
    setCurrentStep(0);
    setError(null);
  }, [stopPlay]);

  const switchToRun = useCallback(() => {
    const trimmed = code.trim();
    if (!trimmed) return;
    try {
      const result = interpret(trimmed, language);
      setStates(result);
      setCurrentStep(0);
      setMode("run");
      setError(null);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Parse error. Use simple syntax: variables, loops, if/else, arrays."
      );
    }
  }, [code, language]);

  const stepForward = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev < totalSteps - 1) return prev + 1;
      setPlaying(false);
      return prev;
    });
  }, [totalSteps]);

  const stepBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
    setPlaying(false);
  }, []);

  const resetViz = useCallback(() => {
    stopPlay();
    setCurrentStep(0);
  }, [stopPlay]);

  const togglePlay = useCallback(() => {
    if (playing) {
      stopPlay();
    } else {
      if (currentStep >= totalSteps - 1) setCurrentStep(0);
      setPlaying(true);
    }
  }, [playing, currentStep, totalSteps, stopPlay]);

  const loadExample = useCallback(
    (ex: PlaygroundExample) => {
      setCode(ex.code[language]);
      setExamplesOpen(false);
      if (mode === "run") switchToEdit();
    },
    [language, mode, switchToEdit]
  );

  const switchLanguage = useCallback(
    (lang: Lang) => {
      // try to find matching example to translate code
      const currentExample = PLAYGROUND_EXAMPLES.find(
        (ex) => ex.code[language] === code.trim()
      );
      setLanguage(lang);
      if (currentExample) {
        setCode(currentExample.code[lang]);
      }
      if (mode === "run") switchToEdit();
    },
    [language, code, mode, switchToEdit]
  );

  /* ── auto-play timer ────────────────────────────────── */
  useEffect(() => {
    if (playing) {
      playTimer.current = setTimeout(() => {
        stepForward();
      }, speed);
    }
    return () => {
      if (playTimer.current) clearTimeout(playTimer.current);
    };
  }, [playing, currentStep, stepForward, speed]);

  /* ── keyboard nav ───────────────────────────────────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (mode !== "run") return;
      // Don't capture if user is typing in textarea
      if ((e.target as HTMLElement)?.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        stepForward();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepBack();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mode, stepForward, stepBack]);

  /* ── close dropdown on outside click ────────────────── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement)?.closest(".examples-dropdown")) {
        setExamplesOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  /* ── scroll to active line ──────────────────────────── */
  useEffect(() => {
    if (mode === "run" && currentState && currentState.line >= 0 && codeDisplayRef.current) {
      const lineEl = codeDisplayRef.current.querySelector(
        `[data-line="${currentState.line}"]`
      );
      if (lineEl) {
        lineEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [mode, currentState]);

  /* ── render ─────────────────────────────────────────── */
  const codeLines = code.split("\n");

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* ── Top bar ────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/5 bg-surface-low/80 backdrop-blur-md flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container text-lg">
              play_circle
            </span>
          </div>
          <div>
            <h1 className="font-headline text-base font-bold text-on-surface">
              Code Playground
            </h1>
            <p className="text-[10px] text-outline font-mono uppercase tracking-wider">
              Interactive Step Visualizer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language tabs */}
          <div className="hidden sm:flex items-center gap-1 bg-surface-lowest rounded-xl p-1">
            {LANGUAGES.map((l) => (
              <button
                key={l.key}
                onClick={() => switchLanguage(l.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  language === l.key
                    ? "bg-primary-container text-on-primary-container"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Mode toggle */}
          <div className="flex items-center gap-1 bg-surface-lowest rounded-xl p-1">
            <button
              onClick={switchToEdit}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                mode === "edit"
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Edit
            </button>
            <button
              onClick={switchToRun}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                mode === "run"
                  ? "bg-green-500/20 text-green-400"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Visualize
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile language tabs ───────────────────────── */}
      <div className="flex sm:hidden items-center gap-1 px-4 py-2 border-b border-white/5 bg-surface-low/50">
        {LANGUAGES.map((l) => (
          <button
            key={l.key}
            onClick={() => switchLanguage(l.key)}
            className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-lg transition-all ${
              language === l.key
                ? "bg-primary-container text-on-primary-container"
                : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* ── Main split panels ──────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ── Left: Code Panel ─────────────────────────── */}
        <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 min-h-0">
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-2 bg-surface-container/50 border-b border-white/5 flex-shrink-0">
            <span className="text-[10px] font-mono text-outline uppercase tracking-widest">
              Code
            </span>
            <div className="examples-dropdown relative">
              <button
                onClick={() => setExamplesOpen((p) => !p)}
                className="text-[10px] font-mono text-on-surface-variant px-2 py-1 rounded border border-white/10 hover:border-primary/40 hover:text-primary transition-colors"
              >
                Examples ▾
              </button>
              {examplesOpen && (
                <div className="absolute top-full right-0 mt-1 bg-surface-high border border-white/10 rounded-xl p-1 z-50 min-w-[200px] shadow-2xl shadow-black/40">
                  {PLAYGROUND_EXAMPLES.map((ex) => (
                    <button
                      key={ex.key}
                      onClick={() => loadExample(ex)}
                      className="block w-full text-left px-3 py-2 text-xs text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Code area */}
          <div className="flex-1 overflow-auto min-h-0" ref={codeDisplayRef}>
            {mode === "edit" ? (
              <textarea
                className="code-runner-editor w-full h-full bg-transparent text-on-surface font-mono text-[13px] leading-7 p-4 resize-none outline-none"
                spellCheck={false}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`Paste your ${language} code here...\n\nSupported: variables, arrays, while/for loops, if/else, basic math.`}
              />
            ) : (
              <div className="font-mono text-[13px] leading-7">
                {codeLines.map((line, i) => {
                  const isActive = currentState?.line === i;
                  const wasPrev =
                    currentStep > 0 &&
                    states.slice(0, currentStep).some((s) => s.line === i) &&
                    !isActive;
                  return (
                    <div
                      key={i}
                      data-line={i}
                      className={`flex gap-3 px-4 py-0.5 transition-colors duration-200 ${
                        isActive
                          ? "bg-primary/15"
                          : wasPrev
                          ? "bg-green-500/5"
                          : ""
                      }`}
                    >
                      <span
                        className={`inline-block w-8 text-right flex-shrink-0 select-none text-xs leading-7 ${
                          isActive
                            ? "text-primary font-medium"
                            : "text-outline/50"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span
                        className={`flex-1 whitespace-pre ${
                          isActive
                            ? "text-primary font-medium"
                            : wasPrev
                            ? "text-green-400/70"
                            : "text-on-surface-variant"
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: escHtml(line) || "\u200B",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Controls bar (run mode only) */}
          {mode === "run" && (
            <div className="flex items-center gap-2 px-4 py-3 bg-surface-container/50 border-t border-white/5 flex-shrink-0 flex-wrap">
              <button
                onClick={stepBack}
                disabled={currentStep === 0}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-on-surface-variant hover:text-on-surface bg-surface-highest hover:bg-surface-bright rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-base">
                  arrow_back
                </span>
                Back
              </button>

              <button
                onClick={stepForward}
                disabled={currentStep >= totalSteps - 1}
                className="flex items-center gap-1 px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-primary-container to-primary/80 text-on-primary-container rounded-lg shadow-lg shadow-primary/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
                <span className="material-symbols-outlined text-base">
                  arrow_forward
                </span>
              </button>

              <button
                onClick={togglePlay}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  playing
                    ? "bg-tertiary/20 text-tertiary border border-tertiary/30"
                    : "text-on-surface-variant hover:text-on-surface bg-surface-highest hover:bg-surface-bright"
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {playing ? "pause" : "play_arrow"}
                </span>
                {playing ? "Pause" : "Play"}
              </button>

              <button
                onClick={resetViz}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-base">
                  restart_alt
                </span>
                Reset
              </button>

              <div className="flex-1" />

              <div className="flex items-center gap-2 text-[10px] text-outline font-mono">
                <span>Speed</span>
                <input
                  type="range"
                  min={200}
                  max={2000}
                  step={100}
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-16 accent-primary"
                />
              </div>

              <span className="text-[10px] font-mono text-outline">
                {currentStep} / {totalSteps - 1}
              </span>
            </div>
          )}
        </div>

        {/* ── Right: Visualization Panel ───────────────── */}
        <div className="flex-1 flex flex-col min-h-0 lg:max-w-[50%]">
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-2 bg-surface-container/50 border-b border-white/5 flex-shrink-0">
            <span className="text-[10px] font-mono text-outline uppercase tracking-widest">
              Visualization
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                mode === "run"
                  ? "bg-green-500/15 text-green-400"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {mode === "run" ? "Running" : "Editing"}
            </span>
          </div>

          <div className="flex-1 overflow-auto p-4 md:p-5" ref={rightContentRef}>
            {error && (
              <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-xl text-error text-xs font-mono">
                {error}
              </div>
            )}

            {mode === "edit" ? (
              /* Empty state */
              <div className="h-full flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 bg-primary-container/20 rounded-2xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    code
                  </span>
                </div>
                <h3 className="font-headline text-lg font-bold text-on-surface mb-2">
                  Write or paste your code
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed max-w-xs mb-6">
                  Choose a language, write code on the left panel, then click{" "}
                  <strong className="text-primary">Visualize</strong> to step
                  through execution line by line.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] text-outline font-mono uppercase tracking-wider">
                  <span className="flex items-center gap-1 px-2 py-1 bg-surface-highest rounded">
                    <span className="material-symbols-outlined text-xs">
                      keyboard
                    </span>
                    Arrow keys to step
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 bg-surface-highest rounded">
                    <span className="material-symbols-outlined text-xs">
                      space_bar
                    </span>
                    Space = Next
                  </span>
                </div>
              </div>
            ) : (
              /* Running visualization */
              <div className="space-y-5">
                {/* Variables */}
                {varNames.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-mono text-outline uppercase tracking-widest mb-3">
                      Variables
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {varNames.map((k) => {
                        const changed =
                          currentState?.changedVars.includes(k) ?? false;
                        const val = currentState?.vars[k];
                        const prevVal = prevState?.vars[k];
                        const wasChanged =
                          prevVal !== undefined &&
                          String(prevVal) !== String(val);
                        return (
                          <div
                            key={k}
                            className={`bg-surface-low rounded-xl border p-3 transition-all duration-300 ${
                              changed
                                ? "border-primary shadow-lg shadow-primary/10"
                                : "border-white/5"
                            }`}
                          >
                            <div className="text-[9px] font-mono text-outline uppercase tracking-widest mb-1">
                              {k}
                            </div>
                            <div className="text-lg font-bold font-mono text-on-surface">
                              {String(val)}
                            </div>
                            {wasChanged && (
                              <div className="text-[9px] font-mono text-outline mt-1">
                                was {String(prevVal)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Arrays */}
                {arrayNames.length > 0 &&
                  arrayNames.map((arrName) => {
                    const arr = currentState?.arrays[arrName];
                    if (!arr || arr.length === 0) return null;
                    const iVal =
                      currentState?.vars["i"] !== undefined
                        ? Number(currentState.vars["i"])
                        : -1;
                    const jVal =
                      currentState?.vars["j"] !== undefined
                        ? Number(currentState.vars["j"])
                        : -1;
                    const midVal =
                      currentState?.vars["mid"] !== undefined
                        ? Number(currentState.vars["mid"])
                        : -1;
                    const lowVal =
                      currentState?.vars["low"] !== undefined
                        ? Number(currentState.vars["low"])
                        : -1;
                    const highVal =
                      currentState?.vars["high"] !== undefined
                        ? Number(currentState.vars["high"])
                        : -1;

                    return (
                      <div key={arrName}>
                        <h3 className="text-[10px] font-mono text-outline uppercase tracking-widest mb-3">
                          {arrName}
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {arr.map((v, idx) => {
                            const isHighlighted =
                              idx === iVal ||
                              idx === jVal ||
                              idx === midVal;
                            const isOutOfRange =
                              lowVal >= 0 &&
                              highVal >= 0 &&
                              (idx < lowVal || idx > highVal);
                            const pointers: string[] = [];
                            if (idx === iVal) pointers.push("i");
                            if (idx === jVal) pointers.push("j");
                            if (idx === midVal) pointers.push("mid");

                            return (
                              <div
                                key={idx}
                                className="flex flex-col items-center gap-1"
                              >
                                {/* Pointer labels */}
                                <div className="flex gap-0.5 min-h-[16px]">
                                  {pointers.map((p) => (
                                    <span
                                      key={p}
                                      className={`text-[8px] font-bold font-mono px-1.5 py-0 rounded-full ${
                                        p === "i"
                                          ? "bg-amber-500/20 text-amber-400"
                                          : p === "j"
                                          ? "bg-sky-500/20 text-sky-400"
                                          : "bg-rose-500/20 text-rose-400"
                                      }`}
                                    >
                                      {p}
                                    </span>
                                  ))}
                                </div>
                                {/* Cell */}
                                <div
                                  className={`w-11 h-11 flex items-center justify-center rounded-lg border font-mono text-sm font-medium transition-all duration-200 ${
                                    isHighlighted
                                      ? "bg-primary/15 border-primary text-primary"
                                      : isOutOfRange
                                      ? "bg-green-500/10 border-green-500/30 text-green-400/60"
                                      : "bg-surface-low border-white/5 text-on-surface-variant"
                                  }`}
                                >
                                  {v}
                                </div>
                                {/* Index */}
                                <span className="text-[8px] font-mono text-outline/50">
                                  {idx}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                {/* Step explanation */}
                <div>
                  <h3 className="text-[10px] font-mono text-outline uppercase tracking-widest mb-3">
                    Current Step
                  </h3>
                  <div
                    className="bg-surface-low rounded-xl border border-white/5 p-4 text-sm text-on-surface-variant leading-relaxed [&_strong]:text-on-surface [&_strong]:font-medium [&_code]:font-mono [&_code]:text-xs [&_code]:bg-surface-highest [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-primary"
                    dangerouslySetInnerHTML={{
                      __html:
                        currentState?.explanation ??
                        'Click <strong>Next</strong> to begin stepping through the code.',
                    }}
                  />
                </div>

                {/* Result */}
                {currentStep === totalSteps - 1 &&
                  currentState?.vars["result"] !== undefined && (
                    <div className="p-4 bg-gradient-to-br from-green-500/10 to-primary/10 border border-green-500/30 rounded-xl">
                      <div className="text-[9px] font-mono text-green-400 uppercase tracking-widest mb-1">
                        Result
                      </div>
                      <div className="text-2xl font-bold font-mono text-green-400">
                        {String(currentState.vars["result"])}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
