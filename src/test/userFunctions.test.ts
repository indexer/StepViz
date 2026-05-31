import { describe, it, expect } from "vitest";
import { interpret } from "../engine/interpreter";

function lastResult(snaps: ReturnType<typeof interpret>): unknown {
  for (let i = snaps.length - 1; i >= 0; i--) {
    if (snaps[i].vars["result"] !== undefined) return snaps[i].vars["result"];
  }
  return undefined;
}

describe("User-defined function calls", () => {
  it("TS: recursion — factorial(5) = 120", () => {
    const code = `function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
const result = factorial(5);`;
    const snaps = interpret(code, "typescript");
    expect(lastResult(snaps)).toBe(120);
  });

  it("TS: helper call — sum + double via separate function", () => {
    const code = `function double(x: number): number {
  return x * 2;
}
function compute(a: number, b: number): number {
  return double(a) + double(b);
}
const result = compute(3, 4);`;
    const snaps = interpret(code, "typescript");
    expect(lastResult(snaps)).toBe(14);
  });

  it("TS: snapshots inside a call carry a callStack", () => {
    const code = `function inner(x: number): number {
  return x + 1;
}
function outer(y: number): number {
  return inner(y) + inner(y);
}
const result = outer(10);`;
    const snaps = interpret(code, "typescript");
    expect(lastResult(snaps)).toBe(22);
    // At least one snapshot was emitted while inside `inner`, with `outer`
    // as the parent and `inner` as the top of stack.
    const innerSnap = snaps.find(
      (s) => s.callStack?.[s.callStack.length - 1]?.name === "inner"
    );
    expect(innerSnap).toBeDefined();
    expect(innerSnap!.callStack!.map((f) => f.name)).toContain("outer");
    // The top-level snapshots (before the call expression evaluates) have no callStack.
    expect(snaps[0].callStack).toBeUndefined();
  });

  it("Python: recursion — fib(7) = 13", () => {
    const code = `def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

result = fib(7)`;
    const snaps = interpret(code, "python");
    expect(lastResult(snaps)).toBe(13);
  });

  it("Python: helper call writes correct values into caller env", () => {
    const code = `def add(a, b):
    return a + b

def total(x, y, z):
    return add(x, y) + z

result = total(1, 2, 3)`;
    const snaps = interpret(code, "python");
    expect(lastResult(snaps)).toBe(6);
  });

  it("Kotlin: recursion — power(2, 10) = 1024", () => {
    const code = `fun power(base: Int, exp: Int): Int {
  if (exp == 0) return 1
  return base * power(base, exp - 1)
}
val result = power(2, 10)`;
    const snaps = interpret(code, "kotlin");
    expect(lastResult(snaps)).toBe(1024);
  });

  it("Unknown function name still surfaces 'Cannot evaluate'", () => {
    const code = `const x = doesNotExist(5);`;
    const snaps = interpret(code, "typescript");
    const errSnap = snaps.find((s) => /error|cannot evaluate/i.test(s.explanation));
    expect(errSnap).toBeDefined();
  });

  it("Single function with no top-level call → inlined with sample data", () => {
    const code = `function sumAll(arr: number[]): number {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total = total + arr[i];
  }
  return total;
}`;
    const snaps = interpret(code, "typescript");
    // arr seeded as SAMPLE_ARRAYS["arr"] = [64,34,25,12,22,11,90] → sum = 258
    expect(lastResult(snaps)).toBe(258);
  });
});
