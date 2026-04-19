/**
 * Normalize user-pasted algorithm code into a shape the simple line-by-line
 * interpreter in `./interpreter.ts` can actually execute.
 *
 * Algorithm detail-page snippets typically contain:
 *   - Multiple function declarations (primary + variants)
 *   - A trailing  `// --- Example ---`  /  `# --- Example ---`  block that
 *     calls the primary function and asserts a positive result.
 *
 * The interpreter's limitations (intentional — it's a visualizer, not a real
 * VM):
 *   - Only the FIRST function declaration is unwrapped; subsequent ones leak
 *     into top-level execution and blow up.
 *   - User-defined function CALLS are not evaluated (no call frame machinery).
 *   - Kotlin top-level code runs as-is, but idiomatic Kotlin programs live
 *     inside `fun main() { ... }` — which the user asked us to support.
 *
 * This normalizer transforms the pasted code so the interpreter can show a
 * useful visualization:
 *
 *   1. Detect the primary function (first `function` / `def` / `fun` that is
 *      NOT `main`). Capture its name + body.
 *   2. Detect an optional `--- Example ---` block. If found, look for a call
 *      like `result = primaryFn(arg1, arg2)` and extract the literal args.
 *   3. Emit a new program that:
 *        - Binds the function's parameters to those literal args at the top
 *          (so the interpreter sees `let arr = [1,2,3]; let target = 2;`
 *          rather than needing to guess via SAMPLE_ARRAYS).
 *        - Inlines the primary function body immediately after those bindings.
 *        - Drops every other function declaration and the example block.
 *   4. For Kotlin: if the resulting code has top-level `val/var/for/while/if`
 *      statements but no `fun` declaration at all, auto-wrap it in
 *      `fun main() { ... }` so the interpreter's function-unwrap kicks in.
 *
 * If no primary function is detected, the code is returned unchanged (save for
 * the Kotlin `main()` wrap). This keeps the normalizer safe on small scripts.
 */

export type Lang = "typescript" | "python" | "kotlin";

interface FunctionRegion {
  name: string;
  paramNames: string[];
  bodyLines: string[]; // inner body, already dedented one indent level
  startLine: number;
  endLine: number;
}

/** Top-level public API. */
export function normalizeForInterpreter(code: string, language: Lang): string {
  const lines = code.split("\n");

  // 1. Find all function regions (primary + extras)
  const fns = findAllFunctions(lines, language);

  // 2. Find the example block (if any)
  const example = findExampleBlock(lines, language);

  // 3. Pick the primary function — first non-`main` function
  const primary = fns.find((f) => f.name !== "main") ?? fns[0];

  // If there's no primary function at all, this is already a runnable script.
  // Apply only Kotlin main-wrap handling and return.
  if (!primary) {
    return maybeWrapKotlinMain(code, language);
  }

  // All *other* functions (the variants we're dropping). Any call to them in
  // the example block would fail at runtime — the interpreter doesn't support
  // user-defined function calls — so we must strip those lines.
  const droppedNames = new Set(
    fns.filter((f) => f.name !== primary.name).map((f) => f.name)
  );

  // 4. If we have an example block, extract the call-site arguments and
  //    bind them as top-level variable declarations so the interpreter sees
  //    concrete data rather than relying on SAMPLE_ARRAYS.
  const callArgs = example
    ? extractCallArgs(example.bodyLines, primary.name, language)
    : null;

  // 5. Build the transformed program.
  const header: string[] = [];

  // If the example block has declarations that feed into the call (e.g.
  // `const data = [...]; const target = 3;`), preserve them so variables
  // like `data` and `target` are visible in the visualization too.
  if (example) {
    for (const l of example.bodyLines) {
      const t = l.trim();
      if (!t) continue;
      // Skip the call site to the primary (we're inlining its body)
      if (isCallSite(t, primary.name)) continue;
      // Skip calls to any function we've dropped — they'd throw
      // "Cannot evaluate: name(...)" in the interpreter.
      if (callsAnyDropped(t, droppedNames)) continue;
      // Skip any other user-function call the interpreter can't evaluate
      // (e.g. `linearSearch(nums, 7)` when the user deleted `linearSearch`).
      if (callsUnknownFunction(t, primary.name)) continue;
      // Skip comments and expected-result markers
      if (isComment(t, language)) continue;
      header.push(l);
    }
  }

  // Bind primary function's parameters from the extracted call args,
  // overriding any re-declarations so the interpreter uses real values.
  if (callArgs && callArgs.length === primary.paramNames.length) {
    for (let i = 0; i < primary.paramNames.length; i++) {
      const name = primary.paramNames[i];
      const value = callArgs[i];
      header.push(declareBinding(name, value, language));
    }
  }

  // If we had no example call-site, wrap the primary function body in the
  // interpreter's function-unwrap convention so sample data gets seeded
  // based on param types (the original behavior).
  if (!callArgs) {
    // Just re-emit the primary function declaration; interpreter handles it.
    return maybeWrapKotlinMain(
      reemitPrimaryFunctionOnly(lines, primary, language),
      language
    );
  }

  // Otherwise, inline the function body directly after the bindings.
  const result = [...header, ...primary.bodyLines].join("\n");
  return maybeWrapKotlinMain(result, language);
}

