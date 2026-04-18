/**
 * Simple line-by-line code interpreter for TypeScript, Python, and Kotlin.
 * Supports: variable declarations, assignments, arrays, while/for loops,
 * if/else/else-if, basic math, Math.floor/min/max/abs, comparisons.
 * Also handles class/function wrappers, parameters, return statements,
 * and type annotations so users can paste LeetCode-style code.
 *
 * Produces a list of execution snapshots for step-by-step visualisation.
 */

export interface ExecSnapshot {
  /** 0-based line index (-1 = before/after execution) */
  line: number;
  /** Current variable values (scalars as primitives, arrays as JSON strings) */
  vars: Record<string, unknown>;
  /** Current array states keyed by name */
  arrays: Record<string, number[]>;
  /** HTML explanation for this step */
  explanation: string;
  /** Names of variables that changed in this snapshot */
  changedVars: string[];
}

type Lang = "typescript" | "python" | "kotlin";

/* ── Sample data for common param types ────────────────── */

const SAMPLE_ARRAYS: Record<string, number[]> = {
  default: [10, 15, 20, 25, 30],
  nums: [2, 7, 11, 15, 1, 8],
  cost: [10, 15, 20, 25, 30],
  prices: [7, 1, 5, 3, 6, 4],
  heights: [1, 8, 6, 2, 5, 4, 8, 3, 7],
  arr: [64, 34, 25, 12, 22, 11, 90],
  coins: [1, 5, 10, 25],
  weights: [1, 3, 4, 5],
  values: [1, 4, 5, 7],
  candidates: [2, 3, 6, 7],
  numbers: [2, 7, 11, 15],
  stones: [2, 7, 4, 1, 8, 1],
  piles: [3, 6, 7, 11],
};

const SAMPLE_SCALARS: Record<string, number> = {
  target: 9,
  k: 3,
  n: 5,
  m: 4,
  capacity: 10,
  amount: 11,
  val: 7,
  sum: 0,
  limit: 100,
};

function getSampleArray(name: string): number[] {
  const lower = name.toLowerCase();
  return [...(SAMPLE_ARRAYS[lower] ?? SAMPLE_ARRAYS["default"])];
}

function getSampleScalar(name: string): number {
  const lower = name.toLowerCase();
  return SAMPLE_SCALARS[lower] ?? 5;
}

/* ── Pre-processing: unwrap class/function, extract params ── */

interface PreprocessResult {
  lines: string[];
  /** Line offset: how many lines were removed from the top */
  lineOffset: number;
  /** Extracted function parameters to initialize */
  params: { name: string; type: string }[];
}

function preprocess(code: string, language: Lang): PreprocessResult {
  let lines = code.split("\n");
  let lineOffset = 0;
  const params: { name: string; type: string }[] = [];

  if (language === "python") {
    return preprocessPython(lines);
  }

  // ── Brace-based (TypeScript / Kotlin) ──

  // Strip class wrapper: find `class Something {` and remove it + its closing `}`
  let classStartIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*class\s+\w+/.test(lines[i])) {
      classStartIdx = i;
      break;
    }
  }
  if (classStartIdx >= 0) {
    // Find the matching closing brace
    let depth = 0;
    let classEndIdx = lines.length - 1;
    for (let i = classStartIdx; i < lines.length; i++) {
      for (const ch of lines[i]) {
        if (ch === "{") depth++;
        if (ch === "}") {
          depth--;
          if (depth === 0) {
            classEndIdx = i;
            break;
          }
        }
      }
      if (depth === 0 && i > classStartIdx) break;
    }
    // Remove class line and its closing brace, keep contents
    lines[classStartIdx] = ""; // blank out class line
    lines[classEndIdx] = ""; // blank out closing brace
    // Dedent contents by one level
    lines = lines.map((line) => {
      if (line.startsWith("    ")) return line.slice(4);
      if (line.startsWith("\t")) return line.slice(1);
      return line;
    });
  }

  // Find function declaration
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    // Kotlin: fun name(params): ReturnType {
    const ktFun = trimmed.match(
      /^(?:private\s+|public\s+|internal\s+)?fun\s+\w+\(([^)]*)\)(?:\s*:\s*\w[\w<>,\s?]*?)?\s*\{?\s*$/
    );
    if (ktFun) {
      const paramStr = ktFun[1].trim();
      if (paramStr) parseKotlinParams(paramStr, params);
      lines[i] = ""; // blank out function line
      // Find and blank closing brace
      let depth = 0;
      for (let j = i; j < lines.length; j++) {
        for (const ch of lines[j]) {
          if (ch === "{") depth++;
          if (ch === "}") {
            depth--;
            if (depth === 0) {
              lines[j] = "";
              break;
            }
          }
        }
        if (depth === 0 && j > i) break;
      }
      // Dedent body
      lines = lines.map((line) => {
        if (line.startsWith("        ")) return line.slice(8);
        if (line.startsWith("    ")) return line.slice(4);
        if (line.startsWith("\t\t")) return line.slice(2);
        if (line.startsWith("\t")) return line.slice(1);
        return line;
      });
      lineOffset = 0; // we kept line count with blanks
      break;
    }

    // TypeScript: function name(params): ReturnType {
    const tsFun = trimmed.match(
      /^(?:export\s+)?function\s+\w+\(([^)]*)\)(?:\s*:\s*[^={]+)?\s*\{?\s*$/
    );
    if (tsFun) {
      const paramStr = tsFun[1].trim();
      if (paramStr) parseTsParams(paramStr, params);
      lines[i] = "";
      let depth = 0;
      for (let j = i; j < lines.length; j++) {
        for (const ch of lines[j]) {
          if (ch === "{") depth++;
          if (ch === "}") {
            depth--;
            if (depth === 0) {
              lines[j] = "";
              break;
            }
          }
        }
        if (depth === 0 && j > i) break;
      }
      lines = lines.map((line) => {
        if (line.startsWith("    ")) return line.slice(4);
        if (line.startsWith("  ")) return line.slice(2);
        if (line.startsWith("\t")) return line.slice(1);
        return line;
      });
      break;
    }

    // Arrow function: const name = (params): ReturnType => {
    const arrowFun = trimmed.match(
      /^(?:const|let|var)\s+\w+\s*=\s*\(([^)]*)\)(?:\s*:\s*[^=]+)?\s*=>\s*\{?\s*$/
    );
    if (arrowFun) {
      const paramStr = arrowFun[1].trim();
      if (paramStr) parseTsParams(paramStr, params);
      lines[i] = "";
      let depth = 0;
      for (let j = i; j < lines.length; j++) {
        for (const ch of lines[j]) {
          if (ch === "{") depth++;
          if (ch === "}") {
            depth--;
            if (depth === 0) {
              lines[j] = "";
              break;
            }
          }
        }
        if (depth === 0 && j > i) break;
      }
      lines = lines.map((line) => {
        if (line.startsWith("    ")) return line.slice(4);
        if (line.startsWith("  ")) return line.slice(2);
        if (line.startsWith("\t")) return line.slice(1);
        return line;
      });
      break;
    }
  }

  return { lines, lineOffset, params };
}

