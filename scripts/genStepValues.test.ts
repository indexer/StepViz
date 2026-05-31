// @vitest-environment node
/**
 * Offline generator (gated by GEN_STEP_VALUES=1) that grounds the library's
 * hand-authored step `variables` in REAL execution, closing the drift between
 * the static library walkthroughs and what the playground actually shows.
 *
 *   GEN_STEP_VALUES=1 npx vitest run scripts/genStepValues.test.ts
 *
 * For each TS/Python code example it runs the snippet on the real runtime, then
 * for each authored step samples the execution state at that step's lines (in a
 * single forward pass) and rewrites the step's `variables` to the true values.
 * Only steps whose values actually differ from the authored ones are emitted,
 * so the generated file contains just the corrections. Titles/descriptions and
 * Kotlin examples are untouched. Output: src/data/generatedStepValues.ts
 */
import { it as vitestIt } from "vitest";
// Gated: only runs when explicitly regenerating (it writes a source file).
const it = vitestIt.skipIf(!process.env.GEN_STEP_VALUES);
import fs from "node:fs";
import type { Algorithm, CodeStep } from "../src/types/algorithm";
import type { ExecSnapshot } from "../src/engine/interpreter";
import { runPythonTraced } from "../src/engine/runtime/pythonRuntime";
import { runJsTraced } from "../src/engine/runtime/jsRuntime";
import { sortingAlgorithms } from "../src/data/algorithms-sorting";
import { searchingAlgorithms } from "../src/data/algorithms-searching";
import { graphAlgorithms } from "../src/data/algorithms-graphs";
import { treeAlgorithms } from "../src/data/algorithms-trees";
import { dpAlgorithms } from "../src/data/algorithms-dp";
import { techniqueAlgorithms } from "../src/data/algorithms-techniques";
import { structureAlgorithms } from "../src/data/algorithms-structures";
import { miscAlgorithms } from "../src/data/algorithms-misc";
import { withSelfContainedSnippets } from "../src/data/selfContainedSnippets";

// Apply the same self-contained preambles the app uses, so linked-list/trie
// snippets execute and get grounded values too. Step INDICES are unchanged
// (only line numbers shift), so the overlay stays aligned.
const base: Algorithm[] = withSelfContainedSnippets([
  ...sortingAlgorithms, ...searchingAlgorithms, ...graphAlgorithms,
  ...treeAlgorithms, ...dpAlgorithms, ...techniqueAlgorithms,
  ...structureAlgorithms, ...miscAlgorithms,
]);

const isSimpleIdent = (k: string) => /^[A-Za-z_$][\w$]*$/.test(k);

/** Human-readable rendering matching the authored variable style. */
function fmt(v: unknown): string {
  if (Array.isArray(v)) {
    return v.every((x) => x === null || typeof x !== "object")
      ? `[${v.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join(", ")}]`
      : JSON.stringify(v);
  }
  if (typeof v === "string") return v;
  return String(v);
}

/** Resolve a variable (or `base[idx]`) from a snapshot's live state. */
function liveValue(snap: ExecSnapshot, key: string): string | undefined {
  if (isSimpleIdent(key)) {
    if (key in snap.vars) return fmt(snap.vars[key]);
    if (snap.arrays[key] !== undefined) return fmt(snap.arrays[key]);
    if (snap.maps?.[key] !== undefined)
      return `{${snap.maps[key].map(([k, val]) => `${fmt(k)}: ${fmt(val)}`).join(", ")}}`;
    if (snap.sets?.[key] !== undefined) return `{${snap.sets[key].map(fmt).join(", ")}}`;
    return undefined;
  }
  // base[idx] — ground the common computed key form.
  const m = key.match(/^(\w+)\[(\w+)\]$/);
  if (m) {
    const arr = snap.arrays[m[1]];
    const idx = isSimpleIdent(m[2]) ? snap.vars[m[2]] : Number(m[2]);
    if (Array.isArray(arr) && typeof idx === "number" && idx >= 0 && idx < arr.length) {
      return fmt(arr[idx]);
    }
  }
  return undefined;
}

function findSnap(snaps: ExecSnapshot[], lines: number[], from: number): number {
  const set = new Set(lines.map((l) => l - 1)); // authored lines are 1-based
  for (let i = from; i < snaps.length; i++) if (set.has(snaps[i].line)) return i;
  for (let i = 0; i < from; i++) if (set.has(snaps[i].line)) return i;
  return -1;
}

it("generate step values", async () => {
  const out: Record<string, Record<string, (Record<string, string> | null)[]>> = {};

  for (const a of base) {
    for (const ex of a.codeExamples ?? []) {
      if (ex.language !== "python" && ex.language !== "typescript") continue;
      if (!ex.steps?.length) continue;
      let snaps: ExecSnapshot[];
      try {
        snaps = ex.language === "python" ? await runPythonTraced(ex.code) : await runJsTraced(ex.code);
      } catch {
        continue; // not runnable → keep authored
      }
      if (snaps.some((s) => /<strong>Error:/.test(s.explanation))) continue;

      const perStep: (Record<string, string> | null)[] = [];
      let cursor = 0;
      let anyCorrection = false;
      for (const step of ex.steps as CodeStep[]) {
        const idx = findSnap(snaps, step.lines, cursor);
        if (idx === -1 || !step.variables) {
          perStep.push(null);
          continue;
        }
        const snap = snaps[idx];
        cursor = idx;
        const corrected: Record<string, string> = {};
        let changed = false;
        for (const [k, authored] of Object.entries(step.variables)) {
          const live = liveValue(snap, k);
          if (live !== undefined) {
            corrected[k] = live;
            if (live !== authored) changed = true;
          } else {
            corrected[k] = authored; // ungroundable → keep authored
          }
        }
        perStep.push(changed ? corrected : null);
        if (changed) anyCorrection = true;
      }
      if (anyCorrection) {
        (out[a.id] ??= {})[ex.language] = perStep;
      }
    }
  }

  const header = `// AUTO-GENERATED by scripts/genStepValues.test.ts — do not edit by hand.
// Grounds library step \`variables\` in real execution (see that script).
// Regenerate: GEN_STEP_VALUES=1 npx vitest run scripts/genStepValues.test.ts
import type { CodeExample } from "../types/algorithm";

export type GeneratedStepValues = Record<
  string,
  Partial<Record<CodeExample["language"], (Record<string, string> | null)[]>>
>;

export const GENERATED_STEP_VALUES: GeneratedStepValues = ${JSON.stringify(out, null, 2)};
`;
  fs.writeFileSync("src/data/generatedStepValues.ts", header);
  const corrected = Object.values(out).reduce((n, langs) => n + Object.keys(langs).length, 0);
  console.log(`Wrote generatedStepValues.ts: ${Object.keys(out).length} algorithms, ${corrected} example-language entries corrected.`);
}, 600_000);
