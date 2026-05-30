/**
 * Real-CPython execution backend for the playground. Runs the user's Python
 * under Pyodide with a per-line tracer (see {@link ./pythonTracer}) and adapts
 * the trace into the `ExecSnapshot[]` the visualization renders. Unlike the
 * legacy line-by-line interpreter, this executes the genuine language, so it
 * "runs like LeetCode" for arbitrary Python.
 *
 * Loading strategy:
 *   - Browser: inject the official Pyodide CDN script (so the heavy WASM is
 *     never bundled by Vite) and use `window.loadPyodide`.
 *   - Node (tests): import the npm `pyodide` package, which ships its assets
 *     locally — letting us unit-test the whole pipeline without a browser.
 */
import type { ExecSnapshot } from "../interpreter";
import { PY_TRACER_SOURCE } from "./pythonTracer";
import { buildSnapshots, type RawTrace } from "./traceAdapter";

const PYODIDE_VERSION = "0.29.4";
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

const isNode =
  typeof process !== "undefined" &&
  !!(process as { versions?: { node?: string } }).versions?.node;

// Minimal structural type for the bits of Pyodide we use.
interface PyodideLike {
  runPython(code: string): void;
  globals: { get(name: string): (arg: string) => string };
}
type LoadPyodide = (opts?: { indexURL?: string }) => Promise<PyodideLike>;

let pyodidePromise: Promise<PyodideLike> | null = null;

async function importLoadPyodide(): Promise<LoadPyodide> {
  if (isNode) {
    // Variable specifier prevents Vite from statically bundling pyodide into
    // the browser build (where we use the CDN script instead).
    const spec = "pyodide";
    const mod = (await import(/* @vite-ignore */ spec)) as {
      loadPyodide: LoadPyodide;
    };
    return mod.loadPyodide;
  }
  const w = window as unknown as { loadPyodide?: LoadPyodide };
  if (!w.loadPyodide) {
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = `${PYODIDE_CDN}pyodide.js`;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load the Python runtime."));
      document.head.appendChild(s);
    });
  }
  if (!w.loadPyodide) throw new Error("Python runtime unavailable.");
  return w.loadPyodide;
}

/** Lazily boot Pyodide once and reuse it across runs. */
export function getPyodide(): Promise<PyodideLike> {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      const loadPyodide = await importLoadPyodide();
      const py = await loadPyodide(isNode ? {} : { indexURL: PYODIDE_CDN });
      py.runPython(PY_TRACER_SOURCE);
      return py;
    })().catch((e) => {
      // Allow a later retry if boot failed (e.g. transient CDN error).
      pyodidePromise = null;
      throw e;
    });
  }
  return pyodidePromise;
}

/** True once Pyodide has begun loading — used by the UI to show a hint. */
export function isPythonRuntimeStarted(): boolean {
  return pyodidePromise !== null;
}

/**
 * Execute Python under real CPython (Pyodide) and return a step-by-step trace
 * for the visualizer. Throws on compile errors (before any step is produced);
 * runtime errors after partial progress are appended as a final error step.
 */
export async function runPythonTraced(code: string): Promise<ExecSnapshot[]> {
  const py = await getPyodide();
  const runTraced = py.globals.get("__stepviz_run_traced");
  const rawJson = runTraced(code);
  const raw = JSON.parse(rawJson) as RawTrace;
  return buildSnapshots(code, raw);
}
