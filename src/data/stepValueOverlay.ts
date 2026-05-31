import type { Algorithm } from "../types/algorithm";
import { GENERATED_STEP_VALUES } from "./generatedStepValues";

/**
 * Overlay execution-grounded step `variables` (see scripts/genStepValues.test.ts)
 * onto the hand-authored library walkthroughs, so the values shown in the
 * algorithm detail pages match what the real runtimes produce in the playground.
 * Titles, descriptions, line highlights, and any step without a generated
 * correction are left exactly as authored.
 */
export function withGeneratedStepValues(items: Algorithm[]): Algorithm[] {
  return items.map((algorithm) => {
    const byLang = GENERATED_STEP_VALUES[algorithm.id];
    if (!byLang) return algorithm;
    return {
      ...algorithm,
      codeExamples: algorithm.codeExamples.map((ex) => {
        const generated = byLang[ex.language];
        if (!generated || !ex.steps) return ex;
        return {
          ...ex,
          steps: ex.steps.map((step, i) => {
            const corrected = generated[i];
            return corrected ? { ...step, variables: corrected } : step;
          }),
        };
      }),
    };
  });
}
