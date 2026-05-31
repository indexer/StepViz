// @vitest-environment node
/**
 * Real-runtime harness (Pyodide for Python, Babel-instrumented JS for TS).
 * Gated: no-ops unless HARNESS_IN / HARNESS_OUT are set.
 *
 *   HARNESS_IN=/tmp/in.json HARNESS_OUT=/tmp/out.json \
 *     npx vitest run scripts/realHarness.test.ts
 *
 * in.json:  [{ id, language: "python"|"typescript", code }]
 * out.json: [{ id, ok, error, snapshotCount, lastVars, lastArrays, lastMaps, lastSets }]
 */
import { describe, it } from "vitest";
import fs from "node:fs";
import { runPythonTraced } from "../src/engine/runtime/pythonRuntime";
import { runJsTraced } from "../src/engine/runtime/jsRuntime";

const IN = process.env.HARNESS_IN;
const OUT = process.env.HARNESS_OUT;

describe.skipIf(!IN || !OUT)("real-runtime harness", () => {
  it("runs cases", async () => {
    const cases = JSON.parse(fs.readFileSync(IN!, "utf8")) as Array<{
      id: string;
      language: "python" | "typescript";
      code: string;
    }>;
    const results = [];
    for (const c of cases) {
      try {
        const snaps =
          c.language === "python"
            ? await runPythonTraced(c.code)
            : await runJsTraced(c.code);
        const errSnap = snaps.find((s) => /<strong>Error:/.test(s.explanation));
        const last = snaps[snaps.length - 1];
        results.push({
          id: c.id,
          ok: !errSnap,
          error: errSnap ? errSnap.explanation.replace(/<[^>]+>/g, "") : null,
          snapshotCount: snaps.length,
          lastVars: last?.vars ?? {},
          lastArrays: last?.arrays ?? {},
          lastMaps: last?.maps ?? {},
          lastSets: last?.sets ?? {},
        });
      } catch (e) {
        results.push({
          id: c.id,
          ok: false,
          error: "THREW: " + (e instanceof Error ? e.message : String(e)),
          snapshotCount: 0,
          lastVars: {},
          lastArrays: {},
          lastMaps: {},
          lastSets: {},
        });
      }
    }
    fs.writeFileSync(OUT!, JSON.stringify(results, null, 2));
    // eslint-disable-next-line no-console
    console.log(`REALHARNESS: ${results.filter((r) => r.ok).length}/${results.length} ran clean`);
  });
});