function preprocessPython(
  lines: string[]
): PreprocessResult {
  const params: { name: string; type: string }[] = [];

  // Strip class wrapper
  let classStartIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*class\s+\w+/.test(lines[i])) {
      classStartIdx = i;
      break;
    }
  }
  if (classStartIdx >= 0) {
    lines[classStartIdx] = "";
    lines = lines.map((line) => {
      if (line.startsWith("    ")) return line.slice(4);
      if (line.startsWith("\t")) return line.slice(1);
      return line;
    });
  }

  // Find def declaration
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    const defMatch = trimmed.match(/^def\s+\w+\(([^)]*)\)(?:\s*->.*)?:\s*$/);
    if (defMatch) {
      const paramStr = defMatch[1].trim();
      if (paramStr) parsePythonParams(paramStr, params);
      lines[i] = "";
      // Dedent body
      lines = lines.map((line) => {
        if (line.startsWith("        ")) return line.slice(8);
        if (line.startsWith("    ")) return line.slice(4);
        if (line.startsWith("\t\t")) return line.slice(2);
        if (line.startsWith("\t")) return line.slice(1);
        return line;
      });
      break;
    }
  }

  return { lines, lineOffset: 0, params };
}

function parseKotlinParams(
  paramStr: string,
  out: { name: string; type: string }[]
) {
  for (const part of splitParams(paramStr)) {
    const m = part.trim().match(/^(\w+)\s*:\s*(.+)$/);
    if (m) out.push({ name: m[1], type: m[2].trim() });
  }
}

function parseTsParams(
  paramStr: string,
  out: { name: string; type: string }[]
) {
  for (const part of splitParams(paramStr)) {
    const m = part.trim().match(/^(\w+)(?:\s*:\s*(.+))?$/);
    if (m) out.push({ name: m[1], type: (m[2] ?? "number").trim() });
  }
}

function parsePythonParams(
  paramStr: string,
  out: { name: string; type: string }[]
) {
  for (const part of splitParams(paramStr)) {
    const cleaned = part.trim();
    if (cleaned === "self") continue;
    const m = cleaned.match(/^(\w+)(?:\s*:\s*(.+))?$/);
    if (m) out.push({ name: m[1], type: (m[2] ?? "int").trim() });
  }
}

/** Split params respecting angle brackets and parentheses */
function splitParams(s: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of s) {
    if (ch === "<" || ch === "(" || ch === "[") depth++;
    if (ch === ">" || ch === ")" || ch === "]") depth--;
    if (ch === "," && depth === 0) {
      parts.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) parts.push(cur);
  return parts;
}

function isArrayType(type: string): boolean {
  const lower = type.toLowerCase();
  return (
    lower.includes("array") ||
    lower.includes("list") ||
    lower.includes("[]") ||
    lower.includes("intarray") ||
    lower.includes("vector")
  );
}

function initParamValue(
  name: string,
  type: string,
  env: Record<string, unknown>,
  arrays: Record<string, boolean>
) {
  if (isArrayType(type)) {
    const arr = getSampleArray(name);
    env[name] = arr;
    arrays[name] = true;
  } else if (
    type.toLowerCase().includes("string") ||
    type.toLowerCase() === "str"
  ) {
    env[name] = "hello";
  } else if (
    type.toLowerCase() === "boolean" ||
    type.toLowerCase() === "bool"
  ) {
    env[name] = true;
  } else {
    // numeric
    env[name] = getSampleScalar(name);
  }
}

/* ── public API ─────────────────────────────────────────── */

/** Sentinel thrown to handle `return` statements */
class ReturnSignal {
  value: unknown;
  constructor(value: unknown) {
    this.value = value;
  }
}

/** Maximum number of execution snapshots before we stop generating steps. */
const MAX_SNAPSHOTS = 20000;
/** Maximum statements executed per block (per recursion frame). */
const MAX_STATEMENT_STEPS = 50000;
/** Maximum iterations of any single loop. */
const MAX_LOOP_ITERATIONS = 5000;

