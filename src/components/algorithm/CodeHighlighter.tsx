import { memo, useMemo } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import { LANGUAGE_MAP } from "./codeLanguages";

interface CodeHighlighterProps {
  code: string;
  language: string;
  /** Optional set of 1-indexed line numbers to highlight */
  highlightedLines?: number[];
  /**
   * When true, non-highlighted lines are *softly* muted (not fully faded) so the
   * surrounding code remains readable. Previously this set opacity:0.4 which made
   * the non-stepped parts look "missing". We now keep them visible at opacity:0.85.
   */
  dimNonHighlighted?: boolean;
  /** Show line numbers (default true) */
  showLineNumbers?: boolean;
}

function CodeHighlighterImpl({
  code,
  language,
  highlightedLines,
  dimNonHighlighted = false,
  showLineNumbers = true,
}: CodeHighlighterProps) {
  const prismLang = LANGUAGE_MAP[language] ?? "typescript";

  // Tokenize once per (code, language) pair.
  const highlightedHTML = useMemo(() => {
    const grammar = Prism.languages[prismLang];
    if (!grammar) return Prism.util.encode(code) as string;
    return Prism.highlight(code, grammar, prismLang);
  }, [code, prismLang]);

  const lines = useMemo(() => highlightedHTML.split("\n"), [highlightedHTML]);

  // Stable key for the highlighted-lines set so the Set is only rebuilt when the
  // actual list of line numbers changes (avoids reallocating on every render).
  const highlightKey = (highlightedLines ?? []).join(",");
  const highlightSet = useMemo(
    () => new Set(highlightedLines ?? []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [highlightKey]
  );

  const hasHighlights = highlightSet.size > 0;

  return (
    <div className="code-highlighted font-mono text-[13px] leading-6">
      {lines.map((lineHtml, i) => {
        const lineNum = i + 1;
        const isHighlighted = highlightSet.has(lineNum);
        // Soft muting: keeps code readable and feels less "broken" when steps
        // only cover part of a snippet (e.g. helpers / example blocks).
        const shouldDim = dimNonHighlighted && hasHighlights && !isHighlighted;

        return (
          <div
            key={i}
            data-line={lineNum}
            className={`flex items-stretch rounded-sm transition-colors duration-200 ${
              isHighlighted
                ? "bg-primary/15 border-l-2 border-primary"
                : shouldDim
                ? "opacity-[0.85] border-l-2 border-transparent"
                : "border-l-2 border-transparent"
            }`}
          >
            {showLineNumbers && (
              <span
                className={`inline-block w-12 text-right pr-4 flex-shrink-0 select-none ${
                  isHighlighted ? "text-primary font-medium" : "text-outline/50"
                }`}
              >
                {lineNum}
              </span>
            )}
            <span
              className="flex-1 pr-4"
              style={{ whiteSpace: "pre" }}
              dangerouslySetInnerHTML={{ __html: lineHtml || "\u200B" }}
            />
          </div>
        );
      })}
    </div>
  );
}

// Memoize: same code/lang/highlights → skip re-render entirely. Big win when
// stepping through the walkthrough (only the active-line markers change).
export const CodeHighlighter = memo(CodeHighlighterImpl);
