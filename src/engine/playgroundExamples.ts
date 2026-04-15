/**
 * Built-in example snippets for the playground, one per language.
 * These are simple, self-contained scripts the interpreter can execute.
 */

export interface PlaygroundExample {
  key: string;
  label: string;
  code: Record<"typescript" | "python" | "kotlin", string>;
}

export const PLAYGROUND_EXAMPLES: PlaygroundExample[] = [
  {
    key: "fibonacci",
    label: "Fibonacci Sequence",
    code: {
      typescript: `// Fibonacci Sequence
let n = 8;
let a = 0;
let b = 1;
let i = 2;
while (i <= n) {
  let temp = a + b;
  a = b;
  b = temp;
  i = i + 1;
}
let result = b;`,
      python: `# Fibonacci Sequence
n = 8
a = 0
b = 1
i = 2
while i <= n:
    temp = a + b
    a = b
    b = temp
    i = i + 1
result = b`,
      kotlin: `// Fibonacci Sequence
val n = 8
var a = 0
var b = 1
var i = 2
while (i <= n) {
  val temp = a + b
  a = b
  b = temp
  i = i + 1
}
val result = b`,
    },
  },
  {
    key: "bubblesort",
    label: "Bubble Sort",
    code: {
      typescript: `// Bubble Sort
let arr = [64, 34, 25, 12, 22, 11, 90];
let n = arr.length;
let i = 0;
while (i < n - 1) {
  let j = 0;
  while (j < n - i - 1) {
    if (arr[j] > arr[j + 1]) {
      let temp = arr[j];
      arr[j] = arr[j + 1];
      arr[j + 1] = temp;
    }
    j = j + 1;
  }
  i = i + 1;
}`,
      python: `# Bubble Sort
arr = [64, 34, 25, 12, 22, 11, 90]
n = len(arr)
i = 0
while i < n - 1:
    j = 0
    while j < n - i - 1:
        if arr[j] > arr[j + 1]:
            temp = arr[j]
            arr[j] = arr[j + 1]
            arr[j + 1] = temp
        j = j + 1
    i = i + 1`,
      kotlin: `// Bubble Sort
var arr = mutableListOf(64, 34, 25, 12, 22, 11, 90)
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
}`,
    },
  },
  {
    key: "bsearch",
    label: "Binary Search",
    code: {
      typescript: `// Binary Search
let arr = [1, 3, 5, 7, 9, 11, 13, 15];
let target = 7;
let low = 0;
let high = arr.length - 1;
let found = -1;
while (low <= high) {
  let mid = Math.floor((low + high) / 2);
  if (arr[mid] === target) {
    found = mid;
    low = high + 1;
  }
  if (arr[mid] < target) {
    low = mid + 1;
  }
  if (arr[mid] > target) {
    high = mid - 1;
  }
}
let result = found;`,
      python: `# Binary Search
arr = [1, 3, 5, 7, 9, 11, 13, 15]
target = 7
low = 0
high = len(arr) - 1
found = -1
while low <= high:
    mid = (low + high) // 2
    if arr[mid] == target:
        found = mid
        low = high + 1
    if arr[mid] < target:
        low = mid + 1
    if arr[mid] > target:
        high = mid - 1
result = found`,
      kotlin: `// Binary Search
val arr = listOf(1, 3, 5, 7, 9, 11, 13, 15)
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
val result = found`,
    },
  },
  {
    key: "twosum",
    label: "Two Sum (Brute Force)",
    code: {
      typescript: `// Two Sum - find indices that add to target
let nums = [2, 7, 11, 15];
let target = 9;
let i = 0;
let found = -1;
while (i < nums.length) {
  let j = i + 1;
  while (j < nums.length) {
    let sum = nums[i] + nums[j];
    if (sum === target) {
      found = 1;
    }
    j = j + 1;
  }
  i = i + 1;
}
let result = found;`,
      python: `# Two Sum - find indices that add to target
nums = [2, 7, 11, 15]
target = 9
i = 0
found = -1
while i < len(nums):
    j = i + 1
    while j < len(nums):
        total = nums[i] + nums[j]
        if total == target:
            found = 1
        j = j + 1
    i = i + 1
result = found`,
      kotlin: `// Two Sum - find indices that add to target
val nums = listOf(2, 7, 11, 15)
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
val result = found`,
    },
  },
  {
    key: "maxsubarray",
    label: "Max Subarray (Kadane's)",
    code: {
      typescript: `// Maximum Subarray (Kadane's Algorithm)
let nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
let maxCurrent = nums[0];
let maxGlobal = nums[0];
let i = 1;
while (i < nums.length) {
  if (nums[i] > maxCurrent + nums[i]) {
    maxCurrent = nums[i];
  } else {
    maxCurrent = maxCurrent + nums[i];
  }
  if (maxCurrent > maxGlobal) {
    maxGlobal = maxCurrent;
  }
  i = i + 1;
}
let result = maxGlobal;`,
      python: `# Maximum Subarray (Kadane's Algorithm)
nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
maxCurrent = nums[0]
maxGlobal = nums[0]
i = 1
while i < len(nums):
    if nums[i] > maxCurrent + nums[i]:
        maxCurrent = nums[i]
    else:
        maxCurrent = maxCurrent + nums[i]
    if maxCurrent > maxGlobal:
        maxGlobal = maxCurrent
    i = i + 1
result = maxGlobal`,
      kotlin: `// Maximum Subarray (Kadane's Algorithm)
val nums = listOf(-2, 1, -3, 4, -1, 2, 1, -5, 4)
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
val result = maxGlobal`,
    },
  },
  {
    key: "stairs",
    label: "Min Cost Climbing Stairs",
    code: {
      typescript: `// Min Cost Climbing Stairs
let cost = [10, 15, 20, 25, 30];
let twoStepsBefore = cost[0];
let oneStepBefore = cost[1];
let i = 2;
while (i < cost.length) {
  let current = cost[i] + Math.min(oneStepBefore, twoStepsBefore);
  twoStepsBefore = oneStepBefore;
  oneStepBefore = current;
  i = i + 1;
}
let result = Math.min(oneStepBefore, twoStepsBefore);`,
      python: `# Min Cost Climbing Stairs
cost = [10, 15, 20, 25, 30]
twoStepsBefore = cost[0]
oneStepBefore = cost[1]
i = 2
while i < len(cost):
    current = cost[i] + min(oneStepBefore, twoStepsBefore)
    twoStepsBefore = oneStepBefore
    oneStepBefore = current
    i = i + 1
result = min(oneStepBefore, twoStepsBefore)`,
      kotlin: `// Min Cost Climbing Stairs
val cost = listOf(10, 15, 20, 25, 30)
var twoStepsBefore = cost[0]
var oneStepBefore = cost[1]
var i = 2
while (i < cost.size) {
  val current = cost[i] + minOf(oneStepBefore, twoStepsBefore)
  twoStepsBefore = oneStepBefore
  oneStepBefore = current
  i = i + 1
}
val result = minOf(oneStepBefore, twoStepsBefore)`,
    },
  },
];
