/**
 * Data-driven harness for auditing the playground interpreter. NOT part of the
 * normal suite: it no-ops unless HARNESS_IN / HARNESS_OUT env vars are set.
 *
 *   HARNESS_IN=/tmp/cases.json HARNESS_OUT=/tmp/out.json \
 *     npx vitest run scripts/snippetHarness.test.ts
 *
 * cases.json: [{ id, code, language: "typescript"|"python"|"kotlin", expect? }]
 * out.json:   [{ id, ok, error, snapshotCount, lastVars, lastArrays,
 *                lastMaps, lastSets, prepared }]
 */
import { describe, it } from "vitest";
import fs from "node:fs";
import { interpret } from "../src/engine/interpreter";
import { normalizeForInterpreter } from "../src/engine/normalizeForInterpreter";

const IN = process.env.HARNESS_IN;
const OUT = process.env.HARNESS_OUT;

describe.skipIf(!IN || !OUT)("snippet harness", () => {
  it("runs all cases", () => {
    const cases = JSON.parse(fs.readFileSync(IN!, "utf8")) as Array<{
      id: string;
      code: string;
      language: "typescript" | "python" | "kotlin";
      expect?: unknown;
    }>;
    const results = cases.map((c) => {
      try {
        const prepared = normalizeForInterpreter(c.code, c.language);
        const snaps = interpret(prepared, c.language);
        const last = snaps[snaps.length - 1] ?? null;
        const errSnap = snaps.find((s) =>
          /<strong>Error:|cannot evaluate/i.test(s.explanation)
        );
        return {
          id: c.id,
          ok: !errSnap,
          error: errSnap ? errSnap.explanation.replace(/<[^>]+>/g, "") : null,
          snapshotCount: snaps.length,
          lastVars: last?.vars ?? {},
          lastArrays: last?.arrays ?? {},
          lastMaps: last?.maps ?? {},
          lastSets: last?.sets ?? {},
          expect: c.expect ?? null,
          prepared,
        };
      } catch (e) {
        return {
          id: c.id,
          ok: false,
          error: "THREW: " + (e instanceof Error ? e.message : String(e)),
          snapshotCount: 0,
          lastVars: {},
          lastArrays: {},
          lastMaps: {},
          lastSets: {},
          expect: c.expect ?? null,
          prepared: null,
        };
      }
    });
    fs.writeFileSync(OUT!, JSON.stringify(results, null, 2));
    // Surface a one-line summary in the vitest stdout too.
    const failed = results.filter((r) => !r.ok).length;
    // eslint-disable-next-line no-console
    console.log(`HARNESS: ${results.length - failed}/${results.length} ran without error`);
  });
});
