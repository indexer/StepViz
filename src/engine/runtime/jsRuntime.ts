/**
 * Real-engine execution backend for TypeScript/JavaScript. Instead of a
 * pattern interpreter, it instruments the user's code with Babel — inserting a
 * trace call before every statement and wrapping every function so the call
 * stack is tracked — then runs the instrumented code on the actual JS engine.
 * Because execution is genuine, every language feature works (`.map`/`.reduce`,
 * `for…of`, classes, destructuring, closures, generators, …), matching what a
 * real playground does, while still producing the per-step `ExecSnapshot[]` the
 * visualizer renders.
 *
 * Loading strategy mirrors the Python backend:
 *   - Browser: load `@babel/standalone` from CDN (never bundled by Vite).
 *   - Node (tests): use the installed `@babel/core` + `typescript` packages,
 *     so the whole pipeline is unit-testable without a browser.
 */
/* eslint-disable @typescript-eslint/no-explicit-any -- Babel NodePath/scope
   objects are dynamically typed; fully typing the visitor adds noise without
   safety. The `any`s are confined to the instrumentation plugin. */
import type { ExecSnapshot } from "../interpreter";
import { buildSnapshots, type RawTrace, type RawStep } from "./traceAdapter";

const BABEL_CDN =
  "https://cdn.jsdelivr.net/npm/@babel/standalone@7.29.2/babel.min.js";
const MAX_STEPS = 5000;

const isNode =
  !!(globalThis as { process?: { versions?: { node?: string } } }).process
    ?.versions?.node;

/* ── Babel instrumentation plugin (shared by both environments) ───────── */

// `babel` is the Babel instance (@babel/core or @babel/standalone); both expose
// `.types` and the path/scope API the plugin uses.
function makeTracePlugin(babel: { types: typeof import("@babel/types") }) {
  const t = babel.types;
  const STEP_FNS = ["__step", "__enter", "__exit", "__final", "__tick"];
  const lineOf = (n: { loc?: { start: { line: number } } }) =>
    n.loc ? n.loc.start.line : 0;
  const posOf = (n: { loc?: { start: { line: number; column: number } } }) =>
    n.loc ? n.loc.start.line * 1e5 + n.loc.start.column : Infinity;

  // The object literal `{a, b, …}` of in-scope locals visible (and declared
  // textually before) the statement at `path`. Uses the CONTAINER scope so a
  // function-declaration statement doesn't capture its own params, and the
  // declared-before rule keeps it TDZ-safe in straight-line flow.
  function localsObject(path: any) {
    const container = path.parentPath.scope;
    const fnScope =
      container.getFunctionParent() || container.getProgramParent();
    const props: unknown[] = [];
    const seen = new Set<string>();
    const stmtPos = posOf(path.node);
    let s = container;
    while (s) {
      for (const name of Object.keys(s.bindings)) {
        if (seen.has(name)) continue;
        const b = s.bindings[name];
        if (b.kind === "param" || posOf(b.path.node) < stmtPos) {
          props.push(t.objectProperty(t.identifier(name), t.identifier(name), false, true));
          seen.add(name);
        }
      }
      if (s === fnScope) break;
      s = s.parent;
    }
    return t.objectExpression(props as never);
  }

  const stepStmt = (path: any) =>
    t.expressionStatement(
      t.callExpression(t.identifier("__step"), [
        t.numericLiteral(lineOf(path.node)),
        localsObject(path),
      ])
    );

  const isInstrumented = (n: any) =>
    t.isExpressionStatement(n) &&
    t.isCallExpression(n.expression) &&
    t.isIdentifier(n.expression.callee) &&
    STEP_FNS.includes((n.expression.callee as { name: string }).name);

  return {
    name: "stepviz-trace",
    visitor: {
      Program(path: any) {
        if (path.node.__stepviz) return;
        path.node.__stepviz = true;

        // Pass 1 — wrap every function: push a call frame on entry, pop it on
        // exit (try/finally so returns and throws still pop).
        path.traverse({
          "FunctionDeclaration|FunctionExpression|ArrowFunctionExpression"(p: any) {
            if (p.node.__wrapped) return;
            p.node.__wrapped = true;
            if (
              t.isArrowFunctionExpression(p.node) &&
              !t.isBlockStatement(p.node.body)
            ) {
              p.node.body = t.blockStatement([t.returnStatement(p.node.body)]);
            }
            let name = "(anonymous)";
            if (p.node.id) name = p.node.id.name;
            else if (
              t.isVariableDeclarator(p.parent) &&
              t.isIdentifier(p.parent.id)
            )
              name = p.parent.id.name;
            else if (
              t.isObjectProperty(p.parent) &&
              t.isIdentifier(p.parent.key)
            )
              name = p.parent.key.name;
            const paramNames = p.node.params
              .filter((pp: any) => t.isIdentifier(pp))
              .map((pp: any) => pp.name);
            const enter = t.expressionStatement(
              t.callExpression(t.identifier("__enter"), [
                t.stringLiteral(name),
                t.arrayExpression(paramNames.map((n: string) => t.stringLiteral(n))),
                t.arrayExpression(paramNames.map((n: string) => t.identifier(n))),
              ])
            );
            const body = t.tryStatement(
              t.blockStatement(p.node.body.body),
              null,
              t.blockStatement([
                t.expressionStatement(t.callExpression(t.identifier("__exit"), [])),
              ])
            );
            p.node.body = t.blockStatement([enter, body]);
          },
        });

        // Pass 2 — insert a trace call BEFORE each real body statement.
        path.traverse({
          Statement(p: any) {
            const n = p.node;
            if (isInstrumented(n) || !n.loc) return;
            if (t.isBlockStatement(n) || t.isProgram(n)) return;
            if (n.__stepped) return;
            const parent = p.parentPath;
            if (!(parent && (parent.isBlockStatement() || parent.isProgram())))
              return;
            n.__stepped = true;
            p.insertBefore(stepStmt(p));
          },
        });

        // Pass 2.5 — prepend a lightweight `__tick()` to every loop body so
        // the runaway-guard fires even for loops whose body produces no
        // `__step` (e.g. an empty `while (true) {}`), which would otherwise
        // hang the thread. `__tick` records no snapshot.
        path.traverse({
          "ForStatement|ForInStatement|ForOfStatement|WhileStatement|DoWhileStatement"(
            p: any
          ) {
            if (!t.isBlockStatement(p.node.body)) {
              p.node.body = t.blockStatement(
                p.node.body ? [p.node.body] : []
              );
            }
            p.node.body.body.unshift(
              t.expressionStatement(t.callExpression(t.identifier("__tick"), []))
            );
          },
        });

        // Pass 3 — a final capture of all top-level bindings (the last
        // statement's effect isn't seen by any before-statement step).
        path.scope.crawl();
        const names = Object.keys(path.scope.bindings);
        path.node.body.push(
          t.expressionStatement(
            t.callExpression(t.identifier("__final"), [
              t.objectExpression(
                names.map((n) =>
                  t.objectProperty(t.identifier(n), t.identifier(n), false, true)
                ) as never
              ),
            ])
          )
        );
      },
    },
  };
}