/* ── internals ───────────────────────────────────────────── */

/**
 * Scan the source and return every function declaration we can identify,
 * along with its param names, body lines, and start/end indices.
 */
function findAllFunctions(
  lines: string[],
  language: Lang
): FunctionRegion[] {
  const out: FunctionRegion[] = [];
  if (language === "python") {
    // def name(params):
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/^\s*def\s+(\w+)\s*\(([^)]*)\)(?:\s*->.*)?:\s*$/);
      if (!m) continue;
      const name = m[1];
      const paramNames = parseParamNames(m[2]);
      const baseIndent = getIndent(lines[i]);
      let endLine = lines.length - 1;
      for (let j = i + 1; j < lines.length; j++) {
        const t = lines[j];
        if (t.trim() === "") continue;
        if (getIndent(t) <= baseIndent) {
          endLine = j - 1;
          break;
        }
      }
      const bodyLines = lines
        .slice(i + 1, endLine + 1)
        .map((l) => dedentOne(l, "python"));
      out.push({ name, paramNames, bodyLines, startLine: i, endLine });
    }
    return out;
  }

  // TS or Kotlin — brace-based. We detect `function <name>(` / `fun <name>(`
  // at line-start (with optional modifiers), then walk across *multiple lines*
  // to find the matching `)` — this is essential because algorithm detail
  // pages sometimes wrap long signatures:
  //   function binarySearchRecursive(
  //     arr: number[],
  //     target: number,
  //     left: number = 0,
  //     right: number = arr.length - 1
  //   ): number {
  // A single-line regex misses those and the call site `binarySearchRecursive(...)`
  // in the example block then fails with "Cannot evaluate" at runtime.
  const headerRe =
    /^\s*(?:(?:export|private|public|internal)\s+)?(?:function|fun)\s+(\w+)\s*(?:<[^>]*>)?\s*\(/;
  for (let i = 0; i < lines.length; i++) {
    const mh = lines[i].match(headerRe);
    if (!mh) continue;

    const name = mh[1];

    // Find the `(` that opens the param list on this line.
    const parenStart = lines[i].indexOf("(", mh.index! + mh[0].length - 1);
    if (parenStart === -1) continue;

    // Walk forward, across lines, until the matching `)` closes.
    let paramStr = "";
    let pDepth = 0;
    let sigEndLine = i;
    let sigEndCol = -1;
    let started = false;
    for (let j = i; j < lines.length; j++) {
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
            break;
          }
        } else if (started && pDepth > 0) {
          paramStr += ch;
        }
        // Account for param-string content on continuation lines: when we're
        // past the opening paren, include a newline for readability (though
        // parseParamNames only cares about comma-separated top-level pieces).
      }
      if (sigEndCol !== -1) break;
      // Preserve a space between lines so `arr: number[],` + `target: number`
      // don't collide when they span lines without trailing whitespace.
      if (started) paramStr += " ";
    }
    if (sigEndCol === -1) continue; // malformed — skip

    const paramNames = parseParamNames(paramStr);

    // Body begins after the opening `{` somewhere from sigEndLine onward.
    // Find the first `{` at or after sigEndCol on sigEndLine — but allow it
    // to be on a later line too (Allman style).
    let braceOpenLine = -1;
    for (let j = sigEndLine; j < lines.length; j++) {
      const startCol = j === sigEndLine ? sigEndCol + 1 : 0;
      const idx = lines[j].indexOf("{", startCol);
      if (idx !== -1) {
        braceOpenLine = j;
        break;
      }
      // Skip lines that are clearly just the `: ReturnType` tail
      if (lines[j].trim() && !/^[:\w<>?,\s[\]|&]+$/.test(lines[j].trim())) {
        break;
      }
    }
    if (braceOpenLine === -1) continue;

    // Find matching closing brace from the `{` we just located.
    let depth = 0;
    let endLine = lines.length - 1;
    let found = false;
    for (let j = braceOpenLine; j < lines.length; j++) {
      for (const ch of lines[j]) {
        if (ch === "{") depth++;
        else if (ch === "}") {
          depth--;
          if (depth === 0) {
            endLine = j;
            found = true;
            break;
          }
        }
      }
      if (found) break;
    }
    const bodyLines = lines
      .slice(braceOpenLine + 1, endLine)
      .map((l) => dedentOne(l, "brace"));
    out.push({ name, paramNames, bodyLines, startLine: i, endLine });
    // Don't skip ahead — we want to discover every function.
  }
  return out;
}

