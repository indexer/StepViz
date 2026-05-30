import { describe, it, expect } from "vitest";
import { interpret } from "../engine/interpreter";
import { normalizeForInterpreter } from "../engine/normalizeForInterpreter";

function lastVar(snaps: ReturnType<typeof interpret>, name: string): unknown {
  for (let i = snaps.length - 1; i >= 0; i--) {
    const v = snaps[i].vars[name];
    if (v !== undefined) return v;
  }
  return undefined;
}

function lastSnap(snaps: ReturnType<typeof interpret>) {
  return snaps[snaps.length - 1];
}

describe("review fixes", () => {
  // A1 — findTopLevelOp must not split on " in " inside a string literal.
  it("string literal containing ' in ' is not parsed as a membership test", () => {
    const code = `const count = 3;
const msg = count + " items in stock";`;
    const snaps = interpret(code, "typescript");
    expect(lastVar(snaps, "msg")).toBe("3 items in stock");
  });

  // AL3 — object shorthand and spread no longer collapse to {}.
  it("object shorthand { x, y } captures the same-named variables", () => {
    const code = `const x = 1;
const y = 2;
const point = { x, y };
const result = point["x"] + point["y"];`;
    const snaps = interpret(code, "typescript");
    expect(lastVar(snaps, "result")).toBe(3);
    expect(lastSnap(snaps).maps["point"]).toEqual([
      ["x", 1],
      ["y", 2],
    ]);
  });

  it("object spread merges another object", () => {
    const code = `const base = { a: 1 };
const merged = { ...base, b: 2 };
const result = merged["a"] + merged["b"];`;
    const snaps = interpret(code, "typescript");
    expect(lastVar(snaps, "result")).toBe(3);
  });

  // A4 — multi-index assignment onto a dict/Map of arrays mutates the nesting.
  it("nested write into a dict of lists mutates the inner list", () => {
    const code = `grid = {}
grid["row"] = [0, 0, 0]
grid["row"][1] = 9
result = grid["row"][1]`;
    const snaps = interpret(code, "python");
    expect(lastVar(snaps, "result")).toBe(9);
  });

  // A2 — a scalar that becomes a Map must not linger in `vars`.
  it("scalar reassigned to a Map is removed from vars (no double render)", () => {
    const code = `let acc = 0;
acc = new Map();
acc.set("k", 1);`;
    const snaps = interpret(code, "typescript");
    const last = lastSnap(snaps);
    expect(last.vars["acc"]).toBeUndefined();
    expect(last.maps["acc"]).toEqual([["k", 1]]);
  });

  // C3 — `result` is only surfaced at the top level, never inside a callee.
  it("recursive helper does not leak a phantom `result` into call frames", () => {
    const code = `function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1);
}
const result = fact(4);`;
    const snaps = interpret(code, "typescript");
    expect(lastVar(snaps, "result")).toBe(24);
    // No snapshot taken while inside a fact(...) frame may expose `result`.
    const leaked = snaps.find(
      (s) => s.callStack?.some((f) => f.name === "fact") && "result" in s.vars
    );
    expect(leaked).toBeUndefined();
  });

  // B1 — an Example-block line using an unsupported method is stripped, so the
  // supported call still runs instead of the whole visualization throwing.
  it("normalizer strips unsupported method calls in the Example block", () => {
    const code = `function reverseArr(arr) {
  const out = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    out.push(arr[i]);
  }
  return out;
}

// --- Example ---
const data = [1, 2, 3];
const sub = data.slice(0, 2);
const result = reverseArr(data);`;
    const prepared = normalizeForInterpreter(code, "typescript");
    // The unsupported `data.slice(...)` line must be removed.
    expect(prepared).not.toContain("data.slice");
    const snaps = interpret(prepared, "typescript");
    expect(lastVar(snaps, "result")).toBe("[3,2,1]");
  });

  it("normalizer keeps a known-function call that has a trailing comment", () => {
    const code = `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// --- Example ---
const data = [10, 20, 30];
const idx = linearSearch(data, 20); // maps key => value`;
    const prepared = normalizeForInterpreter(code, "typescript");
    // The trailing `=>` comment must NOT cause the line to be stripped.
    expect(prepared).toContain("linearSearch(data, 20)");
    const snaps = interpret(prepared, "typescript");
    expect(lastVar(snaps, "idx")).toBe(1);
  });
});