/* ── Code transform (env-specific) ────────────────────────────────────── */

type Transform = (code: string) => string;
let transformPromise: Promise<Transform> | null = null;

async function getTransform(): Promise<Transform> {
  if (transformPromise) return transformPromise;
  transformPromise = (async () => {
    if (isNode) {
      const babelSpec = "@babel/core";
      const tsSpec = "typescript";
      // Minimal local type — @babel/core has no usable declaration in the
      // browser-app tsconfig, and this branch only runs in Node (tests).
      const babel = (await import(/* @vite-ignore */ babelSpec)) as {
        transformSync: (
          code: string,
          opts: unknown
        ) => { code?: string | null } | null;
      };
      const tsMod = (await import(/* @vite-ignore */ tsSpec)) as
        | typeof import("typescript")
        | { default: typeof import("typescript") };
      const ts = "default" in tsMod ? tsMod.default : tsMod;
      return (code: string) => {
        const js = ts.transpileModule(code, {
          compilerOptions: {
            target: ts.ScriptTarget.ES2020,
            isolatedModules: true,
            removeComments: false,
          },
        }).outputText;
        const out = babel.transformSync(js, {
          configFile: false,
          babelrc: false,
          sourceType: "module",
          plugins: [makeTracePlugin as never],
        });
        return out?.code ?? "";
      };
    }
    // Browser: @babel/standalone strips TS (preset) and runs our plugin.
    const w = window as unknown as {
      Babel?: { transform: (code: string, opts: unknown) => { code: string } };
    };
    if (!w.Babel) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = BABEL_CDN;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Failed to load the JS/TS runtime."));
        document.head.appendChild(s);
      });
    }
    const Babel = w.Babel;
    if (!Babel) throw new Error("JS/TS runtime unavailable.");
    return (code: string) =>
      Babel.transform(code, {
        filename: "user.ts",
        presets: ["typescript"],
        plugins: [makeTracePlugin],
        sourceType: "module",
        retainLines: false,
      }).code;
  })().catch((e) => {
    transformPromise = null;
    throw e;
  });
  return transformPromise;
}

/** True once the JS/TS runtime (Babel) has begun loading. */
export function isJsRuntimeStarted(): boolean {
  return transformPromise !== null;
}

/* ── Execution runtime injected into the instrumented program ─────────── */

interface Frame {
  name: string;
  paramNames: string[];
  /** Display-serialized args, computed once at call time (not per step). */
  dispArgs: unknown[];
}

// Hard cap on loop iterations (across all loops) — bounds wall-clock time so a
// runaway/empty infinite loop can't freeze the thread. Far above any realistic
// teaching snippet; the visual MAX_STEPS cap (5000) is hit first for loops that
// actually record steps.
const MAX_TICKS = 2_000_000;

