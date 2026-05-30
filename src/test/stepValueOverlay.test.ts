import { describe, it, expect } from "vitest";
import { algorithms } from "../data/algorithms";
import { GENERATED_STEP_VALUES } from "../data/generatedStepValues";

describe("generated step-value overlay", () => {
  it("applies generated corrections onto the library walkthroughs", () => {
    let applied = 0;
    for (const [id, byLang] of Object.entries(GENERATED_STEP_VALUES)) {
      const algo = algorithms.find((a) => a.id === id);
      expect(algo, `algorithm ${id} exists`).toBeDefined();
      for (const [lang, perStep] of Object.entries(byLang)) {
        const ex = algo!.codeExamples.find((e) => e.language === lang);
        expect(ex, `${id} has ${lang} example`).toBeDefined();
        perStep!.forEach((corrected, i) => {
          if (!corrected) return;
          // The live data must reflect the generated (truthful) values, not the
          // original hand-authored ones.
          expect(ex!.steps![i].variables).toEqual(corrected);
          applied++;
        });
      }
    }
    // Sanity: the overlay actually changed a non-trivial amount of content.
    expect(applied).toBeGreaterThan(100);
  });

  it("leaves titles, descriptions, and line highlights untouched", () => {
    // A corrected step keeps everything except `variables`.
    const id = Object.keys(GENERATED_STEP_VALUES)[0];
    const algo = algorithms.find((a) => a.id === id)!;
    for (const ex of algo.codeExamples) {
      for (const step of ex.steps ?? []) {
        expect(typeof step.title).toBe("string");
        expect(Array.isArray(step.lines)).toBe(true);
      }
    }
  });
});