/** Thrown internally when snapshot budget is exhausted. */
class SnapshotLimitError extends Error {
  constructor() {
    super(
      `Execution exceeded the ${MAX_SNAPSHOTS}-step budget. ` +
        "This usually means an infinite (or extremely long) loop. " +
        "Try smaller inputs or add a clear termination condition."
    );
    this.name = "SnapshotLimitError";
  }
}

export function interpret(code: string, language: Lang): ExecSnapshot[] {
  const { lines, params } = preprocess(code, language);
  const env: Record<string, unknown> = {};
  const arrays: Record<string, boolean> = {};
  const states: ExecSnapshot[] = [];

  // Track the last PC we were executing so we can surface line numbers on errors
  let currentExecLine = -1;

  // Initialize function parameters with sample data
  for (const p of params) {
    initParamValue(p.name, p.type, env, arrays);
  }

  /**
   * Snapshot builder with structural sharing. When a var/array hasn't changed
   * in this step, we reuse the reference from the previous snapshot instead of
   * deep-copying — cutting memory + CPU by O(n) per step for large arrays.
   */
  function snapshot(
    lineIdx: number,
    explanation: string,
    changedVars: string[] = []
  ) {
    if (states.length >= MAX_SNAPSHOTS) {
      throw new SnapshotLimitError();
    }

    const prev = states.length > 0 ? states[states.length - 1] : null;
    const changedSet = new Set(changedVars);

    // Build vars: start from previous (shared refs), overwrite only changed keys.
    const vs: Record<string, unknown> = prev ? { ...prev.vars } : {};
    // Remove stale keys that no longer exist in env (e.g. if scoping shrinks).
    for (const k in vs) {
      if (!(k in env)) delete vs[k];
    }
    for (const k in env) {
      if (Array.isArray(env[k])) {
        arrays[k] = true;
        if (!prev || changedSet.has(k) || !(k in prev.vars)) {
          vs[k] = JSON.stringify(env[k]);
        }
        // else reuse prev.vars[k] already carried over
      } else {
        if (!prev || changedSet.has(k) || prev.vars[k] !== env[k]) {
          vs[k] = env[k];
        }
      }
    }

    // Build arrays: reuse unchanged references from previous snapshot.
    const arrs: Record<string, number[]> = {};
    for (const k in arrays) {
      const live = env[k];
      if (
        prev &&
        !changedSet.has(k) &&
        prev.arrays[k] !== undefined
      ) {
        arrs[k] = prev.arrays[k];
      } else {
        arrs[k] = Array.isArray(live) ? (live as number[]).slice() : [];
      }
    }

    states.push({
      line: lineIdx,
      vars: vs,
      arrays: arrs,
      explanation,
      changedVars: changedVars.length ? changedVars.slice() : [],
    });
  }

  /* ── expression evaluator ─────────────────────────────── */

  function evalExpr(expr: string, e: Record<string, unknown>): unknown {
    expr = expr.trim();
    // booleans
    if (expr === "true" || expr === "True") return true;
    if (expr === "false" || expr === "False") return false;
    // None / null
    if (expr === "null" || expr === "None" || expr === "nil") return 0;
    // numbers
    if (/^-?\d+(\.\d+)?$/.test(expr)) return parseFloat(expr);
    // strings
    if (/^(["']).*\1$/.test(expr)) return expr.slice(1, -1);
    // float('inf') / float("inf") — python
    if (/^float\(['"]inf['"]\)$/.test(expr)) return Infinity;
    if (/^float\(['"]-inf['"]\)$/.test(expr)) return -Infinity;
    // Int.MAX_VALUE / Int.MIN_VALUE — kotlin
    if (expr === "Int.MAX_VALUE" || expr === "Integer.MAX_VALUE")
      return 2147483647;
    if (expr === "Int.MIN_VALUE" || expr === "Integer.MIN_VALUE")
      return -2147483648;
    // Number.MAX_SAFE_INTEGER etc — typescript
    if (expr === "Number.MAX_SAFE_INTEGER" || expr === "Infinity") return Infinity;
    if (expr === "Number.MIN_SAFE_INTEGER" || expr === "-Infinity") return -Infinity;
    // array literal
    if (/^\[.*\]$/.test(expr)) {
      const inner = expr.slice(1, -1).trim();
      if (!inner) return [];
      return smartSplit(inner).map((s) => evalExpr(s.trim(), e));
    }
    // intArrayOf / arrayOf / listOf / mutableListOf (kotlin)
    const kotlinList = expr.match(
      /^(?:listOf|mutableListOf|arrayListOf|intArrayOf|arrayOf)\((.+)\)$/
    );
    if (kotlinList) {
      return smartSplit(kotlinList[1]).map((s) => evalExpr(s.trim(), e));
    }
    // BooleanArray(n) { false }, IntArray(n) { 0 } — kotlin
    const ktArrayInit = expr.match(
      /^(?:IntArray|BooleanArray|Array)\((.+)\)\s*\{?\s*(.+?)?\s*\}?$/
    );
    if (ktArrayInit) {
      const size = evalExpr(ktArrayInit[1], e) as number;
      const fillVal = ktArrayInit[2]
        ? evalExpr(ktArrayInit[2], e)
        : 0;
      return Array(size).fill(fillVal);
    }
    // len(x) / python
    const lenCall = expr.match(/^len\((\w+)\)$/);
    if (lenCall) {
      const v = e[lenCall[1]];
      if (Array.isArray(v)) return v.length;
      if (typeof v === "string") return (v as string).length;
      return 0;
    }
    // .size (kotlin)
    const sizeAccess = expr.match(/^(\w+)\.size$/);
    if (sizeAccess) {
      const v = e[sizeAccess[1]];
      if (Array.isArray(v)) return v.length;
      return 0;
    }
    // .length
    const lenAccess = expr.match(/^(\w+)\.length$/);
    if (lenAccess) {
      const v = e[lenAccess[1]];
      if (Array.isArray(v)) return v.length;
      return 0;
    }
    // Math.floor / min / max / abs
    const mathFloor = expr.match(/^Math\.floor\((.+)\)$/);
    if (mathFloor) return Math.floor(evalExpr(mathFloor[1], e) as number);
    const mathMin = expr.match(/^Math\.min\((.+),\s*(.+)\)$/);
    if (mathMin)
      return Math.min(
        evalExpr(mathMin[1], e) as number,
        evalExpr(mathMin[2], e) as number
      );
    const mathMax = expr.match(/^Math\.max\((.+),\s*(.+)\)$/);
    if (mathMax)
      return Math.max(
        evalExpr(mathMax[1], e) as number,
        evalExpr(mathMax[2], e) as number
      );
    const mathAbs = expr.match(/^Math\.abs\((.+)\)$/);
    if (mathAbs) return Math.abs(evalExpr(mathAbs[1], e) as number);
    // python min/max/abs
    const pyMin = expr.match(/^min\((.+),\s*(.+)\)$/);
    if (pyMin)
      return Math.min(
        evalExpr(pyMin[1], e) as number,
        evalExpr(pyMin[2], e) as number
      );
    const pyMax = expr.match(/^max\((.+),\s*(.+)\)$/);
    if (pyMax)
      return Math.max(
        evalExpr(pyMax[1], e) as number,
        evalExpr(pyMax[2], e) as number
      );
    const pyAbs = expr.match(/^abs\((.+)\)$/);
    if (pyAbs) return Math.abs(evalExpr(pyAbs[1], e) as number);
    // kotlin minOf/maxOf
    const ktMin = expr.match(/^minOf\((.+),\s*(.+)\)$/);
    if (ktMin)
      return Math.min(
        evalExpr(ktMin[1], e) as number,
        evalExpr(ktMin[2], e) as number
      );
    const ktMax = expr.match(/^maxOf\((.+),\s*(.+)\)$/);
    if (ktMax)
      return Math.max(
        evalExpr(ktMax[1], e) as number,
        evalExpr(ktMax[2], e) as number
      );
    // int() python cast
    const intCast = expr.match(/^int\((.+)\)$/);
    if (intCast) return Math.floor(evalExpr(intCast[1], e) as number);
    // kotlin toInt()
    if (expr.endsWith(".toInt()")) {
      return Math.floor(evalExpr(expr.slice(0, -8), e) as number);
    }
    // array access  arr[idx]
    const arrAccess = expr.match(/^(\w+)\[(.+)\]$/);
    if (arrAccess) {
      const arrName = arrAccess[1];
      const idx = evalExpr(arrAccess[2], e) as number;
      const arr = e[arrName];
      if (Array.isArray(arr)) return arr[idx];
      return undefined;
    }
    // parenthesised
    if (/^\((.+)\)$/.test(expr)) return evalExpr(expr.slice(1, -1), e);

    // comparison & logical operators (order matters!)
    if (expr.includes("===")) {
      const p = splitOp(expr, "===");
      return evalExpr(p[0], e) === evalExpr(p[1], e);
    }
    if (expr.includes("!==")) {
      const p = splitOp(expr, "!==");
      return evalExpr(p[0], e) !== evalExpr(p[1], e);
    }
    if (expr.includes("==")) {
      const p = splitOp(expr, "==");
      return evalExpr(p[0], e) == evalExpr(p[1], e);
    }
    if (expr.includes("!=")) {
      const p = splitOp(expr, "!=");
      return evalExpr(p[0], e) != evalExpr(p[1], e);
    }
    if (expr.includes(">=")) {
      const p = splitOp(expr, ">=");
      return (evalExpr(p[0], e) as number) >= (evalExpr(p[1], e) as number);
    }
    if (expr.includes("<=")) {
      const p = splitOp(expr, "<=");
      return (evalExpr(p[0], e) as number) <= (evalExpr(p[1], e) as number);
    }
    if (expr.includes("&&") || expr.includes(" and ")) {
      const op = expr.includes("&&") ? "&&" : " and ";
      const p = splitOp(expr, op);
      return evalExpr(p[0], e) && evalExpr(p[1], e);
    }
    if (expr.includes("||") || expr.includes(" or ")) {
      const op = expr.includes("||") ? "||" : " or ";
      const p = splitOp(expr, op);
      return evalExpr(p[0], e) || evalExpr(p[1], e);
    }
    if (/>(?!=)/.test(expr)) {
      const i = expr.search(/>(?!=)/);
      return (
        (evalExpr(expr.slice(0, i), e) as number) >
        (evalExpr(expr.slice(i + 1), e) as number)
      );
    }
    if (/<(?!=)/.test(expr)) {
      const i = expr.search(/<(?!=)/);
      return (
        (evalExpr(expr.slice(0, i), e) as number) <
        (evalExpr(expr.slice(i + 1), e) as number)
      );
    }
    // arithmetic (lowest precedence last → split rightmost)
    if (expr.includes("+")) {
      const p = splitBinLast(expr, "+");
      if (p)
        return (
          (evalExpr(p[0], e) as number) + (evalExpr(p[1], e) as number)
        );
    }
    if (expr.includes("-") && !expr.startsWith("-")) {
      const p = splitBinLast(expr, "-");
      if (p)
        return (
          (evalExpr(p[0], e) as number) - (evalExpr(p[1], e) as number)
        );
    }
    if (expr.includes("*")) {
      const p = splitBinLast(expr, "*");
      if (p)
        return (
          (evalExpr(p[0], e) as number) * (evalExpr(p[1], e) as number)
        );
    }
    if (expr.includes("//")) {
      // python integer division
      const p = splitOp(expr, "//");
      return Math.floor(
        (evalExpr(p[0], e) as number) / (evalExpr(p[1], e) as number)
      );
    }
    if (expr.includes("/")) {
      const p = splitBinLast(expr, "/");
      if (p)
        return (
          (evalExpr(p[0], e) as number) / (evalExpr(p[1], e) as number)
        );
    }
    if (expr.includes("%")) {
      const p = splitBinLast(expr, "%");
      if (p)
        return (
          (evalExpr(p[0], e) as number) % (evalExpr(p[1], e) as number)
        );
    }
    // variable lookup
    if (Object.prototype.hasOwnProperty.call(e, expr)) return e[expr];
    throw new Error("Cannot evaluate: " + expr);
  }

  /** Split comma-separated values respecting brackets */
  function smartSplit(s: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let cur = "";
    for (const ch of s) {
      if (ch === "(" || ch === "[" || ch === "{") depth++;
      if (ch === ")" || ch === "]" || ch === "}") depth--;
      if (ch === "," && depth === 0) {
        parts.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    if (cur.trim()) parts.push(cur);
    return parts;
  }

  function splitOp(expr: string, op: string): [string, string] {
    const i = expr.indexOf(op);
    return [expr.slice(0, i), expr.slice(i + op.length)];
  }

  function splitBinLast(expr: string, op: string): [string, string] | null {
    let depth = 0;
    for (let i = expr.length - 1; i >= 0; i--) {
      if (expr[i] === ")" || expr[i] === "]") depth++;
      if (expr[i] === "(" || expr[i] === "[") depth--;
      if (depth === 0 && expr[i] === op) {
        const l = expr.slice(0, i).trim();
        const r = expr.slice(i + 1).trim();
        if (l && r) return [l, r];
      }
    }
    return null;
  }

  /* ── block-end finders ─────────────────────────────────── */

  /** Find matching closing brace for brace-based languages */
  function findBlockEnd(startLine: number): number {
    let depth = 0;
    for (let i = startLine; i < lines.length; i++) {
      const t = lines[i];
      for (const ch of t) {
        if (ch === "{") depth++;
        if (ch === "}") {
          depth--;
          if (depth === 0) return i;
        }
      }
    }
    return lines.length - 1;
  }

  /** Find end of an indented block for Python */
  function findPythonBlockEnd(startLine: number): number {
    const baseIndent = getIndent(lines[startLine]);
    for (let i = startLine + 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim() === "") continue;
      if (getIndent(line) <= baseIndent) return i - 1;
    }
    return lines.length - 1;
  }

  function getIndent(line: string): number {
    const m = line.match(/^(\s*)/);
    return m ? m[1].length : 0;
  }

  /* ── execution engine (brace-based: TS / Kotlin) ──────── */

  function execBlockBrace(lineStart: number, lineEnd: number) {
    let pc = lineStart;
    let safety = 0;
    while (pc <= lineEnd && safety < MAX_STATEMENT_STEPS) {
      safety++;
      currentExecLine = pc;
      const raw = lines[pc];
      const trimmed = raw.trim();
      if (
        !trimmed ||
        trimmed.startsWith("//") ||
        trimmed === "{" ||
        trimmed === "}"
      ) {
        pc++;
        continue;
      }

      // return statement
      const returnMatch = trimmed.match(/^return\s+(.+?)(?:;?)$/);
      if (returnMatch) {
        const val = evalExpr(returnMatch[1].replace(/;$/, ""), env);
        env["result"] = val;
        snapshot(
          pc,
          `<strong>Return</strong> <code>${JSON.stringify(val)}</code>`,
          ["result"]
        );
        throw new ReturnSignal(val);
      }

      // variable declaration: let/const/var (TS) or val/var (Kotlin)
      const declMatch = trimmed.match(
        /^(?:let|const|var|val)\s+(\w+)(?:\s*:\s*\w[\w<>,\s?]*?)?\s*=\s*(.+?)(?:;?)$/
      );
      if (declMatch) {
        const vname = declMatch[1];
        const val = evalExpr(declMatch[2].replace(/;$/, ""), env);
        env[vname] = val;
        if (Array.isArray(val)) arrays[vname] = true;
        snapshot(
          pc,
          `<strong>Declare</strong> <code>${vname}</code> = <code>${JSON.stringify(val)}</code>`,
          [vname]
        );
        pc++;
        continue;
      }

      // array element assignment  arr[idx] = val
      const arrAssign = trimmed.match(/^(\w+)\[(.+)\]\s*=\s*(.+?)(?:;?)$/);
      if (arrAssign) {
        const arrN = arrAssign[1];
        const idx = evalExpr(arrAssign[2], env) as number;
        const val = evalExpr(arrAssign[3].replace(/;$/, ""), env);
        if (Array.isArray(env[arrN])) (env[arrN] as unknown[])[idx] = val;
        snapshot(
          pc,
          `<strong>Set</strong> <code>${arrN}[${idx}]</code> = <code>${val}</code>`,
          [arrN]
        );
        pc++;
        continue;
      }

      // compound assignment  x += expr, x -= expr, etc.
      const compoundAssign = trimmed.match(
        /^(\w+)\s*(\+=|-=|\*=|\/=|%=)\s*(.+?)(?:;?)$/
      );
      if (compoundAssign) {
        const vname = compoundAssign[1];
        const op = compoundAssign[2];
        const rhs = evalExpr(
          compoundAssign[3].replace(/;$/, ""),
          env
        ) as number;
        const cur = (env[vname] ?? 0) as number;
        let newVal = cur;
        if (op === "+=") newVal = cur + rhs;
        else if (op === "-=") newVal = cur - rhs;
        else if (op === "*=") newVal = cur * rhs;
        else if (op === "/=") newVal = cur / rhs;
        else if (op === "%=") newVal = cur % rhs;
        env[vname] = newVal;
        snapshot(
          pc,
          `<strong>Update</strong> <code>${vname}</code> = <code>${newVal}</code>`,
          [vname]
        );
        pc++;
        continue;
      }

      // simple assignment  x = expr
      const assignMatch = trimmed.match(/^(\w+)\s*=\s*(.+?)(?:;?)$/);
      if (assignMatch) {
        const vname = assignMatch[1];
        const val = evalExpr(assignMatch[2].replace(/;$/, ""), env);
        env[vname] = val;
        snapshot(
          pc,
          `<strong>Update</strong> <code>${vname}</code> = <code>${JSON.stringify(val)}</code>`,
          [vname]
        );
        pc++;
        continue;
      }

      // increment / decrement
      const incDec = trimmed.match(/^(\w+)\s*(\+\+|--)(?:;?)$/);
      if (incDec) {
        const vname = incDec[1];
        const op = incDec[2];
        const cur = (env[vname] ?? 0) as number;
        env[vname] = op === "++" ? cur + 1 : cur - 1;
        snapshot(
          pc,
          `<strong>Update</strong> <code>${vname}</code> = <code>${env[vname]}</code>`,
          [vname]
        );
        pc++;
        continue;
      }

      // while loop
      const whileMatch = trimmed.match(/^while\s*\((.+)\)\s*\{?$/);
      if (whileMatch) {
        const cond = whileMatch[1];
        const bodyStart = pc + 1;
        const bodyEnd = findBlockEnd(pc);
        let wSafety = 0;
        while (wSafety < MAX_LOOP_ITERATIONS) {
          wSafety++;
          const cv = evalExpr(cond, env);
          snapshot(
            pc,
            `<strong>Check</strong> <code>${cond}</code> → <code>${String(cv)}</code>`
          );
          if (!cv) break;
          execBlockBrace(bodyStart, bodyEnd - 1);
        }
        if (wSafety >= MAX_LOOP_ITERATIONS) {
          throw new Error(
            `Line ${pc + 1}: while-loop exceeded ${MAX_LOOP_ITERATIONS} iterations (possible infinite loop).`
          );
        }
        pc = bodyEnd + 1;
        continue;
      }

      // for loop
      const forMatch = trimmed.match(/^for\s*\((.+)\)\s*\{?$/);
      if (forMatch) {
        const inner = forMatch[1];
        // Kotlin for (i in start until/..< end) or (i in start..end)
        const kotlinRange = inner.match(
          /(\w+)\s+in\s+(\w+|\d+)\s+(?:until|\.\.<?)\s+(.+)/
        );
        if (kotlinRange) {
          const vname = kotlinRange[1];
          const start = evalExpr(kotlinRange[2], env) as number;
          const endExpr = kotlinRange[3].trim();
          const endVal = evalExpr(endExpr, env) as number;
          const isUntil = inner.includes("until") || inner.includes("..<");
          const limit = isUntil ? endVal : endVal + 1;
          const bodyStart = pc + 1;
          const bodyEnd = findBlockEnd(pc);
          env[vname] = start;
          snapshot(
            pc,
            `<strong>Init</strong> <code>${vname}</code> = <code>${start}</code>`,
            [vname]
          );
          for (let idx = start; idx < limit; idx++) {
            env[vname] = idx;
            snapshot(
              pc,
              `<strong>Loop</strong> <code>${vname}</code> = <code>${idx}</code>`,
              [vname]
            );
            execBlockBrace(bodyStart, bodyEnd - 1);
          }
          pc = bodyEnd + 1;
          continue;
        }
        // Kotlin for (i in start..end)
        const kotlinRangeInclusive = inner.match(
          /(\w+)\s+in\s+(\w+|\d+)\.\.(\w+|\d+)/
        );
        if (kotlinRangeInclusive) {
          const vname = kotlinRangeInclusive[1];
          const start = evalExpr(kotlinRangeInclusive[2], env) as number;
          const endVal = evalExpr(kotlinRangeInclusive[3], env) as number;
          const bodyStart = pc + 1;
          const bodyEnd = findBlockEnd(pc);
          for (let idx = start; idx <= endVal; idx++) {
            env[vname] = idx;
            snapshot(
              pc,
              `<strong>Loop</strong> <code>${vname}</code> = <code>${idx}</code>`,
              [vname]
            );
            execBlockBrace(bodyStart, bodyEnd - 1);
          }
          pc = bodyEnd + 1;
          continue;
        }
        // C-style for
        const parts = inner.split(";").map((s) => s.trim());
        const bodyStart = pc + 1;
        const bodyEnd = findBlockEnd(pc);
        if (parts.length === 3) {
          const initLine = parts[0];
          const lm = initLine.match(
            /(?:let|var|val)?\s*(\w+)\s*=\s*(.+)/
          );
          if (lm) {
            env[lm[1]] = evalExpr(lm[2], env);
            snapshot(
              pc,
              `<strong>Init</strong> <code>${lm[1]}</code> = <code>${env[lm[1]]}</code>`,
              [lm[1]]
            );
          }
          let fSafety = 0;
          while (fSafety < MAX_LOOP_ITERATIONS) {
            fSafety++;
            const cv = evalExpr(parts[1], env);
            snapshot(
              pc,
              `<strong>Check</strong> <code>${parts[1]}</code> → <code>${String(cv)}</code>`
            );
            if (!cv) break;
            execBlockBrace(bodyStart, bodyEnd - 1);
            const upd = parts[2].replace(/;$/, "");
            const um = upd.match(/(\w+)\s*=\s*(.+)/);
            if (um) {
              env[um[1]] = evalExpr(um[2], env);
            }
            const pp = upd.match(/(\w+)\+\+/);
            if (pp) {
              env[pp[1]] = ((env[pp[1]] as number) ?? 0) + 1;
            }
            const mm = upd.match(/(\w+)--/);
            if (mm) {
              env[mm[1]] = ((env[mm[1]] as number) ?? 0) - 1;
            }
          }
          if (fSafety >= MAX_LOOP_ITERATIONS) {
            throw new Error(
              `Line ${pc + 1}: for-loop exceeded ${MAX_LOOP_ITERATIONS} iterations (possible infinite loop).`
            );
          }
        }
        pc = bodyEnd + 1;
        continue;
      }

      // if statement
      const ifMatch = trimmed.match(/^if\s*\((.+)\)\s*\{?$/);
      if (ifMatch) {
        const cond = ifMatch[1];
        const cv = evalExpr(cond, env);
        snapshot(
          pc,
          `<strong>Check if</strong> <code>${cond}</code> → <code>${String(cv)}</code>`
        );
        const bodyEnd = findBlockEnd(pc);
        if (cv) {
          execBlockBrace(pc + 1, bodyEnd - 1);
        }
        let nextPc = bodyEnd + 1;
        if (
          nextPc <= lineEnd &&
          lines[nextPc] &&
          /^(\}\s*)?else\s*\{?$/.test(lines[nextPc].trim())
        ) {
          if (!cv) {
            const elseEnd = findBlockEnd(nextPc);
            execBlockBrace(nextPc + 1, elseEnd - 1);
            nextPc = elseEnd + 1;
          } else {
            nextPc = findBlockEnd(nextPc) + 1;
          }
        } else if (
          nextPc <= lineEnd &&
          lines[nextPc] &&
          /^(\}\s*)?else\s+if/.test(lines[nextPc].trim())
        ) {
          if (!cv) {
            const elTrimmed = lines[nextPc]
              .trim()
              .replace(/^\}\s*else\s+/, "");
            lines[nextPc] =
              " ".repeat(getIndent(lines[nextPc])) + elTrimmed;
            pc = nextPc;
            continue;
          } else {
            nextPc = findBlockEnd(nextPc) + 1;
          }
        }
        pc = nextPc;
        continue;
      }

      pc++;
    }
  }

  /* ── Python execution (indent-based) ───────────────────── */

  function execBlockPython(lineStart: number, lineEnd: number) {
    let pc = lineStart;
    let safety = 0;
    while (pc <= lineEnd && safety < MAX_STATEMENT_STEPS) {
      safety++;
      currentExecLine = pc;
      const raw = lines[pc];
      const trimmed = raw.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        pc++;
        continue;
      }

      // return statement
      const returnMatch = trimmed.match(/^return\s+(.+)$/);
      if (returnMatch) {
        const val = evalExpr(returnMatch[1], env);
        env["result"] = val;
        snapshot(
          pc,
          `<strong>Return</strong> <code>${JSON.stringify(val)}</code>`,
          ["result"]
        );
        throw new ReturnSignal(val);
      }

      // array element assignment  arr[idx] = val
      const arrAssign = trimmed.match(/^(\w+)\[(.+)\]\s*=\s*(.+)$/);
      if (arrAssign) {
        const arrN = arrAssign[1];
        const idx = evalExpr(arrAssign[2], env) as number;
        const val = evalExpr(arrAssign[3], env);
        if (Array.isArray(env[arrN])) (env[arrN] as unknown[])[idx] = val;
        snapshot(
          pc,
          `<strong>Set</strong> <code>${arrN}[${idx}]</code> = <code>${val}</code>`,
          [arrN]
        );
        pc++;
        continue;
      }

      // compound assignment
      const compoundAssign = trimmed.match(
        /^(\w+)\s*(\+=|-=|\*=|\/=|%=|\/\/=)\s*(.+)$/
      );
      if (compoundAssign) {
        const vname = compoundAssign[1];
        const op = compoundAssign[2];
        const rhs = evalExpr(compoundAssign[3], env) as number;
        const cur = (env[vname] ?? 0) as number;
        let newVal = cur;
        if (op === "+=") newVal = cur + rhs;
        else if (op === "-=") newVal = cur - rhs;
        else if (op === "*=") newVal = cur * rhs;
        else if (op === "/=") newVal = cur / rhs;
        else if (op === "//=") newVal = Math.floor(cur / rhs);
        else if (op === "%=") newVal = cur % rhs;
        env[vname] = newVal;
        snapshot(
          pc,
          `<strong>Update</strong> <code>${vname}</code> = <code>${newVal}</code>`,
          [vname]
        );
        pc++;
        continue;
      }

      // while loop
      const whileMatch = trimmed.match(/^while\s+(.+):$/);
      if (whileMatch) {
        const cond = whileMatch[1];
        const bodyStart = pc + 1;
        const bodyEnd = findPythonBlockEnd(pc);
        let wSafety = 0;
        while (wSafety < MAX_LOOP_ITERATIONS) {
          wSafety++;
          const cv = evalExpr(cond, env);
          snapshot(
            pc,
            `<strong>Check</strong> <code>${cond}</code> → <code>${String(cv)}</code>`
          );
          if (!cv) break;
          execBlockPython(bodyStart, bodyEnd);
        }
        if (wSafety >= MAX_LOOP_ITERATIONS) {
          throw new Error(
            `Line ${pc + 1}: while-loop exceeded ${MAX_LOOP_ITERATIONS} iterations (possible infinite loop).`
          );
        }
        pc = bodyEnd + 1;
        continue;
      }

      // for i in range(n):
      const forRange = trimmed.match(
        /^for\s+(\w+)\s+in\s+range\((.+)\):$/
      );
      if (forRange) {
        const vname = forRange[1];
        const rangeArgs = forRange[2].split(",").map((s) => s.trim());
        let start = 0,
          end = 0,
          step = 1;
        if (rangeArgs.length === 1) {
          end = evalExpr(rangeArgs[0], env) as number;
        } else if (rangeArgs.length === 2) {
          start = evalExpr(rangeArgs[0], env) as number;
          end = evalExpr(rangeArgs[1], env) as number;
        } else if (rangeArgs.length === 3) {
          start = evalExpr(rangeArgs[0], env) as number;
          end = evalExpr(rangeArgs[1], env) as number;
          step = evalExpr(rangeArgs[2], env) as number;
        }
        const bodyStart = pc + 1;
        const bodyEnd = findPythonBlockEnd(pc);
        for (
          let idx = start;
          step > 0 ? idx < end : idx > end;
          idx += step
        ) {
          env[vname] = idx;
          snapshot(
            pc,
            `<strong>Loop</strong> <code>${vname}</code> = <code>${idx}</code>`,
            [vname]
          );
          execBlockPython(bodyStart, bodyEnd);
        }
        pc = bodyEnd + 1;
        continue;
      }

      // if statement
      const ifMatch = trimmed.match(/^if\s+(.+):$/);
      if (ifMatch) {
        const cond = ifMatch[1];
        const cv = evalExpr(cond, env);
        snapshot(
          pc,
          `<strong>Check if</strong> <code>${cond}</code> → <code>${String(cv)}</code>`
        );
        const bodyEnd = findPythonBlockEnd(pc);
        if (cv) {
          execBlockPython(pc + 1, bodyEnd);
        }
        let nextPc = bodyEnd + 1;
        // elif
        while (
          nextPc <= lineEnd &&
          lines[nextPc] &&
          lines[nextPc].trim().startsWith("elif ")
        ) {
          if (!cv) {
            const elifMatch = lines[nextPc]
              .trim()
              .match(/^elif\s+(.+):$/);
            if (elifMatch) {
              const elifCond = elifMatch[1];
              const elifCv = evalExpr(elifCond, env);
              snapshot(
                nextPc,
                `<strong>Check elif</strong> <code>${elifCond}</code> → <code>${String(elifCv)}</code>`
              );
              const elifEnd = findPythonBlockEnd(nextPc);
              if (elifCv) {
                execBlockPython(nextPc + 1, elifEnd);
                nextPc = elifEnd + 1;
                break;
              }
              nextPc = elifEnd + 1;
              continue;
            }
          }
          const skipEnd = findPythonBlockEnd(nextPc);
          nextPc = skipEnd + 1;
        }
        // else
        if (
          nextPc <= lineEnd &&
          lines[nextPc] &&
          lines[nextPc].trim() === "else:"
        ) {
          if (!cv) {
            const elseEnd = findPythonBlockEnd(nextPc);
            execBlockPython(nextPc + 1, elseEnd);
            nextPc = elseEnd + 1;
          } else {
            const skipEnd = findPythonBlockEnd(nextPc);
            nextPc = skipEnd + 1;
          }
        }
        pc = nextPc;
        continue;
      }

      // simple assignment  x = expr
      const assignMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
      if (assignMatch) {
        const vname = assignMatch[1];
        const val = evalExpr(assignMatch[2], env);
        env[vname] = val;
        if (Array.isArray(val)) arrays[vname] = true;
        snapshot(
          pc,
          `<strong>${Object.prototype.hasOwnProperty.call(env, vname) ? "Update" : "Declare"}</strong> <code>${vname}</code> = <code>${JSON.stringify(val)}</code>`,
          [vname]
        );
        pc++;
        continue;
      }

      pc++;
    }
  }

  /* ── main entry ────────────────────────────────────────── */

  // Show initial state with params if any
  if (params.length > 0) {
    snapshot(
      -1,
      `Initialized with sample data: ${params.map((p) => `<code>${p.name}</code>`).join(", ")}. Click <strong>Next</strong> to start.`,
      params.map((p) => p.name)
    );
  } else {
    snapshot(
      -1,
      'Ready to execute. Click <strong>Next</strong> to start.'
    );
  }

  try {
    if (language === "python") {
      execBlockPython(0, lines.length - 1);
    } else {
      execBlockBrace(0, lines.length - 1);
    }
  } catch (e) {
    if (e instanceof ReturnSignal) {
      // Return handled - result already set
    } else if (e instanceof SnapshotLimitError) {
      // Gracefully stop: we've exceeded the step budget. Surface in UI by
      // appending a final error step (if we still have room — otherwise just
      // return what we have).
      try {
        snapshot(-1, `<strong>Error:</strong> ${e.message}`);
      } catch {
        /* snapshot limit reached again - fine */
      }
      return states;
    } else {
      const raw = e instanceof Error ? e.message : String(e);
      // Attach a line number if the error doesn't already carry one.
      const msg = /^Line\s+\d+/.test(raw)
        ? raw
        : currentExecLine >= 0
        ? `Line ${currentExecLine + 1}: ${raw}`
        : raw;
      try {
        snapshot(-1, `<strong>Error:</strong> ${msg}`);
      } catch {
        /* ignore */
      }
    }
  }

  try {
    snapshot(-1, "<strong>Execution complete!</strong>");
  } catch {
    /* at snapshot limit - skip final marker */
  }
  return states;
}
