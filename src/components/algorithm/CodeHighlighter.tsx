import { useMemo } from "react";
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
  /** Whether non-highlighted lines should be dimmed */
  dimNonHighlighted?: boolean;
  /** Show line numbers (default true) */
  showLineNumbers?: boolean;
}

export function CodeHighlighter({
  code,
  language,
  highlightedLines,
  dimNonHighlighted = false,
  showLineNumbers = true,
}: CodeHighlighterProps) {
  const prismLang = LANGUAGE_MAP[language] ?? "typescript";

  const highlightedHTML = useMemo(() => {
    const grammar = Prism.languages[prismLang];
    if (!grammar) return Prism.util.encode(code) as string;
    return Prism.highlight(code, grammar, prismLang);
  }, [code, prismLang]);

  const lines = useMemo(() => highlightedHTML.split("\n"), [highlightedHTML]);

  const highlightSet = useMemo(
    () => new Set(highlightedLines ?? []),
    [highlightedLines]
  );

  const hasHighlights = highlightSet.size > 0;

  return (
    <div className="code-highlighted font-mono text-[13px] leading-6">
      {lines.map((lineHtml, i) => {
        const lineNum = i + 1;
        const isHighlighted = highlightSet.has(lineNum);
        const shouldDim = dimNonHighlighted && hasHighlights && !isHighlighted;

        return (
          <div
            key={i}
            data-line={lineNum}
            className={`flex items-stretch rounded-sm transition-all duration-300 ${
              isHighlighted
                ? "bg-primary/15 border-l-2 border-primary"
                : shouldDim
                ? "opacity-40 border-l-2 border-transparent"
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
