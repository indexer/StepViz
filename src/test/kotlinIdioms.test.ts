import { describe, it, expect } from "vitest";
import { interpret } from "../engine/interpreter";
import { normalizeForInterpreter } from "../engine/normalizeForInterpreter";

function run(code: string) {
  return interpret(normalizeForInterpreter(code, "kotlin"), "kotlin");
}
function lastVar(snaps: ReturnType<typeof interpret>, name: string) {
  for (let i = snaps.length - 1; i >= 0; i--) {
    if (snaps[i].vars[name] !== undefined) return snaps[i].vars[name];
  }
  return undefined;
}

describe("Kotlin interpreter idioms", () => {
  it("interpolates string templates ($x and ${expr})", () => {
    const snaps = run(`val name = "x"
val result = "hello $name ${1 + 1}"`);
    expect(lastVar(snaps, "result")).toBe("hello x 2");
  });

  it("iterates a collection with for (x in listOf(...))", () => {
    const snaps = run(`var total = 0
for (x in listOf(10, 20, 30)) {
    total += x
}
val result = total`);
    expect(lastVar(snaps, "result")).toBe(60);
  });

  it("iterates an array variable with for (x in arr)", () => {
    const snaps = run(`val a = intArrayOf(1, 2, 3, 4)
var t = 0
for (x in a) {
    t += x
}
val result = t`);
    expect(lastVar(snaps, "result")).toBe(10);
  });

  it("supports downTo (descending range)", () => {
    const snaps = run(`var s = 0
for (i in 5 downTo 1) {
    s += i
}
val result = s`);
    expect(lastVar(snaps, "result")).toBe(15);
  });

  it("supports step on an ascending range", () => {
    const snaps = run(`var s = 0
for (i in 0 until 10 step 2) {
    s += i
}
val result = s`);
    expect(lastVar(snaps, "result")).toBe(20); // 0+2+4+6+8
  });

  describe("when expressions and statements", () => {
    it("expression form with subject", () => {
      const snaps = run(`val x = 2
val result = when (x) {
  1 -> "one"
  2 -> "two"
  else -> "other"
}`);
      expect(lastVar(snaps, "result")).toBe("two");
    });

    it("comma-separated and range conditions", () => {
      expect(
        lastVar(run(`val n = 3
val result = when (n) {
  1, 2 -> "low"
  3, 4 -> "mid"
  else -> "high"
}`), "result")
      ).toBe("mid");
      expect(
        lastVar(run(`val score = 85
val result = when (score) {
  in 90..100 -> "A"
  in 80..89 -> "B"
  else -> "C"
}`), "result")
      ).toBe("B");
    });

    it("subjectless boolean form", () => {
      const snaps = run(`val a = 7
val result = when {
  a < 0 -> "neg"
  a == 0 -> "zero"
  else -> "pos"
}`);
      expect(lastVar(snaps, "result")).toBe("pos");
    });

    it("statement form with multi-statement block branches", () => {
      const snaps = run(`var total = 0
val k = 2
when (k) {
  1 -> {
    total = 10
  }
  2 -> {
    total = 20
    total = total + 5
  }
  else -> {
    total = 0
  }
}
val result = total`);
      expect(lastVar(snaps, "result")).toBe(25);
    });

    it("when as a compound-assignment RHS (FizzBuzz count)", () => {
      const snaps = run(`var out = 0
for (i in 1..15) {
  out += when {
    i % 15 == 0 -> 100
    i % 3 == 0 -> 1
    i % 5 == 0 -> 1
    else -> 0
  }
}
val result = out`);
      expect(lastVar(snaps, "result")).toBe(106); // 100 + (3,6,9,12) + (5,10)
    });
  });

  it("reports a clear error for invalid [...] list literals", () => {
    const snaps = run(`val nums = [1, 2, 3]
val result = nums`);
    const err = snaps.find((s) => /Error:/.test(s.explanation));
    expect(err).toBeDefined();
    expect(err!.explanation).toMatch(/listOf|mutableListOf/);
  });
});
