/**
 * Simple line-by-line code interpreter for TypeScript, Python, and Kotlin.
 * Supports: variable declarations, assignments, arrays, while/for loops,
 * if/else/else-if, basic math, Math.floor/min/max/abs, comparisons.
 * Also handles class/function wrappers, parameters, return statements,
 * and type annotations so users can paste LeetCode-style code.
 *
 * Produces a list of execution snapshots for step-by-step visualisation.
 */

/** A cell value inside a visualised array — either a scalar or a nested row. */
export type ArrayCell = number | string | boolean | ArrayCell[];

/**
 * True when `v` is a plain JS object — i.e. the result of a `{}` literal or
 * `Object.create(null)`. Excludes arrays, Maps, and Sets so they each get
 * routed to their dedicated viewer.
 */
function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (v === null || typeof v !== "object") return false;
  if (Array.isArray(v)) return false;
  if (v instanceof Map || v instanceof Set) return false;
  return true;
}

/** One entry in a snapshot's call stack — a user-defined function currently mid-execution. */
export interface CallFrameInfo {
  /** Function name as it appears in source. */
  name: string;
  /** Arguments the function was invoked with (primitives in place, arrays JSON-stringified for display). */
  args: unknown[];
  /** Parameter names corresponding to `args`, in declaration order. */
  paramNames: string[];
}

/** One entry in a visualised Map / dict — a key/value pair captured at snapshot time. */
export type MapEntry = [unknown, unknown];

export interface ExecSnapshot {
  /** 0-based line index (-1 = before/after execution) */
  line: number;
  /** Current variable values (scalars as primitives, arrays as JSON strings) */
  vars: Record<string, unknown>;
  /** Current array states keyed by name. Values may be 1-D or 2-D (nested). */
  arrays: Record<string, ArrayCell[]>;
  /**
   * Current map / dict / plain-object states keyed by name. Serialized as an
   * entries array so the renderer can show insertion-order. JS Map, JS plain
   * `{}`, and Python `dict` all flow through here.
   */
  maps: Record<string, MapEntry[]>;
  /**
   * Current set states keyed by name. JS/TS Set and Python set flow through
   * here. Values appear in insertion order.
   */
  sets: Record<string, unknown[]>;
  /** HTML explanation for this step */
  explanation: string;
  /** Names of variables that changed in this snapshot */
  changedVars: string[];
  /**
   * Active call stack (innermost last). Omitted when execution is at top
   * level. Each entry corresponds to one user-defined function call that
   * has not yet returned.
   */
  callStack?: CallFrameInfo[];
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

/**
 * Record of one parsed function definition. Indices are into the (post-
 * class-blanking) `lines` array returned by preprocess, so executors can
 * jump to `bodyStartIdx` and walk through `bodyEndIdx` directly.
 */
export interface FunctionDef {
  name: string;
  params: { name: string; type: string; defaultExpr?: string }[];
  paramNames: string[];
  /** Line index of the function header (e.g. `function foo(...)`). */
  declLine: number;
  /** First line of body (after the opening brace / def line). */
  bodyStartIdx: number;
  /** Last line of body (inclusive). For brace langs this is the line before the matching `}`. */
  bodyEndIdx: number;
  /** Brace-based only: line index of the matching closing `}`. */
  closeBraceLine?: number;
}

interface PreprocessResult {
  lines: string[];
  /** Line offset: how many lines were removed from the top (always 0 with the multi-function preprocess). */
  lineOffset: number;
  /** Primary function's parameters, used to seed sample data at top level. */
  params: { name: string; type: string; defaultExpr?: string }[];
  /** All discovered functions, keyed by name. The primary is included. */
  functions: Map<string, FunctionDef>;
  /** Name of the primary function (first non-`main`), or null if no function declared. */
  primaryName: string | null;
}

function preprocess(code: string, language: Lang): PreprocessResult {
  const lines = code.split("\n");
  const functions = new Map<string, FunctionDef>();

  // 1. Blank class wrapper if present (no whole-file dedent — we only dedent
  //    the primary function's body region, so helper functions keep their
  //    natural indentation and remain executable in-place).
  blankClassWrapper(lines, language);

  // 2. Discover every function declaration (after class blanking, so methods
  //    inside a Python class become visible as top-level `def`s).
  const allFns = findAllFunctions(lines, language);
  for (const fn of allFns) functions.set(fn.name, fn);

  if (allFns.length === 0) {
    return { lines, lineOffset: 0, params: [], functions, primaryName: null };
  }

  // 3. If the user has any executable statement OUTSIDE every function body,
  //    that top-level code IS the program — every function is just a callable
  //    helper. Don't inline anything; don't seed sample data.
  if (hasTopLevelExecutableCode(lines, allFns, language)) {
    return { lines, lineOffset: 0, params: [], functions, primaryName: null };
  }

  // 4. No top-level code → fall back to the playground convention: pick a
  //    primary function, blank its declaration so execution falls through
  //    into its body, and seed its parameters with sample data so the user
  //    sees a concrete run. First non-`main` (Kotlin idiom keeps `fun main`
  //    as the trampoline).
  const primary = allFns.find((f) => f.name !== "main") ?? allFns[0];

  lines[primary.declLine] = "";
  if (primary.closeBraceLine !== undefined) {
    lines[primary.closeBraceLine] = "";
  }

  return {
    lines,
    lineOffset: 0,
    params: primary.params,
    functions,
    primaryName: primary.name,
  };
}

/**
 * Return true if `lines` contains at least one non-blank, non-comment line
 * that isn't inside any function body or a function declaration itself. Used
 * to decide whether to inline a primary function (no top-level code) or to
 * treat the top-level statements as the program (has top-level code).
 */
function hasTopLevelExecutableCode(
  lines: string[],
  fns: FunctionDef[],
  language: Lang
): boolean {
  // Build a coverage map: which lines are inside any function (decl + body + close)?
  const covered = new Array<boolean>(lines.length).fill(false);
  for (const fn of fns) {
    const end = fn.closeBraceLine ?? fn.bodyEndIdx;
    for (let i = fn.declLine; i <= end; i++) covered[i] = true;
  }
  const commentPrefix = language === "python" ? "#" : "//";
  for (let i = 0; i < lines.length; i++) {
    if (covered[i]) continue;
    const t = lines[i].trim();
    if (!t) continue;
    if (t.startsWith(commentPrefix)) continue;
    // Bare braces / class skeletons aren't executable.
    if (t === "{" || t === "}") continue;
    return true;
  }
  return false;
}

/** Blank `class X { ... }` (TS/Kotlin) or `class X:` (Python). Leaves contents intact. */
function blankClassWrapper(lines: string[], language: Lang): void {
  if (language === "python") {
    for (let i = 0; i < lines.length; i++) {
      if (/^\s*class\s+\w+/.test(lines[i])) {
        lines[i] = "";
        return;
      }
    }
    return;
  }
  let classStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*class\s+\w+/.test(lines[i])) {
      classStart = i;
      break;
    }
  }
  if (classStart < 0) return;
  let depth = 0;
  for (let i = classStart; i < lines.length; i++) {
    for (const ch of lines[i]) {
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) {
          lines[classStart] = "";
          lines[i] = "";
          return;
        }
      }
    }
  }
}

/**
 * Discover every function declaration in `lines`. Supports:
 *   - TypeScript:  `function name(...)` and arrow `const name = (...) => {`
 *   - Kotlin:      `fun name(...)`
 *   - Python:      `def name(...):` (also handles `self` as the first param)
 *
 * Returns functions in source order. Indices are into the `lines` array as
 * provided, so they remain valid through subsequent preprocessing.
 */
