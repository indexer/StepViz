// @vitest-environment node
import { describe, it, expect } from "vitest";
import { runJsTraced } from "../engine/runtime/jsRuntime";

type Snaps = Awaited<ReturnType<typeof runJsTraced>>;
function lastVar(snaps: Snaps, name: string) {
  for (let i = snaps.length - 1; i >= 0; i--) {
    if (snaps[i].vars[name] !== undefined) return snaps[i].vars[name];
  }
  return undefined;
}
function finalSnap(snaps: Snaps) {
  return snaps[snaps.length - 1];
}

describe("TypeScript/JavaScript via real engine (Babel-instrumented)", () => {
  it("runs array methods with arrow callbacks", async () => {
    const snaps = await runJsTraced(`const nums = [1, 2, 3, 4, 5];
const doubled = nums.map((x) => x * 2);
const evens = nums.filter((x) => x % 2 === 0);
const result = nums.reduce((a, b) => a + b, 0);`);
    expect(finalSnap(snaps).arrays["doubled"]).toEqual([2, 4, 6, 8, 10]);
    expect(finalSnap(snaps).arrays["evens"]).toEqual([2, 4]);
    expect(lastVar(snaps, "result")).toBe(15);
  });

  it("Two Sum with a typed Map resolves indices", async () => {
    const snaps = await runJsTraced(`function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const c = target - nums[i];
    if (seen.has(c)) return [seen.get(c)!, i];
    seen.set(nums[i], i);
  }
  return [];
}
const result = twoSum([2, 7, 11, 15], 9);`);
    expect(finalSnap(snaps).arrays["result"]).toEqual([0, 1]);
  });

  it("for…of accumulation and Set work", async () => {
    const snaps = await runJsTraced(`let total = 0;
for (const x of [10, 20, 30]) {
  total += x;
}
const uniq = new Set([1, 1, 2, 3]);`);
    expect(lastVar(snaps, "total")).toBe(60);
    expect(finalSnap(snaps).sets["uniq"]).toEqual([1, 2, 3]);
  });

  it("captures the call stack in a recursive function", async () => {
    const snaps = await runJsTraced(`function fact(n: number): number {
  if (n <= 1) return 1;
  return n * fact(n - 1);
}
const result = fact(4);`);
    expect(lastVar(snaps, "result")).toBe(24);
    const deep = snaps.find((s) => (s.callStack?.length ?? 0) >= 3);
    expect(deep).toBeDefined();
    expect(deep!.callStack!.every((f) => f.name === "fact")).toBe(true);
  });

  it("destructuring swap and template literals execute correctly", async () => {
    const snaps = await runJsTraced(`let a = 1;
let b = 2;
[a, b] = [b, a];
const msg = \`a=\${a} b=\${b}\`;`);
    expect(lastVar(snaps, "a")).toBe(2);
    expect(lastVar(snaps, "b")).toBe(1);
    expect(lastVar(snaps, "msg")).toBe("a=2 b=1");
  });

  it("a class with methods works", async () => {
    const snaps = await runJsTraced(`class Counter {
  count = 0;
  inc() { this.count += 1; }
}
const c = new Counter();
c.inc();
c.inc();
const result = c.count;`);
    expect(lastVar(snaps, "result")).toBe(2);
  });

  it("surfaces a runtime error as a final error step", async () => {
    const snaps = await runJsTraced(`const a = 1;
const b = a + 1;
const c = (undefined as any).x;`);
    expect(finalSnap(snaps).explanation).toMatch(/Error:/);
    expect(snaps.length).toBeGreaterThan(1);
  });

  it("throws on a syntax error", async () => {
    await expect(runJsTraced("const = ;")).rejects.toThrow();
  });

  it("an empty infinite loop terminates (does not hang the thread)", async () => {
    const t0 = Date.now();
    const snaps = await runJsTraced("let i = 0;\nwhile (true) {}\nconst result = i;");
    // Bounded by the runaway tick-guard, so it returns quickly...
    expect(Date.now() - t0).toBeLessThan(10_000);
    // ...with a clear "infinite loop" notice as the final step.
    expect(finalSnap(snaps).explanation).toMatch(/infinite loop|step limit/i);
  }, 15_000);
});
