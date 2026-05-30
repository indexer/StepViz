/**
 * Shared adapter that turns a raw per-line trace (produced by any real-runtime
 * backend — Pyodide for Python, Babel-instrumented execution for JS/TS) into
 * the `ExecSnapshot[]` the visualizer renders. Centralizing this keeps the
 * panels, change-highlighting, and call-stack formatting identical across
 * languages.
 */
import type { ExecSnapshot, ArrayCell, MapEntry, CallFrameInfo } from "../interpreter";

export interface RawStep {
  line: number;
  vars: Record<string, unknown>;
  arrays: Record<string, ArrayCell[]>;
  maps: Record<string, [unknown, unknown][]>;
  sets: Record<string, unknown[]>;
  callStack: { name: string; paramNames: string[]; args: unknown[] }[];
}

export interface RawTrace {
  steps: RawStep[];
  final: RawStep | null;
  error: { type: string; msg: string; line: number | null } | null;
  overflow: boolean;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function flatten(step: RawStep): Map<string, string> {
  const m = new Map<string, string>();
  for (const k in step.vars) m.set(k, JSON.stringify(step.vars[k]));
  for (const k in step.arrays) m.set(k, JSON.stringify(step.arrays[k]));
  for (const k in step.maps) m.set(k, JSON.stringify(step.maps[k]));
  for (const k in step.sets) m.set(k, JSON.stringify(step.sets[k]));
  return m;
}

function changedSince(
  prev: Map<string, string> | null,
  cur: Map<string, string>
): string[] {
  if (!prev) return [];
  const changed: string[] = [];
  for (const [k, v] of cur) if (prev.get(k) !== v) changed.push(k);
  return changed;
}

function toCallStack(raw: RawStep["callStack"]): CallFrameInfo[] | undefined {
  if (!raw || raw.length === 0) return undefined;
  return raw.map((f) => ({
    name: f.name,
    paramNames: f.paramNames,
    args: f.args.map((v) =>
      v !== null && typeof v === "object" ? JSON.stringify(v) : v
    ),
  }));
}

function snapFrom(step: RawStep, explanation: string, changedVars: string[]): ExecSnapshot {
  const cs = toCallStack(step.callStack);
  return {
    line: step.line,
    vars: step.vars,
    arrays: step.arrays,
    maps: step.maps as Record<string, MapEntry[]>,
    sets: step.sets,
    explanation,
    changedVars,
    ...(cs ? { callStack: cs } : {}),
  };
}

/**
 * Build the snapshot list from a raw trace. Each step's `explanation` shows the
 * source line about to execute; `changedVars` is the diff from the prior step.
 * Compile/early errors (no steps) throw so the caller surfaces the banner;
 * runtime errors after partial progress append a final error step.
 */
export function buildSnapshots(code: string, raw: RawTrace): ExecSnapshot[] {
  const srcLines = code.split("\n");
  const out: ExecSnapshot[] = [];
  let prevFlat: Map<string, string> | null = null;

  for (const step of raw.steps) {
    const flat = flatten(step);
    const src = srcLines[step.line]?.trim() ?? "";
    out.push(
      snapFrom(
        step,
        src
          ? `<strong>Line ${step.line + 1}</strong> <code>${esc(src)}</code>`
          : `<strong>Line ${step.line + 1}</strong>`,
        changedSince(prevFlat, flat)
      )
    );
    prevFlat = flat;
  }

  if (raw.error) {
    const e = raw.error;
    const lineTxt = e.line ? `Line ${e.line}: ` : "";
    const message = `${lineTxt}${e.type}: ${e.msg}`;
    if (out.length === 0) throw new Error(message);
    out.push({
      line: e.line != null ? e.line - 1 : -1,
      vars: {},
      arrays: {},
      maps: {},
      sets: {},
      explanation: `<strong>Error:</strong> ${esc(message)}`,
      changedVars: [],
    });
    return out;
  }

  if (raw.final) {
    const finalFlat = flatten(raw.final);
    out.push(
      snapFrom(
        { ...raw.final, line: -1, callStack: [] },
        raw.overflow
          ? `<strong>Stopped:</strong> trace exceeded the step limit (showing the first part of execution).`
          : `<strong>Execution complete!</strong>`,
        changedSince(prevFlat, finalFlat)
      )
    );
  } else if (raw.overflow && out.length > 0) {
    // Hit the step cap before completing (e.g. an infinite loop) and no final
    // state was captured — note the truncation so it doesn't look complete.
    out.push({
      line: -1,
      vars: {},
      arrays: {},
      maps: {},
      sets: {},
      explanation: `<strong>Stopped:</strong> trace exceeded the step limit (possible infinite loop — showing the first part of execution).`,
      changedVars: [],
    });
  }
  return out;
}