/** Parse `a: number, b: T[], c` → ["a","b","c"]. */
function parseParamNames(paramStr: string): string[] {
  const s = paramStr.trim();
  if (!s) return [];
  const parts: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of s) {
    if (ch === "<" || ch === "(" || ch === "[") depth++;
    else if (ch === ">" || ch === ")" || ch === "]") depth--;
    if (ch === "," && depth === 0) {
      parts.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) parts.push(cur);
  return parts
    .map((p) => p.trim())
    .filter((p) => p && p !== "self")
    .map((p) => {
      const name = p.match(/^(\w+)/);
      return name ? name[1] : p;
    });
}

interface ExampleRegion {
  bodyLines: string[];
  startLine: number;
}

function findExampleBlock(lines: string[], _language: Lang): ExampleRegion | null {
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(?:\/\/|#)\s*---\s*Example\s*---/i.test(lines[i])) {
      return {
        bodyLines: lines.slice(i + 1),
        startLine: i,
      };
    }
  }
  return null;
}

/**
 * Given the example block, find a line that calls `primaryFn(...)` and return
 * the raw argument expressions. Returns null if no call is found or args
 * can't be parsed.
 */
function extractCallArgs(
  exampleLines: string[],
  primaryName: string,
  _language: Lang
): string[] | null {
  // Match either:
  //   result = primary(a, b, ...);
  //   const r = primary(a, b, ...);
  //   val r = primary(a, b, ...)
  //   primary(a, b, ...)
  const callRe = new RegExp(
    "\\b" + primaryName + "\\s*\\(([\\s\\S]*?)\\)",
    "m"
  );
  for (const raw of exampleLines) {
    const line = stripLineComment(raw);
    const m = line.match(callRe);
    if (!m) continue;
    return splitArgs(m[1]);
  }
  return null;
}

/** Remove trailing // or # comment from a line (respecting strings). */
function stripLineComment(line: string): string {
  // Simple — not perfect for strings with // in them, but good enough.
  let inStr: string | null = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inStr) {
      if (c === inStr && line[i - 1] !== "\\") inStr = null;
      continue;
    }
    if (c === '"' || c === "'") {
      inStr = c;
      continue;
    }
    if (c === "#" || (c === "/" && line[i + 1] === "/")) {
      return line.slice(0, i);
    }
  }
  return line;
}

/** Split `[1,2], 3, "hi"` → ["[1,2]", "3", "\"hi\""]. */
function splitArgs(s: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let cur = "";
  let inStr: string | null = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      cur += c;
      if (c === inStr && s[i - 1] !== "\\") inStr = null;
      continue;
    }
    if (c === '"' || c === "'") {
      inStr = c;
      cur += c;
      continue;
    }
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") depth--;
    if (c === "," && depth === 0) {
      parts.push(cur.trim());
      cur = "";
    } else {
      cur += c;
    }
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

function isCallSite(trimmed: string, primaryName: string): boolean {
  return new RegExp("\\b" + primaryName + "\\s*\\(").test(trimmed);
}

/** Does this line invoke any of the function names we've dropped? */
function callsAnyDropped(trimmed: string, dropped: Set<string>): boolean {
  for (const name of dropped) {
    if (new RegExp("\\b" + name + "\\s*\\(").test(trimmed)) return true;
  }
  return false;
}

