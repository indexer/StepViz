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
  type ArrayCell,
} from "../engine/interpreter";
import { normalizeForInterpreter } from "../engine/normalizeForInterpreter";
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

const STORAGE_CODE_KEY = "stepviz_playground_code";
const STORAGE_LANG_KEY = "stepviz_playground_lang";

function escHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Parse "Line N:" prefix from an error message (1-based). */
function parseErrorLine(msg: string): number | null {
  const m = msg.match(/^Line\s+(\d+)/i) ?? msg.match(/Line\s+(\d+):/i);
  return m ? Number(m[1]) : null;
}

function loadInitialCode(): { code: string; lang: Lang } {
  try {
    const savedCode = localStorage.getItem(STORAGE_CODE_KEY);
    const savedLang = localStorage.getItem(STORAGE_LANG_KEY) as Lang | null;
    const lang: Lang =
      savedLang === "python" || savedLang === "kotlin" || savedLang === "typescript"
        ? savedLang
        : "typescript";
    const code =
      savedCode && savedCode.trim().length > 0
        ? savedCode
        : PLAYGROUND_EXAMPLES[0].code[lang];
    return { code, lang };
  } catch {
    return {
      code: PLAYGROUND_EXAMPLES[0].code.typescript,
      lang: "typescript",
    };
  }
}

