// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import { runPythonTraced } from "../engine/runtime/pythonRuntime";

// Pyodide boots once; give it room on the first call.
beforeAll(async () => {
  await runPythonTraced("x = 1");
}, 60_000);

function lastVar(snaps: Awaited<ReturnType<typeof runPythonTraced>>, name: string) {
  for (let i = snaps.length - 1; i >= 0; i--) {
    if (snaps[i].vars[name] !== undefined) return snaps[i].vars[name];
  }
  return undefined;
}
function finalSnap(snaps: Awaited<ReturnType<typeof runPythonTraced>>) {
  return snaps[snaps.length - 1];
}

describe("Python via real CPython (Pyodide)", () => {
  it("runs the idioms the line interpreter could not", async () => {
    const snaps = await runPythonTraced(`a = 17
r1 = a // 3
sq = [x * x for x in [1, 2, 3]]
total = 0
for x in [10, 20, 30]:
    total += x
result = r1 + total`);
    expect(lastVar(snaps, "r1")).toBe(5); // floor division
    expect(finalSnap(snaps).arrays["sq"]).toEqual([1, 4, 9]); // comprehension
    expect(lastVar(snaps, "total")).toBe(60); // for x in collection
    expect(lastVar(snaps, "result")).toBe(65);
  });

  it("Two Sum with dict + enumerate resolves indices", async () => {
    const snaps = await runPythonTraced(`def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        c = target - n
        if c in seen:
            return [seen[c], i]
        seen[n] = i
    return []

result = two_sum([2, 7, 11, 15], 9)`);
    expect(finalSnap(snaps).arrays["result"]).toEqual([0, 1]);
  });

  it("string iteration + char frequency dict", async () => {
    const snaps = await runPythonTraced(`def count(s):
    d = {}
    for c in s:
        d[c] = d.get(c, 0) + 1
    return d

result = count("abba")`);
    expect(finalSnap(snaps).maps["result"]).toEqual([
      ["a", 2],
      ["b", 2],
    ]);
  });

  it("captures the call stack inside a recursive function", async () => {
    const snaps = await runPythonTraced(`def fact(n):
    if n <= 1:
        return 1
    return n * fact(n - 1)

result = fact(4)`);
    expect(lastVar(snaps, "result")).toBe(24);
    const deep = snaps.find((s) => (s.callStack?.length ?? 0) >= 3);
    expect(deep).toBeDefined();
    expect(deep!.callStack!.every((f) => f.name === "fact")).toBe(true);
  });

  it("slicing and built-in aggregates work", async () => {
    const snaps = await runPythonTraced(`nums = [3, 1, 4, 1, 5]
rev = nums[::-1]
hi = max(nums)
lo = min(nums)
result = hi + lo`);
    expect(finalSnap(snaps).arrays["rev"]).toEqual([5, 1, 4, 1, 3]);
    expect(lastVar(snaps, "result")).toBe(6);
  });

  it("surfaces a runtime error as a final error step (after partial trace)", async () => {
    const snaps = await runPythonTraced(`x = 1
y = x + 2
z = nums[5]`);
    const last = finalSnap(snaps);
    expect(last.explanation).toMatch(/Error:/);
    // Some real execution happened before the error.
    expect(snaps.length).toBeGreaterThan(1);
  });

  it("throws on a syntax error (no steps to show)", async () => {
    await expect(runPythonTraced("def (:\n  pass")).rejects.toThrow();
  });

  it("float('inf') serializes without breaking the trace (Dijkstra-style)", async () => {
    const code = `import math
dist = [float('inf')] * 4
dist[0] = 0
neg = float('-inf')
result = dist[1]`;
    const snaps = await runPythonTraced(code);
    // Must not throw a JSON parse error; inf renders as the string "Infinity".
    expect(finalSnap(snaps).explanation).toMatch(/complete/i);
    expect(finalSnap(snaps).arrays["dist"]).toEqual([0, "Infinity", "Infinity", "Infinity"]);
    expect(lastVar(snaps, "neg")).toBe("-Infinity");
  });

  it("N-Queens: nested closure + recursion + sets + comprehension, in source order", async () => {
    const code = `def solve_n_queens(n):
    solutions = []
    board = []
    cols = set()
    diag1 = set()
    diag2 = set()
    def backtrack(row):
        if row == n:
            solutions.append([''.join(r) for r in board])
            return
        for col in range(n):
            if col in cols or (row - col) in diag1 or (row + col) in diag2:
                continue
            board.append('.' * col + 'Q' + '.' * (n - col - 1))
            cols.add(col)
            diag1.add(row - col)
            diag2.add(row + col)
            backtrack(row + 1)
            board.pop()
            cols.remove(col)
            diag1.remove(row - col)
            diag2.remove(row + col)
    backtrack(0)
    return solutions

n = 4
result = solve_n_queens(n)`;
    const snaps = await runPythonTraced(code);
    // Correct answer: 4-queens has exactly 2 solutions.
    const result = finalSnap(snaps).arrays["result"] as unknown[];
    expect(result.length).toBe(2);
    // Execution does NOT begin inside the function body: the first body line
    // (`solutions = []`, line index 1) is reached only AFTER `n = 4` (index 25).
    const firstBody = snaps.findIndex((s) => s.line === 1);
    const nAssign = snaps.findIndex((s) => s.line === 25);
    expect(nAssign).toBeGreaterThanOrEqual(0);
    expect(firstBody).toBeGreaterThan(nAssign);
    // The nested closure recurses — call stack reaches depth > 1.
    expect(Math.max(...snaps.map((s) => s.callStack?.length ?? 0))).toBeGreaterThan(1);
  });
});
