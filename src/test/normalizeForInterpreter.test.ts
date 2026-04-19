import { describe, it, expect } from "vitest";
import { normalizeForInterpreter } from "../engine/normalizeForInterpreter";
import { interpret } from "../engine/interpreter";

/**
 * The playground normalizer must convert algorithm detail-page snippets
 * (multiple functions + `// --- Example ---` block) into a shape the simple
 * interpreter can execute, and must auto-wrap top-level Kotlin in fun main().
 */

function lastVar(snapshots: ReturnType<typeof interpret>, name: string) {
  for (let i = snapshots.length - 1; i >= 0; i--) {
    const v = snapshots[i].vars[name];
    if (v !== undefined) return v;
  }
  return undefined;
}

describe("normalizeForInterpreter", () => {
  it("TS: multi-function snippet + Example block executes the primary function", () => {
    const code = `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}

function linearSearchAll(arr, target) {
  let out = [];
  return out;
}

// --- Example ---
const data = [10, 20, 30, 40, 50];
const result = linearSearch(data, 30); // → 2`;
    const prepared = normalizeForInterpreter(code, "typescript");
    const snaps = interpret(prepared, "typescript");
    // The primary function returns 2 → we should see result === 2 in final frame.
    expect(lastVar(snaps, "result")).toBe(2);
  });

  it("Python: multi-def snippet + Example block executes the first def", () => {
    const code = `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1

def linear_search_all(arr, target):
    return []

# --- Example ---
data = [10, 20, 30, 40, 50]
result = linear_search(data, 40)  # -> 3`;
    const prepared = normalizeForInterpreter(code, "python");
    const snaps = interpret(prepared, "python");
    expect(lastVar(snaps, "result")).toBe(3);
  });

  it("Kotlin: wraps bare top-level code in fun main() so it executes", () => {
    const code = `val x = 5
val y = 10
val result = x + y`;
    const prepared = normalizeForInterpreter(code, "kotlin");
    expect(prepared).toMatch(/^fun main\(\)/);
    const snaps = interpret(prepared, "kotlin");
    expect(lastVar(snaps, "result")).toBe(15);
  });

  it("Kotlin: leaves existing fun main() alone", () => {
    const code = `fun main() {
  val a = 1
  val result = a + 2
}`;
    const prepared = normalizeForInterpreter(code, "kotlin");
    expect(prepared).toBe(code);
    const snaps = interpret(prepared, "kotlin");
    expect(lastVar(snaps, "result")).toBe(3);
  });

  it("TS: bare script with no function is returned unchanged", () => {
    const code = `let a = 1;\nlet b = 2;\nlet result = a + b;`;
    const prepared = normalizeForInterpreter(code, "typescript");
    expect(prepared).toBe(code);
  });

  it("Kotlin: multi-function + Example executes the primary function", () => {
    const code = `fun linearSearch(arr: IntArray, target: Int): Int {
  for (i in 0 until arr.size) {
    if (arr[i] == target) {
      return i
    }
  }
  return -1
}

fun linearSearchAll(arr: IntArray, target: Int): IntArray {
  return intArrayOf()
}

// --- Example ---
val data = intArrayOf(10, 20, 30, 40, 50)
val result = linearSearch(data, 10)`;
    const prepared = normalizeForInterpreter(code, "kotlin");
    const snaps = interpret(prepared, "kotlin");
    expect(lastVar(snaps, "result")).toBe(0);
  });
});
