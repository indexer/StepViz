/**
 * Normalize user-pasted algorithm code into a shape the line-by-line
 * interpreter in `./interpreter.ts` can execute.
 *
 * The interpreter now supports user-defined function calls and a call-stack
 * frame model, so multi-function snippets execute natively — we no longer
 * need to inline the primary function or strip helpers. What's left for the
 * normalizer is small:
 *
 *   1. Discover the names of all functions declared in the source (so we
 *      can recognize which example-block calls will succeed).
 *
 *   2. From the lines below the `--- Example ---` marker, strip statements
 *      the interpreter still can't evaluate:
 *        - Calls to functions that aren't declared anywhere (e.g. an
 *          example references `linearSearch` but the user kept only
 *          `linearSearchAll`).
 *        - Calls passing an arrow-function (lambda) argument — the
 *          interpreter doesn't represent callables as values.
 *      Lines that survive are left in place as the program's entry point.
 *
 *   3. Strip the marker line itself so the kept example statements parse as
 *      ordinary top-level code.
 *
 *   4. Wrap bare Kotlin scripts in `fun main() { ... }` when the user has
 *      pasted top-level statements without any `fun` declaration — the
 *      interpreter's primary-function-unwrap then runs the body verbatim.
 *
 * Anything else (parsing function signatures, calling them with the right
 * args, capturing return values) is the interpreter's job.
 */

export type Lang = "typescript" | "python" | "kotlin";

/** Top-level public API. */
export function normalizeForInterpreter(code: string, language: Lang): string {
  const lines = code.split("\n");
  const knownFns = findDeclaredFunctionNames(lines, language);

  // Find the marker line index, if any.
  let markerIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(?:\/\/|#)\s*---\s*Example\s*---/i.test(lines[i])) {
      markerIdx = i;
      break;
    }
  }

  if (markerIdx >= 0) {
    // Strip the marker itself.
    lines[markerIdx] = "";
    // Filter the example region: drop lines that reference unsupported
    // constructs. We leave declarations of supporting data (arrays, literals)
    // and only-known-function calls untouched.
    for (let i = markerIdx + 1; i < lines.length; i++) {
      // Decide on the code only (comments must not trigger a false strip — a
      // `// helper(x)` comment isn't a call, and a `// a => b` comment isn't a
      // lambda arg).
      const code = stripComment(lines[i], language).trim();
      if (!code) continue;
      if (
        referencesUnknownFunction(code, knownFns) ||
        containsArrowFunctionArg(code, language)
      ) {
        lines[i] = "";
      }
    }
  }

  return maybeWrapKotlinMain(lines.join("\n"), language);
}

/**
 * Collect the names of every function declared in the source. Used to decide
 * which example-block call sites the interpreter will actually resolve.
 */
