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

describe("Python floor division `//`", () => {
  it("evaluates a // b rather than treating // as a comment", () => {
    expect(lastVar(interpret("a=17\nresult=a//3", "python"), "result")).toBe(5);
  });
  it("computes the binary-search midpoint correctly", () => {
    const code = "lo=0\nhi=4\nresult=(lo+hi)//2";
    expect(lastVar(interpret(code, "python"), "result")).toBe(2);
  });
  it("digit-extraction loop with n = n // 10 terminates with the right sum", () => {
    const code = "n=123\ns=0\nwhile n>0:\n    s+=n%10\n    n=n//10\nresult=s";
    expect(lastVar(interpret(code, "python"), "result")).toBe(6);
  });
});

describe("Python elif short-circuits", () => {
  it("runs only the first matching branch", () => {
    const code = `count=0
x=5
if x%2==0:
    count+=1
elif x%5==0:
    count+=1
elif x%3==0:
    count+=1
result=count`;
    expect(lastVar(interpret(code, "python"), "result")).toBe(1);
  });
  it("FizzBuzz-style if/elif/elif counting is correct", () => {
    const code = `count=0
for i in range(1, 16):
    if i%15==0:
        count+=1
    elif i%3==0:
        count+=1
    elif i%5==0:
        count+=1
result=count`;
    // multiples of 3 or 5 in 1..15: 3,5,6,9,10,12,15 = 7
    expect(lastVar(interpret(code, "python"), "result")).toBe(7);
  });
});

describe("Brace if / else if / else chains", () => {
  const chain = (x: number) => `const x=${x};
let result="none";
if(x===1){
  result="a";
}else if(x===2){
  result="b";
}else if(x===3){
  result="c";
}else{
  result="d";
}`;
  it("takes the first branch", () => {
    expect(lastVar(interpret(chain(1), "typescript"), "result")).toBe("a");
  });
  it("takes a middle branch and skips the rest", () => {
    expect(lastVar(interpret(chain(2), "typescript"), "result")).toBe("b");
    expect(lastVar(interpret(chain(3), "typescript"), "result")).toBe("c");
  });
  it("falls through to else when nothing matches", () => {
    expect(lastVar(interpret(chain(9), "typescript"), "result")).toBe("d");
  });
  it("iterative binary search with a 3-way else-if chain + break", () => {
    const code = `const nums=[1,3,5,7,9];
const t=5;
let lo=0;
let hi=nums.length-1;
let result=-1;
while(lo<=hi){
  const mid=Math.floor((lo+hi)/2);
  if(nums[mid]===t){
    result=mid;
    break;
  }else if(nums[mid]<t){
    lo=mid+1;
  }else{
    hi=mid-1;
  }
}`;
    expect(lastVar(interpret(code, "typescript"), "result")).toBe(2);
  });
});

describe("Augmented assignment to indexed targets", () => {
  it("TS: arr[i] += v mutates the cell", () => {
    const code = `const result=[0,0];\nresult[0]+=5;`;
    expect(lastVar(interpret(code, "typescript"), "result")).toBe("[5,0]");
  });
  it("Python: freq[c] += 1 builds a frequency map", () => {
    const code = `s=["a","b","a"]
freq={}
for i in range(len(s)):
    c=s[i]
    if c in freq:
        freq[c]+=1
    else:
        freq[c]=1
result=freq`;
    expect(lastSnap(interpret(code, "python")).maps["result"]).toEqual([
      ["a", 2],
      ["b", 1],
    ]);
  });
});
