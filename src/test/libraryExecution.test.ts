// @vitest-environment node
/**
 * Executes every TypeScript and Python code example shipped in the algorithm
 * library on the real runtimes, asserting the set that fails to run matches a
 * known allowlist. This guards two things at once:
 *   - a NEW snippet that doesn't execute (regression) fails CI, and
 *   - fixing a known-broken snippet (without updating the list) also fails CI,
 *     keeping the allowlist honest.
 *
 * The linked-list / trie snippets that referenced undefined helper types are
 * now made self-contained by `withSelfContainedSnippets`, so the allowlist is
 * empty — every TS/Python library example must execute cleanly.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { algorithms } from "../data/algorithms";
import { runPythonTraced } from "../engine/runtime/pythonRuntime";
import { runJsTraced } from "../engine/runtime/jsRuntime";

const KNOWN_BROKEN = new Set<string>([]);

describe("library code examples execute on the real runtimes", () => {
  beforeAll(async () => {
    await runPythonTraced("x = 1");
    await runJsTraced("const x = 1;");
  }, 60_000);

  it(
    "every TS/Python example runs, except the known-incomplete ones",
    async () => {
      const failing: string[] = [];
      for (const a of algorithms) {
        for (const ex of a.codeExamples ?? []) {
          if (ex.language !== "python" && ex.language !== "typescript") continue;
          const key = `${a.id}:${ex.language}`;
          try {
            const snaps =
              ex.language === "python"
                ? await runPythonTraced(ex.code)
                : await runJsTraced(ex.code);
            if (snaps.some((s) => /<strong>Error:/.test(s.explanation))) {
              failing.push(key);
            }
          } catch {
            failing.push(key);
          }
        }
      }
      const unexpected = failing.filter((k) => !KNOWN_BROKEN.has(k));
      const fixed = [...KNOWN_BROKEN].filter((k) => !failing.includes(k));
      expect({ unexpected, fixed }).toEqual({ unexpected: [], fixed: [] });
    },
    600_000
  );
});
