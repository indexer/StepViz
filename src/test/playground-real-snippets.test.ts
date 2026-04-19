import { describe, it, expect } from "vitest";
import { normalizeForInterpreter } from "../engine/normalizeForInterpreter";
import { interpret } from "../engine/interpreter";

/**
 * Smoke-test the normalizer + interpreter pipeline against real algorithm
 * detail-page snippets to surface the exact errors a user would hit when
 * pasting into the playground.
 */

describe("playground: real algorithm snippets", () => {
  it("SEA_001 Binary Search (TS)", () => {
    const code = `function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (arr[mid] === target) {
      return mid;
    }

    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1; // Element not found
}

// Recursive implementation
function binarySearchRecursive(
  arr: number[],
  target: number,
  left: number = 0,
  right: number = arr.length - 1
): number {
  if (left > right) return -1;

  const mid = Math.floor(left + (right - left) / 2);

  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return binarySearchRecursive(arr, target, mid + 1, right);
  return binarySearchRecursive(arr, target, left, mid - 1);
}

// --- Example ---
const sortedArr = [10, 20, 30, 40, 50, 60, 70, 80, 90];
const idx = binarySearch(sortedArr, 40);          // → 3
const idxRec = binarySearchRecursive(sortedArr, 80); // → 7
const notFound = binarySearch(sortedArr, 42);     // → -1`;
    const prepared = normalizeForInterpreter(code, "typescript");
    // Should not throw
    const snaps = interpret(prepared, "typescript");
    expect(snaps.length).toBeGreaterThan(0);
    // Multi-line signature of `binarySearchRecursive(...)` must be recognized
    // as a dropped function → its call site in the example block stripped →
    // primary body executes → result === 3.
    const last = snaps[snaps.length - 1];
    expect(last.vars["result"]).toBe(3);
    // Inputs from the Example block must be visible to the user.
    expect(last.vars["sortedArr"]).toBe("[10,20,30,40,50,60,70,80,90]");
    expect(last.vars["target"]).toBe(40);
  });

  it("SEA_002: primary=linearSearchAll with inline-array call arg (TS)", () => {
    // User's case: keeps only linearSearchAll, example uses inline literal
    const code = `function linearSearchAll(arr: number[], target: number): number[] {
  const indices: number[] = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      indices.push(i);
    }
  }

  return indices;
}


// --- Example ---
const nums = [4, 2, 7, 1, 9, 5];
const idx = linearSearch(nums, 7);                   // → 2
const all = linearSearchAll([1, 3, 7, 3, 5], 3);     // → [1, 3]`;
    const prepared = normalizeForInterpreter(code, "typescript");
    const snaps = interpret(prepared, "typescript");
    const last = snaps[snaps.length - 1];
    // The visualization should show arr = [1, 3, 7, 3, 5] and target = 3
    expect(last.arrays["arr"]).toEqual([1, 3, 7, 3, 5]);
    expect(last.vars["target"]).toBe(3);
  });

  it("SEA_002 Linear Search — real snippet (TS)", () => {
    // Exact snippet from src/data/algorithms-searching.ts SEA_002
    const code = `function linearSearch(arr: number[], target: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1; // Element not found
}

// Find all occurrences
function linearSearchAll(arr: number[], target: number): number[] {
  const indices: number[] = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      indices.push(i);
    }
  }

  return indices;
}

// Generic linear search
function linearSearchGeneric<T>(
  arr: T[],
  predicate: (item: T) => boolean
): number {
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) {
      return i;
    }
  }
  return -1;
}

// --- Example ---
const nums = [4, 2, 7, 1, 9, 5];
const idx = linearSearch(nums, 7);                   // → 2
const all = linearSearchAll([1, 3, 7, 3, 5], 3);     // → [1, 3]
const firstEven = linearSearchGeneric(nums, (n) => n % 2 === 0); // → 0 (value 4)
const missing = linearSearch(nums, 42);              // → -1`;
    const prepared = normalizeForInterpreter(code, "typescript");
    const snaps = interpret(prepared, "typescript");
    const last = snaps[snaps.length - 1];
    expect(last.vars["result"] ?? last.vars["idx"]).toBe(2);
  });
});