/**
 * Built-in identifiers the interpreter actually handles as call expressions.
 * Any other `ident(...)` call in an example-block line is almost certainly
 * a reference to a function the user deleted or a higher-order helper the
 * interpreter doesn't support — either way, the line will throw
 * "Cannot evaluate" at runtime, so we strip it.
 */
const INTERPRETER_SAFE_CALLS = new Set([
  "Math.floor",
  "Math.min",
  "Math.max",
  "Math.abs",
  "min",
  "max",
  "abs",
  "minOf",
  "maxOf",
  "len",
  "int",
  "range",
  "float",
  "listOf",
  "mutableListOf",
  "arrayListOf",
  "intArrayOf",
  "arrayOf",
  "IntArray",
  "BooleanArray",
  "Array",
]);

/**
 * Does this line reference a non-primary, non-built-in function call?
 * Such calls will blow up in the interpreter (no user-function-call support).
 * We use this to strip orphan calls like `linearSearch(nums, 7)` when the
 * user has kept only `linearSearchAll` as the primary.
 */
function callsUnknownFunction(trimmed: string, primaryName: string): boolean {
  // Match any `ident(` (including `a.b.c(`). Capture the dotted identifier.
  const re = /(\b[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\(/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(trimmed)) !== null) {
    const ident = m[1];
    // Skip keywords that happen to be followed by `(` — they're not calls.
    if (
      ident === "if" ||
      ident === "for" ||
      ident === "while" ||
      ident === "return" ||
      ident === "switch" ||
      ident === primaryName
    )
      continue;
    if (INTERPRETER_SAFE_CALLS.has(ident)) continue;
    // Any method-on-object call like `xs.push(` or `arr.map(` — the
    // interpreter doesn't support these either (except for readonly
    // `.length` / `.size`, which aren't calls anyway).
    return true;
  }
  return false;
}

function isComment(trimmed: string, language: Lang): boolean {
  if (language === "python") return trimmed.startsWith("#");
  return trimmed.startsWith("//");
}

/** Emit `const name = value;` / `name = value` / `val name = value`. */
function declareBinding(name: string, value: string, language: Lang): string {
  if (language === "python") return `${name} = ${value}`;
  if (language === "kotlin") return `val ${name} = ${value}`;
  return `const ${name} = ${value};`;
}

function getIndent(line: string): number {
  const m = line.match(/^(\s*)/);
  return m ? m[1].length : 0;
}

function dedentOne(line: string, style: "python" | "brace"): string {
  if (style === "python") {
    if (line.startsWith("    ")) return line.slice(4);
    if (line.startsWith("\t")) return line.slice(1);
    return line;
  }
  if (line.startsWith("    ")) return line.slice(4);
  if (line.startsWith("  ")) return line.slice(2);
  if (line.startsWith("\t")) return line.slice(1);
  return line;
}

/**
 * If user-pasted Kotlin has no `fun` declaration anywhere but does have
 * top-level executable statements, wrap them in `fun main() { ... }`. The
 * interpreter will then strip the wrapper and run the body normally.
 *
 * If the code already has a `fun main()` or any `fun` declaration, leave it
 * alone — the interpreter's existing function-unwrap handles it.
 */
function maybeWrapKotlinMain(code: string, language: Lang): string {
  if (language !== "kotlin") return code;
  if (/\bfun\s+\w+\s*\(/.test(code)) return code;
  const trimmed = code.trim();
  if (!trimmed) return code;
  // Indent each line by four spaces so the interpreter's brace-unwrap dedent
  // (which strips four spaces) restores them cleanly.
  const indented = code
    .split("\n")
    .map((l) => (l.length ? "    " + l : l))
    .join("\n");
  return `fun main() {\n${indented}\n}`;
}

/**
 * Fallback path: no example block available. Re-emit just the primary
 * function's declaration and body, stripping every other function so the
 * interpreter's function-unwrap finds a clean target.
 */
function reemitPrimaryFunctionOnly(
  lines: string[],
  primary: FunctionRegion,
  language: Lang
): string {
  // The interpreter wants the function header + body + closing `}` (or just
  // the Python def + body).
  const header = lines[primary.startLine];
  if (language === "python") {
    const body = lines.slice(primary.startLine + 1, primary.endLine + 1);
    return [header, ...body].join("\n");
  }
  const body = lines.slice(primary.startLine + 1, primary.endLine);
  const footer = lines[primary.endLine];
  return [header, ...body, footer].join("\n");
}