function makeRuntime() {
  const steps: RawStep[] = [];
  const stack: Frame[] = [{ name: "<module>", paramNames: [], dispArgs: [] }];
  let finalStep: RawStep | null = null;
  let overflow = false;
  let ticks = 0;

  const ser = (v: unknown, d: number): unknown => {
    if (d > 6) return String(v);
    // Non-finite numbers don't survive JSON — represent as strings.
    if (typeof v === "number" && !Number.isFinite(v)) return String(v);
    if (v === null || ["number", "string", "boolean"].includes(typeof v)) return v;
    if (typeof v === "undefined") return null;
    if (Array.isArray(v)) return v.map((x) => ser(x, d + 1));
    if (v instanceof Map)
      return [...v.entries()].map(([k, val]) => [ser(k, d + 1), ser(val, d + 1)]);
    if (v instanceof Set) return [...v].map((x) => ser(x, d + 1));
    if (typeof v === "object") {
      const o: Record<string, unknown> = {};
      for (const k of Object.keys(v as object)) o[k] = ser((v as Record<string, unknown>)[k], d + 1);
      return o;
    }
    return undefined;
  };
  const disp = (v: unknown) =>
    v !== null && typeof v === "object" ? JSON.stringify(ser(v, 0)) : v;

  function classify(locals: Record<string, unknown>): Omit<RawStep, "line" | "callStack"> {
    const vars: Record<string, unknown> = {};
    const arrays: Record<string, never> = {};
    const maps: Record<string, never> = {};
    const sets: Record<string, never> = {};
    for (const k of Object.keys(locals)) {
      const v = locals[k];
      if (typeof v === "function" || typeof v === "undefined") continue;
      if (Array.isArray(v)) (arrays as Record<string, unknown>)[k] = ser(v, 0);
      else if (v instanceof Map)
        (maps as Record<string, unknown>)[k] = [...v.entries()].map(([kk, vv]) => [ser(kk, 0), ser(vv, 0)]);
      else if (v instanceof Set)
        (sets as Record<string, unknown>)[k] = [...v].map((x) => ser(x, 0));
      else if (v !== null && typeof v === "object")
        (maps as Record<string, unknown>)[k] = Object.entries(v as object).map(([kk, vv]) => [kk, ser(vv, 0)]);
      else vars[k] = typeof v === "number" && !Number.isFinite(v) ? String(v) : v;
    }
    return { vars, arrays, maps, sets };
  }

  const callStack = () =>
    stack.slice(1).map((f) => ({
      name: f.name,
      paramNames: f.paramNames,
      args: f.dispArgs,
    }));

  return {
    api: {
      __step(line: number, locals: Record<string, unknown>) {
        if (steps.length >= MAX_STEPS) {
          overflow = true;
          throw { __stepvizOverflow: true };
        }
        steps.push({ line: line - 1, ...classify(locals), callStack: callStack() });
      },
      __enter(name: string, paramNames: string[], args: unknown[]) {
        // Serialize the args ONCE here (at call time), not on every step.
        stack.push({ name, paramNames, dispArgs: args.map(disp) });
      },
      __exit() {
        if (stack.length > 1) stack.pop();
      },
      __final(locals: Record<string, unknown>) {
        finalStep = { line: -1, ...classify(locals), callStack: [] };
      },
      __tick() {
        if (++ticks > MAX_TICKS) {
          overflow = true;
          throw { __stepvizOverflow: true };
        }
      },
    },
    result(): { steps: RawStep[]; final: RawStep | null; overflow: boolean } {
      return { steps, final: finalStep, overflow };
    },
  };
}

/** Trim a JS engine error message into something close to the source. */
function normalizeError(e: unknown): { type: string; msg: string; line: number | null } {
  if (e instanceof Error) {
    return { type: e.name || "Error", msg: e.message, line: null };
  }
  return { type: "Error", msg: String(e), line: null };
}

/**
 * Execute TypeScript/JavaScript on the real JS engine with per-line tracing and
 * return the visualizer snapshots. Compile (parse) errors throw so the caller
 * shows the banner; runtime errors after partial progress become a final error
 * step.
 */
export async function runJsTraced(code: string): Promise<ExecSnapshot[]> {
  const transform = await getTransform();
  let instrumented: string;
  try {
    instrumented = transform(code);
  } catch (e) {
    // Parse/transform failure → surface as a thrown error (no steps).
    throw e instanceof Error ? e : new Error(String(e));
  }

  const rt = makeRuntime();
  let runtimeError: { type: string; msg: string; line: number | null } | null = null;
  try {
    const fn = new Function(
      "__step",
      "__enter",
      "__exit",
      "__final",
      "__tick",
      instrumented
    );
    fn(rt.api.__step, rt.api.__enter, rt.api.__exit, rt.api.__final, rt.api.__tick);
  } catch (e) {
    if (!(e && typeof e === "object" && "__stepvizOverflow" in e)) {
      runtimeError = normalizeError(e);
    }
  }

  const { steps, final, overflow } = rt.result();
  const raw: RawTrace = {
    steps,
    final: runtimeError ? null : final,
    error: runtimeError,
    overflow,
  };
  return buildSnapshots(code, raw);
}