export function CodeRunnerPage() {
  /* ── state ──────────────────────────────────────────── */
  const initial = useMemo(loadInitialCode, []);
  const [language, setLanguage] = useState<Lang>(initial.lang);
  const [mode, setMode] = useState<"edit" | "run">("edit");
  const [code, setCode] = useState(initial.code);
  const [states, setStates] = useState<ExecSnapshot[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [error, setError] = useState<string | null>(null);
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [examplesOpen, setExamplesOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const playTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codeDisplayRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);

  /* ── derived ────────────────────────────────────────── */
  const currentState: ExecSnapshot | null = states[currentStep] ?? null;
  const totalSteps = states.length;
  const atEnd = totalSteps > 0 && currentStep >= totalSteps - 1;

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

  /* ── persistence (debounced) ────────────────────────── */
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_CODE_KEY, code);
      } catch {
        /* quota or disabled - ignore */
      }
    }, 600);
    return () => clearTimeout(t);
  }, [code]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LANG_KEY, language);
    } catch {
      /* ignore */
    }
  }, [language]);

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
    setErrorLine(null);
  }, [stopPlay]);

  const switchToRun = useCallback(() => {
    const trimmed = code.trim();
    if (!trimmed || running) return;
    setRunning(true);
    setError(null);
    setErrorLine(null);
    // Yield to the browser so the loading state paints before the
    // potentially-heavy interpret() call blocks the main thread.
    setTimeout(() => {
      try {
        // Normalize the source first so algorithm detail-page snippets with
        // multiple function declarations + an `// --- Example ---` block
        // actually execute. For Kotlin, this also auto-wraps top-level code
        // in `fun main() { ... }` so the interpreter's function-unwrap kicks
        // in idiomatically.
        const prepared = normalizeForInterpreter(trimmed, language);
        const result = interpret(prepared, language);
        setStates(result);
        setCurrentStep(0);
        setMode("run");
      } catch (e) {
        const msg =
          e instanceof Error
            ? e.message
            : "Parse error. Use simple syntax: variables, loops, if/else, arrays.";
        setError(msg);
        setErrorLine(parseErrorLine(msg));
      } finally {
        setRunning(false);
      }
    }, 0);
  }, [code, language, running]);

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

  const jumpToEnd = useCallback(() => {
    stopPlay();
    if (totalSteps > 0) setCurrentStep(totalSteps - 1);
  }, [stopPlay, totalSteps]);

  const togglePlay = useCallback(() => {
    if (playing) {
      stopPlay();
    } else {
      if (currentStep >= totalSteps - 1) setCurrentStep(0);
      setPlaying(true);
    }
  }, [playing, currentStep, totalSteps, stopPlay]);

  const nextOrRestart = useCallback(() => {
    if (atEnd) {
      setCurrentStep(0);
    } else {
      stepForward();
    }
  }, [atEnd, stepForward]);

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

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }, [code]);

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
      const tag = (e.target as HTMLElement)?.tagName;
      // Don't capture when user is typing in form fields
      if (tag === "TEXTAREA" || tag === "INPUT") return;
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextOrRestart();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepBack();
      } else if (e.key === "Home") {
        e.preventDefault();
        resetViz();
      } else if (e.key === "End") {
        e.preventDefault();
        jumpToEnd();
      } else if (e.key.toLowerCase() === "p") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "Escape") {
        e.preventDefault();
        switchToEdit();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mode, nextOrRestart, stepBack, resetViz, jumpToEnd, togglePlay, switchToEdit]);

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

  /* ── scroll editor to error line ────────────────────── */
  useEffect(() => {
    if (errorLine && mode === "edit" && codeDisplayRef.current) {
      const ta = codeDisplayRef.current.querySelector("textarea");
      if (ta && "value" in ta) {
        const textarea = ta as HTMLTextAreaElement;
        const linesBefore = code.split("\n").slice(0, errorLine).join("\n");
        const pos = linesBefore.length;
        textarea.focus();
        textarea.setSelectionRange(pos, pos);
      }
    }
  }, [errorLine, mode, code]);

  /* ── render ─────────────────────────────────────────── */
  const codeLines = code.split("\n");
  const progressPct =
    totalSteps > 1
      ? Math.round((currentStep / (totalSteps - 1)) * 100)
      : totalSteps === 1
      ? 100
      : 0;

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
              disabled={running}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                mode === "run"
                  ? "bg-green-500/20 text-green-400"
                  : "text-on-surface-variant hover:text-on-surface"
              } ${running ? "opacity-60 cursor-wait" : ""}`}
              title="Ctrl/Cmd + Enter"
            >
              {running && (
                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              )}
              {running
                ? "Parsing…"
                : mode === "run"
                ? "Viewing"
                : "Visualize"}
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
          <div className="flex items-center justify-between px-4 py-2 bg-surface-container/50 border-b border-white/5 flex-shrink-0 gap-2">
            <span className="text-[10px] font-mono text-outline uppercase tracking-widest">
              Code · {codeLines.length} line{codeLines.length === 1 ? "" : "s"}
            </span>
            <div className="flex items-center gap-2">
              {mode === "run" && (
                <button
                  onClick={switchToEdit}
                  className="text-[10px] font-mono text-on-surface-variant px-2 py-1 rounded border border-white/10 hover:border-primary/40 hover:text-primary transition-colors flex items-center gap-1"
                  title="Back to editing (Esc)"
                >
                  <span className="material-symbols-outlined text-xs">edit</span>
                  Edit
                </button>
              )}
              <button
                onClick={copyCode}
                className="text-[10px] font-mono text-on-surface-variant px-2 py-1 rounded border border-white/10 hover:border-primary/40 hover:text-primary transition-colors flex items-center gap-1"
                title="Copy code"
              >
                <span className="material-symbols-outlined text-xs">
                  {copied ? "check" : "content_copy"}
                </span>
                {copied ? "Copied" : "Copy"}
              </button>
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
          </div>

          {/* Code area */}
          <div className="flex-1 overflow-auto min-h-0" ref={codeDisplayRef}>
            {mode === "edit" ? (
              <textarea
                className="code-runner-editor w-full h-full bg-transparent text-on-surface font-mono text-[13px] leading-7 p-4 resize-none outline-none"
                spellCheck={false}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => {
                  // Ctrl/Cmd+Enter → Visualize
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    e.preventDefault();
                    switchToRun();
                  }
                }}
                placeholder={`Paste your ${language} code here...\n\nSupported: variables, arrays, while/for loops, if/else, basic math.\nYou can paste algorithm examples with a single function + a\n"// --- Example ---" (or "# --- Example ---") block — the call site\nwill seed the function's parameters with your real values.${
                  language === "kotlin"
                    ? '\nKotlin: top-level code is auto-wrapped in "fun main() { ... }".'
                    : ""
                }\n\nCtrl/Cmd + Enter = Visualize`}
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
            <div className="flex flex-col gap-2 px-4 py-3 bg-surface-container/50 border-t border-white/5 flex-shrink-0">
              {/* Step slider */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-outline whitespace-nowrap">
                  Step {currentStep + 1} / {totalSteps}
                </span>
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, totalSteps - 1)}
                  value={currentStep}
                  onChange={(e) => {
                    setCurrentStep(Number(e.target.value));
                    setPlaying(false);
                  }}
                  className="flex-1 h-1.5 accent-primary cursor-pointer"
                  aria-label="Step scrubber"
                />
                <span className="text-[10px] font-mono text-primary whitespace-nowrap w-10 text-right">
                  {progressPct}%
                </span>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={resetViz}
                  disabled={currentStep === 0}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Restart (Home)"
                >
                  <span className="material-symbols-outlined text-base">
                    first_page
                  </span>
                </button>

                <button
                  onClick={stepBack}
                  disabled={currentStep === 0}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-on-surface-variant hover:text-on-surface bg-surface-highest hover:bg-surface-bright rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Previous step (←)"
                >
                  <span className="material-symbols-outlined text-base">
                    arrow_back
                  </span>
                  <span className="hidden sm:inline">Back</span>
                </button>

                <button
                  onClick={togglePlay}
                  disabled={totalSteps === 0}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all disabled:opacity-30 ${
                    playing
                      ? "bg-tertiary/20 text-tertiary border border-tertiary/30"
                      : "text-on-surface-variant hover:text-on-surface bg-surface-highest hover:bg-surface-bright"
                  }`}
                  title="Play / Pause (P)"
                >
                  <span className="material-symbols-outlined text-base">
                    {playing ? "pause" : "play_arrow"}
                  </span>
                  <span className="hidden sm:inline">
                    {playing ? "Pause" : "Play"}
                  </span>
                </button>

                <button
                  onClick={nextOrRestart}
                  className="flex items-center gap-1 px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-primary-container to-primary/80 text-on-primary-container rounded-lg shadow-lg shadow-primary/10 transition-all"
                  title={atEnd ? "Restart" : "Next step (→ or Space)"}
                >
                  {atEnd ? "Restart" : "Next"}
                  <span className="material-symbols-outlined text-base">
                    {atEnd ? "restart_alt" : "arrow_forward"}
                  </span>
                </button>

                <button
                  onClick={jumpToEnd}
                  disabled={atEnd}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Jump to end (End)"
                >
                  <span className="material-symbols-outlined text-base">
                    last_page
                  </span>
                </button>

                <div className="flex-1" />

                <div className="flex items-center gap-2 text-[10px] text-outline font-mono">
                  <span>Speed</span>
                  <input
                    type="range"
                    min={100}
                    max={2000}
                    step={100}
                    value={2100 - speed}
                    onChange={(e) => setSpeed(2100 - Number(e.target.value))}
                    className="w-20 accent-primary"
                    title={`${speed}ms per step`}
                  />
                </div>
              </div>
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
              <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-xl text-error text-xs font-mono flex items-start gap-2">
                <span className="material-symbols-outlined text-sm flex-shrink-0">
                  error
                </span>
                <div className="flex-1 break-words whitespace-pre-wrap">
                  {error}
                  {errorLine && (
                    <div className="mt-1 text-error/70">
                      Jump to line {errorLine} to fix.
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setError(null);
                    setErrorLine(null);
                  }}
                  className="text-error/60 hover:text-error flex-shrink-0"
                  aria-label="Dismiss error"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
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
                <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-outline font-mono uppercase tracking-wider max-w-md">
                  <span className="flex items-center gap-1 px-2 py-1 bg-surface-highest rounded">
                    <kbd className="font-sans">⌘/Ctrl + Enter</kbd>
                    <span className="text-outline/60">Visualize</span>
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 bg-surface-highest rounded">
                    <kbd className="font-sans">← →</kbd>
                    <span className="text-outline/60">Step</span>
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 bg-surface-highest rounded">
                    <kbd className="font-sans">Space</kbd>
                    <span className="text-outline/60">Next</span>
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 bg-surface-highest rounded">
                    <kbd className="font-sans">P</kbd>
                    <span className="text-outline/60">Play/Pause</span>
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 bg-surface-highest rounded">
                    <kbd className="font-sans">Home/End</kbd>
                    <span className="text-outline/60">First/Last</span>
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 bg-surface-highest rounded">
                    <kbd className="font-sans">Esc</kbd>
                    <span className="text-outline/60">Back to edit</span>
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
                            <div className="text-lg font-bold font-mono text-on-surface break-all">
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

                    // Pointer vars — used to highlight the active cell.
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
                    const rVal =
                      currentState?.vars["r"] !== undefined
                        ? Number(currentState.vars["r"])
                        : -1;
                    const cVal =
                      currentState?.vars["c"] !== undefined
                        ? Number(currentState.vars["c"])
                        : -1;

                    // Detect 2-D: any top-level element is itself an array.
                    const is2D = arr.some((v) => Array.isArray(v));

                    if (is2D) {
                      // Row pointer prefers `i` then `r`; column pointer prefers `j` then `c`.
                      const rowPointer = iVal >= 0 ? iVal : rVal;
                      const colPointer = jVal >= 0 ? jVal : cVal;
                      const rowLabel = iVal >= 0 ? "i" : rVal >= 0 ? "r" : "";
                      const colLabel = jVal >= 0 ? "j" : cVal >= 0 ? "c" : "";
                      const rows = arr as ArrayCell[][];
                      const colCount = rows.reduce(
                        (m, row) => Math.max(m, Array.isArray(row) ? row.length : 0),
                        0
                      );

                      return (
                        <div key={arrName}>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-[10px] font-mono text-outline uppercase tracking-widest">
                              {arrName}
                            </h3>
                            <span className="text-[10px] font-mono text-outline/60">
                              {rows.length} × {colCount}
                            </span>
                          </div>
                          <div className="inline-block">
                            {/* Column header indices */}
                            {colCount > 0 && (
                              <div className="flex gap-1 mb-1 pl-7">
                                {Array.from({ length: colCount }, (_, c) => (
                                  <div
                                    key={c}
                                    className={`w-10 text-center text-[9px] font-mono ${
                                      c === colPointer
                                        ? "text-sky-400 font-bold"
                                        : "text-outline/40"
                                    }`}
                                  >
                                    {c === colPointer && colLabel ? (
                                      <span className="inline-block px-1 rounded bg-sky-500/20">
                                        {colLabel}={c}
                                      </span>
                                    ) : (
                                      c
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="flex flex-col gap-1">
                              {rows.map((row, rIdx) => {
                                const cells = Array.isArray(row)
                                  ? (row as ArrayCell[])
                                  : [row];
                                const isRowActive = rIdx === rowPointer;
                                return (
                                  <div key={rIdx} className="flex items-center gap-1">
                                    {/* Row index label */}
                                    <div
                                      className={`w-6 flex-shrink-0 text-right text-[9px] font-mono pr-1 ${
                                        isRowActive
                                          ? "text-amber-400 font-bold"
                                          : "text-outline/40"
                                      }`}
                                    >
                                      {isRowActive && rowLabel ? (
                                        <span className="inline-block px-1 rounded bg-amber-500/20">
                                          {rowLabel}
                                        </span>
                                      ) : (
                                        rIdx
                                      )}
                                    </div>
                                    {/* Row cells */}
                                    {cells.map((v, cIdx) => {
                                      const isActiveCell =
                                        rIdx === rowPointer && cIdx === colPointer;
                                      const isActiveRowOrCol =
                                        rIdx === rowPointer || cIdx === colPointer;
                                      return (
                                        <div
                                          key={cIdx}
                                          className={`w-10 h-10 flex items-center justify-center rounded-md border font-mono text-xs font-medium transition-all duration-200 ${
                                            isActiveCell
                                              ? "bg-primary/25 border-primary text-primary ring-2 ring-primary/40 scale-105"
                                              : isActiveRowOrCol
                                              ? "bg-primary/5 border-primary/30 text-on-surface"
                                              : "bg-surface-low border-white/5 text-on-surface-variant"
                                          }`}
                                        >
                                          {String(v)}
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // ── 1-D rendering (unchanged) ──
                    const flatArr = arr as ArrayCell[];
                    const isLargeArr = flatArr.length > 40;

                    return (
                      <div key={arrName}>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-[10px] font-mono text-outline uppercase tracking-widest">
                            {arrName}
                          </h3>
                          <span className="text-[10px] font-mono text-outline/60">
                            len = {flatArr.length}
                          </span>
                        </div>
                        <div className="relative">
                          <div
                            className={`${
                              isLargeArr
                                ? "flex gap-1.5 overflow-x-auto pb-2 stepviz-scroll"
                                : "flex flex-wrap gap-1.5"
                            }`}
                          >
                            {flatArr.map((v, idx) => {
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
                                  className="flex flex-col items-center gap-1 flex-shrink-0"
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
                                    {String(v)}
                                  </div>
                                  {/* Index */}
                                  <span className="text-[8px] font-mono text-outline/50">
                                    {idx}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                          {isLargeArr && (
                            <div className="pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-surface to-transparent" />
                          )}
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
                {atEnd &&
                  currentState?.vars["result"] !== undefined && (
                    <div className="p-4 bg-gradient-to-br from-green-500/10 to-primary/10 border border-green-500/30 rounded-xl">
                      <div className="text-[9px] font-mono text-green-400 uppercase tracking-widest mb-1">
                        Result
                      </div>
                      <div className="text-2xl font-bold font-mono text-green-400 break-all">
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
