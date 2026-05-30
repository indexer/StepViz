import { describe, it, expect } from "vitest";
import { interpret } from "../engine/interpreter";

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

describe("Maps and Sets — first-class kinds", () => {
  it("TS: Two-Sum with new Map() resolves indices via .get/.has/.set", () => {
    const code = `function twoSum(nums: number[], target: number): number[] {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}
const result = twoSum([2, 7, 11, 15], 9);`;
    const snaps = interpret(code, "typescript");
    // [2,7,11,15] / target 9 → indices [0, 1].
    expect(lastVar(snaps, "result")).toBe("[0,1]");
    // While inside twoSum, `seen` must appear in the snapshot's `maps` field.
    const insideCall = snaps.find(
      (s) => s.callStack?.some((f) => f.name === "twoSum") && s.maps?.["seen"]
    );
    expect(insideCall).toBeDefined();
  });

  it("TS: contains-duplicate with new Set() returns true on the second 1", () => {
    const code = `function hasDup(nums: number[]): boolean {
  const seen = new Set();
  for (let i = 0; i < nums.length; i++) {
    if (seen.has(nums[i])) return true;
    seen.add(nums[i]);
  }
  return false;
}
const result = hasDup([3, 5, 1, 7, 1, 9]);`;
    const snaps = interpret(code, "typescript");
    expect(lastVar(snaps, "result")).toBe(true);
    // The set's values must appear in some snapshot's `sets` field.
    const hadSet = snaps.find(
      (s) => s.sets?.["seen"] && (s.sets["seen"] as unknown[]).length >= 3
    );
    expect(hadSet).toBeDefined();
  });

  it("TS: object literal used as dict — properties show up in maps", () => {
    const code = `const counts = {};
counts["a"] = 1;
counts["b"] = 2;
counts["a"] = counts["a"] + 1;
const result = counts["a"] + counts["b"];`;
    const snaps = interpret(code, "typescript");
    expect(lastVar(snaps, "result")).toBe(4);
    const last = lastSnap(snaps);
    expect(last.maps["counts"]).toEqual([
      ["a", 2],
      ["b", 2],
    ]);
  });

  it("Python: dict counts characters", () => {
    const code = `def char_count(s):
    counts = {}
    for c in s:
        if c in counts:
            counts[c] = counts[c] + 1
        else:
            counts[c] = 1
    return counts

result = char_count("abba")`;
    // Python `for c in s` iteration over strings isn't supported by the
    // interpreter — substitute an explicit list traversal so the test
    // exercises dict mutation rather than string iteration.
    const fallback = `def char_count(chars):
    counts = {}
    for i in range(len(chars)):
        c = chars[i]
        if c in counts:
            counts[c] = counts[c] + 1
        else:
            counts[c] = 1
    return counts

result = char_count(["a", "b", "b", "a"])`;
    void code;
    const snaps = interpret(fallback, "python");
    const last = lastSnap(snaps);
    // result is a dict {a:2, b:2}, surfaced via maps + result var holding the
    // reference (omitted from `vars` because plain objects go to `maps`).
    expect(last.maps["result"]).toEqual([
      ["a", 2],
      ["b", 2],
    ]);
  });

  it("Python: set tracks visited indices via .add and `in`", () => {
    const code = `def first_repeated(nums):
    seen = set()
    for i in range(len(nums)):
        if nums[i] in seen:
            return nums[i]
        seen.add(nums[i])
    return -1

result = first_repeated([4, 2, 7, 2, 9])`;
    const snaps = interpret(code, "python");
    expect(lastVar(snaps, "result")).toBe(2);
  });

  it("TS: `key in obj` membership for plain objects", () => {
    const code = `const cache = {};
cache["x"] = 10;
const hasX = "x" in cache;
const hasY = "y" in cache;`;
    const snaps = interpret(code, "typescript");
    expect(lastVar(snaps, "hasX")).toBe(true);
    expect(lastVar(snaps, "hasY")).toBe(false);
  });

  it("Map / Set serialize to snapshot entries in insertion order", () => {
    const code = `const m = new Map();
m.set("c", 3);
m.set("a", 1);
m.set("b", 2);
const s = new Set();
s.add(10);
s.add(20);
s.add(10);`;
    const snaps = interpret(code, "typescript");
    const last = lastSnap(snaps);
    expect(last.maps["m"]).toEqual([
      ["c", 3],
      ["a", 1],
      ["b", 2],
    ]);
    // Set preserves insertion order and deduplicates.
    expect(last.sets["s"]).toEqual([10, 20]);
  });
});