function findDeclaredFunctionNames(lines: string[], language: Lang): Set<string> {
  const out = new Set<string>();
  if (language === "python") {
    for (const ln of lines) {
      const m = ln.match(/^\s*def\s+(\w+)\s*\(/);
      if (m) out.add(m[1]);
    }
    return out;
  }
  const fnRe =
    /^\s*(?:(?:export|private|public|internal)\s+)?(?:function|fun)\s+(\w+)\s*\(/;
  // Mirror the interpreter's arrow detection (which requires a parenthesized
  // param list) so we don't mark a single-param arrow `const f = x => …` as a
  // callable the interpreter then can't resolve.
  const arrowRe = /^\s*(?:const|let|var)\s+(\w+)\s*=\s*\(/;
  for (const ln of lines) {
    const m = ln.match(fnRe);
    if (m) {
      out.add(m[1]);
      continue;
    }
    const a = ln.match(arrowRe);
    if (a) out.add(a[1]);
  }
  return out;
}

/**
 * Return true if the line invokes something the interpreter can't evaluate:
 *   - a bare-identifier call `foo(...)` that isn't a known user function or a
 *     recognized built-in, or
 *   - a method/dotted call `recv.bar(...)` whose method the interpreter has no
 *     handler for (and whose receiver isn't a supported namespace like Math).
 * Such a line would throw "Cannot evaluate" at runtime and halt the whole
 * visualization, so we strip it before the interpreter ever sees it.
 *
 * We walk the string so matches inside string literals are ignored.
 */
function referencesUnknownFunction(line: string, knownFns: Set<string>): boolean {
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
    // Start of an identifier (allow a leading `.` so method names are seen).
    if (/[A-Za-z_$]/.test(c) && (i === 0 || !/[\w$]/.test(line[i - 1]))) {
      let j = i;
      while (j < line.length && /[\w$]/.test(line[j])) j++;
      if (j < line.length && line[j] === "(") {
        const name = line.slice(i, j);
        if (i > 0 && line[i - 1] === ".") {
          // Method call `recv.name(...)`. Allowed when the method is one the
          // interpreter implements, or the receiver is a known namespace.
          if (!INTERPRETER_METHODS.has(name)) {
            let e = i - 2; // char before the `.`
            while (e >= 0 && /[\w$]/.test(line[e])) e--;
            const recv = line.slice(e + 1, i - 1);
            if (!INTERPRETER_NAMESPACES.has(recv)) return true;
          }
        } else if (
          name !== "if" &&
          name !== "for" &&
          name !== "while" &&
          name !== "return" &&
          name !== "switch" &&
          !INTERPRETER_BUILTINS.has(name) &&
          !knownFns.has(name)
        ) {
          return true;
        }
        i = j;
      }
    }
  }
  return false;
}

/** Instance methods the interpreter has dedicated handling for. */
const INTERPRETER_METHODS = new Set([
  "push",
  "add",
  "set",
  "get",
  "has",
  "contains",
  "delete",
  "append",
  "pop",
  "discard",
  "remove",
]);

/** Receiver names whose method calls the interpreter resolves (e.g. Math.floor). */
const INTERPRETER_NAMESPACES = new Set(["Math"]);

/** Calls/constructors the interpreter resolves directly without a frame. */
const INTERPRETER_BUILTINS = new Set([
  "Math",
  "min",
  "max",
  "abs",
  "minOf",
  "maxOf",
  "len",
  "int",
  "float",
  "range",
  "listOf",
  "mutableListOf",
  "arrayListOf",
  "intArrayOf",
  "arrayOf",
  "IntArray",
  "BooleanArray",
  "Array",
  "print",
  "println",
  "console",
]);

/**
 * Detect a lambda the interpreter can't represent as a value: a JS/TS arrow
 * (`=>`) or a Kotlin lambda (`{ it -> ... }`). Expects comment-free input.
 */
function containsArrowFunctionArg(code: string, language: Lang): boolean {
  if (/=>/.test(code)) return true;
  if (language === "kotlin" && /->/.test(code)) return true;
  return false;
}

/**
 * Strip a trailing line comment (string-aware). Python comments start with
 * `#`; brace languages use `//` (note Python's `//` is integer division, so
 * it must not be treated as a comment there).
 */
function stripComment(line: string, language: Lang): string {
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
    if (language === "python") {
      if (c === "#") return line.slice(0, i);
    } else if (c === "/" && line[i + 1] === "/") {
      return line.slice(0, i);
    }
  }
  return line;
}

/**
 * If user-pasted Kotlin has no `fun` declaration but does have top-level
 * executable statements, wrap them in `fun main() { ... }` so the
 * interpreter's primary-function-unwrap kicks in. If there's already a `fun`
 * (any function), leave the source alone — the interpreter handles it
 * directly through its function table.
 */
function maybeWrapKotlinMain(code: string, language: Lang): string {
  if (language !== "kotlin") return code;
  if (/\bfun\s+\w+\s*\(/.test(code)) return code;
  if (!code.trim()) return code;
  const indented = code
    .split("\n")
    .map((l) => (l.length ? "    " + l : l))
    .join("\n");
  return `fun main() {\n${indented}\n}`;
}
