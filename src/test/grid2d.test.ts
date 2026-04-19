import { describe, it, expect } from "vitest";
import { interpret } from "../engine/interpreter";

function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

/**
 * 2-D array / grid interpretation tests.
 *
 * These exercise:
 *   - Nested literal parsing ( [[...]] in TS/Python, nested mutableListOf in Kotlin )
 *   - Chained subscript reads  grid[i][j]
 *   - Chained subscript writes grid[i][j] = v
 *   - Mixed arithmetic on 2-D cells
 *
 * The canonical check is the "Min Path Sum" DP:
 *   grid = [[1,3,1], [1,5,1], [4,2,1]]  →  min-cost bottom-right = 7
 */

describe("2-D array interpretation", () => {
  it("TS: min path sum on 3x3 grid returns 7", () => {
    const code = `let grid = [[1, 3, 1], [1, 5, 1], [4, 2, 1]];
let rows = 3;
let cols = 3;
let i = 0;
while (i < rows) {
  let j = 0;
  while (j < cols) {
    if (i === 0 && j > 0) {
      grid[i][j] = grid[i][j] + grid[i][j - 1];
    }
    if (j === 0 && i > 0) {
      grid[i][j] = grid[i][j] + grid[i - 1][j];
    }
    if (i > 0 && j > 0) {
      grid[i][j] = grid[i][j] + Math.min(grid[i - 1][j], grid[i][j - 1]);
    }
    j = j + 1;
  }
  i = i + 1;
}
let result = grid[rows - 1][cols - 1];`;
    const s = interpret(code, "typescript");
    const withResult = s.filter((x) => x.vars["result"] !== undefined);
    expect(last(withResult)?.vars["result"]).toBe(7);
  });

  it("Python: min path sum on 3x3 grid returns 7", () => {
    const code = `grid = [[1, 3, 1], [1, 5, 1], [4, 2, 1]]
rows = 3
cols = 3
i = 0
while i < rows:
    j = 0
    while j < cols:
        if i == 0 and j > 0:
            grid[i][j] = grid[i][j] + grid[i][j - 1]
        if j == 0 and i > 0:
            grid[i][j] = grid[i][j] + grid[i - 1][j]
        if i > 0 and j > 0:
            grid[i][j] = grid[i][j] + min(grid[i - 1][j], grid[i][j - 1])
        j = j + 1
    i = i + 1
result = grid[rows - 1][cols - 1]`;
    const s = interpret(code, "python");
    const withResult = s.filter((x) => x.vars["result"] !== undefined);
    expect(last(withResult)?.vars["result"]).toBe(7);
  });

  it("Kotlin: min path sum on 3x3 grid returns 7", () => {
    const code = `val grid = mutableListOf(mutableListOf(1, 3, 1), mutableListOf(1, 5, 1), mutableListOf(4, 2, 1))
val rows = 3
val cols = 3
var i = 0
while (i < rows) {
  var j = 0
  while (j < cols) {
    if (i === 0 && j > 0) {
      grid[i][j] = grid[i][j] + grid[i][j - 1]
    }
    if (j === 0 && i > 0) {
      grid[i][j] = grid[i][j] + grid[i - 1][j]
    }
    if (i > 0 && j > 0) {
      grid[i][j] = grid[i][j] + minOf(grid[i - 1][j], grid[i][j - 1])
    }
    j = j + 1
  }
  i = i + 1
}
val result = grid[rows - 1][cols - 1]`;
    const s = interpret(code, "kotlin");
    const withResult = s.filter((x) => x.vars["result"] !== undefined);
    expect(last(withResult)?.vars["result"]).toBe(7);
  });

  it("TS: 2-D array round-trips through snapshots (deep copies preserve history)", () => {
    const code = `let m = [[1, 2], [3, 4]];
m[0][0] = 9;
let result = m[0][0];`;
    const s = interpret(code, "typescript");
    const finalGrid = last(s)?.arrays["m"];
    // Final state should reflect mutation
    expect(finalGrid).toEqual([[9, 2], [3, 4]]);
    // Earlier snapshots (before mutation) should still hold the original value
    // (i.e. deep clone worked — not shared refs)
    const preMutation = s.find((x) => x.line === 0 && x.arrays["m"]);
    expect(preMutation?.arrays["m"]).toEqual([[1, 2], [3, 4]]);
  });

  it("TS: grid[i][j] read propagates through arithmetic", () => {
    const code = `let g = [[10, 20], [30, 40]];
let sum = g[0][0] + g[1][1];
let result = sum;`;
    const s = interpret(code, "typescript");
    const withResult = s.filter((x) => x.vars["result"] !== undefined);
    expect(last(withResult)?.vars["result"]).toBe(50);
  });

  it("Kotlin: nested listOf parses correctly", () => {
    const code = `val g = listOf(listOf(1, 2), listOf(3, 4))
val result = g[1][0]`;
    const s = interpret(code, "kotlin");
    const withResult = s.filter((x) => x.vars["result"] !== undefined);
    expect(last(withResult)?.vars["result"]).toBe(3);
  });
});