function findAllFunctions(lines: string[], language: Lang): FunctionDef[] {
  const out: FunctionDef[] = [];
  if (language === "python") {
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/^\s*def\s+(\w+)\(([^)]*)\)(?:\s*->.*)?:\s*$/);
      if (!m) continue;
      const name = m[1];
      const params: { name: string; type: string; defaultExpr?: string }[] = [];
      if (m[2].trim()) parsePythonParams(m[2].trim(), params);
      const baseIndent = getIndentLevel(lines[i]);
      // Body extends until next non-blank line at indent <= baseIndent.
      let bodyEnd = lines.length - 1;
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() === "") continue;
        if (getIndentLevel(lines[j]) <= baseIndent) {
          bodyEnd = j - 1;
          break;
        }
      }
      out.push({
        name,
        params,
        paramNames: params.map((p) => p.name),
        declLine: i,
        bodyStartIdx: i + 1,
        bodyEndIdx: bodyEnd,
      });
    }
    return out;
  }

  // Brace-based: TypeScript / Kotlin. Two header shapes:
  //   `function name(...)`  /  `fun name(...)`  /  `const name = (...) => {`
  // Header may span multiple lines (long signatures), so we walk paren depth.
  const headerRe =
    /^\s*(?:(?:export|private|public|internal)\s+)?(?:function|fun)\s+(\w+)\s*(?:<[^>]*>)?\s*\(/;
  const arrowHeaderRe =
    /^\s*(?:const|let|var)\s+(\w+)\s*=\s*\(/;

  for (let i = 0; i < lines.length; i++) {
    let name: string | null = null;
    let parenStart = -1;
    let isArrow = false;
    const mh = lines[i].match(headerRe);
    if (mh) {
      name = mh[1];
      parenStart = lines[i].indexOf("(", mh[0].length - 1);
    } else {
      const ma = lines[i].match(arrowHeaderRe);
      if (ma) {
        name = ma[1];
        parenStart = lines[i].indexOf("(", ma[0].length - 1);
        isArrow = true;
      }
    }
    if (name === null || parenStart < 0) continue;

    // Walk across lines to find the closing `)` of the parameter list.
    let paramStr = "";
    let pDepth = 0;
    let started = false;
    let sigEndLine = i;
    let sigEndCol = -1;
    outer: for (let j = i; j < lines.length; j++) {
      const ln = lines[j];
      const startCol = j === i ? parenStart : 0;
      for (let c = startCol; c < ln.length; c++) {
        const ch = ln[c];
        if (ch === "(") {
          pDepth++;
          started = true;
        } else if (ch === ")") {
          pDepth--;
          if (started && pDepth === 0) {
            sigEndLine = j;
            sigEndCol = c;
            break outer;
          }
        } else if (started && pDepth > 0) {
          paramStr += ch;
        }
      }
      if (started) paramStr += " ";
    }
    if (sigEndCol === -1) continue;

    // Find the opening `{` of the body — may be on the same line or later.
    let braceOpenLine = -1;
    for (let j = sigEndLine; j < lines.length; j++) {
      const startCol = j === sigEndLine ? sigEndCol + 1 : 0;
      const idx = lines[j].indexOf("{", startCol);
      if (idx !== -1) {
        braceOpenLine = j;
        break;
      }
      // tolerate `: ReturnType` tail or arrow `=>`
      const tail = lines[j].trim();
      if (tail && !/^[:=>\w<>?,\s[\]|&]+$/.test(tail)) break;
    }
    if (braceOpenLine === -1) continue;

    // Find matching closing brace.
    let depth = 0;
    let closeBraceLine = -1;
    for (let j = braceOpenLine; j < lines.length; j++) {
      for (const ch of lines[j]) {
        if (ch === "{") depth++;
        else if (ch === "}") {
          depth--;
          if (depth === 0) {
            closeBraceLine = j;
            break;
          }
        }
      }
      if (closeBraceLine !== -1) break;
    }
    if (closeBraceLine === -1) continue;

    const params: { name: string; type: string; defaultExpr?: string }[] = [];
    if (paramStr.trim()) {
      if (language === "kotlin") parseKotlinParams(paramStr, params);
      else parseTsParams(paramStr, params);
    }

    out.push({
      name,
      params,
      paramNames: params.map((p) => p.name),
      declLine: i,
      bodyStartIdx: braceOpenLine + 1,
      bodyEndIdx: closeBraceLine - 1,
      closeBraceLine,
    });

    // Skip over body so we don't redetect nested arrow functions as
    // separate top-level defs in this naive pass.
    void isArrow;
    i = closeBraceLine;
  }
  return out;
}

function getIndentLevel(line: string): number {
  const m = line.match(/^(\s*)/);
  return m ? m[1].length : 0;
}

/**
 * Split a single param chunk like `right: number = arr.length - 1` into
 * `{ name, type, defaultExpr }`. The default is captured as a raw expression
 * string so the caller can evalExpr it inside the callee frame (where prior
 * params are already bound and visible).
 */
function splitParamChunk(part: string): { core: string; defaultExpr?: string } {
  // Find the first `=` at top-level depth (skipping `==`, `===`, `=>`).
  let depth = 0;
  for (let i = 0; i < part.length; i++) {
    const c = part[i];
    if (c === "(" || c === "[" || c === "<" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === ">" || c === "}") depth--;
    if (depth !== 0) continue;
    if (c === "=" && part[i + 1] !== "=" && part[i + 1] !== ">") {
      return {
        core: part.slice(0, i).trim(),
        defaultExpr: part.slice(i + 1).trim(),
      };
    }
  }
  return { core: part.trim() };
}

function parseKotlinParams(
  paramStr: string,
  out: { name: string; type: string; defaultExpr?: string }[]
) {
  for (const part of splitParams(paramStr)) {
    const { core, defaultExpr } = splitParamChunk(part);
    const m = core.match(/^(\w+)\s*:\s*(.+)$/);
    if (m) out.push({ name: m[1], type: m[2].trim(), defaultExpr });
  }
}

function parseTsParams(
  paramStr: string,
  out: { name: string; type: string; defaultExpr?: string }[]
) {
  for (const part of splitParams(paramStr)) {
    const { core, defaultExpr } = splitParamChunk(part);
    const m = core.match(/^(\w+)(?:\s*:\s*(.+))?$/);
    if (m)
      out.push({
        name: m[1],
        type: (m[2] ?? "number").trim(),
        defaultExpr,
      });
  }
}

function parsePythonParams(
  paramStr: string,
  out: { name: string; type: string; defaultExpr?: string }[]
) {
  for (const part of splitParams(paramStr)) {
    const cleaned = part.trim();
    if (cleaned === "self") continue;
    const { core, defaultExpr } = splitParamChunk(cleaned);
    const m = core.match(/^(\w+)(?:\s*:\s*(.+))?$/);
    if (m)
      out.push({
        name: m[1],
        type: (m[2] ?? "int").trim(),
        defaultExpr,
      });
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

/**
 * Parse an array-assignment left-hand side like `arr[i] = v` or `grid[r][c] = v`.
 * Returns the variable name, list of index expressions (as raw strings, to be
 * evaluated later), and the right-hand-side expression.
 *
 * Semicolons are stripped from the RHS. Returns null if the line doesn't look
 * like an array/subscript assignment at all (so the caller falls through).
 *
 * Uses bracket-depth matching so index expressions can themselves contain
 * brackets: `dp[i - 1][j + nums[k]] = x`.
 */
function parseArrayAssignLhs(
  line: string
): { name: string; indexStrs: string[]; rhs: string } | null {
  const base = parseArrayAssignLhsLoose(line);
  if (!base) return null;
  // Whatever comes after the last `]` must start with optional whitespace + `=`
  // that is NOT part of `==`, `===`, `!=`, `<=`, `>=`, `+=`, `-=`, `*=`, `/=`, `%=`.
  const eqMatch = base.tail.match(/^\s*=(?!=)\s*(.+?)\s*;?\s*$/);
  if (!eqMatch) return null;
  return { name: base.name, indexStrs: base.indexStrs, rhs: eqMatch[1] };
}

/**
 * Parse an augmented assignment to an indexed target, e.g. `freq[c] += 1`,
 * `arr[i] -= 2`, `grid[i][j] += 1`, or Python `d[k] //= 2`. Returns the
 * receiver name, the index expression(s), the operator, and the rhs — or null
 * if the line isn't an indexed compound assignment. Without this, the common
 * `freq[c] += 1` frequency-counter idiom matches no handler and is silently
 * dropped.
 */
function parseIndexedCompoundLhs(
  line: string
): { name: string; indexStrs: string[]; op: string; rhs: string } | null {
  const base = parseArrayAssignLhsLoose(line);
  if (!base) return null;
  const opMatch = base.tail.match(
    /^\s*(\+=|-=|\*=|\/=|%=|\/\/=)\s*(.+?)\s*;?\s*$/
  );
  if (!opMatch) return null;
  return {
    name: base.name,
    indexStrs: base.indexStrs,
    op: opMatch[1],
    rhs: opMatch[2],
  };
}

/** Like parseArrayAssignLhs but stops at the indices and hands back the raw tail. */
function parseArrayAssignLhsLoose(
  line: string
): { name: string; indexStrs: string[]; tail: string } | null {
  const nameMatch = line.match(/^(\w+)\[/);
  if (!nameMatch) return null;
  const name = nameMatch[1];
  const indexStrs: string[] = [];
  let cursor = name.length;
  while (cursor < line.length && line[cursor] === "[") {
    let depth = 0;
    let closeIdx = -1;
    for (let i = cursor; i < line.length; i++) {
      const c = line[i];
      if (c === "[") depth++;
      else if (c === "]") {
        depth--;
        if (depth === 0) {
          closeIdx = i;
          break;
        }
      }
    }
    if (closeIdx === -1) return null;
    indexStrs.push(line.slice(cursor + 1, closeIdx));
    cursor = closeIdx + 1;
  }
  if (indexStrs.length === 0) return null;
  return { name, indexStrs, tail: line.slice(cursor) };
}

/**
 * Find the leftmost top-level occurrence of any operator in `ops` within
 * `expr`, respecting bracket/paren depth so we don't split inside `arr[...]`
 * or `(...)`. Returns `[op, idx]` where `idx` is the start index of the
 * matched operator, or null if no match.
 *
 * Longer operator forms (e.g. `===`) should be listed BEFORE shorter forms
 * (`==`) so that `startsWith` doesn't prematurely match the short variant.
 *
 * This is used for proper operator-precedence descent in `evalExpr`: the
 * caller picks the lowest-precedence group first and splits there, ensuring
 * `i === 0 && j > 0` is split on `&&` (not on `===`).
 */
function findTopLevelOp(
  expr: string,
  ops: string[]
): [string, number] | null {
  let depth = 0;
  let inStr: string | null = null;
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    // Skip string literals so operators inside them (e.g. the substring
    // " in " in `count + " items in stock"`) aren't treated as real ops.
    if (inStr) {
      if (c === inStr && expr[i - 1] !== "\\") inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      inStr = c;
      continue;
    }
    if (c === "(" || c === "[" || c === "{") {
      depth++;
      continue;
    }
    if (c === ")" || c === "]" || c === "}") {
      depth--;
      continue;
    }
    if (depth !== 0) continue;
    for (const op of ops) {
      if (expr.startsWith(op, i)) {
        // For single-char arithmetic tokens ('+', '-', '*', '/', '%') we
        // don't want to match a leading unary sign — caller handles those
        // via splitBinLast instead, so this helper is only used for
        // multi-char ops (`==`, `&&`, etc). A leading '+' / '-' guard is
        // therefore unnecessary here.
        return [op, i];
      }
    }
  }
  return null;
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

interface CallFrame {
  env: Record<string, unknown>;
  arrays: Record<string, boolean>;
  /** Names in `env` that hold a Map / plain `{}` / Python dict (for snapshot serialization). */
  maps: Record<string, boolean>;
  /** Names in `env` that hold a Set (JS Set or Python set). */
  sets: Record<string, boolean>;
  dirtyArrayRows: Record<string, Set<number>>;
  /** Function name when this frame represents a user call. Undefined for the top-level frame. */
  fnName?: string;
  paramNames?: string[];
  /** Argument values bound at call time, captured for the call-stack UI. */
  args?: unknown[];
}

export function interpret(code: string, language: Lang): ExecSnapshot[] {
  const { lines, params, functions, primaryName } = preprocess(code, language);
  const states: ExecSnapshot[] = [];

  /**
   * Decl-line index → end-of-body line for every helper function (i.e.
   * everything *except* the primary, whose body we want top-level execution
   * to flow into). Used by the executors to skip past helper declarations
   * without trying to interpret them as statements.
   */
  const helperSkip = new Map<number, number>();
  for (const fn of functions.values()) {
    if (fn.name === primaryName) continue;
    const end = fn.closeBraceLine ?? fn.bodyEndIdx;
    helperSkip.set(fn.declLine, end);
  }

  // Frames stack. Index 0 is the top-level frame; each user-function call
  // pushes a new frame and pops on return. `env` / `arrays` / `maps` / `sets`
  // / `dirtyArrayRows` are `let` bindings reassigned from the current top
  // frame so that closures (snapshot, evalExpr, exec…) see the right scope.
  const topFrame: CallFrame = {
    env: {},
    arrays: {},
    maps: {},
    sets: {},
    dirtyArrayRows: {},
  };
  const frames: CallFrame[] = [topFrame];
  let env: Record<string, unknown> = topFrame.env;
  let arrays: Record<string, boolean> = topFrame.arrays;
  let maps: Record<string, boolean> = topFrame.maps;
  let sets: Record<string, boolean> = topFrame.sets;
  let dirtyArrayRows: Record<string, Set<number>> = topFrame.dirtyArrayRows;

  function pushFrame(fnName: string, paramNames: string[], args: unknown[]) {
    const frame: CallFrame = {
      env: {},
      arrays: {},
      maps: {},
      sets: {},
      dirtyArrayRows: {},
      fnName,
      paramNames,
      args,
    };
    for (let i = 0; i < paramNames.length; i++) {
      const v = args[i];
      frame.env[paramNames[i]] = v;
      if (Array.isArray(v)) frame.arrays[paramNames[i]] = true;
      else if (v instanceof Map || isPlainObject(v)) frame.maps[paramNames[i]] = true;
      else if (v instanceof Set) frame.sets[paramNames[i]] = true;
    }
    frames.push(frame);
    env = frame.env;
    arrays = frame.arrays;
    maps = frame.maps;
    sets = frame.sets;
    dirtyArrayRows = frame.dirtyArrayRows;
  }

  function popFrame() {
    frames.pop();
    const top = frames[frames.length - 1];
    env = top.env;
    arrays = top.arrays;
    maps = top.maps;
    sets = top.sets;
    dirtyArrayRows = top.dirtyArrayRows;
  }

  /** Snapshot the active call stack (skipping the implicit top-level frame). */
  function activeCallStack(): CallFrameInfo[] | undefined {
    if (frames.length <= 1) return undefined;
    const out: CallFrameInfo[] = [];
    for (let i = 1; i < frames.length; i++) {
      const f = frames[i];
      out.push({
        name: f.fnName ?? "(anonymous)",
        paramNames: f.paramNames ?? [],
        args: (f.args ?? []).map((v) =>
          Array.isArray(v) ? JSON.stringify(v) : v
        ),
      });
    }
    return out;
  }

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
    // Build fresh instead of delete-in-place to avoid V8 hidden-class deopt.
    const vs: Record<string, unknown> = {};
    if (prev) {
      for (const k in prev.vars) {
        if (k in env) vs[k] = prev.vars[k];
      }
    }
    for (const k in env) {
      const v = env[k];
      if (Array.isArray(v)) {
        arrays[k] = true;
        if (!prev || changedSet.has(k) || !(k in prev.vars)) {
          vs[k] = JSON.stringify(v);
        }
      } else if (v instanceof Map || isPlainObject(v)) {
        // Maps and plain objects show up in their own panel — keep them out
        // of the primitive `vars` so they don't render twice. Drop any stale
        // value carried forward from prev.vars (e.g. `x` was a scalar before
        // it became a Map).
        maps[k] = true;
        delete vs[k];
      } else if (v instanceof Set) {
        sets[k] = true;
        delete vs[k];
      } else {
        if (!prev || changedSet.has(k) || prev.vars[k] !== v) {
          vs[k] = v;
        }
      }
    }

    // Build arrays: reuse unchanged rows from the previous snapshot and only
    // copy rows that were dirtied since the last snapshot. This avoids O(m×n)
    // work per snapshot and brings the total cost for a 2-D DP table from
    // O(m²n²) down to O(m²n) — each cell is copied at most once.
    const arrs: Record<string, ArrayCell[]> = {};
    for (const k in arrays) {
      const live = env[k];
      if (
        prev &&
        !changedSet.has(k) &&
        prev.arrays[k] !== undefined
      ) {
        arrs[k] = prev.arrays[k];
      } else if (Array.isArray(live)) {
        const dirtyRows = dirtyArrayRows[k];
        const prevArr = prev?.arrays[k];
        const hasDirtyTracking = dirtyRows && dirtyRows.size > 0;
        arrs[k] = (live as unknown[]).map((row, idx) => {
          if (!Array.isArray(row)) return row as ArrayCell;
          if (hasDirtyTracking && !dirtyRows.has(idx) && prevArr && Array.isArray(prevArr[idx])) {
            return prevArr[idx];
          }
          return [...row] as ArrayCell[];
        }) as ArrayCell[];
      } else {
        arrs[k] = [];
      }
    }
    dirtyArrayRows = {};

    // Build maps: serialize each tracked Map / dict / plain-object as an
    // entries array so the renderer can show insertion order.
    // Reuse the previous serialization for any map/set not touched this step,
    // mirroring the structural sharing used for arrays — avoids re-copying
    // every entry on every snapshot (O(steps × size)).
    const mapSnap: Record<string, MapEntry[]> = {};
    for (const k in maps) {
      if (prev && !changedSet.has(k) && prev.maps[k] !== undefined) {
        mapSnap[k] = prev.maps[k];
        continue;
      }
      const live = env[k];
      if (live instanceof Map) {
        mapSnap[k] = Array.from(live.entries()) as MapEntry[];
      } else if (isPlainObject(live)) {
        mapSnap[k] = Object.entries(live) as MapEntry[];
      } else {
        mapSnap[k] = [];
      }
    }

    // Build sets: serialize each Set as an ordered array of values.
    const setSnap: Record<string, unknown[]> = {};
    for (const k in sets) {
      if (prev && !changedSet.has(k) && prev.sets[k] !== undefined) {
        setSnap[k] = prev.sets[k];
        continue;
      }
      const live = env[k];
      if (live instanceof Set) {
        setSnap[k] = Array.from(live.values());
      } else {
        setSnap[k] = [];
      }
    }

    const cs = activeCallStack();
    states.push({
      line: lineIdx,
      vars: vs,
      arrays: arrs,
      maps: mapSnap,
      sets: setSnap,
      explanation,
      changedVars: changedVars.length ? changedVars.slice() : [],
      ...(cs ? { callStack: cs } : {}),
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
    // strings — with Kotlin string-template interpolation ("$x" / "${expr}").
    if (/^(["']).*\1$/.test(expr)) {
      const raw = expr.slice(1, -1);
      if (language === "kotlin" && raw.indexOf("$") !== -1) {
        return raw
          .replace(/\$\{([^}]*)\}/g, (_m, ex: string) => {
            try {
              return String(evalExpr(ex.trim(), e));
            } catch {
              return "";
            }
          })
          .replace(/\$(\w[\w.]*)/g, (_m, id: string) => {
            try {
              return String(evalExpr(id, e));
            } catch {
              return "";
            }
          });
      }
      return raw;
    }
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
      // Kotlin has no `[...]` list literal — surface a clear error instead of
      // silently treating it as one (a common JS/Python habit).
      if (language === "kotlin") {
        throw new Error(
          `Kotlin has no [...] list literal — use listOf(...) or mutableListOf(...) instead of ${expr}`
        );
      }
      const inner = expr.slice(1, -1).trim();
      if (!inner) return [];
      return smartSplit(inner).map((s) => evalExpr(s.trim(), e));
    }
    // Object / dict / set literal:
    //   {}                 → empty plain object (TS/JS) or empty dict (Python)
    //   { k: v, k2: v2 }   → plain object / dict
    //   { v1, v2 }         → Python set (no colons inside)
    if (expr.startsWith("{") && expr.endsWith("}")) {
      const inner = expr.slice(1, -1).trim();
      if (!inner) return {};
      const parts = smartSplit(inner);
      const hasColon = parts.some((p) => containsTopLevelColon(p));
      // No colons anywhere in Python → set literal.
      if (!hasColon && language === "python") {
        const s = new Set<unknown>();
        for (const part of parts) s.add(evalExpr(part.trim(), e));
        return s;
      }
      // Otherwise a plain object / dict. Each entry is one of:
      //   key: value      → explicit pair
      //   ...src          → spread of another object/Map
      //   ident           → ES shorthand `{ x }` → `{ x: x }`
      const obj: Record<string, unknown> = {};
      for (const part of parts) {
        const t = part.trim();
        if (!t) continue;
        if (t.startsWith("...")) {
          const spread = evalExpr(t.slice(3).trim(), e);
          if (spread instanceof Map) {
            for (const [k, v] of spread) obj[String(k)] = v;
          } else if (isPlainObject(spread)) {
            Object.assign(obj, spread);
          }
          continue;
        }
        const idx = topLevelColonIndex(t);
        if (idx >= 0) {
          const rawKey = t.slice(0, idx).trim();
          const valSrc = t.slice(idx + 1).trim();
          // Quoted string key or bare identifier (treated as string).
          const key = /^["'].*["']$/.test(rawKey)
            ? rawKey.slice(1, -1)
            : rawKey;
          obj[key] = evalExpr(valSrc, e);
        } else if (/^\w+$/.test(t)) {
          // Shorthand property — value comes from the same-named variable.
          obj[t] = evalExpr(t, e);
        }
      }
      return obj;
    }
    // new Map() / new Map([[k, v], ...])  — TypeScript / JavaScript
    const newMapEmpty = expr.match(/^new\s+Map\s*(?:<[^>]*>)?\s*\(\s*\)$/);
    if (newMapEmpty) return new Map();
    const newMapInit = expr.match(
      /^new\s+Map\s*(?:<[^>]*>)?\s*\(\s*\[([\s\S]*)\]\s*\)$/
    );
    if (newMapInit) {
      const m = new Map<unknown, unknown>();
      const inner = newMapInit[1].trim();
      if (inner) {
        for (const part of smartSplit(inner)) {
          const t = part.trim();
          if (!t.startsWith("[") || !t.endsWith("]")) continue;
          const kv = smartSplit(t.slice(1, -1));
          if (kv.length !== 2) continue;
          m.set(evalExpr(kv[0].trim(), e), evalExpr(kv[1].trim(), e));
        }
      }
      return m;
    }
    // new Set() / new Set([v, ...])  — TypeScript / JavaScript
    const newSetEmpty = expr.match(/^new\s+Set\s*(?:<[^>]*>)?\s*\(\s*\)$/);
    if (newSetEmpty) return new Set();
    const newSetInit = expr.match(
      /^new\s+Set\s*(?:<[^>]*>)?\s*\(\s*\[([\s\S]*)\]\s*\)$/
    );
    if (newSetInit) {
      const s = new Set<unknown>();
      const inner = newSetInit[1].trim();
      if (inner) {
        for (const part of smartSplit(inner)) {
          s.add(evalExpr(part.trim(), e));
        }
      }
      return s;
    }
    // Python dict() / set() constructors with no args.
    if (expr === "dict()") return {};
    if (expr === "set()") return new Set();
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
    // len(x) / python — works for arrays, strings, Maps, Sets, and dicts.
    const lenCall = expr.match(/^len\((\w+)\)$/);
    if (lenCall) {
      const v = e[lenCall[1]];
      if (Array.isArray(v)) return v.length;
      if (typeof v === "string") return (v as string).length;
      if (v instanceof Map || v instanceof Set) return v.size;
      if (isPlainObject(v)) return Object.keys(v).length;
      return 0;
    }
    // .size  — arrays, Maps, Sets (Kotlin + JS).
    const sizeAccess = expr.match(/^(\w+)\.size$/);
    if (sizeAccess) {
      const v = e[sizeAccess[1]];
      if (Array.isArray(v)) return v.length;
      if (v instanceof Map || v instanceof Set) return v.size;
      if (isPlainObject(v)) return Object.keys(v).length;
      return 0;
    }
    // .length  — arrays, strings.
    const lenAccess = expr.match(/^(\w+)\.length$/);
    if (lenAccess) {
      const v = e[lenAccess[1]];
      if (Array.isArray(v)) return v.length;
      if (typeof v === "string") return (v as string).length;
      return 0;
    }
    // m.get(key)  — JS Map; falls back to plain-object bracket access.
    const mapGet = expr.match(/^(\w+)\.get\((.+)\)$/);
    if (mapGet) {
      const container = e[mapGet[1]];
      const key = evalExpr(mapGet[2], e);
      if (container instanceof Map) return container.get(key);
      if (isPlainObject(container)) return container[String(key)];
      return undefined;
    }
    // m.has(key)  — JS Map / JS Set / plain-object property check.
    const collHas = expr.match(/^(\w+)\.has\((.+)\)$/);
    if (collHas) {
      const container = e[collHas[1]];
      const key = evalExpr(collHas[2], e);
      if (container instanceof Map || container instanceof Set) return container.has(key);
      if (isPlainObject(container))
        return Object.prototype.hasOwnProperty.call(container, String(key));
      return false;
    }
    // Kotlin / Python style `.contains(value)` — same semantics as `.has`.
    const collContains = expr.match(/^(\w+)\.contains\((.+)\)$/);
    if (collContains) {
      const container = e[collContains[1]];
      const v = evalExpr(collContains[2], e);
      if (container instanceof Map) return container.has(v);
      if (container instanceof Set) return container.has(v);
      if (Array.isArray(container)) return container.includes(v);
      if (isPlainObject(container))
        return Object.prototype.hasOwnProperty.call(container, String(v));
      return false;
    }
    // Plain-object dot access: obj.key (must come after .length/.size and
    // .get/.has/.contains so those built-ins win, and after Math.* / Number.*
    // because those resolve via exact-match higher up).
    const dotAccess = expr.match(/^(\w+)\.(\w+)$/);
    if (dotAccess) {
      const container = e[dotAccess[1]];
      if (isPlainObject(container)) return container[dotAccess[2]];
      // fall through — let variable lookup raise a useful error
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
    // array access  arr[idx]  (also chained:  arr[i][j],  grid[i][j][k])
    // Must use bracket-depth matching, not a greedy regex — otherwise
    // expressions like `arr[0] > arr[1]` get incorrectly parsed as
    // name=arr, idx="0] > arr[1", bypassing comparison operators entirely.
    const nameMatch = expr.match(/^(\w+)\[/);
    if (nameMatch && expr.endsWith("]")) {
      const arrName = nameMatch[1];
      // Walk through a sequence of `[...]` groups starting right after the
      // variable name. Collect every index expression and require the final
      // closing bracket to be at the very end of `expr` — otherwise a tail
      // operator (`arr[0] > arr[1]`) is hiding here and we must fall through.
      const indexStrs: string[] = [];
      let cursor = arrName.length; // position of `[`
      let consumedWholeExpr = false;
      while (cursor < expr.length && expr[cursor] === "[") {
        let depth = 0;
        let closeIdx = -1;
        for (let i = cursor; i < expr.length; i++) {
          const c = expr[i];
          if (c === "[") depth++;
          else if (c === "]") {
            depth--;
            if (depth === 0) {
              closeIdx = i;
              break;
            }
          }
        }
        if (closeIdx === -1) break; // malformed, fall through
        indexStrs.push(expr.slice(cursor + 1, closeIdx));
        cursor = closeIdx + 1;
        if (cursor === expr.length) {
          consumedWholeExpr = true;
          break;
        }
      }
      if (consumedWholeExpr && indexStrs.length > 0) {
        let cur: unknown = e[arrName];
        for (const iStr of indexStrs) {
          const idx = evalExpr(iStr, e);
          if (Array.isArray(cur)) {
            cur = (cur as unknown[])[idx as number];
          } else if (cur instanceof Map) {
            cur = cur.get(idx);
          } else if (isPlainObject(cur)) {
            cur = (cur as Record<string, unknown>)[String(idx)];
          } else if (typeof cur === "string") {
            cur = (cur as string)[idx as number];
          } else {
            return undefined;
          }
        }
        return cur;
      }
    }
    // parenthesised
    if (/^\((.+)\)$/.test(expr)) return evalExpr(expr.slice(1, -1), e);

    // Recursive-descent: split on LOWEST precedence first, respecting
    // bracket depth so we don't split inside `arr[...]` or `(...)`.
    // Precedence (lowest → highest): `||` → `&&` → equality → relational → additive → multiplicative.

    // ── logical OR ──
    {
      const i = findTopLevelOp(expr, ["||", " or "]);
      if (i !== null) {
        const [op, idx] = i;
        return (
          evalExpr(expr.slice(0, idx), e) ||
          evalExpr(expr.slice(idx + op.length), e)
        );
      }
    }
    // ── logical AND ──
    {
      const i = findTopLevelOp(expr, ["&&", " and "]);
      if (i !== null) {
        const [op, idx] = i;
        return (
          evalExpr(expr.slice(0, idx), e) &&
          evalExpr(expr.slice(idx + op.length), e)
        );
      }
    }
    // ── equality ==, ===, !=, !== ──
    {
      const i = findTopLevelOp(expr, ["===", "!==", "==", "!="]);
      if (i !== null) {
        const [op, idx] = i;
        const l = evalExpr(expr.slice(0, idx), e);
        const r = evalExpr(expr.slice(idx + op.length), e);
        if (op === "===") return l === r;
        if (op === "!==") return l !== r;
        if (op === "==") return l == r;
        return l != r;
      }
    }
    // ── relational >=, <=, >, < ──
    {
      const i = findTopLevelOp(expr, [">=", "<=", ">", "<"]);
      if (i !== null) {
        const [op, idx] = i;
        const l = evalExpr(expr.slice(0, idx), e) as number;
        const r = evalExpr(expr.slice(idx + op.length), e) as number;
        if (op === ">=") return l >= r;
        if (op === "<=") return l <= r;
        if (op === ">") return l > r;
        return l < r;
      }
    }
    // `key in container`  — TS `in` operator + Python membership test.
    // Same precedence tier as relational.
    {
      const i = findTopLevelOp(expr, [" in "]);
      if (i !== null) {
        const [op, idx] = i;
        const k = evalExpr(expr.slice(0, idx), e);
        const c = evalExpr(expr.slice(idx + op.length), e);
        if (c instanceof Map || c instanceof Set) return c.has(k);
        if (Array.isArray(c)) return c.includes(k);
        if (isPlainObject(c))
          return Object.prototype.hasOwnProperty.call(c, String(k));
        if (typeof c === "string") return c.includes(String(k));
        return false;
      }
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
      if (p) {
        const a = evalExpr(p[0], e) as number;
        const b = evalExpr(p[1], e) as number;
        // Kotlin `/` on integer operands performs integer (truncating) division.
        if (language === "kotlin" && Number.isInteger(a) && Number.isInteger(b)) {
          return Math.trunc(a / b);
        }
        return a / b;
      }
    }
    if (expr.includes("%")) {
      const p = splitBinLast(expr, "%");
      if (p)
        return (
          (evalExpr(p[0], e) as number) % (evalExpr(p[1], e) as number)
        );
    }
    // User-defined function call:  name(arg, arg, ...)
    // Checked after operator splits so `foo(x) + bar(y)` is split on `+` first.
    if (functions.size > 0 && expr.endsWith(")")) {
      const callMatch = expr.match(/^(\w+)\s*\(([\s\S]*)\)$/);
      if (callMatch && functions.has(callMatch[1])) {
        const fn = functions.get(callMatch[1])!;
        const argSrc = callMatch[2].trim();
        const argStrs = argSrc ? smartSplit(argSrc) : [];
        const argVals = argStrs.map((s) => evalExpr(s.trim(), e));
        return callUserFunction(fn, argVals);
      }
    }
    // variable lookup
    if (Object.prototype.hasOwnProperty.call(e, expr)) return e[expr];
    throw new Error("Cannot evaluate: " + expr);
  }

  /**
   * Execute a user-defined function with the given pre-evaluated arguments.
   * Pushes a fresh frame, runs the body, catches the function-local
   * `ReturnSignal`, and pops on the way out (including on error).
   */
  function callUserFunction(fn: FunctionDef, argVals: unknown[]): unknown {
    // Fill missing trailing args from declared defaults. Each default is
    // evaluated in a partial callee env so later defaults can reference
    // earlier params (e.g. `right: number = arr.length - 1`).
    const finalArgs: unknown[] = argVals.slice();
    if (finalArgs.length < fn.paramNames.length) {
      const partial: Record<string, unknown> = {};
      for (let i = 0; i < fn.paramNames.length; i++) {
        if (i < finalArgs.length) {
          partial[fn.paramNames[i]] = finalArgs[i];
          continue;
        }
        const p = fn.params[i];
        if (p?.defaultExpr) {
          const v = evalExpr(p.defaultExpr, partial);
          partial[fn.paramNames[i]] = v;
          finalArgs.push(v);
        } else {
          partial[fn.paramNames[i]] = undefined;
          finalArgs.push(undefined);
        }
      }
    }
    pushFrame(fn.name, fn.paramNames, finalArgs);
    // Snapshot the entry so the UI shows the call frame opening.
    try {
      const argDisplay = argVals
        .map((v) =>
          Array.isArray(v)
            ? JSON.stringify(v)
            : typeof v === "string"
              ? JSON.stringify(v)
              : String(v)
        )
        .join(", ");
      snapshot(
        fn.declLine,
        `<strong>Call</strong> <code>${fn.name}(${argDisplay})</code>`,
        fn.paramNames
      );
    } catch (snapErr) {
      // Snapshot budget exhausted — bail out and propagate.
      popFrame();
      throw snapErr;
    }
    let returnVal: unknown = undefined;
    try {
      if (language === "python") {
        execBlockPython(fn.bodyStartIdx, fn.bodyEndIdx);
      } else {
        execBlockBrace(fn.bodyStartIdx, fn.bodyEndIdx);
      }
    } catch (err) {
      if (err instanceof ReturnSignal) {
        returnVal = err.value;
      } else {
        popFrame();
        throw err;
      }
    }
    popFrame();
    return returnVal;
  }

  /** Split comma-separated values respecting brackets */
  /**
   * Index of the first `:` at top level (not inside `[]`, `()`, `{}`, or a
   * string literal). Used to split object-literal entries `key: value`.
   */
  function topLevelColonIndex(s: string): number {
    let depth = 0;
    let inStr: string | null = null;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (inStr) {
        if (c === inStr && s[i - 1] !== "\\") inStr = null;
        continue;
      }
      if (c === '"' || c === "'") {
        inStr = c;
        continue;
      }
      if (c === "(" || c === "[" || c === "{") depth++;
      else if (c === ")" || c === "]" || c === "}") depth--;
      else if (c === ":" && depth === 0) return i;
    }
    return -1;
  }
  function containsTopLevelColon(s: string): boolean {
    return topLevelColonIndex(s) >= 0;
  }

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

  /**
   * Brace-match table: for every `{` at "line:col", the line index of its
   * matching `}`. Built lazily on first use — `lines` is immutable during
   * execution (only `preprocess` mutates it, before any executor runs), so the
   * table stays valid. Lets matchBraceClose be O(1) instead of re-scanning the
   * block on every loop iteration / branch re-entry.
   */
  let braceTable: Map<string, number> | null = null;
  function getBraceTable(): Map<string, number> {
    if (braceTable) return braceTable;
    const t = new Map<string, number>();
    const open: Array<[number, number]> = [];
    for (let i = 0; i < lines.length; i++) {
      const ln = lines[i];
      for (let c = 0; c < ln.length; c++) {
        if (ln[c] === "{") open.push([i, c]);
        else if (ln[c] === "}") {
          const o = open.pop();
          if (o) t.set(`${o[0]}:${o[1]}`, i);
        }
      }
    }
    braceTable = t;
    return t;
  }

  /**
   * Find the line of the `}` that matches the `{` at (startLine, startCol).
   * Counting begins AT that brace, so a leading `}` on the same line (the K&R
   * `} else if (...) {` shape) is correctly ignored. O(1) via the brace table,
   * with a scan fallback for safety.
   */
  function matchBraceClose(startLine: number, startCol: number): number {
    const hit = getBraceTable().get(`${startLine}:${startCol}`);
    if (hit !== undefined) return hit;
    let depth = 0;
    for (let i = startLine; i < lines.length; i++) {
      for (let c = i === startLine ? startCol : 0; c < lines[i].length; c++) {
        const ch = lines[i][c];
        if (ch === "{") depth++;
        else if (ch === "}") {
          depth--;
          if (depth === 0) return i;
        }
      }
    }
    return lines.length - 1;
  }

  /**
   * Execute a single-line `when`-branch body (right of `->`). Returns the body's
   * value (used by the expression form `val x = when (...) { ... }`). Handles
   * `return`, compound/increment/simple assignment, and falls back to an
   * expression/call.
   */
  function execWhenBody(body: string, lineIdx: number): unknown {
    const b = stripTrailingComment(body.trim()).replace(/;$/, "").trim();
    const ret = b.match(/^return\b\s*(.*)$/);
    if (ret) {
      const v = ret[1].trim() ? evalExpr(ret[1].trim(), env) : undefined;
      if (frames.length === 1) env["result"] = v;
      snapshot(lineIdx, `<strong>Return</strong> <code>${JSON.stringify(v)}</code>`, ["result"]);
      throw new ReturnSignal(v);
    }
    const comp = b.match(/^(\w+)\s*(\+=|-=|\*=|\/=|%=)\s*(.+)$/);
    if (comp) {
      const cur = (env[comp[1]] ?? 0) as number;
      const r = evalExpr(comp[3], env) as number;
      const nv =
        comp[2] === "+=" ? cur + r : comp[2] === "-=" ? cur - r :
        comp[2] === "*=" ? cur * r : comp[2] === "/=" ? cur / r : cur % r;
      env[comp[1]] = nv;
      snapshot(lineIdx, `<strong>Update</strong> <code>${comp[1]}</code> = <code>${nv}</code>`, [comp[1]]);
      return nv;
    }
    const inc = b.match(/^(\w+)(\+\+|--)$/);
    if (inc) {
      const nv = ((env[inc[1]] ?? 0) as number) + (inc[2] === "++" ? 1 : -1);
      env[inc[1]] = nv;
      snapshot(lineIdx, `<strong>Update</strong> <code>${inc[1]}</code> = <code>${nv}</code>`, [inc[1]]);
      return nv;
    }
    const asg = b.match(/^(\w+)\s*=(?!=)\s*(.+)$/);
    if (asg) {
      const v = evalExpr(asg[2], env);
      env[asg[1]] = v;
      tagBindingKind(asg[1], v);
      snapshot(lineIdx, `<strong>Update</strong> <code>${asg[1]}</code> = <code>${JSON.stringify(v)}</code>`, [asg[1]]);
      return v;
    }
    return evalExpr(b, env);
  }

  /**
   * Execute a Kotlin `when` (statement or expression form) starting at the line
   * `pc`. `subjectExpr` is the matched value (`when (x)`) or null for the
   * subjectless boolean form (`when { cond -> ... }`). Runs only the first
   * matching branch and returns its value plus the line after the block.
   * Branch conditions support comma-separated values, `else`, and `in a..b` /
   * `in collection`. Branch bodies may be a single expression/statement or a
   * `{ ... }` block.
   */
  function runWhen(pc: number, subjectExpr: string | null): { value: unknown; nextPc: number } {
    let openLine = -1;
    let openCol = -1;
    for (let i = pc; i < lines.length; i++) {
      const idx = lines[i].indexOf("{");
      if (idx >= 0) { openLine = i; openCol = idx; break; }
    }
    if (openLine === -1) return { value: undefined, nextPc: pc + 1 };
    const blockEnd = matchBraceClose(openLine, openCol);
    const subjVal = subjectExpr !== null ? evalExpr(subjectExpr, env) : undefined;
    snapshot(
      pc,
      subjectExpr !== null
        ? `<strong>when</strong> <code>${subjectExpr}</code> → <code>${JSON.stringify(subjVal)}</code>`
        : `<strong>when</strong>`
    );

    let cursor = openLine + 1;
    while (cursor < blockEnd) {
      const t = stripTrailingComment(lines[cursor].trim());
      if (!t) { cursor++; continue; }
      const arrow = findTopLevelOp(t, ["->"]);
      if (arrow === null) { cursor++; continue; }
      const condPart = t.slice(0, arrow[1]).trim();
      const bodyPart = t.slice(arrow[1] + 2).trim();

      let isMatch = false;
      if (condPart === "else") {
        isMatch = true;
      } else if (subjectExpr !== null) {
        for (const cs of smartSplit(condPart)) {
          const c = cs.trim();
          const inM = c.match(/^in\s+(.+)$/);
          if (inM) {
            const rng = inM[1].match(/^(.+?)\.\.(.+)$/);
            if (rng) {
              const lo = evalExpr(rng[1].trim(), env) as number;
              const hi = evalExpr(rng[2].trim(), env) as number;
              if (typeof subjVal === "number" && subjVal >= lo && subjVal <= hi) { isMatch = true; break; }
            } else {
              const coll = evalExpr(inM[1].trim(), env);
              if (Array.isArray(coll) && coll.includes(subjVal)) { isMatch = true; break; }
            }
          } else if (evalExpr(c, env) === subjVal) {
            isMatch = true;
            break;
          }
        }
      } else {
        isMatch = !!evalExpr(condPart, env);
      }

      if (bodyPart === "{" || bodyPart === "") {
        // Block body: brace is the last `{` on the branch line (or next line).
        let bOpen = cursor;
        let bCol = lines[cursor].lastIndexOf("{");
        if (bCol === -1) {
          bOpen = cursor + 1;
          bCol = lines[bOpen]?.indexOf("{") ?? -1;
        }
        const bClose = bCol === -1 ? cursor : matchBraceClose(bOpen, bCol);
        if (isMatch) {
          execBlockBrace(bOpen + 1, bClose - 1);
          return { value: undefined, nextPc: blockEnd + 1 };
        }
        cursor = bClose + 1;
      } else {
        if (isMatch) {
          const value = execWhenBody(bodyPart, cursor);
          return { value, nextPc: blockEnd + 1 };
        }
        cursor++;
      }
    }
    return { value: undefined, nextPc: blockEnd + 1 };
  }

  /**
   * Execute a full brace-language `if / else if* / else?` chain starting at
   * `startPc`, running ONLY the first branch whose condition is true. Handles
   * both K&R (`} else if (...) {` on the closing-brace line) and Allman (`else`
   * on its own line) layouts, and chains of arbitrary length. Returns the line
   * index immediately after the chain. Replaces the older single-branch logic
   * that silently executed every remaining branch's body as a stray statement.
   */
  function execBraceIfChain(startPc: number): number {
    let taken = false;
    let cursor = startPc;
    const first = lines[cursor].trim().match(/^if\s*\((.+)\)\s*\{?$/);
    let cond: string | null = first ? first[1] : null;
    // Safety bound: a chain can't have more branches than there are lines.
    for (let guard = 0; guard <= lines.length; guard++) {
      // Locate this branch's body-opening `{` at/after the header line. Use
      // the LAST `{` on the line so a K&R `} else if (...) {` resolves to the
      // body brace rather than being thrown off by the leading `}`.
      let openLine = cursor;
      let openCol = -1;
      for (let i = cursor; i < lines.length; i++) {
        const idx = lines[i].lastIndexOf("{");
        if (idx >= 0) {
          openLine = i;
          openCol = idx;
          break;
        }
      }
      if (openCol < 0) return cursor + 1;
      const closeLine = matchBraceClose(openLine, openCol);

      if (!taken) {
        const cv = cond === null ? true : !!evalExpr(cond, env);
        snapshot(
          cursor,
          cond === null
            ? `<strong>Else</strong>`
            : `<strong>Check if</strong> <code>${cond}</code> → <code>${String(cv)}</code>`
        );
        if (cv) {
          execBlockBrace(openLine + 1, closeLine - 1);
          taken = true;
        }
      }

      // Look for a continuation: K&R on the closing-brace line, else Allman on
      // the next line.
      const closeTrim = (lines[closeLine] || "").trim();
      const krElseIf = closeTrim.match(/^\}\s*else\s+if\s*\((.+)\)\s*\{?\s*$/);
      if (krElseIf) {
        cond = krElseIf[1];
        cursor = closeLine;
        continue;
      }
      if (/^\}\s*else\s*\{?\s*$/.test(closeTrim)) {
        cond = null;
        cursor = closeLine;
        continue;
      }
      const nl = closeLine + 1;
      const nlTrim = (lines[nl] || "").trim();
      const allmanElseIf = nlTrim.match(/^else\s+if\s*\((.+)\)\s*\{?\s*$/);
      if (allmanElseIf) {
        cond = allmanElseIf[1];
        cursor = nl;
        continue;
      }
      if (/^else\s*\{?\s*$/.test(nlTrim)) {
        cond = null;
        cursor = nl;
        continue;
      }
      return closeLine + 1;
    }
    return cursor + 1;
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

  /**
   * Tag the binding `name = value` into the appropriate kind-tracking map on
   * the active frame so the renderer can route it to the right viewer. A
   * single value can only be tracked under ONE kind at a time — we clear the
   * stale tag if the type changed (e.g. `arr = new Set()` after `arr = []`).
   */
  function tagBindingKind(name: string, value: unknown) {
    if (Array.isArray(value)) {
      arrays[name] = true;
      delete maps[name];
      delete sets[name];
    } else if (value instanceof Map || isPlainObject(value)) {
      maps[name] = true;
      delete arrays[name];
      delete sets[name];
    } else if (value instanceof Set) {
      sets[name] = true;
      delete arrays[name];
      delete maps[name];
    } else {
      delete arrays[name];
      delete maps[name];
      delete sets[name];
    }
  }

  /**
   * Apply an indexed assignment `name[i][j]... = val`, descending through any
   * mix of arrays, Maps, and plain objects. Shared by the TS/Kotlin and Python
   * executors. Returns true if the statement was handled (always, once the
   * receiver resolves to something writable or is freshly seeded).
   */
  function applyIndexedAssign(
    arrN: string,
    idxVals: unknown[],
    val: unknown,
    pc: number
  ): boolean {
    if (idxVals.length === 0) return false;
    // Seed a fresh plain object when the receiver doesn't exist yet, so first
    // assignments like `counts[k] = 1` work without an explicit declaration.
    if (env[arrN] === undefined) {
      env[arrN] = {};
    }

    // Descend to the parent of the final index.
    let parent: unknown = env[arrN];
    for (let d = 0; d < idxVals.length - 1; d++) {
      const key = idxVals[d];
      if (Array.isArray(parent)) parent = (parent as unknown[])[key as number];
      else if (parent instanceof Map) parent = parent.get(key);
      else if (isPlainObject(parent))
        parent = (parent as Record<string, unknown>)[String(key)];
      else {
        parent = null;
        break;
      }
    }

    const lastKey = idxVals[idxVals.length - 1];
    if (Array.isArray(parent)) {
      (parent as unknown[])[lastKey as number] = val;
    } else if (parent instanceof Map) {
      parent.set(lastKey, val);
    } else if (isPlainObject(parent)) {
      (parent as Record<string, unknown>)[String(lastKey)] = val;
    } else {
      // Couldn't resolve a writable parent — nothing to mutate.
      return false;
    }

    tagBindingKind(arrN, env[arrN]);
    // Mark the touched top-level row dirty so the array renderer recopies it.
    if (Array.isArray(env[arrN]) && idxVals.length > 1) {
      (dirtyArrayRows[arrN] ??= new Set()).add(idxVals[0] as number);
    }

    const keyDisplay = idxVals
      .map((k) => (typeof k === "number" ? `[${k}]` : `[${JSON.stringify(k)}]`))
      .join("");
    snapshot(
      pc,
      `<strong>Set</strong> <code>${arrN}${keyDisplay}</code> = <code>${JSON.stringify(val)}</code>`,
      [arrN]
    );
    return true;
  }

  /** Read a (possibly nested) indexed value, returning undefined if a level is missing. */
  function readIndexed(name: string, idxVals: unknown[]): unknown {
    let cur: unknown = env[name];
    for (const k of idxVals) {
      if (Array.isArray(cur)) cur = (cur as unknown[])[k as number];
      else if (cur instanceof Map) cur = cur.get(k);
      else if (isPlainObject(cur))
        cur = (cur as Record<string, unknown>)[String(k)];
      else return undefined;
    }
    return cur;
  }

  /**
   * Apply an augmented assignment to an indexed target (`arr[i] += v`,
   * `freq[c] += 1`, `grid[i][j] *= 2`, Python `d[k] //= 2`). Reads the current
   * value, applies the operator, and writes the result back via
   * applyIndexedAssign. Returns true when handled.
   */
  function applyIndexedCompound(
    name: string,
    idxVals: unknown[],
    op: string,
    rhsVal: number,
    pc: number
  ): boolean {
    const cur = (readIndexed(name, idxVals) ?? 0) as number;
    let next = cur;
    if (op === "+=") next = cur + rhsVal;
    else if (op === "-=") next = cur - rhsVal;
    else if (op === "*=") next = cur * rhsVal;
    else if (op === "/=") next = cur / rhsVal;
    else if (op === "%=") next = cur % rhsVal;
    else if (op === "//=") next = Math.floor(cur / rhsVal);
    return applyIndexedAssign(name, idxVals, next, pc);
  }

  /**
   * Remove a trailing line comment from a single line (string-aware so we
   * don't strip a comment marker inside a string literal). Language-aware:
   * Python comments start with `#` (and `//` there is FLOOR DIVISION, not a
   * comment), while brace languages use `//`. Used by the executors so
   * `const x = foo(); // expected 2` parses cleanly.
   */
  function stripTrailingComment(s: string): string {
    let inStr: string | null = null;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (inStr) {
        if (c === inStr && s[i - 1] !== "\\") inStr = null;
        continue;
      }
      if (c === '"' || c === "'") {
        inStr = c;
        continue;
      }
      const isComment =
        language === "python"
          ? c === "#"
          : c === "/" && s[i + 1] === "/";
      if (isComment) {
        return s.slice(0, i).replace(/\s+$/, "");
      }
    }
    return s;
  }

  /* ── execution engine (brace-based: TS / Kotlin) ──────── */

  function execBlockBrace(lineStart: number, lineEnd: number) {
    let pc = lineStart;
    let safety = 0;
    while (pc <= lineEnd && safety < MAX_STATEMENT_STEPS) {
      safety++;
      currentExecLine = pc;
      // Skip past helper function declarations — their bodies are only
      // executed when called via evalExpr's user-function-call branch.
      const skipEnd = helperSkip.get(pc);
      if (skipEnd !== undefined) {
        pc = skipEnd + 1;
        continue;
      }
      const raw = lines[pc];
      const trimmed = stripTrailingComment(raw.trim());
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
        // Only the top-level frame surfaces `result` to the UI; inside a
        // called function the value is delivered via ReturnSignal, so writing
        // a phantom `result` into the callee's scope would mislead the viewer.
        if (frames.length === 1) env["result"] = val;
        snapshot(
          pc,
          `<strong>Return</strong> <code>${JSON.stringify(val)}</code>`,
          ["result"]
        );
        throw new ReturnSignal(val);
      }

      // `when` expression assigned to a variable:
      //   val x = when (subj) { ... }   /   val x = when { ... }
      // Checked before the plain declaration so the `when` block is consumed
      // as a unit rather than mis-parsed as an expression.
      const whenDecl = trimmed.match(
        /^(?:let|const|var|val)\s+(\w+)(?:\s*:\s*[^=]+?)?\s*=\s*when\b\s*(?:\((.+)\))?\s*\{?\s*$/
      );
      if (whenDecl) {
        const { value, nextPc } = runWhen(pc, whenDecl[2] ?? null);
        env[whenDecl[1]] = value;
        tagBindingKind(whenDecl[1], value);
        snapshot(
          pc,
          `<strong>Declare</strong> <code>${whenDecl[1]}</code> = <code>${JSON.stringify(value)}</code>`,
          [whenDecl[1]]
        );
        pc = nextPc;
        continue;
      }

      // `when` assigned / compound-assigned to an existing variable:
      //   total = when (x) { ... }   /   total += when { ... }
      const whenAssign = trimmed.match(
        /^(\w+)\s*(=|\+=|-=|\*=|\/=|%=)(?!=)\s*when\b\s*(?:\((.+)\))?\s*\{?\s*$/
      );
      if (whenAssign) {
        const { value, nextPc } = runWhen(pc, whenAssign[3] ?? null);
        const name = whenAssign[1];
        const op = whenAssign[2];
        if (op === "=") {
          env[name] = value;
          tagBindingKind(name, value);
        } else {
          const cur = (env[name] ?? 0) as number;
          const r = value as number;
          env[name] =
            op === "+=" ? cur + r : op === "-=" ? cur - r :
            op === "*=" ? cur * r : op === "/=" ? cur / r : cur % r;
        }
        snapshot(
          pc,
          `<strong>Update</strong> <code>${name}</code> = <code>${JSON.stringify(env[name])}</code>`,
          [name]
        );
        pc = nextPc;
        continue;
      }

      // `when` statement form:  when (subj) { ... }  /  when { ... }
      const whenStmt = trimmed.match(/^when\b\s*(?:\((.+)\))?\s*\{?\s*$/);
      if (whenStmt) {
        pc = runWhen(pc, whenStmt[1] ?? null).nextPc;
        continue;
      }

      // variable declaration: let/const/var (TS) or val/var (Kotlin)
      // Type annotation (optional): match any run of identifier/type chars
      // including `[]` for `number[]`, `|` for unions, `?` for optional,
      // `<...>` for generics, `,` and whitespace for multi-arg generics.
      const declMatch = trimmed.match(
        /^(?:let|const|var|val)\s+(\w+)(?:\s*:\s*[\w<>,\s?[\]|]+?)?\s*=\s*(.+?)(?:;?)$/
      );
      if (declMatch) {
        const vname = declMatch[1];
        const val = evalExpr(declMatch[2].replace(/;$/, ""), env);
        env[vname] = val;
        tagBindingKind(vname, val);
        snapshot(
          pc,
          `<strong>Declare</strong> <code>${vname}</code> = <code>${JSON.stringify(val)}</code>`,
          [vname]
        );
        pc++;
        continue;
      }

      // Indexed assignment:
      //   arr[i] = v         (array — current behavior, including 2-D)
      //   obj[k] = v         (plain object — bracket access)
      //   map.set / Map[k]=v (JS Map — single-level only)
      // The receiver kind is determined by `env[name]` at runtime.
      const arrAssignParsed = parseArrayAssignLhs(trimmed);
      if (arrAssignParsed) {
        const { name: arrN, indexStrs, rhs } = arrAssignParsed;
        const idxVals = indexStrs.map((s) => evalExpr(s, env));
        const val = evalExpr(rhs.replace(/;$/, ""), env);
        if (applyIndexedAssign(arrN, idxVals, val, pc)) {
          pc++;
          continue;
        }
      }

      // augmented assignment to an indexed target  arr[i] += v / freq[c] += 1
      const idxCompound = parseIndexedCompoundLhs(trimmed);
      if (idxCompound) {
        const idxVals = idxCompound.indexStrs.map((s) => evalExpr(s, env));
        const rhsVal = evalExpr(
          idxCompound.rhs.replace(/;$/, ""),
          env
        ) as number;
        if (
          applyIndexedCompound(idxCompound.name, idxVals, idxCompound.op, rhsVal, pc)
        ) {
          pc++;
          continue;
        }
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

      // array.push(expr) / arr.add(expr) — TypeScript/Kotlin list append,
      // OR  set.add(value)  — JS/TS Set membership. Dispatch on the actual
      // runtime kind of `arr`.
      const pushOrAddCall = trimmed.match(
        /^(\w+)\.(?:push|add)\s*\((.+)\)\s*;?\s*$/
      );
      if (pushOrAddCall) {
        const recName = pushOrAddCall[1];
        const val = evalExpr(pushOrAddCall[2], env);
        const cur = env[recName];
        if (cur instanceof Set) {
          cur.add(val);
          sets[recName] = true;
          snapshot(
            pc,
            `<strong>Add</strong> <code>${JSON.stringify(val)}</code> to set <code>${recName}</code>`,
            [recName]
          );
        } else if (Array.isArray(cur)) {
          cur.push(val);
          arrays[recName] = true;
          snapshot(
            pc,
            `<strong>Push</strong> <code>${JSON.stringify(val)}</code> to <code>${recName}</code>`,
            [recName]
          );
        } else {
          // Uninitialized — default to array (legacy behavior).
          env[recName] = [val];
          arrays[recName] = true;
          snapshot(
            pc,
            `<strong>Push</strong> <code>${JSON.stringify(val)}</code> to <code>${recName}</code>`,
            [recName]
          );
        }
        pc++;
        continue;
      }

      // map.set(key, value)  — JS/TS Map mutation.
      const mapSetCall = trimmed.match(
        /^(\w+)\.set\s*\(([\s\S]+)\)\s*;?\s*$/
      );
      if (mapSetCall) {
        const recName = mapSetCall[1];
        const parts = smartSplit(mapSetCall[2]);
        if (parts.length === 2) {
          const k = evalExpr(parts[0].trim(), env);
          const v = evalExpr(parts[1].trim(), env);
          const cur = env[recName];
          if (cur instanceof Map) {
            cur.set(k, v);
          } else if (isPlainObject(cur)) {
            (cur as Record<string, unknown>)[String(k)] = v;
          } else {
            const m = new Map<unknown, unknown>();
            m.set(k, v);
            env[recName] = m;
          }
          maps[recName] = true;
          snapshot(
            pc,
            `<strong>Set</strong> <code>${recName}[${JSON.stringify(k)}]</code> = <code>${JSON.stringify(v)}</code>`,
            [recName]
          );
          pc++;
          continue;
        }
      }

      // map.delete(key) / set.delete(value)  — dispatch by receiver kind.
      const deleteCall = trimmed.match(
        /^(\w+)\.delete\s*\((.+)\)\s*;?\s*$/
      );
      if (deleteCall) {
        const recName = deleteCall[1];
        const k = evalExpr(deleteCall[2], env);
        const cur = env[recName];
        if (cur instanceof Map) {
          cur.delete(k);
          maps[recName] = true;
          snapshot(
            pc,
            `<strong>Delete</strong> <code>${recName}[${JSON.stringify(k)}]</code>`,
            [recName]
          );
        } else if (cur instanceof Set) {
          cur.delete(k);
          sets[recName] = true;
          snapshot(
            pc,
            `<strong>Remove</strong> <code>${JSON.stringify(k)}</code> from set <code>${recName}</code>`,
            [recName]
          );
        } else if (isPlainObject(cur)) {
          delete (cur as Record<string, unknown>)[String(k)];
          maps[recName] = true;
          snapshot(
            pc,
            `<strong>Delete</strong> <code>${recName}[${JSON.stringify(k)}]</code>`,
            [recName]
          );
        }
        pc++;
        continue;
      }

      // simple assignment  x = expr
      const assignMatch = trimmed.match(/^(\w+)\s*=\s*(.+?)(?:;?)$/);
      if (assignMatch) {
        const vname = assignMatch[1];
        const val = evalExpr(assignMatch[2].replace(/;$/, ""), env);
        env[vname] = val;
        tagBindingKind(vname, val);
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
          // The tail may carry a trailing `step k`.
          let endExpr = kotlinRange[3].trim();
          let stepV = 1;
          const stepM = endExpr.match(/^(.*?)\s+step\s+(.+)$/);
          if (stepM) {
            endExpr = stepM[1].trim();
            stepV = evalExpr(stepM[2].trim(), env) as number;
          }
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
          for (let idx = start; idx < limit; idx += stepV) {
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
        // Kotlin for (i in start downTo end [step k]) — descending.
        const kotlinDownTo = inner.match(
          /^(\w+)\s+in\s+(.+?)\s+downTo\s+(.+?)(?:\s+step\s+(.+))?$/
        );
        if (kotlinDownTo) {
          const vname = kotlinDownTo[1];
          const start = evalExpr(kotlinDownTo[2].trim(), env) as number;
          const endVal = evalExpr(kotlinDownTo[3].trim(), env) as number;
          const stepV = kotlinDownTo[4]
            ? Math.abs(evalExpr(kotlinDownTo[4].trim(), env) as number)
            : 1;
          const bodyStart = pc + 1;
          const bodyEnd = findBlockEnd(pc);
          for (let idx = start; idx >= endVal; idx -= stepV) {
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
        // Kotlin/TS for (x in collection) / for (x of collection) — iterate
        // the elements of an array, list, or set (NOT a numeric range, which
        // the branches above already consumed).
        const forEachIn = inner.match(/^(?:val\s+|var\s+|const\s+|let\s+)?(\w+)\s+(?:in|of)\s+(.+)$/);
        if (forEachIn && !inner.includes("..") && !inner.includes(" until ") && !inner.includes(" downTo ")) {
          const vname = forEachIn[1];
          const coll = evalExpr(forEachIn[2].trim(), env);
          const items = Array.isArray(coll)
            ? (coll as unknown[])
            : coll instanceof Set
              ? Array.from(coll.values())
              : coll instanceof Map
                ? Array.from(coll.keys())
                : typeof coll === "string"
                  ? coll.split("")
                  : null;
          if (items) {
            const bodyStart = pc + 1;
            const bodyEnd = findBlockEnd(pc);
            for (const item of items) {
              env[vname] = item;
              tagBindingKind(vname, item);
              snapshot(
                pc,
                `<strong>Loop</strong> <code>${vname}</code> = <code>${JSON.stringify(item)}</code>`,
                [vname]
              );
              execBlockBrace(bodyStart, bodyEnd - 1);
            }
            pc = bodyEnd + 1;
            continue;
          }
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

      // Inline if-return: `if (cond) return EXPR;` — recursive algorithms
      // use this for base cases. Must be matched BEFORE the multi-line `if`
      // form so we don't mis-parse the trailing `return` as garbage.
      const ifInlineReturn = trimmed.match(
        /^if\s*\((.+)\)\s+return(?:\s+(.+?))?\s*;?\s*$/
      );
      if (ifInlineReturn) {
        const cond = ifInlineReturn[1];
        const retSrc = ifInlineReturn[2];
        const cv = evalExpr(cond, env);
        snapshot(
          pc,
          `<strong>Check if</strong> <code>${cond}</code> → <code>${String(cv)}</code>`
        );
        if (cv) {
          const val = retSrc !== undefined ? evalExpr(retSrc, env) : undefined;
          // Only the top-level frame surfaces `result` to the UI; inside a
          // called function the value is delivered via ReturnSignal, so
          // writing a phantom `result` into the callee would mislead the view.
          if (frames.length === 1) env["result"] = val;
          snapshot(
            pc,
            `<strong>Return</strong> <code>${JSON.stringify(val)}</code>`,
            ["result"]
          );
          throw new ReturnSignal(val);
        }
        pc++;
        continue;
      }

      // if / else if / else chain — handled by a single chain evaluator that
      // runs only the first true branch and skips the rest.
      const ifMatch = trimmed.match(/^if\s*\((.+)\)\s*\{?$/);
      if (ifMatch) {
        pc = execBraceIfChain(pc);
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
      // Skip helper function declarations at top-level scope.
      const skipEnd = helperSkip.get(pc);
      if (skipEnd !== undefined) {
        pc = skipEnd + 1;
        continue;
      }
      const raw = lines[pc];
      const trimmed = stripTrailingComment(raw.trim());
      if (!trimmed || trimmed.startsWith("#")) {
        pc++;
        continue;
      }

      // return statement
      const returnMatch = trimmed.match(/^return\s+(.+)$/);
      if (returnMatch) {
        const val = evalExpr(returnMatch[1], env);
        // Only the top-level frame surfaces `result` to the UI; inside a
        // called function the value is delivered via ReturnSignal, so writing
        // a phantom `result` into the callee's scope would mislead the viewer.
        if (frames.length === 1) env["result"] = val;
        snapshot(
          pc,
          `<strong>Return</strong> <code>${JSON.stringify(val)}</code>`,
          ["result"]
        );
        throw new ReturnSignal(val);
      }

      // Indexed assignment:  arr[i] = v, d[k] = v (dict), and obj[k] = v
      // (plain object). Receiver kind is determined at runtime.
      const arrAssignParsed = parseArrayAssignLhs(trimmed);
      if (arrAssignParsed) {
        const { name: arrN, indexStrs, rhs } = arrAssignParsed;
        const idxVals = indexStrs.map((s) => evalExpr(s, env));
        const val = evalExpr(rhs, env);
        if (applyIndexedAssign(arrN, idxVals, val, pc)) {
          pc++;
          continue;
        }
      }

      // augmented assignment to an indexed target  d[k] += 1 / arr[i] //= 2
      const idxCompound = parseIndexedCompoundLhs(trimmed);
      if (idxCompound) {
        const idxVals = idxCompound.indexStrs.map((s) => evalExpr(s, env));
        const rhsVal = evalExpr(idxCompound.rhs, env) as number;
        if (
          applyIndexedCompound(idxCompound.name, idxVals, idxCompound.op, rhsVal, pc)
        ) {
          pc++;
          continue;
        }
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

      // Inline if-return: `if cond: return EXPR` — recursive base cases.
      // Must match BEFORE the multi-line form.
      const ifInlineReturn = trimmed.match(
        /^if\s+(.+):\s*return(?:\s+(.+?))?\s*$/
      );
      if (ifInlineReturn) {
        const cond = ifInlineReturn[1];
        const retSrc = ifInlineReturn[2];
        const cv = evalExpr(cond, env);
        snapshot(
          pc,
          `<strong>Check if</strong> <code>${cond}</code> → <code>${String(cv)}</code>`
        );
        if (cv) {
          const val = retSrc !== undefined ? evalExpr(retSrc, env) : undefined;
          // Only the top-level frame surfaces `result` to the UI; inside a
          // called function the value is delivered via ReturnSignal, so
          // writing a phantom `result` into the callee would mislead the view.
          if (frames.length === 1) env["result"] = val;
          snapshot(
            pc,
            `<strong>Return</strong> <code>${JSON.stringify(val)}</code>`,
            ["result"]
          );
          throw new ReturnSignal(val);
        }
        pc++;
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
        // `taken` tracks whether any branch in this chain has already run, so
        // later elif/else branches are SKIPPED (not executed as stray
        // statements) once one matches — proper short-circuit semantics.
        let taken = cv;
        if (cv) {
          execBlockPython(pc + 1, bodyEnd);
        }
        let nextPc = bodyEnd + 1;
        // elif* — always consume each elif block (advancing past it); only the
        // first one whose condition is true (when nothing taken yet) executes.
        while (
          nextPc <= lineEnd &&
          lines[nextPc] &&
          lines[nextPc].trim().startsWith("elif ")
        ) {
          const elifEnd = findPythonBlockEnd(nextPc);
          if (!taken) {
            const elifMatch = lines[nextPc].trim().match(/^elif\s+(.+):$/);
            if (elifMatch) {
              const elifCond = elifMatch[1];
              const elifCv = evalExpr(elifCond, env);
              snapshot(
                nextPc,
                `<strong>Check elif</strong> <code>${elifCond}</code> → <code>${String(elifCv)}</code>`
              );
              if (elifCv) {
                execBlockPython(nextPc + 1, elifEnd);
                taken = true;
              }
            }
          }
          nextPc = elifEnd + 1;
        }
        // else
        if (
          nextPc <= lineEnd &&
          lines[nextPc] &&
          lines[nextPc].trim() === "else:"
        ) {
          const elseEnd = findPythonBlockEnd(nextPc);
          if (!taken) {
            execBlockPython(nextPc + 1, elseEnd);
          }
          nextPc = elseEnd + 1;
        }
        pc = nextPc;
        continue;
      }

      // arr.append(expr) — python list append. Falls back to creating a
      // fresh list if the receiver hasn't been declared yet.
      const appendCall = trimmed.match(
        /^(\w+)\.append\s*\((.+)\)\s*$/
      );
      if (appendCall) {
        const arrN = appendCall[1];
        const val = evalExpr(appendCall[2], env);
        const cur = env[arrN];
        if (Array.isArray(cur)) {
          (cur as unknown[]).push(val);
        } else {
          env[arrN] = [val];
        }
        arrays[arrN] = true;
        snapshot(
          pc,
          `<strong>Append</strong> <code>${JSON.stringify(val)}</code> to <code>${arrN}</code>`,
          [arrN]
        );
        pc++;
        continue;
      }

      // set.add(value) — Python set membership mutation.
      const pyAddCall = trimmed.match(/^(\w+)\.add\s*\((.+)\)\s*$/);
      if (pyAddCall) {
        const recName = pyAddCall[1];
        const val = evalExpr(pyAddCall[2], env);
        const cur = env[recName];
        if (cur instanceof Set) {
          cur.add(val);
        } else {
          const s = new Set<unknown>();
          s.add(val);
          env[recName] = s;
        }
        sets[recName] = true;
        snapshot(
          pc,
          `<strong>Add</strong> <code>${JSON.stringify(val)}</code> to set <code>${recName}</code>`,
          [recName]
        );
        pc++;
        continue;
      }

      // d.pop(key) / s.discard(value) / s.remove(value) — Python deletions.
      const pyRemoveCall = trimmed.match(
        /^(\w+)\.(?:pop|discard|remove)\s*\((.+)\)\s*$/
      );
      if (pyRemoveCall) {
        const recName = pyRemoveCall[1];
        const k = evalExpr(pyRemoveCall[2], env);
        const cur = env[recName];
        if (cur instanceof Set) {
          cur.delete(k);
          sets[recName] = true;
          snapshot(
            pc,
            `<strong>Remove</strong> <code>${JSON.stringify(k)}</code> from set <code>${recName}</code>`,
            [recName]
          );
        } else if (isPlainObject(cur)) {
          delete (cur as Record<string, unknown>)[String(k)];
          maps[recName] = true;
          snapshot(
            pc,
            `<strong>Delete</strong> <code>${recName}[${JSON.stringify(k)}]</code>`,
            [recName]
          );
        } else if (Array.isArray(cur)) {
          // list.pop(idx) / list.remove(value) — fall through to existing
          // list semantics by replacing the array contents.
          const arr = cur as unknown[];
          const idx = arr.indexOf(k);
          if (idx >= 0) arr.splice(idx, 1);
          arrays[recName] = true;
          snapshot(
            pc,
            `<strong>Remove</strong> <code>${JSON.stringify(k)}</code> from <code>${recName}</code>`,
            [recName]
          );
        }
        pc++;
        continue;
      }

      // simple assignment  x = expr
      const assignMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
      if (assignMatch) {
        const vname = assignMatch[1];
        const val = evalExpr(assignMatch[2], env);
        env[vname] = val;
        tagBindingKind(vname, val);
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
