import { describe, it, expect } from "vitest";
import { interpret } from "../engine/interpreter";

function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

describe("Kotlin interpretation", () => {
  it("fibonacci (n=8) returns b=21", () => {
    const code = `val n = 8
var a = 0
var b = 1
var i = 2
while (i <= n) {
  val temp = a + b
  a = b
  b = temp
  i = i + 1
}
val result = b`;
    const s = interpret(code, "kotlin");
    // find the snapshot where result was set
    const withResult = s.filter((x) => x.vars["result"] !== undefined);
    expect(withResult.length).toBeGreaterThan(0);
    expect(withResult[withResult.length - 1].vars["result"]).toBe(21);
  });

  it("binary search finds target=7 at index 3", () => {
    const code = `val arr = listOf(1, 3, 5, 7, 9, 11, 13, 15)
val target = 7
var low = 0
var high = arr.size - 1
var found = -1
while (low <= high) {
  val mid = (low + high) / 2
  if (arr[mid] === target) {
    found = mid
    low = high + 1
  }
  if (arr[mid] < target) {
    low = mid + 1
  }
  if (arr[mid] > target) {
    high = mid - 1
  }
}
val result = found`;
    const s = interpret(code, "kotlin");
    const withResult = s.filter((x) => x.vars["result"] !== undefined);
    expect(last(withResult)?.vars["result"]).toBe(3);
  });

  it("bubble sort sorts [64,34,25,12,22,11,90]", () => {
    const code = `var arr = mutableListOf(64, 34, 25, 12, 22, 11, 90)
val n = arr.size
var i = 0
while (i < n - 1) {
  var j = 0
  while (j < n - i - 1) {
    if (arr[j] > arr[j + 1]) {
      val temp = arr[j]
      arr[j] = arr[j + 1]
      arr[j + 1] = temp
    }
    j = j + 1
  }
  i = i + 1
}`;
    const s = interpret(code, "kotlin");
    const finalArr = last(s)?.arrays["arr"];
    expect(finalArr).toEqual([11, 12, 22, 25, 34, 64, 90]);
  });

  it("two sum finds match (sets found=1)", () => {
    const code = `val nums = listOf(2, 7, 11, 15)
val target = 9
var i = 0
var found = -1
while (i < nums.size) {
  var j = i + 1
  while (j < nums.size) {
    val sum = nums[i] + nums[j]
    if (sum === target) {
      found = 1
    }
    j = j + 1
  }
  i = i + 1
}
val result = found`;
    const s = interpret(code, "kotlin");
    expect(last(s.filter((x) => x.vars["result"] !== undefined))?.vars["result"]).toBe(1);
  });

  it("max subarray (Kadane) on [-2,1,-3,4,-1,2,1,-5,4] returns 6", () => {
    const code = `val nums = listOf(-2, 1, -3, 4, -1, 2, 1, -5, 4)
var maxCurrent = nums[0]
var maxGlobal = nums[0]
var i = 1
while (i < nums.size) {
  if (nums[i] > maxCurrent + nums[i]) {
    maxCurrent = nums[i]
  } else {
    maxCurrent = maxCurrent + nums[i]
  }
  if (maxCurrent > maxGlobal) {
    maxGlobal = maxCurrent
  }
  i = i + 1
}
val result = maxGlobal`;
    const s = interpret(code, "kotlin");
    expect(last(s.filter((x) => x.vars["result"] !== undefined))?.vars["result"]).toBe(6);
  });

  it("min cost climbing stairs [10,15,20,25,30] returns 40", () => {
    // dp over costs-to-reach: dp[i] = cost[i] + min(dp[i-1], dp[i-2])
    // Final = min(dp[n-1], dp[n-2]).
    // For [10,15,20,25,30]: dp=[10,15,30,40,60] → min(60,40)=40.
    const code = `val cost = listOf(10, 15, 20, 25, 30)
var twoStepsBefore = cost[0]
var oneStepBefore = cost[1]
var i = 2
while (i < cost.size) {
  val current = cost[i] + minOf(oneStepBefore, twoStepsBefore)
  twoStepsBefore = oneStepBefore
  oneStepBefore = current
  i = i + 1
}
val result = minOf(oneStepBefore, twoStepsBefore)`;
    const s = interpret(code, "kotlin");
    expect(last(s.filter((x) => x.vars["result"] !== undefined))?.vars["result"]).toBe(40);
  });
});
