import type { Algorithm } from "../types/algorithm";

export const dpAlgorithms: Algorithm[] = [
  {
    id: "DP_001",
    name: "Fibonacci (Memoization)",
    category: "Dynamic Programming",
    difficulty: "Beginner",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    description: "Calculates Fibonacci numbers using memoization to avoid redundant calculations.",
    longDescription: "The Fibonacci sequence with memoization demonstrates the core principle of dynamic programming: storing previously computed results to avoid redundant work. Instead of the exponential time complexity of naive recursion, memoization reduces it to linear time. This approach stores each computed Fibonacci number in a cache, ensuring each value is calculated only once. It's an excellent introduction to DP concepts and showcases how caching can dramatically improve performance.",
    icon: "function",
    complexityScore: 0.2,
    tags: ["recursion", "memoization", "sequences", "optimization", "cache"],
    leetcodeProblems: [
      "Fibonacci Number",
      "N-th Tribonacci Number",
      "Climbing Stairs"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function fibonacci(n: number, memo: Map<number, number> = new Map()): number {
  // Base cases
  if (n <= 1) return n;

  // Check if already computed
  if (memo.has(n)) {
    return memo.get(n)!;
  }

  // Compute and store result
  const result = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  memo.set(n, result);

  return result;
}

// Iterative approach with O(1) space
function fibonacciIterative(n: number): number {
  if (n <= 1) return n;

  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }

  return curr;
}`,
        steps: [
          {
            lines: [1],
            title: "Function signature with memoization",
            description: "Initialize the fibonacci function with a Map for memoization. The memo parameter defaults to an empty Map to cache previously computed results."
          },
          {
            lines: [2, 3],
            title: "Base case check",
            description: "Handle the base cases where n is 0 or 1. These are the starting points of the Fibonacci sequence and require no recursion."
          },
          {
            lines: [5, 6, 7, 8],
            title: "Check memoization cache",
            description: "Before computing, check if the result for n already exists in the memo cache. If found, return the cached value immediately to avoid redundant calculations."
          },
          {
            lines: [10, 11],
            title: "Recursive computation",
            description: "Compute fibonacci(n) by recursively calculating fibonacci(n-1) and fibonacci(n-2). Both recursive calls share the same memo cache, preventing duplicate work."
          },
          {
            lines: [12],
            title: "Store result in cache",
            description: "Save the computed result in the memo Map with n as the key. This ensures future calls for the same n will hit the cache instead of recomputing."
          },
          {
            lines: [14],
            title: "Return computed result",
            description: "Return the calculated Fibonacci number. Each unique value is computed exactly once and cached, achieving O(n) time complexity."
          }
        ]
      },
      {
        language: "python",
        code: `def fibonacci(n: int, memo: dict = None) -> int:
    """Calculate nth Fibonacci number using memoization."""
    if memo is None:
        memo = {}

    # Base cases
    if n <= 1:
        return n

    # Check if already computed
    if n in memo:
        return memo[n]

    # Compute and store result
    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo)
    return memo[n]

def fibonacci_iterative(n: int) -> int:
    """Iterative approach with O(1) space."""
    if n <= 1:
        return n

    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr

    return curr`,
        steps: [
          {
            lines: [1, 2, 3, 4],
            title: "Function signature with memoization",
            description: "Initialize the fibonacci function with a dictionary for memoization. If memo is None, create an empty dict to cache previously computed results. This default parameter handling is Python-specific.",
            variables: { "n": "5", "memo": "{}" }
          },
          {
            lines: [6, 7, 8],
            title: "Base case check",
            description: "Handle the base cases where n is 0 or 1. These are the starting points of the Fibonacci sequence and require no recursion. Return n directly.",
            variables: { "n": "1", "result": "1" }
          },
          {
            lines: [10, 11, 12],
            title: "Check memoization cache",
            description: "Before computing, check if the result for n already exists in the memo dictionary. If found, return the cached value immediately to avoid redundant calculations.",
            variables: { "n": "5", "memo": "{3: 2, 4: 3}" }
          },
          {
            lines: [14, 15],
            title: "Recursive computation and caching",
            description: "Compute fibonacci(n) by recursively calculating fibonacci(n-1) and fibonacci(n-2). Store the result directly in memo[n]. Both recursive calls share the same memo cache, preventing duplicate work.",
            variables: { "n": "5", "memo[5]": "5" }
          },
          {
            lines: [16],
            title: "Return computed result",
            description: "Return the calculated and cached Fibonacci number. Each unique value is computed exactly once, achieving O(n) time complexity.",
            variables: { "result": "5" }
          }
        ]
      }
    ],
    keyInsights: [
      "Memoization transforms exponential O(2^n) time to linear O(n) time",
      "Each subproblem (fibonacci number) is computed exactly once",
      "Space-optimized version only needs two variables instead of full array",
      "Bottom-up iteration can be more efficient than top-down recursion"
    ],
    whenToUse: [
      "When solving problems with overlapping subproblems and optimal substructure",
      "As an introduction to dynamic programming concepts",
      "When recursive solutions are too slow due to repeated calculations"
    ]
  },
  {
    id: "DP_002",
    name: "Longest Common Subsequence",
    category: "Dynamic Programming",
    difficulty: "Medium",
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(m*n)",
    description: "Finds the longest subsequence common to two sequences without requiring consecutive elements.",
    longDescription: "The Longest Common Subsequence (LCS) problem finds the longest sequence that appears in the same order in two given sequences, though not necessarily consecutively. This classic DP problem uses a 2D table where dp[i][j] represents the LCS length of the first i characters of string1 and first j characters of string2. The algorithm builds up the solution by comparing characters and either extending the LCS or taking the maximum from previous states. LCS is fundamental in diff algorithms, bioinformatics for DNA sequence comparison, and version control systems.",
    icon: "compare_arrows",
    complexityScore: 0.6,
    tags: ["strings", "sequences", "2d-dp", "optimization", "comparison"],
    leetcodeProblems: [
      "Longest Common Subsequence",
      "Uncrossed Lines",
      "Delete Operation for Two Strings"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length;
  const n = text2.length;

  // Create DP table
  const dp: number[][] = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0));

  // Fill the table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        // Characters match: extend previous LCS
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        // Take maximum from excluding one character
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}`,
        steps: [
          {
            lines: [1, 2, 3],
            title: "Initialize dimensions",
            description: "Extract the lengths of both input strings. These will determine the size of our DP table."
          },
          {
            lines: [5, 6, 7, 8],
            title: "Create DP table",
            description: "Create a 2D array of size (m+1) x (n+1) initialized with zeros. The extra row and column handle empty string base cases. dp[i][j] will store the LCS length for the first i characters of text1 and first j characters of text2."
          },
          {
            lines: [10, 11, 12],
            title: "Iterate through both strings",
            description: "Use nested loops to fill the DP table. Start from index 1 since row 0 and column 0 represent empty strings (base cases already initialized to 0)."
          },
          {
            lines: [13, 14, 15],
            title: "Characters match - extend LCS",
            description: "When characters at positions i-1 and j-1 match, extend the LCS by taking the diagonal value dp[i-1][j-1] and adding 1. This represents including this matching character in the subsequence."
          },
          {
            lines: [16, 17, 18],
            title: "Characters differ - take maximum",
            description: "When characters don't match, take the maximum of excluding either the current character from text1 (dp[i-1][j]) or from text2 (dp[i][j-1]). This ensures we keep the longest subsequence found so far."
          },
          {
            lines: [23],
            title: "Return final result",
            description: "The bottom-right cell dp[m][n] contains the length of the LCS for the complete strings. This is built up from all the smaller subproblems."
          }
        ]
      },
      {
        language: "python",
        code: `def longest_common_subsequence(text1: str, text2: str) -> int:
    """Find length of longest common subsequence."""
    m, n = len(text1), len(text2)

    # Create DP table
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Fill the table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                # Characters match: extend previous LCS
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                # Take maximum from excluding one character
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    return dp[m][n]

# Space-optimized version using O(n) space
def lcs_optimized(text1: str, text2: str) -> int:
    """Space-optimized LCS using rolling array."""
    if len(text1) < len(text2):
        text1, text2 = text2, text1

    prev = [0] * (len(text2) + 1)

    for char1 in text1:
        curr = [0] * (len(text2) + 1)
        for j, char2 in enumerate(text2, 1):
            curr[j] = prev[j - 1] + 1 if char1 == char2 else max(curr[j - 1], prev[j])
        prev = curr

    return prev[-1]`,
        steps: [
          {
            lines: [1, 2, 3],
            title: "Initialize dimensions",
            description: "Extract the lengths of both input strings. These will determine the size of our DP table, which will be (m+1) x (n+1) to handle empty string base cases.",
            variables: { "m": "4", "n": "4", "text1": "abcd", "text2": "abef" }
          },
          {
            lines: [5, 6],
            title: "Create DP table",
            description: "Create a 2D list of size (m+1) x (n+1) initialized with zeros using list comprehension. dp[i][j] will store the LCS length for the first i characters of text1 and first j characters of text2.",
            variables: { "dp": "[[0,0,0,0,0], ...]" }
          },
          {
            lines: [8, 9, 10],
            title: "Iterate through both strings",
            description: "Use nested loops to fill the DP table. Start from index 1 since row 0 and column 0 represent empty strings (base cases already initialized to 0).",
            variables: { "i": "1", "j": "1" }
          },
          {
            lines: [11, 12, 13],
            title: "Characters match - extend LCS",
            description: "When characters at positions i-1 and j-1 match, extend the LCS by taking the diagonal value dp[i-1][j-1] and adding 1. This represents including this matching character in the subsequence.",
            variables: { "text1[i-1]": "a", "text2[j-1]": "a", "dp[i][j]": "1" }
          },
          {
            lines: [14, 15, 16],
            title: "Characters differ - take maximum",
            description: "When characters don't match, take the maximum of excluding either the current character from text1 (dp[i-1][j]) or from text2 (dp[i][j-1]). This ensures we keep the longest subsequence found so far.",
            variables: { "dp[i-1][j]": "2", "dp[i][j-1]": "1", "dp[i][j]": "2" }
          },
          {
            lines: [18],
            title: "Return final result",
            description: "The bottom-right cell dp[m][n] contains the length of the LCS for the complete strings. This is built up from all the smaller subproblems.",
            variables: { "result": "2" }
          }
        ]
      }
    ],
    keyInsights: [
      "Uses 2D DP table where dp[i][j] represents LCS of first i and j characters",
      "When characters match, extend diagonal value; otherwise take max of top or left",
      "Can be optimized to O(min(m,n)) space using rolling arrays",
      "The actual subsequence can be reconstructed by backtracking through the table"
    ],
    whenToUse: [
      "Finding similarity between two sequences (strings, arrays, DNA)",
      "Implementing diff algorithms for version control",
      "Solving edit distance variations and string alignment problems"
    ]
  },
  {
    id: "DP_003",
    name: "Longest Increasing Subsequence",
    category: "Dynamic Programming",
    difficulty: "Medium",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    description: "Finds the length of the longest strictly increasing subsequence in an array.",
    longDescription: "The Longest Increasing Subsequence (LIS) problem seeks the longest subsequence of an array where elements are in strictly increasing order. While the classic DP solution runs in O(n²) time, an optimized approach using binary search and patience sorting achieves O(n log n). The algorithm maintains an array representing the smallest tail element for all increasing subsequences of each length. This technique is applicable to various scheduling, stock market analysis, and optimization problems.",
    icon: "trending_up",
    complexityScore: 0.6,
    tags: ["sequences", "binary-search", "optimization", "greedy", "patience-sorting"],
    leetcodeProblems: [
      "Longest Increasing Subsequence",
      "Number of Longest Increasing Subsequence",
      "Russian Doll Envelopes"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function lengthOfLIS(nums: number[]): number {
  const tails: number[] = [];

  for (const num of nums) {
    // Binary search for position
    let left = 0;
    let right = tails.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] < num) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    // Replace or append
    if (left === tails.length) {
      tails.push(num);
    } else {
      tails[left] = num;
    }
  }

  return tails.length;
}`,
        steps: [
          {
            lines: [1, 2],
            title: "Initialize tails array",
            description: "Create an empty array 'tails' where tails[i] stores the smallest tail element of all increasing subsequences of length i+1. This enables the O(n log n) optimization."
          },
          {
            lines: [4],
            title: "Process each number",
            description: "Iterate through each number in the input array. For each number, we'll either extend the longest subsequence or update a smaller subsequence to have a better (smaller) tail."
          },
          {
            lines: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
            title: "Binary search for insertion position",
            description: "Use binary search to find the leftmost position where num can be placed in the tails array. This finds the length of the longest subsequence that num can extend, or the position where it can improve a shorter subsequence."
          },
          {
            lines: [18, 19, 20],
            title: "Extend longest subsequence",
            description: "If left equals tails.length, num is larger than all existing tails, so it extends the longest increasing subsequence. Append it to create a new longer subsequence."
          },
          {
            lines: [21, 22],
            title: "Update subsequence tail",
            description: "Otherwise, replace tails[left] with num. This maintains a subsequence of the same length but with a smaller tail, making it easier to extend in future iterations."
          },
          {
            lines: [26],
            title: "Return LIS length",
            description: "The length of the tails array equals the length of the longest increasing subsequence. Each index represents a possible subsequence length with the optimal (smallest) tail."
          }
        ]
      },
      {
        language: "python",
        code: `from bisect import bisect_left

def length_of_lis(nums: list[int]) -> int:
    """Find length of longest increasing subsequence using binary search."""
    tails = []

    for num in nums:
        # Binary search for insertion position
        pos = bisect_left(tails, num)

        # Replace or append
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num

    return len(tails)

# Classic DP approach - O(n^2)
def length_of_lis_dp(nums: list[int]) -> int:
    """Classic DP solution with O(n^2) time complexity."""
    if not nums:
        return 0

    n = len(nums)
    dp = [1] * n

    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)

    return max(dp)`,
        steps: [
          {
            lines: [1, 2, 3, 4, 5],
            title: "Initialize tails array",
            description: "Import bisect_left for binary search. Create an empty list 'tails' where tails[i] stores the smallest tail element of all increasing subsequences of length i+1. This enables the O(n log n) optimization.",
            variables: { "tails": "[]", "nums": "[10,9,2,5,3,7,101,18]" }
          },
          {
            lines: [7, 8, 9],
            title: "Process each number with binary search",
            description: "Iterate through each number in the input array. Use Python's bisect_left to find the leftmost position where num can be placed in the tails array, maintaining sorted order.",
            variables: { "num": "5", "tails": "[2,3]", "pos": "1" }
          },
          {
            lines: [11, 12, 13],
            title: "Extend longest subsequence",
            description: "If pos equals len(tails), num is larger than all existing tails, so it extends the longest increasing subsequence. Append it to create a new longer subsequence.",
            variables: { "num": "7", "tails": "[2,3,5]", "pos": "3" }
          },
          {
            lines: [14, 15],
            title: "Update subsequence tail",
            description: "Otherwise, replace tails[pos] with num. This maintains a subsequence of the same length but with a smaller tail, making it easier to extend in future iterations.",
            variables: { "num": "3", "pos": "1", "tails[1]": "3" }
          },
          {
            lines: [17],
            title: "Return LIS length",
            description: "The length of the tails array equals the length of the longest increasing subsequence. Each index represents a possible subsequence length with the optimal (smallest) tail.",
            variables: { "result": "4" }
          }
        ]
      }
    ],
    keyInsights: [
      "Binary search optimization reduces time from O(n²) to O(n log n)",
      "Maintains array of smallest tail elements for each subsequence length",
      "Each element either extends longest subsequence or improves a shorter one",
      "Patience sorting algorithm provides intuitive understanding of the approach"
    ],
    whenToUse: [
      "Finding trends in time series data or stock prices",
      "Scheduling problems with precedence constraints",
      "Box stacking and envelope nesting problems"
    ]
  },
  {
    id: "DP_004",
    name: "0/1 Knapsack",
    category: "Dynamic Programming",
    difficulty: "Medium",
    timeComplexity: "O(n*W)",
    spaceComplexity: "O(n*W)",
    description: "Maximizes value by selecting items with given weights and values, each item taken at most once.",
    longDescription: "The 0/1 Knapsack problem is a fundamental optimization problem where you must select items to maximize total value while staying within a weight capacity. Each item can be either included or excluded (hence '0/1'). The DP solution builds a table where dp[i][w] represents the maximum value achievable using the first i items with weight limit w. This problem is NP-complete but pseudo-polynomial in the weight capacity, making DP practical for reasonable capacities. It has applications in resource allocation, portfolio optimization, and cargo loading.",
    icon: "backpack",
    complexityScore: 0.65,
    tags: ["optimization", "subset-selection", "2d-dp", "combinatorial", "resource-allocation"],
    leetcodeProblems: [
      "Partition Equal Subset Sum",
      "Target Sum",
      "Ones and Zeroes"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function knapsack(weights: number[], values: number[], capacity: number): number {
  const n = weights.length;
  const dp: number[][] = Array(n + 1)
    .fill(0)
    .map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      // Don't take item i
      dp[i][w] = dp[i - 1][w];

      // Take item i if it fits
      if (weights[i - 1] <= w) {
        const takeValue = values[i - 1] + dp[i - 1][w - weights[i - 1]];
        dp[i][w] = Math.max(dp[i][w], takeValue);
      }
    }
  }

  return dp[n][capacity];
}

// Space-optimized version
function knapsackOptimized(weights: number[], values: number[], capacity: number): number {
  const dp: number[] = Array(capacity + 1).fill(0);

  for (let i = 0; i < weights.length; i++) {
    // Iterate backwards to avoid using updated values
    for (let w = capacity; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]]);
    }
  }

  return dp[capacity];
}`,
        steps: [
          {
            lines: [1, 2, 3, 4, 5],
            title: "Initialize DP table",
            description: "Create a 2D table of size (n+1) x (capacity+1) filled with zeros. dp[i][w] represents the maximum value achievable using the first i items with weight capacity w. The extra row handles the base case of no items."
          },
          {
            lines: [7, 8],
            title: "Iterate through items and capacities",
            description: "Use nested loops to consider each item (i) and each possible weight capacity (w). Build up the solution by making decisions for each item at each capacity."
          },
          {
            lines: [9, 10],
            title: "Option 1: Don't take current item",
            description: "First, set dp[i][w] to dp[i-1][w], which represents not taking item i. This is the value we can achieve with the same capacity using only the first i-1 items."
          },
          {
            lines: [12, 13, 14, 15, 16],
            title: "Option 2: Take current item if it fits",
            description: "If the current item's weight fits in capacity w, calculate the value of taking it: add its value to the best value achievable with remaining capacity (w - weights[i-1]) using previous items. Take the maximum of both options."
          },
          {
            lines: [20],
            title: "Return optimal solution",
            description: "dp[n][capacity] contains the maximum value achievable using all n items with the given capacity. This is built up from optimal solutions to all smaller subproblems."
          }
        ]
      },
      {
        language: "python",
        code: `def knapsack(weights: list[int], values: list[int], capacity: int) -> int:
    """Solve 0/1 knapsack problem using dynamic programming."""
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(capacity + 1):
            # Don't take item i
            dp[i][w] = dp[i - 1][w]

            # Take item i if it fits
            if weights[i - 1] <= w:
                take_value = values[i - 1] + dp[i - 1][w - weights[i - 1]]
                dp[i][w] = max(dp[i][w], take_value)

    return dp[n][capacity]

def knapsack_optimized(weights: list[int], values: list[int], capacity: int) -> int:
    """Space-optimized version using 1D array."""
    dp = [0] * (capacity + 1)

    for i in range(len(weights)):
        # Iterate backwards to avoid using updated values
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], values[i] + dp[w - weights[i]])

    return dp[capacity]`,
        steps: [
          {
            lines: [1, 2, 3, 4],
            title: "Initialize DP table",
            description: "Create a 2D list of size (n+1) x (capacity+1) filled with zeros using list comprehension. dp[i][w] represents the maximum value achievable using the first i items with weight capacity w.",
            variables: { "n": "3", "capacity": "10", "dp": "[[0,0,...], ...]" }
          },
          {
            lines: [6, 7],
            title: "Iterate through items and capacities",
            description: "Use nested loops to consider each item (i) and each possible weight capacity (w). Build up the solution by making decisions for each item at each capacity.",
            variables: { "i": "1", "w": "5" }
          },
          {
            lines: [8, 9],
            title: "Option 1: Don't take current item",
            description: "First, set dp[i][w] to dp[i-1][w], which represents not taking item i. This is the value we can achieve with the same capacity using only the first i-1 items.",
            variables: { "dp[i][w]": "10", "dp[i-1][w]": "10" }
          },
          {
            lines: [11, 12, 13, 14],
            title: "Option 2: Take current item if it fits",
            description: "If the current item's weight fits in capacity w, calculate the value of taking it: add its value to the best value achievable with remaining capacity. Take the maximum of both options.",
            variables: { "weights[i-1]": "3", "values[i-1]": "5", "take_value": "15" }
          },
          {
            lines: [16],
            title: "Return optimal solution",
            description: "dp[n][capacity] contains the maximum value achievable using all n items with the given capacity. This is built up from optimal solutions to all smaller subproblems.",
            variables: { "result": "22" }
          }
        ]
      }
    ],
    keyInsights: [
      "Each item has binary choice: include or exclude from knapsack",
      "State dp[i][w] represents max value using first i items with capacity w",
      "Can be optimized to O(W) space by processing items in reverse order",
      "Pseudo-polynomial time complexity depends on weight capacity, not truly polynomial"
    ],
    whenToUse: [
      "Resource allocation problems with capacity constraints",
      "Portfolio optimization with budget limits",
      "Cargo loading and cutting stock problems"
    ]
  },
  {
    id: "DP_005",
    name: "Coin Change",
    category: "Dynamic Programming",
    difficulty: "Medium",
    timeComplexity: "O(n*S)",
    spaceComplexity: "O(S)",
    description: "Finds the minimum number of coins needed to make a given amount using unlimited coins of given denominations.",
    longDescription: "The Coin Change problem is a classic unbounded knapsack variant where you need to find the minimum number of coins from given denominations to make a target amount. Unlike 0/1 knapsack, each coin type can be used unlimited times. The DP approach builds up solutions for all amounts from 0 to the target, where dp[i] represents the minimum coins needed for amount i. This problem demonstrates bottom-up dynamic programming and has practical applications in making change, currency systems, and resource allocation problems.",
    icon: "payments",
    complexityScore: 0.55,
    tags: ["unbounded-knapsack", "optimization", "greedy-fails", "currency", "combinatorial"],
    leetcodeProblems: [
      "Coin Change",
      "Coin Change 2",
      "Minimum Cost For Tickets"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function coinChange(coins: number[], amount: number): number {
  // Initialize dp array with amount + 1 (impossible value)
  const dp: number[] = Array(amount + 1).fill(amount + 1);
  dp[0] = 0; // Base case: 0 coins needed for amount 0

  // Build up solutions for all amounts
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        // Try using this coin
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  // If dp[amount] unchanged, amount cannot be made
  return dp[amount] > amount ? -1 : dp[amount];
}

// Count number of ways to make amount
function coinChangeWays(coins: number[], amount: number): number {
  const dp: number[] = Array(amount + 1).fill(0);
  dp[0] = 1; // One way to make 0: use no coins

  for (const coin of coins) {
    for (let i = coin; i <= amount; i++) {
      dp[i] += dp[i - coin];
    }
  }

  return dp[amount];
}`,
        steps: [
          {
            lines: [1, 2, 3],
            title: "Initialize DP array with sentinel value",
            description: "Create dp array of size amount+1, initialized with amount+1 (a value larger than any possible solution). This impossible value helps us detect unreachable amounts. dp[i] will store the minimum coins needed for amount i."
          },
          {
            lines: [4],
            title: "Set base case",
            description: "Set dp[0] = 0 because we need 0 coins to make amount 0. This is the foundation for building up all other solutions."
          },
          {
            lines: [6, 7, 8],
            title: "Build solutions bottom-up",
            description: "Iterate through all amounts from 1 to target. For each amount i, try using each coin denomination to see which combination gives the minimum coins."
          },
          {
            lines: [9, 10, 11, 12],
            title: "Try each coin denomination",
            description: "For each coin that fits in the current amount i, calculate dp[i - coin] + 1 (use this coin plus the minimum coins for the remaining amount). Take the minimum across all coin choices."
          },
          {
            lines: [16, 17],
            title: "Return result or -1",
            description: "If dp[amount] is still the sentinel value (amount+1), it means the amount cannot be made with the given coins, so return -1. Otherwise, return the minimum number of coins needed."
          }
        ]
      },
      {
        language: "python",
        code: `def coin_change(coins: list[int], amount: int) -> int:
    """Find minimum coins needed to make amount."""
    # Initialize with impossible value
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0  # Base case

    # Build up solutions for all amounts
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)

    # Return -1 if amount cannot be made
    return dp[amount] if dp[amount] <= amount else -1

def coin_change_ways(coins: list[int], amount: int) -> int:
    """Count number of combinations to make amount."""
    dp = [0] * (amount + 1)
    dp[0] = 1  # One way to make 0

    # Process each coin type
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] += dp[i - coin]

    return dp[amount]`,
        steps: [
          {
            lines: [1, 2, 3, 4, 5],
            title: "Initialize DP array with sentinel value",
            description: "Create dp list of size amount+1, initialized with amount+1 (a value larger than any possible solution). This impossible value helps us detect unreachable amounts. Then set dp[0] = 0 as the base case.",
            variables: { "amount": "11", "dp[0]": "0", "dp[1:]": "12" }
          },
          {
            lines: [7, 8, 9],
            title: "Build solutions bottom-up",
            description: "Iterate through all amounts from 1 to target. For each amount i, try using each coin denomination to see which combination gives the minimum coins.",
            variables: { "i": "5", "coins": "[1,2,5]" }
          },
          {
            lines: [10, 11],
            title: "Try each coin denomination",
            description: "For each coin that fits in the current amount i, calculate dp[i - coin] + 1 (use this coin plus the minimum coins for the remaining amount). Take the minimum across all coin choices.",
            variables: { "coin": "2", "i": "5", "dp[i]": "min(dp[5], dp[3] + 1)" }
          },
          {
            lines: [13, 14],
            title: "Return result or -1",
            description: "If dp[amount] is still the sentinel value (amount+1), it means the amount cannot be made with the given coins, so return -1. Otherwise, return the minimum number of coins needed.",
            variables: { "dp[amount]": "3", "result": "3" }
          }
        ]
      }
    ],
    keyInsights: [
      "Greedy approach fails for arbitrary coin systems (e.g., coins [1,3,4] amount 6)",
      "Unbounded knapsack variation: each coin can be used unlimited times",
      "Order of loops matters when counting combinations vs permutations",
      "Initialize with impossible value (amount+1) to detect unreachable amounts"
    ],
    whenToUse: [
      "Making change with minimum coins in currency systems",
      "Resource allocation with unlimited supply of certain units",
      "Counting ways to achieve target using given building blocks"
    ]
  },
  {
    id: "DP_006",
    name: "Edit Distance",
    category: "Dynamic Programming",
    difficulty: "Medium",
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(m*n)",
    description: "Computes minimum edit operations (insert, delete, replace) to transform one string into another.",
    longDescription: "Edit Distance, also known as Levenshtein Distance, measures the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one string into another. The DP solution uses a 2D table where dp[i][j] represents the minimum edits to transform the first i characters of string1 into the first j characters of string2. This algorithm is fundamental in spell checkers, DNA sequence alignment, natural language processing, and plagiarism detection. It demonstrates how DP can elegantly solve string transformation problems.",
    icon: "edit_note",
    complexityScore: 0.65,
    tags: ["strings", "transformation", "2d-dp", "nlp", "similarity"],
    leetcodeProblems: [
      "Edit Distance",
      "Delete Operation for Two Strings",
      "Minimum ASCII Delete Sum for Two Strings"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function minDistance(word1: string, word2: string): number {
  const m = word1.length;
  const n = word2.length;

  // Create DP table
  const dp: number[][] = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0));

  // Initialize base cases
  for (let i = 0; i <= m; i++) dp[i][0] = i; // Delete all
  for (let j = 0; j <= n; j++) dp[0][j] = j; // Insert all

  // Fill the table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]; // No operation needed
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,     // Delete
          dp[i][j - 1] + 1,     // Insert
          dp[i - 1][j - 1] + 1  // Replace
        );
      }
    }
  }

  return dp[m][n];
}`,
        steps: [
          {
            lines: [1, 2, 3],
            title: "Initialize string lengths",
            description: "Get the lengths of both input strings. These determine the dimensions of our DP table where dp[i][j] represents the edit distance between the first i characters of word1 and first j characters of word2."
          },
          {
            lines: [5, 6, 7, 8],
            title: "Create DP table",
            description: "Initialize a 2D array of size (m+1) x (n+1). The extra row and column handle the base cases of empty strings."
          },
          {
            lines: [10, 11, 12],
            title: "Initialize base cases",
            description: "Set dp[i][0] = i (cost to delete all i characters from word1) and dp[0][j] = j (cost to insert all j characters to match word2). These represent transforming to/from empty strings."
          },
          {
            lines: [14, 15, 16, 17, 18],
            title: "Characters match - no operation",
            description: "Fill the table using nested loops. When characters at positions i-1 and j-1 match, no edit is needed, so copy the diagonal value dp[i-1][j-1]."
          },
          {
            lines: [19, 20, 21, 22, 23, 24],
            title: "Characters differ - three operations",
            description: "When characters don't match, consider three operations: delete from word1 (dp[i-1][j] + 1), insert into word1 (dp[i][j-1] + 1), or replace (dp[i-1][j-1] + 1). Take the minimum of these three options."
          },
          {
            lines: [29],
            title: "Return minimum edit distance",
            description: "The bottom-right cell dp[m][n] contains the minimum number of edits needed to transform word1 into word2. This is built from optimal solutions to all subproblems."
          }
        ]
      },
      {
        language: "python",
        code: `def min_distance(word1: str, word2: str) -> int:
    """Calculate minimum edit distance (Levenshtein distance)."""
    m, n = len(word1), len(word2)

    # Create DP table
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Initialize base cases
    for i in range(m + 1):
        dp[i][0] = i  # Delete all characters
    for j in range(n + 1):
        dp[0][j] = j  # Insert all characters

    # Fill the table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]  # No operation
            else:
                dp[i][j] = min(
                    dp[i - 1][j] + 1,      # Delete
                    dp[i][j - 1] + 1,      # Insert
                    dp[i - 1][j - 1] + 1   # Replace
                )

    return dp[m][n]`,
        steps: [
          {
            lines: [1, 2, 3],
            title: "Initialize string lengths",
            description: "Get the lengths of both input strings. These determine the dimensions of our DP table where dp[i][j] represents the edit distance between the first i characters of word1 and first j characters of word2.",
            variables: { "m": "5", "n": "4", "word1": "horse", "word2": "rose" }
          },
          {
            lines: [5, 6],
            title: "Create DP table",
            description: "Create a 2D list of size (m+1) x (n+1) initialized with zeros. The extra row and column handle the base cases of empty strings.",
            variables: { "dp": "[[0,0,0,0,0], ...]" }
          },
          {
            lines: [8, 9, 10, 11, 12],
            title: "Initialize base cases",
            description: "Set dp[i][0] = i (cost to delete all i characters from word1) and dp[0][j] = j (cost to insert all j characters to match word2). These represent transforming to/from empty strings.",
            variables: { "dp[1][0]": "1", "dp[0][1]": "1" }
          },
          {
            lines: [14, 15, 16, 17, 18],
            title: "Characters match - no operation",
            description: "Fill the table using nested loops. When characters at positions i-1 and j-1 match, no edit is needed, so copy the diagonal value dp[i-1][j-1] without adding any cost.",
            variables: { "word1[i-1]": "o", "word2[j-1]": "o", "dp[i][j]": "1" }
          },
          {
            lines: [19, 20, 21, 22, 23, 24],
            title: "Characters differ - three operations",
            description: "When characters don't match, consider three operations: delete from word1 (dp[i-1][j] + 1), insert into word1 (dp[i][j-1] + 1), or replace (dp[i-1][j-1] + 1). Take the minimum of these three options.",
            variables: { "delete": "2", "insert": "3", "replace": "2", "dp[i][j]": "2" }
          },
          {
            lines: [26],
            title: "Return minimum edit distance",
            description: "The bottom-right cell dp[m][n] contains the minimum number of edits needed to transform word1 into word2. This is built from optimal solutions to all subproblems.",
            variables: { "result": "3" }
          }
        ]
      }
    ],
    keyInsights: [
      "Three operations considered: insert, delete, replace (all cost 1)",
      "When characters match, no operation needed - carry forward diagonal value",
      "Can be space-optimized to O(min(m,n)) using rolling arrays",
      "Forms basis for diff algorithms and sequence alignment in bioinformatics"
    ],
    whenToUse: [
      "Implementing spell checkers and autocorrect features",
      "Measuring similarity between strings for fuzzy matching",
      "DNA/protein sequence alignment in bioinformatics"
    ]
  },
  {
    id: "DP_007",
    name: "Matrix Chain Multiplication",
    category: "Dynamic Programming",
    difficulty: "Advanced",
    timeComplexity: "O(n³)",
    spaceComplexity: "O(n²)",
    description: "Finds optimal parenthesization to minimize scalar multiplications when multiplying a chain of matrices.",
    longDescription: "Matrix Chain Multiplication determines the most efficient way to multiply a sequence of matrices by finding the optimal order of parenthesization. While matrix multiplication is associative, different orderings result in vastly different numbers of scalar multiplications. The DP solution uses a 2D table where dp[i][j] represents the minimum cost to multiply matrices from i to j. It tries all possible split points k and chooses the one minimizing total operations. This problem demonstrates interval DP and has applications in compiler optimization, graphics processing, and query optimization in databases.",
    icon: "grid_view",
    complexityScore: 0.8,
    tags: ["interval-dp", "optimization", "matrices", "parenthesization", "combinatorial"],
    leetcodeProblems: [
      "Burst Balloons",
      "Minimum Cost Tree From Leaf Values",
      "Remove Boxes"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function matrixChainOrder(dimensions: number[]): number {
  const n = dimensions.length - 1; // Number of matrices

  // dp[i][j] = min cost to multiply matrices from i to j
  const dp: number[][] = Array(n)
    .fill(0)
    .map(() => Array(n).fill(0));

  // len is chain length
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i < n - len + 1; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;

      // Try all split points
      for (let k = i; k < j; k++) {
        // Cost of multiplying left and right parts
        const cost = dp[i][k] + dp[k + 1][j] +
                     dimensions[i] * dimensions[k + 1] * dimensions[j + 1];

        dp[i][j] = Math.min(dp[i][j], cost);
      }
    }
  }

  return dp[0][n - 1];
}`,
        steps: [
          {
            lines: [1, 2],
            title: "Initialize number of matrices",
            description: "Extract n as the number of matrices. The dimensions array has n+1 elements where matrix i has dimensions[i-1] x dimensions[i]. For example, [10,20,30,40] represents 3 matrices."
          },
          {
            lines: [4, 5, 6, 7],
            title: "Create DP table",
            description: "Initialize a 2D table where dp[i][j] stores the minimum scalar multiplications needed to multiply matrices from index i to j. Base case: single matrices (i==j) have cost 0."
          },
          {
            lines: [9, 10],
            title: "Iterate by chain length",
            description: "Process chains of increasing length from 2 to n. This ensures when computing dp[i][j], all smaller subproblems dp[i][k] and dp[k+1][j] are already solved."
          },
          {
            lines: [11, 12, 13],
            title: "Set chain endpoints and initialize cost",
            description: "For each starting position i, calculate ending position j = i + len - 1. Initialize dp[i][j] to Infinity before trying different split points to find the minimum."
          },
          {
            lines: [15, 16, 17, 18, 19, 20, 21],
            title: "Try all split points",
            description: "For each possible split point k between i and j, compute the cost: multiply matrices i..k, multiply matrices k+1..j, then multiply the two results. The multiplication cost is dimensions[i] * dimensions[k+1] * dimensions[j+1]."
          },
          {
            lines: [26],
            title: "Return optimal cost",
            description: "dp[0][n-1] contains the minimum cost to multiply all matrices from the first to the last. This represents the optimal parenthesization of the entire chain."
          }
        ]
      },
      {
        language: "python",
        code: `def matrix_chain_order(dimensions: list[int]) -> int:
    """
    Find minimum scalar multiplications for matrix chain.
    dimensions[i-1] x dimensions[i] is the size of matrix i.
    """
    n = len(dimensions) - 1  # Number of matrices

    # dp[i][j] = min cost to multiply matrices from i to j
    dp = [[0] * n for _ in range(n)]

    # len is chain length
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')

            # Try all split points
            for k in range(i, j):
                # Cost of multiplying left and right parts
                cost = (dp[i][k] + dp[k + 1][j] +
                       dimensions[i] * dimensions[k + 1] * dimensions[j + 1])

                dp[i][j] = min(dp[i][j], cost)

    return dp[0][n - 1]

def print_optimal_parens(s: list[list[int]], i: int, j: int) -> str:
    """Reconstruct optimal parenthesization."""
    if i == j:
        return f"A{i}"
    return f"({print_optimal_parens(s, i, s[i][j])}{print_optimal_parens(s, s[i][j] + 1, j)})"
`,
        steps: [
          {
            lines: [1, 2, 3, 4],
            title: "Function definition and docstring",
            description: "Define the function that takes a list of matrix dimensions. For n+1 dimensions, we have n matrices where matrix i has size dimensions[i-1] × dimensions[i]."
          },
          {
            lines: [5],
            title: "Count matrices",
            description: "Calculate n, the number of matrices. If we have 4 dimensions (e.g., [10, 30, 5, 60]), we have 3 matrices: 10×30, 30×5, 5×60."
          },
          {
            lines: [7, 8],
            title: "Initialize DP table",
            description: "Create an n×n table initialized to 0. dp[i][j] will store the minimum number of scalar multiplications needed to compute the product of matrices i through j."
          },
          {
            lines: [10, 11, 12, 13],
            title: "Iterate over chain lengths",
            description: "Build solutions bottom-up by increasing chain length. Start with length 2 (pairs of matrices). For each length, try all possible starting positions i and compute the ending position j."
          },
          {
            lines: [15, 16, 17, 18, 19, 20, 21, 22],
            title: "Try all split points",
            description: "For each possible split point k between i and j, compute the cost of splitting the chain at k: cost of left subchain + cost of right subchain + cost of multiplying the two resulting matrices together."
          },
          {
            lines: [24],
            title: "Return optimal cost",
            description: "dp[0][n-1] contains the minimum cost to multiply all matrices from the first to the last. This is the optimal solution for the entire chain."
          }
        ]
      }
    ],
    keyInsights: [
      "Interval DP: builds solutions for increasing interval lengths",
      "Optimal substructure: optimal solution contains optimal subsolutions",
      "Tries all possible split points to find minimum multiplication cost",
      "Different parenthesizations can have exponentially different costs"
    ],
    whenToUse: [
      "Optimizing sequence of matrix multiplications in scientific computing",
      "Query optimization in database systems",
      "Compiler optimization for expression evaluation"
    ]
  },
  {
    id: "DP_008",
    name: "Rod Cutting",
    category: "Dynamic Programming",
    difficulty: "Medium",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(n)",
    description: "Maximizes profit by cutting a rod into pieces of various lengths, each with different prices.",
    longDescription: "The Rod Cutting problem determines how to cut a rod of length n into pieces to maximize total revenue, given prices for rods of different lengths. This is an unbounded knapsack variant where you can make multiple cuts of the same size. The DP solution builds up optimal revenues for all rod lengths from 1 to n, where dp[i] represents the maximum revenue obtainable from a rod of length i. Each position considers all possible first cuts and takes the maximum. This problem models resource optimization scenarios in manufacturing and resource allocation.",
    icon: "straighten",
    complexityScore: 0.55,
    tags: ["unbounded-knapsack", "optimization", "cutting-stock", "profit-maximization", "intervals"],
    leetcodeProblems: [
      "Integer Break",
      "Perfect Squares",
      "Decode Ways"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function rodCutting(prices: number[], n: number): number {
  // dp[i] = max revenue for rod of length i
  const dp: number[] = Array(n + 1).fill(0);

  // Build up solutions for all lengths
  for (let i = 1; i <= n; i++) {
    let maxRevenue = 0;

    // Try all possible first cuts
    for (let j = 1; j <= i && j <= prices.length; j++) {
      maxRevenue = Math.max(maxRevenue, prices[j - 1] + dp[i - j]);
    }

    dp[i] = maxRevenue;
  }

  return dp[n];
}

// Version that returns the actual cuts
function rodCuttingWithCuts(prices: number[], n: number): { revenue: number; cuts: number[] } {
  const dp: number[] = Array(n + 1).fill(0);
  const cuts: number[] = Array(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    let maxRevenue = 0;
    let bestCut = 0;

    for (let j = 1; j <= i && j <= prices.length; j++) {
      const revenue = prices[j - 1] + dp[i - j];
      if (revenue > maxRevenue) {
        maxRevenue = revenue;
        bestCut = j;
      }
    }

    dp[i] = maxRevenue;
    cuts[i] = bestCut;
  }

  // Reconstruct cuts
  const result: number[] = [];
  let remaining = n;
  while (remaining > 0) {
    result.push(cuts[remaining]);
    remaining -= cuts[remaining];
  }

  return { revenue: dp[n], cuts: result };
}`,
        steps: [
          {
            lines: [1, 2, 3],
            title: "Initialize DP array",
            description: "Create dp array of size n+1, initialized with zeros. dp[i] will store the maximum revenue obtainable from a rod of length i. The base case dp[0] = 0 represents a rod of length 0 has no value."
          },
          {
            lines: [5, 6, 7],
            title: "Build solutions for all rod lengths",
            description: "Iterate through all rod lengths from 1 to n. For each length i, we'll determine the optimal way to cut the rod by considering all possible first cuts."
          },
          {
            lines: [9, 10, 11],
            title: "Try all possible first cuts",
            description: "For rod of length i, try making the first cut at position j (creating a piece of length j). The revenue is prices[j-1] for the cut piece plus dp[i-j] for the remaining rod. Try all valid cut positions."
          },
          {
            lines: [14],
            title: "Store maximum revenue",
            description: "After trying all possible first cuts, store the maximum revenue found in dp[i]. This optimal solution will be used when solving for longer rod lengths."
          },
          {
            lines: [17],
            title: "Return optimal revenue",
            description: "dp[n] contains the maximum revenue achievable from a rod of length n. This is built up from optimal solutions to all smaller subproblems, representing the best cutting strategy."
          }
        ]
      },
      {
        language: "python",
        code: `def rod_cutting(prices: list[int], n: int) -> int:
    """Find maximum revenue from cutting rod of length n."""
    # dp[i] = max revenue for rod of length i
    dp = [0] * (n + 1)

    # Build up solutions for all lengths
    for i in range(1, n + 1):
        max_revenue = 0

        # Try all possible first cuts
        for j in range(1, min(i, len(prices)) + 1):
            max_revenue = max(max_revenue, prices[j - 1] + dp[i - j])

        dp[i] = max_revenue

    return dp[n]

def rod_cutting_with_cuts(prices: list[int], n: int) -> tuple[int, list[int]]:
    """Return maximum revenue and the actual cuts to make."""
    dp = [0] * (n + 1)
    cuts = [0] * (n + 1)

    for i in range(1, n + 1):
        max_revenue = 0
        best_cut = 0

        for j in range(1, min(i, len(prices)) + 1):
            revenue = prices[j - 1] + dp[i - j]
            if revenue > max_revenue:
                max_revenue = revenue
                best_cut = j

        dp[i] = max_revenue
        cuts[i] = best_cut

    # Reconstruct cuts
    result = []
    remaining = n
    while remaining > 0:
        result.append(cuts[remaining])
        remaining -= cuts[remaining]

    return dp[n], result`
      ,
        steps: [
                  {
                            "lines": [
                                      1,
                                      2,
                                      3,
                                      4,
                                      6
                            ],
                            "title": "Define rod_cutting",
                            "description": "Define the rod_cutting function which takes prices, n as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      7,
                                      8,
                                      10,
                                      11,
                                      12,
                                      14
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(1, n + 1) using variable 'i'. Each iteration processes one element."
                  },
                  {
                            "lines": [
                                      16
                            ],
                            "title": "Return Result",
                            "description": "Return the computed result: dp[n]. This is the final output of the function."
                  },
                  {
                            "lines": [
                                      18,
                                      19,
                                      20,
                                      21
                            ],
                            "title": "Define rod_cutting_with_cuts",
                            "description": "Define the rod_cutting_with_cuts function which takes prices, n as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      23,
                                      24,
                                      25,
                                      27,
                                      28,
                                      29,
                                      30,
                                      31
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(1, n + 1) using variable 'i'. Each iteration processes one element."
                  },
                  {
                            "lines": [
                                      39,
                                      40,
                                      41
                            ],
                            "title": "While Loop",
                            "description": "Continue looping while the condition remaining > 0 holds true."
                  },
                  {
                            "lines": [
                                      43
                            ],
                            "title": "Return Result",
                            "description": "Return the computed result: dp[n], result. This is the final output of the function."
                  }
        ]
      }
    ],
    keyInsights: [
      "Unbounded problem: can make multiple cuts of same length",
      "Optimal substructure: optimal solution for length n uses optimal solutions for smaller lengths",
      "Each length considers all possible first cuts and takes maximum",
      "Can reconstruct actual cutting strategy by tracking decisions"
    ],
    whenToUse: [
      "Manufacturing optimization for cutting materials to maximize profit",
      "Resource allocation with divisible units of varying value",
      "Pricing strategy problems with quantity-dependent values"
    ]
  },
  {
    id: "DP_009",
    name: "Subset Sum",
    category: "Dynamic Programming",
    difficulty: "Medium",
    timeComplexity: "O(n*S)",
    spaceComplexity: "O(S)",
    description: "Determines if there exists a subset of numbers that sum to a target value.",
    longDescription: "The Subset Sum problem asks whether a subset of a given set of integers sums to a specific target. This is a classic NP-complete problem that can be solved using dynamic programming in pseudo-polynomial time. The DP solution maintains a boolean table where dp[i] indicates whether sum i is achievable using available numbers. This problem is a special case of the 0/1 knapsack and is fundamental to partition problems, cryptography, and resource allocation. It demonstrates how DP can efficiently solve certain NP-complete problems for reasonable input sizes.",
    icon: "checklist",
    complexityScore: 0.6,
    tags: ["subset-selection", "boolean-dp", "knapsack-variant", "np-complete", "combinatorial"],
    leetcodeProblems: [
      "Partition Equal Subset Sum",
      "Target Sum",
      "Last Stone Weight II"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function canPartition(nums: number[], target: number): boolean {
  // dp[i] = true if sum i is achievable
  const dp: boolean[] = Array(target + 1).fill(false);
  dp[0] = true; // Sum of 0 is always achievable (empty subset)

  for (const num of nums) {
    // Iterate backwards to avoid using same element twice
    for (let sum = target; sum >= num; sum--) {
      dp[sum] = dp[sum] || dp[sum - num];
    }
  }

  return dp[target];
}

// Count number of subsets that sum to target
function countSubsetSum(nums: number[], target: number): number {
  const dp: number[] = Array(target + 1).fill(0);
  dp[0] = 1; // One way to make 0: empty subset

  for (const num of nums) {
    for (let sum = target; sum >= num; sum--) {
      dp[sum] += dp[sum - num];
    }
  }

  return dp[target];
}

// Return actual subset if exists
function findSubsetSum(nums: number[], target: number): number[] | null {
  const n = nums.length;
  const dp: boolean[][] = Array(n + 1)
    .fill(0)
    .map(() => Array(target + 1).fill(false));

  for (let i = 0; i <= n; i++) dp[i][0] = true;

  for (let i = 1; i <= n; i++) {
    for (let sum = 1; sum <= target; sum++) {
      dp[i][sum] = dp[i - 1][sum];
      if (nums[i - 1] <= sum) {
        dp[i][sum] = dp[i][sum] || dp[i - 1][sum - nums[i - 1]];
      }
    }
  }

  if (!dp[n][target]) return null;

  // Reconstruct subset
  const result: number[] = [];
  let i = n, sum = target;
  while (i > 0 && sum > 0) {
    if (!dp[i - 1][sum]) {
      result.push(nums[i - 1]);
      sum -= nums[i - 1];
    }
    i--;
  }

  return result;
}`,
        steps: [
          {
            lines: [1, 2, 3],
            title: "Initialize DP array",
            description: "Create a boolean array of size target+1, initialized to false. dp[i] will indicate whether sum i is achievable using some subset of the numbers seen so far."
          },
          {
            lines: [4],
            title: "Set base case",
            description: "Set dp[0] = true because a sum of 0 is always achievable with the empty subset (selecting no numbers). This is the foundation for building all other reachable sums."
          },
          {
            lines: [6, 7, 8],
            title: "Process each number",
            description: "For each number in the array, iterate backwards through possible sums from target down to num. Backwards iteration prevents using the same element twice in the current iteration."
          },
          {
            lines: [9],
            title: "Update achievable sums",
            description: "For each sum, check if it's already achievable (dp[sum]) OR if it becomes achievable by adding the current number (dp[sum - num]). This propagates reachable sums forward."
          },
          {
            lines: [13],
            title: "Return result",
            description: "dp[target] indicates whether the target sum is achievable using any subset of the input numbers. If true, a valid subset exists; if false, no such subset exists."
          }
        ]
      },
      {
        language: "python",
        code: `def can_partition(nums: list[int], target: int) -> bool:
    """Check if any subset sums to target."""
    # dp[i] = True if sum i is achievable
    dp = [False] * (target + 1)
    dp[0] = True  # Empty subset

    for num in nums:
        # Iterate backwards to avoid using same element twice
        for sum_val in range(target, num - 1, -1):
            dp[sum_val] = dp[sum_val] or dp[sum_val - num]

    return dp[target]

def count_subset_sum(nums: list[int], target: int) -> int:
    """Count number of subsets that sum to target."""
    dp = [0] * (target + 1)
    dp[0] = 1  # One way to make 0

    for num in nums:
        for sum_val in range(target, num - 1, -1):
            dp[sum_val] += dp[sum_val - num]

    return dp[target]

def find_subset_sum(nums: list[int], target: int) -> list[int] | None:
    """Return actual subset if exists, else None."""
    n = len(nums)
    dp = [[False] * (target + 1) for _ in range(n + 1)]

    for i in range(n + 1):
        dp[i][0] = True

    for i in range(1, n + 1):
        for sum_val in range(1, target + 1):
            dp[i][sum_val] = dp[i - 1][sum_val]
            if nums[i - 1] <= sum_val:
                dp[i][sum_val] |= dp[i - 1][sum_val - nums[i - 1]]

    if not dp[n][target]:
        return None

    # Reconstruct
    result = []
    i, sum_val = n, target
    while i > 0 and sum_val > 0:
        if not dp[i - 1][sum_val]:
            result.append(nums[i - 1])
            sum_val -= nums[i - 1]
        i -= 1

    return result`
      ,
        steps: [
                  {
                            "lines": [
                                      1,
                                      2,
                                      3,
                                      4,
                                      5
                            ],
                            "title": "Define can_partition",
                            "description": "Define the can_partition function which takes nums, target as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      7,
                                      8,
                                      9,
                                      10,
                                      12,
                                      14,
                                      15,
                                      16,
                                      17
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through nums using variable 'num'. Each iteration processes one element. Return the computed result: dp[target]. This is the final output of the function. Define the count_subset_sum function which takes nums, target as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      19,
                                      20,
                                      21,
                                      23,
                                      25,
                                      26,
                                      27,
                                      28
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through nums using variable 'num'. Each iteration processes one element. Return the computed result: dp[target]. This is the final output of the function. Define the find_subset_sum function which takes nums, target as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      30,
                                      31,
                                      33,
                                      34,
                                      35,
                                      36,
                                      37
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(n + 1) using variable 'i'. Each iteration processes one element. Iterate through range(1, n + 1) using variable 'i'. Each iteration processes one element."
                  },
                  {
                            "lines": [
                                      39,
                                      40,
                                      42,
                                      43,
                                      44
                            ],
                            "title": "Conditional Check",
                            "description": "Check the condition: not dp[n][target]. This determines the path of execution based on the current state."
                  },
                  {
                            "lines": [
                                      45,
                                      46,
                                      47,
                                      48,
                                      49,
                                      51
                            ],
                            "title": "While Loop",
                            "description": "Continue looping while the condition i > 0 and sum_val > 0 holds true. Return the computed result: result. This is the final output of the function."
                  }
        ]
      }
    ],
    keyInsights: [
      "Boolean DP: tracks achievable sums rather than optimal values",
      "Process in reverse order when using 1D array to avoid reusing elements",
      "Pseudo-polynomial complexity: efficient for small target sums",
      "Can be extended to count subsets or reconstruct actual subset"
    ],
    whenToUse: [
      "Partition problems (equal sum subsets, balanced splits)",
      "Resource allocation with exact target requirements",
      "Cryptographic applications and knapsack cryptosystems"
    ]
  },
  {
    id: "DP_010",
    name: "Palindrome Partitioning",
    category: "Dynamic Programming",
    difficulty: "Advanced",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(n²)",
    description: "Finds minimum cuts needed to partition a string into palindromic substrings.",
    longDescription: "Palindrome Partitioning finds the minimum number of cuts required to partition a string such that every substring is a palindrome. The DP solution uses two tables: one to precompute which substrings are palindromes, and another to track minimum cuts for each position. For each position, it tries all possible last palindromic substrings and takes the minimum cuts needed. This problem combines palindrome detection with optimization and has applications in text processing, DNA sequence analysis, and string manipulation algorithms.",
    icon: "content_cut",
    complexityScore: 0.75,
    tags: ["strings", "palindromes", "optimization", "2d-dp", "partitioning"],
    leetcodeProblems: [
      "Palindrome Partitioning II",
      "Palindrome Partitioning",
      "Palindrome Partitioning III"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function minCut(s: string): number {
  const n = s.length;

  // isPalin[i][j] = true if s[i:j+1] is palindrome
  const isPalin: boolean[][] = Array(n)
    .fill(0)
    .map(() => Array(n).fill(false));

  // Precompute palindromes
  for (let len = 1; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      if (len === 1) {
        isPalin[i][j] = true;
      } else if (len === 2) {
        isPalin[i][j] = s[i] === s[j];
      } else {
        isPalin[i][j] = s[i] === s[j] && isPalin[i + 1][j - 1];
      }
    }
  }

  // dp[i] = min cuts for s[0:i+1]
  const dp: number[] = Array(n).fill(n - 1);

  for (let i = 0; i < n; i++) {
    if (isPalin[0][i]) {
      dp[i] = 0; // Entire substring is palindrome
      continue;
    }

    for (let j = 0; j < i; j++) {
      if (isPalin[j + 1][i]) {
        dp[i] = Math.min(dp[i], dp[j] + 1);
      }
    }
  }

  return dp[n - 1];
}`,
        steps: [
          {
            lines: [1, 2, 3, 4, 5, 6, 7],
            title: "Initialize palindrome lookup table",
            description: "Create a 2D boolean table isPalin where isPalin[i][j] will indicate whether substring s[i..j] is a palindrome. This precomputation allows O(1) palindrome checks later."
          },
          {
            lines: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            title: "Precompute all palindromes",
            description: "Build the palindrome table by length. Single characters are palindromes. For length 2, check if characters match. For longer strings, check if outer characters match AND inner substring is a palindrome. This builds from smaller to larger substrings."
          },
          {
            lines: [22, 23],
            title: "Initialize cuts DP array",
            description: "Create dp array where dp[i] represents minimum cuts needed to partition s[0..i] into palindromes. Initialize with worst case (n-1 cuts, making each character a separate palindrome)."
          },
          {
            lines: [25, 26, 27, 28, 29],
            title: "Check if entire prefix is palindrome",
            description: "For each position i, first check if the entire substring s[0..i] is a palindrome. If so, no cuts are needed (dp[i] = 0), and we can skip to the next position."
          },
          {
            lines: [31, 32, 33, 34, 35],
            title: "Try all possible last palindromes",
            description: "If s[0..i] isn't a palindrome, try all possible positions j to make a cut. If s[j+1..i] is a palindrome, we can partition there with dp[j] + 1 total cuts. Take the minimum across all valid cut positions."
          },
          {
            lines: [38],
            title: "Return minimum cuts",
            description: "dp[n-1] contains the minimum cuts needed to partition the entire string into palindromic substrings. This is built from optimal solutions to all prefix subproblems."
          }
        ]
      },
      {
        language: "python",
        code: `def min_cut(s: str) -> int:
    """Find minimum cuts to partition string into palindromes."""
    n = len(s)

    # isPalin[i][j] = True if s[i:j+1] is palindrome
    is_palin = [[False] * n for _ in range(n)]

    # Precompute palindromes
    for length in range(1, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if length == 1:
                is_palin[i][j] = True
            elif length == 2:
                is_palin[i][j] = s[i] == s[j]
            else:
                is_palin[i][j] = s[i] == s[j] and is_palin[i + 1][j - 1]

    # dp[i] = min cuts for s[0:i+1]
    dp = [n - 1] * n

    for i in range(n):
        if is_palin[0][i]:
            dp[i] = 0  # Entire substring is palindrome
            continue

        for j in range(i):
            if is_palin[j + 1][i]:
                dp[i] = min(dp[i], dp[j] + 1)

    return dp[n - 1]

def partition_palindrome(s: str) -> list[list[str]]:
    """Return all possible palindrome partitions."""
    def is_palindrome(sub: str) -> bool:
        return sub == sub[::-1]

    result = []

    def backtrack(start: int, path: list[str]):
        if start == len(s):
            result.append(path[:])
            return

        for end in range(start + 1, len(s) + 1):
            substring = s[start:end]
            if is_palindrome(substring):
                path.append(substring)
                backtrack(end, path)
                path.pop()

    backtrack(0, [])
    return result`
      ,
        steps: [
                  {
                            "lines": [
                                      1,
                                      2,
                                      3,
                                      5,
                                      6,
                                      8
                            ],
                            "title": "Define min_cut",
                            "description": "Define the min_cut function which takes s as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      9,
                                      10,
                                      11,
                                      12,
                                      13,
                                      14,
                                      15,
                                      16
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(1, n + 1) using variable 'length'. Each iteration processes one element."
                  },
                  {
                            "lines": [
                                      22,
                                      23,
                                      24,
                                      25,
                                      27,
                                      28,
                                      29
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(n) using variable 'i'. Each iteration processes one element."
                  },
                  {
                            "lines": [
                                      31,
                                      33,
                                      34
                            ],
                            "title": "Return Result",
                            "description": "Return the computed result: dp[n - 1]. This is the final output of the function. Define the partition_palindrome function which takes s as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      35,
                                      36,
                                      38
                            ],
                            "title": "Define is_palindrome",
                            "description": "Define the is_palindrome function which takes sub as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      40,
                                      41,
                                      42,
                                      43,
                                      45,
                                      46,
                                      47,
                                      48,
                                      53
                            ],
                            "title": "Define backtrack",
                            "description": "Define the backtrack function which takes start, path as parameters. This sets up the function signature and documents its interface. Return the computed result: result. This is the final output of the function."
                  }
        ]
      }
    ],
    keyInsights: [
      "Precompute palindrome table using interval DP for O(1) palindrome checks",
      "For each position, try all possible last palindromic substrings",
      "If entire prefix is palindrome, no cuts needed for that position",
      "Can be extended to enumerate all valid partitions using backtracking"
    ],
    whenToUse: [
      "Text processing requiring palindrome-based partitioning",
      "String optimization problems with palindrome constraints",
      "DNA sequence analysis for palindromic patterns"
    ]
  },
  {
    id: "DP_011",
    name: "Word Break",
    category: "Dynamic Programming",
    difficulty: "Medium",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(n)",
    description: "Determines if a string can be segmented into space-separated dictionary words.",
    longDescription: "Word Break checks whether a given string can be segmented into a sequence of one or more dictionary words. The DP solution uses a boolean array where dp[i] indicates whether the substring s[0:i] can be segmented. For each position, it checks all possible last words and verifies if they exist in the dictionary. This problem is fundamental in natural language processing, text parsing, and has applications in spell checking, URL parsing, and domain-specific language processing. It demonstrates how DP can efficiently solve string segmentation problems.",
    icon: "spellcheck",
    complexityScore: 0.55,
    tags: ["strings", "segmentation", "dictionary", "boolean-dp", "nlp"],
    leetcodeProblems: [
      "Word Break",
      "Word Break II",
      "Concatenated Words"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function wordBreak(s: string, wordDict: string[]): boolean {
  const wordSet = new Set(wordDict);
  const n = s.length;

  // dp[i] = true if s[0:i] can be segmented
  const dp: boolean[] = Array(n + 1).fill(false);
  dp[0] = true; // Empty string

  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      // If s[0:j] can be segmented and s[j:i] is in dict
      if (dp[j] && wordSet.has(s.substring(j, i))) {
        dp[i] = true;
        break; // Found valid segmentation for position i
      }
    }
  }

  return dp[n];
}

// Return all possible segmentations
function wordBreakAll(s: string, wordDict: string[]): string[] {
  const wordSet = new Set(wordDict);
  const memo = new Map<number, string[]>();

  function backtrack(start: number): string[] {
    if (start === s.length) return [''];
    if (memo.has(start)) return memo.get(start)!;

    const result: string[] = [];

    for (let end = start + 1; end <= s.length; end++) {
      const word = s.substring(start, end);
      if (wordSet.has(word)) {
        const suffixes = backtrack(end);
        for (const suffix of suffixes) {
          result.push(word + (suffix ? ' ' + suffix : ''));
        }
      }
    }

    memo.set(start, result);
    return result;
  }

  return backtrack(0);
}`,
        steps: [
          {
            lines: [1, 2, 3],
            title: "Convert dictionary to Set for O(1) lookup",
            description: "Convert the word dictionary array to a Set for constant-time word lookups. Store the string length n for iteration bounds."
          },
          {
            lines: [5, 6, 7],
            title: "Initialize DP array with base case",
            description: "Create dp array of size n+1 where dp[i] indicates if substring s[0:i] can be segmented into dictionary words. Set dp[0] = true as the empty string is always valid."
          },
          {
            lines: [9],
            title: "Iterate through string positions",
            description: "For each position i from 1 to n, determine if s[0:i] can be segmented by checking all possible ways to split it into a prefix and a last word."
          },
          {
            lines: [10, 11, 12, 13, 14, 15],
            title: "Try all possible last words",
            description: "For each position j before i, check if s[0:j] can be segmented (dp[j]) AND if s[j:i] exists in the dictionary. If both conditions are true, s[0:i] can be segmented. Break early once a valid segmentation is found."
          },
          {
            lines: [19],
            title: "Return final result",
            description: "dp[n] indicates whether the entire string s[0:n] can be segmented into dictionary words. This is built from all smaller prefix subproblems."
          }
        ]
      },
      {
        language: "python",
        code: `def word_break(s: str, word_dict: list[str]) -> bool:
    """Check if string can be segmented into dictionary words."""
    word_set = set(word_dict)
    n = len(s)

    # dp[i] = True if s[0:i] can be segmented
    dp = [False] * (n + 1)
    dp[0] = True  # Empty string

    for i in range(1, n + 1):
        for j in range(i):
            # If s[0:j] can be segmented and s[j:i] is in dict
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break

    return dp[n]

def word_break_all(s: str, word_dict: list[str]) -> list[str]:
    """Return all possible word break segmentations."""
    word_set = set(word_dict)
    memo = {}

    def backtrack(start: int) -> list[str]:
        if start == len(s):
            return ['']
        if start in memo:
            return memo[start]

        result = []

        for end in range(start + 1, len(s) + 1):
            word = s[start:end]
            if word in word_set:
                suffixes = backtrack(end)
                for suffix in suffixes:
                    result.append(word + (' ' + suffix if suffix else ''))

        memo[start] = result
        return result

    return backtrack(0)`
      ,
        steps: [
                  {
                            "lines": [
                                      1,
                                      2,
                                      3,
                                      4,
                                      6,
                                      7,
                                      8
                            ],
                            "title": "Define word_break",
                            "description": "Define the word_break function which takes s, word_dict as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      10,
                                      11,
                                      12,
                                      13,
                                      14,
                                      15
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(1, n + 1) using variable 'i'. Each iteration processes one element."
                  },
                  {
                            "lines": [
                                      17
                            ],
                            "title": "Return Result",
                            "description": "Return the computed result: dp[n]. This is the final output of the function."
                  },
                  {
                            "lines": [
                                      19,
                                      20,
                                      21,
                                      22
                            ],
                            "title": "Define word_break_all",
                            "description": "Define the word_break_all function which takes s, word_dict as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      24,
                                      25,
                                      26,
                                      27,
                                      28,
                                      30,
                                      32,
                                      33
                            ],
                            "title": "Define backtrack",
                            "description": "Define the backtrack function which takes start as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      42
                            ],
                            "title": "Return Result",
                            "description": "Return the computed result: backtrack(0). This is the final output of the function."
                  }
        ]
      }
    ],
    keyInsights: [
      "Boolean DP: dp[i] indicates if prefix of length i is segmentable",
      "Use HashSet for O(1) dictionary lookups to optimize performance",
      "Can break early once valid segmentation found for current position",
      "Extend to find all segmentations using backtracking with memoization"
    ],
    whenToUse: [
      "Natural language processing and text parsing",
      "URL parsing and domain name validation",
      "Spell checking and word suggestion systems"
    ]
  },
  {
    id: "DP_012",
    name: "House Robber",
    category: "Dynamic Programming",
    difficulty: "Medium",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    description: "Maximizes money robbed from houses without robbing adjacent ones.",
    longDescription: "The House Robber problem asks for the maximum amount of money that can be stolen from houses arranged in a line, with the constraint that adjacent houses cannot be robbed (they have alarms). The DP solution maintains the maximum money obtainable at each position, considering whether to rob the current house or skip it. This elegantly demonstrates the principle of optimal substructure and can be optimized to use only constant space. Variations include circular arrangements and binary tree structures, making it a versatile problem for understanding state transitions in DP.",
    icon: "house",
    complexityScore: 0.4,
    tags: ["optimization", "state-machine", "constraints", "linear-dp", "greedy-fails"],
    leetcodeProblems: [
      "House Robber",
      "House Robber II",
      "House Robber III"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function rob(nums: number[]): number {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];

  // prev2 = max money two houses back
  // prev1 = max money one house back
  let prev2 = 0;
  let prev1 = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // Either rob current house + prev2, or skip and take prev1
    const current = Math.max(nums[i] + prev2, prev1);
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

// Circular arrangement (houses in a circle)
function robCircular(nums: number[]): number {
  if (nums.length === 1) return nums[0];

  // Case 1: Rob first house, can't rob last
  // Case 2: Skip first house, can rob last
  const robRange = (start: number, end: number): number => {
    let prev2 = 0, prev1 = 0;

    for (let i = start; i < end; i++) {
      const current = Math.max(nums[i] + prev2, prev1);
      prev2 = prev1;
      prev1 = current;
    }

    return prev1;
  };

  return Math.max(robRange(0, nums.length - 1), robRange(1, nums.length));
}`,
        steps: [
          {
            lines: [1, 2, 3],
            title: "Handle base cases",
            description: "Check for empty array (return 0) and single house (return that house's value). These edge cases don't require DP logic."
          },
          {
            lines: [5, 6, 7, 8],
            title: "Initialize state variables",
            description: "Use prev2 to track max money from two houses back (initially 0), and prev1 for one house back (initially nums[0]). This space-optimized approach uses O(1) space instead of O(n)."
          },
          {
            lines: [10],
            title: "Iterate through houses",
            description: "Process each house starting from index 1. For each house, decide whether to rob it or skip it based on previous optimal solutions."
          },
          {
            lines: [11, 12],
            title: "Choose optimal decision",
            description: "At each house, we have two choices: rob current house (nums[i] + prev2, skipping the previous house) or don't rob it (prev1). Take the maximum of these two options."
          },
          {
            lines: [13, 14],
            title: "Update state for next iteration",
            description: "Shift the window: prev2 becomes prev1, and prev1 becomes current. This maintains the invariant that prev1 always holds the max money up to the current position."
          },
          {
            lines: [17],
            title: "Return maximum money",
            description: "prev1 contains the maximum money that can be robbed from all houses without triggering alarms. This is built from optimal decisions at each house."
          }
        ]
      },
      {
        language: "python",
        code: `def rob(nums: list[int]) -> int:
    """Find maximum money to rob without alerting police."""
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]

    # prev2 = max money two houses back
    # prev1 = max money one house back
    prev2, prev1 = 0, nums[0]

    for i in range(1, len(nums)):
        # Either rob current + prev2, or skip and take prev1
        current = max(nums[i] + prev2, prev1)
        prev2, prev1 = prev1, current

    return prev1

def rob_circular(nums: list[int]) -> int:
    """House Robber with circular arrangement."""
    if len(nums) == 1:
        return nums[0]

    def rob_range(start: int, end: int) -> int:
        prev2, prev1 = 0, 0

        for i in range(start, end):
            current = max(nums[i] + prev2, prev1)
            prev2, prev1 = prev1, current

        return prev1

    # Case 1: Rob first, can't rob last
    # Case 2: Skip first, can rob last
    return max(rob_range(0, len(nums) - 1), rob_range(1, len(nums)))`
      ,
        steps: [
                  {
                            "lines": [
                                      1,
                                      2,
                                      3,
                                      4
                            ],
                            "title": "Define rob",
                            "description": "Define the rob function which takes nums as parameters. This sets up the function signature and documents its interface. Check the condition: not nums. This determines the path of execution based on the current state."
                  },
                  {
                            "lines": [
                                      5,
                                      6,
                                      8,
                                      9,
                                      10
                            ],
                            "title": "Conditional Check",
                            "description": "Check the condition: len(nums) == 1. This determines the path of execution based on the current state."
                  },
                  {
                            "lines": [
                                      12,
                                      13,
                                      14,
                                      15
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(1, len(nums)) using variable 'i'. Each iteration processes one element."
                  },
                  {
                            "lines": [
                                      17,
                                      19,
                                      20
                            ],
                            "title": "Return Result",
                            "description": "Return the computed result: prev1. This is the final output of the function. Define the rob_circular function which takes nums as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      21,
                                      22
                            ],
                            "title": "Conditional Check",
                            "description": "Check the condition: len(nums) == 1. This determines the path of execution based on the current state."
                  },
                  {
                            "lines": [
                                      24,
                                      25,
                                      27,
                                      28,
                                      29,
                                      31,
                                      33,
                                      34,
                                      35
                            ],
                            "title": "Define rob_range",
                            "description": "Define the rob_range function which takes start, end as parameters. This sets up the function signature and documents its interface. Return the computed result: max(rob_range(0, len(nums) - 1), rob_range(1, len(nums))). This is the final output of the function."
                  }
        ]
      }
    ],
    keyInsights: [
      "At each house, decide: rob current + max from two back, or skip and take max from previous",
      "State transition: dp[i] = max(nums[i] + dp[i-2], dp[i-1])",
      "Space optimization: only need two previous values, not entire array",
      "Circular variant requires considering two scenarios: including first or last house"
    ],
    whenToUse: [
      "Optimization problems with non-adjacent selection constraints",
      "Resource allocation with spacing requirements",
      "Scheduling problems with cooldown periods"
    ]
  },
  {
    id: "DP_013",
    name: "Unique Paths",
    category: "Dynamic Programming",
    difficulty: "Beginner",
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(m*n)",
    description: "Counts unique paths from top-left to bottom-right in a grid, moving only right or down.",
    longDescription: "The Unique Paths problem counts the number of different paths from the top-left corner to the bottom-right corner of a grid, where movement is restricted to right or down. This classic grid DP problem demonstrates the additive principle: paths to any cell equal the sum of paths from the cell above and the cell to the left. The solution can be optimized from O(mn) space to O(n) by using a single row. This problem has applications in robot path planning, game development, and serves as an excellent introduction to 2D dynamic programming.",
    icon: "grid_on",
    complexityScore: 0.35,
    tags: ["grid", "paths", "combinatorics", "2d-dp", "beginner-friendly"],
    leetcodeProblems: [
      "Unique Paths",
      "Unique Paths II",
      "Minimum Path Sum"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function uniquePaths(m: number, n: number): number {
  // Create DP table
  const dp: number[][] = Array(m)
    .fill(0)
    .map(() => Array(n).fill(1));

  // Fill the table
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      // Paths = paths from above + paths from left
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }

  return dp[m - 1][n - 1];
}

// Space-optimized version
function uniquePathsOptimized(m: number, n: number): number {
  const dp: number[] = Array(n).fill(1);

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] += dp[j - 1];
    }
  }

  return dp[n - 1];
}

// With obstacles
function uniquePathsWithObstacles(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;

  if (grid[0][0] === 1 || grid[m - 1][n - 1] === 1) return 0;

  const dp: number[] = Array(n).fill(0);
  dp[0] = 1;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        dp[j] = 0;
      } else if (j > 0) {
        dp[j] += dp[j - 1];
      }
    }
  }

  return dp[n - 1];
}`,
        steps: [
          {
            lines: [1, 2, 3, 4, 5],
            title: "Initialize DP table",
            description: "Create an m x n table filled with 1s. dp[i][j] will store the number of unique paths to reach cell (i, j). Initialize all cells to 1 because there's exactly one path along the first row and first column."
          },
          {
            lines: [7, 8, 9],
            title: "Iterate through grid cells",
            description: "Start from cell (1,1) and process each cell row by row. Skip the first row and column since they're already initialized correctly (only one path along edges)."
          },
          {
            lines: [10, 11],
            title: "Apply recurrence relation",
            description: "For each cell (i,j), the number of paths equals paths from above (dp[i-1][j]) plus paths from left (dp[i][j-1]). We can only move right or down, so all paths must come from these two directions."
          },
          {
            lines: [14],
            title: "Return total unique paths",
            description: "dp[m-1][n-1] contains the total number of unique paths from top-left (0,0) to bottom-right (m-1,n-1). This is built by summing paths from all possible routes."
          }
        ]
      },
      {
        language: "python",
        code: `def unique_paths(m: int, n: int) -> int:
    """Count unique paths in m x n grid."""
    # Create DP table initialized to 1
    dp = [[1] * n for _ in range(m)]

    # Fill the table
    for i in range(1, m):
        for j in range(1, n):
            # Paths = paths from above + paths from left
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1]

    return dp[m - 1][n - 1]

def unique_paths_optimized(m: int, n: int) -> int:
    """Space-optimized version using O(n) space."""
    dp = [1] * n

    for i in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j - 1]

    return dp[n - 1]

def unique_paths_with_obstacles(grid: list[list[int]]) -> int:
    """Count paths with obstacles (1 = obstacle, 0 = free)."""
    m, n = len(grid), len(grid[0])

    if grid[0][0] == 1 or grid[m - 1][n - 1] == 1:
        return 0

    dp = [0] * n
    dp[0] = 1

    for i in range(m):
        for j in range(n):
            if grid[i][j] == 1:
                dp[j] = 0
            elif j > 0:
                dp[j] += dp[j - 1]

    return dp[n - 1]`
      ,
        steps: [
                  {
                            "lines": [
                                      1,
                                      2,
                                      3,
                                      4,
                                      6
                            ],
                            "title": "Define unique_paths",
                            "description": "Define the unique_paths function which takes m, n as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      7,
                                      8,
                                      9,
                                      10
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(1, m) using variable 'i'. Each iteration processes one element."
                  },
                  {
                            "lines": [
                                      12,
                                      14,
                                      15,
                                      16
                            ],
                            "title": "Return Result",
                            "description": "Return the computed result: dp[m - 1][n - 1]. This is the final output of the function. Define the unique_paths_optimized function which takes m, n as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      18,
                                      19,
                                      20,
                                      22,
                                      24,
                                      25,
                                      26
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(1, m) using variable 'i'. Each iteration processes one element. Return the computed result: dp[n - 1]. This is the final output of the function. Define the unique_paths_with_obstacles function which takes grid as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      28,
                                      29,
                                      31,
                                      32
                            ],
                            "title": "Conditional Check",
                            "description": "Check the condition: grid[0][0] == 1 or grid[m - 1][n - 1] == 1. This determines the path of execution based on the current state."
                  },
                  {
                            "lines": [
                                      34,
                                      35,
                                      36,
                                      37,
                                      38,
                                      39,
                                      41
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(m) using variable 'i'. Each iteration processes one element. Return the computed result: dp[n - 1]. This is the final output of the function."
                  }
        ]
      }
    ],
    keyInsights: [
      "Paths to cell (i,j) equals sum of paths to (i-1,j) and (i,j-1)",
      "Base case: first row and column all have exactly 1 path",
      "Can optimize from O(mn) to O(n) space using single row",
      "Mathematically equivalent to combinations: C(m+n-2, m-1)"
    ],
    whenToUse: [
      "Robot path planning in grid environments",
      "Counting routes in navigation systems",
      "Game board path enumeration problems"
    ]
  },
  {
    id: "DP_014",
    name: "Maximum Subarray (Kadane's)",
    category: "Dynamic Programming",
    difficulty: "Beginner",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    description: "Finds the contiguous subarray with the largest sum using Kadane's algorithm.",
    longDescription: "Kadane's Algorithm finds the maximum sum of any contiguous subarray in linear time. The elegant DP approach maintains the maximum sum ending at each position by deciding whether to extend the current subarray or start a new one. At each element, if adding it to the current sum is better than starting fresh, we extend; otherwise, we start anew. This algorithm demonstrates optimal substructure beautifully and is fundamental in financial analysis for finding maximum profit periods, signal processing, and genomics. It's an excellent example of how DP can achieve linear time complexity.",
    icon: "show_chart",
    complexityScore: 0.25,
    tags: ["arrays", "optimization", "linear-dp", "kadanes", "streaming"],
    leetcodeProblems: [
      "Maximum Subarray",
      "Maximum Sum Circular Subarray",
      "Maximum Product Subarray"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function maxSubArray(nums: number[]): number {
  let maxSum = nums[0];
  let currentSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // Either extend current subarray or start new one
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}

// Return the actual subarray indices
function maxSubArrayWithIndices(nums: number[]): { sum: number; start: number; end: number } {
  let maxSum = nums[0];
  let currentSum = nums[0];
  let maxStart = 0, maxEnd = 0;
  let currentStart = 0;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > currentSum + nums[i]) {
      currentSum = nums[i];
      currentStart = i;
    } else {
      currentSum += nums[i];
    }

    if (currentSum > maxSum) {
      maxSum = currentSum;
      maxStart = currentStart;
      maxEnd = i;
    }
  }

  return { sum: maxSum, start: maxStart, end: maxEnd };
}`,
        steps: [
          {
            lines: [1, 2, 3],
            title: "Initialize variables",
            description: "Set both maxSum and currentSum to the first element. maxSum tracks the global maximum found so far, while currentSum tracks the maximum sum ending at the current position."
          },
          {
            lines: [5],
            title: "Iterate through array",
            description: "Process each element starting from index 1. At each position, make a decision about whether to extend the current subarray or start a new one."
          },
          {
            lines: [6, 7],
            title: "Extend or restart subarray",
            description: "The key insight of Kadane's algorithm: at each position, either add the current element to the existing sum (extend) or start fresh with just the current element. Choose whichever is larger."
          },
          {
            lines: [8],
            title: "Update global maximum",
            description: "After updating currentSum, check if it exceeds the global maximum. If so, update maxSum. This ensures we track the best subarray seen so far."
          },
          {
            lines: [11],
            title: "Return maximum sum",
            description: "maxSum contains the largest sum of any contiguous subarray. This elegant O(n) solution processes each element exactly once, making a greedy local decision that leads to the global optimum."
          }
        ]
      },
      {
        language: "python",
        code: `def max_subarray(nums: list[int]) -> int:
    """Find maximum sum of contiguous subarray using Kadane's algorithm."""
    max_sum = current_sum = nums[0]

    for i in range(1, len(nums)):
        # Either extend current subarray or start new one
        current_sum = max(nums[i], current_sum + nums[i])
        max_sum = max(max_sum, current_sum)

    return max_sum

def max_subarray_with_indices(nums: list[int]) -> tuple[int, int, int]:
    """Return maximum sum and the subarray indices."""
    max_sum = current_sum = nums[0]
    max_start = max_end = 0
    current_start = 0

    for i in range(1, len(nums)):
        if nums[i] > current_sum + nums[i]:
            current_sum = nums[i]
            current_start = i
        else:
            current_sum += nums[i]

        if current_sum > max_sum:
            max_sum = current_sum
            max_start = current_start
            max_end = i

    return max_sum, max_start, max_end

def max_subarray_divide_conquer(nums: list[int]) -> int:
    """Alternative divide-and-conquer approach."""
    def max_crossing_sum(arr: list[int], left: int, mid: int, right: int) -> int:
        left_sum = float('-inf')
        current_sum = 0
        for i in range(mid, left - 1, -1):
            current_sum += arr[i]
            left_sum = max(left_sum, current_sum)

        right_sum = float('-inf')
        current_sum = 0
        for i in range(mid + 1, right + 1):
            current_sum += arr[i]
            right_sum = max(right_sum, current_sum)

        return left_sum + right_sum

    def max_subarray_helper(arr: list[int], left: int, right: int) -> int:
        if left == right:
            return arr[left]

        mid = (left + right) // 2

        return max(
            max_subarray_helper(arr, left, mid),
            max_subarray_helper(arr, mid + 1, right),
            max_crossing_sum(arr, left, mid, right)
        )

    return max_subarray_helper(nums, 0, len(nums) - 1)`
      ,
        steps: [
                  {
                            "lines": [
                                      1,
                                      2,
                                      3,
                                      5,
                                      6,
                                      7,
                                      8
                            ],
                            "title": "Define max_subarray",
                            "description": "Define the max_subarray function which takes nums as parameters. This sets up the function signature and documents its interface. Iterate through range(1, len(nums)) using variable 'i'. Each iteration processes one element."
                  },
                  {
                            "lines": [
                                      10,
                                      12,
                                      13,
                                      14,
                                      15,
                                      16
                            ],
                            "title": "Return Result",
                            "description": "Return the computed result: max_sum. This is the final output of the function. Define the max_subarray_with_indices function which takes nums as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      18,
                                      19,
                                      20,
                                      21,
                                      22,
                                      23,
                                      25,
                                      26
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(1, len(nums)) using variable 'i'. Each iteration processes one element."
                  },
                  {
                            "lines": [
                                      30,
                                      32,
                                      33
                            ],
                            "title": "Return Result",
                            "description": "Return the computed result: max_sum, max_start, max_end. This is the final output of the function. Define the max_subarray_divide_conquer function which takes nums as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      34,
                                      35,
                                      36,
                                      37,
                                      38,
                                      39,
                                      41,
                                      42
                            ],
                            "title": "Define max_crossing_sum",
                            "description": "Define the max_crossing_sum function which takes arr, left, mid, right as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      49,
                                      50,
                                      51,
                                      53,
                                      55,
                                      56,
                                      57,
                                      58,
                                      61
                            ],
                            "title": "Define max_subarray_helper",
                            "description": "Define the max_subarray_helper function which takes arr, left, right as parameters. This sets up the function signature and documents its interface. Return the computed result: max_subarray_helper(nums, 0, len(nums) - 1). This is the final output of the function."
                  }
        ]
      }
    ],
    keyInsights: [
      "At each position, decide: extend current subarray or start fresh",
      "Local maximum: max(current element, current element + previous sum)",
      "Global maximum: track the best seen across all positions",
      "Works in one pass with O(1) space - optimal for streaming data"
    ],
    whenToUse: [
      "Finding maximum profit periods in financial time series",
      "Signal processing for detecting strongest signal segments",
      "Genomics for identifying high-scoring sequence regions"
    ]
  },
  {
    id: "DP_015",
    name: "Climbing Stairs",
    category: "Dynamic Programming",
    difficulty: "Beginner",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    description: "Counts distinct ways to climb n stairs taking 1 or 2 steps at a time.",
    longDescription: "The Climbing Stairs problem is a fundamental DP introduction that counts the number of distinct ways to reach the top of a staircase with n steps, where you can climb 1 or 2 steps at a time. The solution follows the Fibonacci pattern: to reach step n, you can come from step n-1 (take 1 step) or step n-2 (take 2 steps). This elegantly demonstrates the optimal substructure property of DP and can be extended to variable step sizes or costs. It's widely used in teaching DP concepts and has applications in counting problems and combinatorics.",
    icon: "stairs",
    complexityScore: 0.2,
    tags: ["fibonacci-variant", "combinatorics", "paths", "beginner-friendly", "recursion"],
    leetcodeProblems: [
      "Climbing Stairs",
      "Min Cost Climbing Stairs",
      "Fibonacci Number"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function climbStairs(n: number): number {
  if (n <= 2) return n;

  // prev2 = ways to reach step i-2
  // prev1 = ways to reach step i-1
  let prev2 = 1;
  let prev1 = 2;

  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

// With cost - find minimum cost to reach top
function minCostClimbingStairs(cost: number[]): number {
  const n = cost.length;
  let prev2 = cost[0];
  let prev1 = cost[1];

  for (let i = 2; i < n; i++) {
    const current = cost[i] + Math.min(prev1, prev2);
    prev2 = prev1;
    prev1 = current;
  }

  // Can start from either last or second-to-last step
  return Math.min(prev1, prev2);
}

// Variable step sizes (can take 1 to k steps)
function climbStairsVariableSteps(n: number, k: number): number {
  const dp: number[] = Array(n + 1).fill(0);
  dp[0] = 1;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= k && j <= i; j++) {
      dp[i] += dp[i - j];
    }
  }

  return dp[n];
}`,
        steps: [
          {
            lines: [1, 2],
            title: "Handle base cases",
            description: "For n <= 2, return n directly. There's 1 way to climb 1 stair (one 1-step) and 2 ways to climb 2 stairs (two 1-steps or one 2-step)."
          },
          {
            lines: [4, 5, 6, 7],
            title: "Initialize state variables",
            description: "Use prev2 and prev1 to track the number of ways to reach the previous two steps. Initialize prev2=1 (step 1) and prev1=2 (step 2). This space-optimized approach uses O(1) space."
          },
          {
            lines: [9],
            title: "Iterate through remaining steps",
            description: "For each step from 3 to n, calculate the number of ways to reach it based on the Fibonacci recurrence relation."
          },
          {
            lines: [10],
            title: "Apply recurrence relation",
            description: "To reach step i, you can come from step i-1 (take 1 step) or step i-2 (take 2 steps). The total ways is the sum: ways[i] = ways[i-1] + ways[i-2], which follows the Fibonacci pattern."
          },
          {
            lines: [11, 12],
            title: "Slide the window forward",
            description: "Update prev2 and prev1 for the next iteration by shifting values: prev2 becomes prev1, and prev1 becomes current. This maintains the two-step sliding window."
          },
          {
            lines: [15],
            title: "Return total ways",
            description: "prev1 contains the number of distinct ways to climb n stairs. This elegant solution mirrors the Fibonacci sequence and demonstrates the optimal substructure of DP."
          }
        ]
      },
      {
        language: "python",
        code: `def climb_stairs(n: int) -> int:
    """Count ways to climb n stairs taking 1 or 2 steps."""
    if n <= 2:
        return n

    # prev2 = ways to reach step i-2
    # prev1 = ways to reach step i-1
    prev2, prev1 = 1, 2

    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2, prev1 = prev1, current

    return prev1

def min_cost_climbing_stairs(cost: list[int]) -> int:
    """Find minimum cost to reach top of stairs."""
    n = len(cost)
    prev2 = cost[0]
    prev1 = cost[1]

    for i in range(2, n):
        current = cost[i] + min(prev1, prev2)
        prev2, prev1 = prev1, current

    # Can start from either last or second-to-last
    return min(prev1, prev2)

def climb_stairs_variable_steps(n: int, k: int) -> int:
    """Count ways to climb n stairs taking 1 to k steps."""
    dp = [0] * (n + 1)
    dp[0] = 1

    for i in range(1, n + 1):
        for j in range(1, min(k, i) + 1):
            dp[i] += dp[i - j]

    return dp[n]`
      ,
        steps: [
                  {
                            "lines": [
                                      1,
                                      2,
                                      3,
                                      4,
                                      6,
                                      7,
                                      8
                            ],
                            "title": "Define climb_stairs",
                            "description": "Define the climb_stairs function which takes n as parameters. This sets up the function signature and documents its interface. Check the condition: n <= 2. This determines the path of execution based on the current state."
                  },
                  {
                            "lines": [
                                      10,
                                      11,
                                      12
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(3, n + 1) using variable 'i'. Each iteration processes one element."
                  },
                  {
                            "lines": [
                                      14,
                                      16,
                                      17,
                                      18,
                                      19,
                                      20
                            ],
                            "title": "Return Result",
                            "description": "Return the computed result: prev1. This is the final output of the function. Define the min_cost_climbing_stairs function which takes cost as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      22,
                                      23,
                                      24,
                                      26
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(2, n) using variable 'i'. Each iteration processes one element."
                  },
                  {
                            "lines": [
                                      27,
                                      29,
                                      30,
                                      31,
                                      32
                            ],
                            "title": "Return Result",
                            "description": "Return the computed result: min(prev1, prev2). This is the final output of the function. Define the climb_stairs_variable_steps function which takes n, k as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      34,
                                      35,
                                      36,
                                      38
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(1, n + 1) using variable 'i'. Each iteration processes one element. Return the computed result: dp[n]. This is the final output of the function."
                  }
        ]
      }
    ],
    keyInsights: [
      "Follows Fibonacci pattern: ways[n] = ways[n-1] + ways[n-2]",
      "Base cases: 1 way for 1 step, 2 ways for 2 steps",
      "Space optimization: only need two previous values",
      "Can be extended to variable step sizes or minimum cost variants"
    ],
    whenToUse: [
      "Introduction to dynamic programming concepts",
      "Counting path problems with constrained movements",
      "Teaching optimal substructure and state transitions"
    ]
  },
  {
    id: "DP_016",
    name: "Best Time to Buy/Sell Stock",
    category: "Dynamic Programming",
    difficulty: "Beginner",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    description: "Finds maximum profit from buying and selling stock with various transaction constraints.",
    longDescription: "The Stock Trading problems involve finding the maximum profit from buying and selling stock given an array of daily prices. The basic version allows one transaction (buy once, sell once), while variations include unlimited transactions, at most k transactions, with cooldown periods, or with transaction fees. The DP approach maintains states for holding or not holding stock and transitions between states. This problem teaches state machine DP and has direct applications in financial algorithms, trading strategies, and optimization problems with multiple states.",
    icon: "candlestick_chart",
    complexityScore: 0.25,
    tags: ["state-machine", "optimization", "trading", "finance", "greedy"],
    leetcodeProblems: [
      "Best Time to Buy and Sell Stock",
      "Best Time to Buy and Sell Stock II",
      "Best Time to Buy and Sell Stock with Cooldown"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `// Single transaction (buy once, sell once)
function maxProfit(prices: number[]): number {
  let minPrice = prices[0];
  let maxProfit = 0;

  for (let i = 1; i < prices.length; i++) {
    maxProfit = Math.max(maxProfit, prices[i] - minPrice);
    minPrice = Math.min(minPrice, prices[i]);
  }

  return maxProfit;
}

// Unlimited transactions
function maxProfitUnlimited(prices: number[]): number {
  let profit = 0;

  for (let i = 1; i < prices.length; i++) {
    // Buy yesterday, sell today if profitable
    if (prices[i] > prices[i - 1]) {
      profit += prices[i] - prices[i - 1];
    }
  }

  return profit;
}

// With cooldown (must wait 1 day after selling)
function maxProfitWithCooldown(prices: number[]): number {
  let sold = 0;      // Max profit if we just sold
  let held = -prices[0];  // Max profit if holding stock
  let reset = 0;     // Max profit in cooldown/reset state

  for (let i = 1; i < prices.length; i++) {
    const prevSold = sold;
    const prevHeld = held;
    const prevReset = reset;

    sold = prevHeld + prices[i];       // Sell today
    held = Math.max(prevHeld, prevReset - prices[i]); // Buy today or keep holding
    reset = Math.max(prevReset, prevSold); // Cooldown or stay in reset
  }

  return Math.max(sold, reset);
}`,
        steps: [
          {
            lines: [1, 2, 3, 4],
            title: "Initialize tracking variables",
            description: "Set minPrice to the first day's price (lowest price seen so far) and maxProfit to 0 (best profit achievable). These track the optimal buy point and maximum profit as we scan through prices."
          },
          {
            lines: [6],
            title: "Iterate through prices",
            description: "Process each day's price starting from day 1. For each price, we'll check if selling today yields better profit and update our minimum buy price."
          },
          {
            lines: [7],
            title: "Update maximum profit",
            description: "Calculate profit if we sell today (prices[i] - minPrice). Update maxProfit if this is better than any previous profit. This represents selling at the current price after buying at the lowest price seen so far."
          },
          {
            lines: [8],
            title: "Update minimum price",
            description: "Update minPrice to be the minimum of current minPrice and today's price. This ensures we always know the best buying opportunity up to the current day."
          },
          {
            lines: [11],
            title: "Return maximum profit",
            description: "maxProfit contains the maximum profit from a single buy-sell transaction. This greedy approach works because we track the minimum price seen and maximum profit achievable at each step."
          }
        ]
      },
      {
        language: "python",
        code: `def max_profit(prices: list[int]) -> int:
    """Single transaction - buy once, sell once."""
    min_price = prices[0]
    max_profit = 0

    for i in range(1, len(prices)):
        max_profit = max(max_profit, prices[i] - min_price)
        min_price = min(min_price, prices[i])

    return max_profit

def max_profit_unlimited(prices: list[int]) -> int:
    """Unlimited transactions - buy and sell multiple times."""
    profit = 0

    for i in range(1, len(prices)):
        # Capture every upward price movement
        if prices[i] > prices[i - 1]:
            profit += prices[i] - prices[i - 1]

    return profit

def max_profit_with_cooldown(prices: list[int]) -> int:
    """With cooldown - must wait 1 day after selling."""
    if not prices:
        return 0

    sold = 0           # Max profit if we just sold
    held = -prices[0]  # Max profit if holding stock
    reset = 0          # Max profit in cooldown/reset state

    for i in range(1, len(prices)):
        prev_sold = sold
        prev_held = held
        prev_reset = reset

        sold = prev_held + prices[i]  # Sell today
        held = max(prev_held, prev_reset - prices[i])  # Buy or hold
        reset = max(prev_reset, prev_sold)  # Cooldown

    return max(sold, reset)

def max_profit_with_fee(prices: list[int], fee: int) -> int:
    """With transaction fee."""
    cash = 0  # Max profit without holding stock
    hold = -prices[0]  # Max profit while holding stock

    for i in range(1, len(prices)):
        cash = max(cash, hold + prices[i] - fee)
        hold = max(hold, cash - prices[i])

    return cash`
      ,
        steps: [
                  {
                            "lines": [
                                      1,
                                      2,
                                      3,
                                      4,
                                      6,
                                      7,
                                      8,
                                      10,
                                      12,
                                      13
                            ],
                            "title": "Define max_profit",
                            "description": "Define the max_profit function which takes prices as parameters. This sets up the function signature and documents its interface. Iterate through range(1, len(prices)) using variable 'i'. Each iteration processes one element. Return the computed result: max_profit. This is the final output of the function. Define the max_profit_unlimited function which takes prices as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      16,
                                      17,
                                      18,
                                      19
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(1, len(prices)) using variable 'i'. Each iteration processes one element."
                  },
                  {
                            "lines": [
                                      21,
                                      23,
                                      24,
                                      25,
                                      26,
                                      28,
                                      29,
                                      30
                            ],
                            "title": "Return Result",
                            "description": "Return the computed result: profit. This is the final output of the function. Define the max_profit_with_cooldown function which takes prices as parameters. This sets up the function signature and documents its interface. Check the condition: not prices. This determines the path of execution based on the current state."
                  },
                  {
                            "lines": [
                                      32,
                                      33,
                                      34,
                                      35,
                                      37,
                                      38,
                                      39
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(1, len(prices)) using variable 'i'. Each iteration processes one element."
                  },
                  {
                            "lines": [
                                      41,
                                      43,
                                      44,
                                      45,
                                      46
                            ],
                            "title": "Return Result",
                            "description": "Return the computed result: max(sold, reset). This is the final output of the function. Define the max_profit_with_fee function which takes prices, fee as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      48,
                                      49,
                                      50,
                                      52
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(1, len(prices)) using variable 'i'. Each iteration processes one element. Return the computed result: cash. This is the final output of the function."
                  }
        ]
      }
    ],
    keyInsights: [
      "Single transaction: track minimum price and maximum profit at each step",
      "Unlimited transactions: greedy approach - capture every price increase",
      "State machine DP: maintain states for holding/not holding stock",
      "Cooldown variant requires tracking sold, held, and reset states"
    ],
    whenToUse: [
      "Financial trading algorithms and strategy optimization",
      "Resource allocation with buy/sell decisions over time",
      "State machine problems with multiple valid states"
    ]
  },
  {
    id: "DP_017",
    name: "Decode Ways",
    category: "Dynamic Programming",
    difficulty: "Medium",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    description: "Counts ways to decode a digit string where 'A'=1, 'B'=2, ..., 'Z'=26.",
    longDescription: "Decode Ways counts the number of ways to decode a string of digits into letters, where 'A' is encoded as '1', 'B' as '2', up to 'Z' as '26'. At each position, we can decode one digit (if 1-9) or two digits (if 10-26), similar to the climbing stairs pattern. The DP solution maintains the number of ways to decode up to each position. This problem demonstrates decision-making DP with validity constraints and has applications in cryptography, telecommunications, and string parsing with multiple interpretations.",
    icon: "password",
    complexityScore: 0.5,
    tags: ["strings", "decoding", "fibonacci-variant", "constraints", "combinatorics"],
    leetcodeProblems: [
      "Decode Ways",
      "Decode Ways II",
      "Number of Ways to Separate Numbers"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function numDecodings(s: string): number {
  if (s[0] === '0') return 0;

  const n = s.length;
  const dp: number[] = Array(n + 1).fill(0);
  dp[0] = 1; // Empty string
  dp[1] = 1; // First character (already checked not '0')

  for (let i = 2; i <= n; i++) {
    const oneDigit = parseInt(s.substring(i - 1, i));
    const twoDigits = parseInt(s.substring(i - 2, i));

    // Decode as single digit (1-9)
    if (oneDigit >= 1 && oneDigit <= 9) {
      dp[i] += dp[i - 1];
    }

    // Decode as two digits (10-26)
    if (twoDigits >= 10 && twoDigits <= 26) {
      dp[i] += dp[i - 2];
    }
  }

  return dp[n];
}

// Space-optimized version
function numDecodingsOptimized(s: string): number {
  if (s[0] === '0') return 0;

  let prev2 = 1; // dp[i-2]
  let prev1 = 1; // dp[i-1]

  for (let i = 2; i <= s.length; i++) {
    let current = 0;

    const oneDigit = parseInt(s[i - 1]);
    const twoDigits = parseInt(s.substring(i - 2, i));

    if (oneDigit >= 1 && oneDigit <= 9) {
      current += prev1;
    }

    if (twoDigits >= 10 && twoDigits <= 26) {
      current += prev2;
    }

    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}`,
        steps: [
          {
            lines: [1, 2],
            title: "Handle invalid start",
            description: "If the string starts with '0', it cannot be decoded (no letter maps to 0), so return 0 immediately. This is a critical validation check."
          },
          {
            lines: [4, 5, 6, 7],
            title: "Initialize DP array",
            description: "Create dp array where dp[i] represents the number of ways to decode s[0:i]. Set dp[0]=1 (empty string has one way) and dp[1]=1 (first character, already validated as non-zero)."
          },
          {
            lines: [9, 10, 11],
            title: "Iterate through string positions",
            description: "For each position i from 2 to n, extract both one-digit (current char) and two-digit (previous + current) numbers to check decoding possibilities."
          },
          {
            lines: [13, 14, 15, 16],
            title: "Check single-digit decoding",
            description: "If the current digit (1-9) can be decoded as a single letter, add dp[i-1] to dp[i]. This represents extending all previous decodings with this single character."
          },
          {
            lines: [18, 19, 20, 21],
            title: "Check two-digit decoding",
            description: "If the previous two digits form a valid number (10-26), add dp[i-2] to dp[i]. This represents extending decodings from two positions back with this two-character letter."
          },
          {
            lines: [24],
            title: "Return total decode ways",
            description: "dp[n] contains the total number of ways to decode the entire string. This follows a Fibonacci-like pattern where each position can be reached via one or two digit decoding."
          }
        ]
      },
      {
        language: "python",
        code: `def num_decodings(s: str) -> int:
    """Count ways to decode digit string into letters."""
    if s[0] == '0':
        return 0

    n = len(s)
    dp = [0] * (n + 1)
    dp[0] = 1  # Empty string
    dp[1] = 1  # First character

    for i in range(2, n + 1):
        one_digit = int(s[i - 1])
        two_digits = int(s[i - 2:i])

        # Decode as single digit (1-9)
        if 1 <= one_digit <= 9:
            dp[i] += dp[i - 1]

        # Decode as two digits (10-26)
        if 10 <= two_digits <= 26:
            dp[i] += dp[i - 2]

    return dp[n]

def num_decodings_optimized(s: str) -> int:
    """Space-optimized version using O(1) space."""
    if s[0] == '0':
        return 0

    prev2 = 1  # dp[i-2]
    prev1 = 1  # dp[i-1]

    for i in range(2, len(s) + 1):
        current = 0

        one_digit = int(s[i - 1])
        two_digits = int(s[i - 2:i])

        if 1 <= one_digit <= 9:
            current += prev1

        if 10 <= two_digits <= 26:
            current += prev2

        prev2, prev1 = prev1, current

    return prev1`
      ,
        steps: [
                  {
                            "lines": [
                                      1,
                                      2
                            ],
                            "title": "Define num_decodings",
                            "description": "Define the num_decodings function which takes s as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      3,
                                      4,
                                      6,
                                      7,
                                      8,
                                      9
                            ],
                            "title": "Conditional Check",
                            "description": "Check the condition: s[0] == '0'. This determines the path of execution based on the current state."
                  },
                  {
                            "lines": [
                                      11,
                                      12,
                                      13,
                                      15,
                                      16,
                                      17,
                                      19,
                                      20
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(2, n + 1) using variable 'i'. Each iteration processes one element."
                  },
                  {
                            "lines": [
                                      23,
                                      25,
                                      26
                            ],
                            "title": "Return Result",
                            "description": "Return the computed result: dp[n]. This is the final output of the function. Define the num_decodings_optimized function which takes s as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      27,
                                      28,
                                      30,
                                      31
                            ],
                            "title": "Conditional Check",
                            "description": "Check the condition: s[0] == '0'. This determines the path of execution based on the current state."
                  },
                  {
                            "lines": [
                                      33,
                                      34,
                                      36,
                                      37,
                                      39,
                                      40,
                                      42,
                                      43,
                                      47
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(2, len(s) + 1) using variable 'i'. Each iteration processes one element. Return the computed result: prev1. This is the final output of the function."
                  }
        ]
      }
    ],
    keyInsights: [
      "Similar to Fibonacci: ways[i] depends on ways[i-1] and ways[i-2]",
      "Must validate: single digit 1-9, two digits 10-26",
      "Leading zeros invalidate previous decodings",
      "Space can be optimized to O(1) using two variables"
    ],
    whenToUse: [
      "String decoding problems with multiple valid interpretations",
      "Counting valid parsings of ambiguous encodings",
      "Telecommunications and cryptography applications"
    ]
  },
  {
    id: "DP_018",
    name: "Longest Palindromic Substring",
    category: "Dynamic Programming",
    difficulty: "Medium",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(n²)",
    description: "Finds the longest palindromic substring within a given string.",
    longDescription: "The Longest Palindromic Substring problem finds the longest contiguous substring that reads the same forwards and backwards. The DP solution uses a 2D table where dp[i][j] indicates whether substring from index i to j is a palindrome. Building from smaller lengths to larger, it checks if characters match and the inner substring is palindromic. Alternative approaches include expanding around centers (O(n²) time, O(1) space) and Manacher's algorithm (O(n) time). This problem is fundamental in string processing, DNA analysis, and text pattern recognition.",
    icon: "text_rotation_none",
    complexityScore: 0.6,
    tags: ["strings", "palindromes", "2d-dp", "expand-around-center", "optimization"],
    leetcodeProblems: [
      "Longest Palindromic Substring",
      "Palindromic Substrings",
      "Longest Palindromic Subsequence"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function longestPalindrome(s: string): string {
  const n = s.length;
  if (n < 2) return s;

  let start = 0, maxLen = 1;

  // Expand around center approach - O(n^2) time, O(1) space
  const expandAroundCenter = (left: number, right: number): void => {
    while (left >= 0 && right < n && s[left] === s[right]) {
      const currentLen = right - left + 1;
      if (currentLen > maxLen) {
        start = left;
        maxLen = currentLen;
      }
      left--;
      right++;
    }
  };

  for (let i = 0; i < n; i++) {
    expandAroundCenter(i, i);     // Odd length palindromes
    expandAroundCenter(i, i + 1); // Even length palindromes
  }

  return s.substring(start, start + maxLen);
}

// DP approach with O(n^2) space
function longestPalindromeDP(s: string): string {
  const n = s.length;
  const dp: boolean[][] = Array(n)
    .fill(0)
    .map(() => Array(n).fill(false));

  let start = 0, maxLen = 1;

  // All single characters are palindromes
  for (let i = 0; i < n; i++) {
    dp[i][i] = true;
  }

  // Check for length 2
  for (let i = 0; i < n - 1; i++) {
    if (s[i] === s[i + 1]) {
      dp[i][i + 1] = true;
      start = i;
      maxLen = 2;
    }
  }

  // Check for lengths 3 and above
  for (let len = 3; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;

      if (s[i] === s[j] && dp[i + 1][j - 1]) {
        dp[i][j] = true;
        start = i;
        maxLen = len;
      }
    }
  }

  return s.substring(start, start + maxLen);
}`,
        steps: [
          {
            lines: [1, 2, 3, 4, 5],
            title: "Initialize tracking variables",
            description: "Handle base case for strings shorter than 2 characters. Initialize start (beginning index of longest palindrome) and maxLen (its length) to track the best palindrome found."
          },
          {
            lines: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
            title: "Define expand around center helper",
            description: "Create a helper function that expands outward from a center position while characters match. This efficiently finds palindromes centered at any position. Updates start and maxLen when a longer palindrome is found."
          },
          {
            lines: [20, 21, 22],
            title: "Try all possible centers",
            description: "For each position, try expanding around two types of centers: single character (odd-length palindromes like 'aba') and between two characters (even-length palindromes like 'abba'). This covers all possible palindromes."
          },
          {
            lines: [24],
            title: "Return longest palindrome",
            description: "Extract and return the substring from start with length maxLen. This expand-around-center approach achieves O(n²) time with O(1) space, more efficient than the DP table approach."
          }
        ]
      },
      {
        language: "python",
        code: `def longest_palindrome(s: str) -> str:
    """Find longest palindromic substring using expand around center."""
    if len(s) < 2:
        return s

    start = 0
    max_len = 1

    def expand_around_center(left: int, right: int) -> None:
        nonlocal start, max_len

        while left >= 0 and right < len(s) and s[left] == s[right]:
            current_len = right - left + 1
            if current_len > max_len:
                start = left
                max_len = current_len
            left -= 1
            right += 1

    for i in range(len(s)):
        expand_around_center(i, i)      # Odd length
        expand_around_center(i, i + 1)  # Even length

    return s[start:start + max_len]

def longest_palindrome_dp(s: str) -> str:
    """DP approach with O(n^2) space."""
    n = len(s)
    dp = [[False] * n for _ in range(n)]

    start = 0
    max_len = 1

    # Single characters
    for i in range(n):
        dp[i][i] = True

    # Length 2
    for i in range(n - 1):
        if s[i] == s[i + 1]:
            dp[i][i + 1] = True
            start = i
            max_len = 2

    # Length 3 and above
    for length in range(3, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1

            if s[i] == s[j] and dp[i + 1][j - 1]:
                dp[i][j] = True
                start = i
                max_len = length

    return s[start:start + max_len]

def count_palindromic_substrings(s: str) -> int:
    """Count all palindromic substrings."""
    count = 0

    def expand_around_center(left: int, right: int) -> int:
        cnt = 0
        while left >= 0 and right < len(s) and s[left] == s[right]:
            cnt += 1
            left -= 1
            right += 1
        return cnt

    for i in range(len(s)):
        count += expand_around_center(i, i)      # Odd
        count += expand_around_center(i, i + 1)  # Even

    return count`
      ,
        steps: [
                  {
                            "lines": [
                                      1,
                                      2,
                                      3,
                                      4,
                                      6,
                                      7
                            ],
                            "title": "Define longest_palindrome",
                            "description": "Define the longest_palindrome function which takes s as parameters. This sets up the function signature and documents its interface. Check the condition: len(s) < 2. This determines the path of execution based on the current state."
                  },
                  {
                            "lines": [
                                      9,
                                      10,
                                      12,
                                      13,
                                      14,
                                      15,
                                      16,
                                      17
                            ],
                            "title": "Define expand_around_center",
                            "description": "Define the expand_around_center function which takes left, right as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      20,
                                      21,
                                      22,
                                      24,
                                      26,
                                      27,
                                      28,
                                      29,
                                      31,
                                      32
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(len(s)) using variable 'i'. Each iteration processes one element. Return the computed result: s[start:start + max_len]. This is the final output of the function. Define the longest_palindrome_dp function which takes s as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      35,
                                      36,
                                      38,
                                      39,
                                      40,
                                      41,
                                      42,
                                      43,
                                      45
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(n) using variable 'i'. Each iteration processes one element. Iterate through range(n - 1) using variable 'i'. Each iteration processes one element."
                  },
                  {
                            "lines": [
                                      46,
                                      47,
                                      48,
                                      50,
                                      51,
                                      52,
                                      53
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(3, n + 1) using variable 'length'. Each iteration processes one element."
                  },
                  {
                            "lines": [
                                      55,
                                      57,
                                      58,
                                      59,
                                      61,
                                      62,
                                      63,
                                      64,
                                      65,
                                      66
                            ],
                            "title": "Return Result",
                            "description": "Return the computed result: s[start:start + max_len]. This is the final output of the function. Define the count_palindromic_substrings function which takes s as parameters. This sets up the function signature and documents its interface. Define the expand_around_center function which takes left, right as parameters. This sets up the function signature and documents its interface. Iterate through range(len(s)) using variable 'i'. Each iteration processes one element. Return the computed result: count. This is the final output of the function."
                  }
        ]
      }
    ],
    keyInsights: [
      "DP approach: dp[i][j] = true if s[i:j+1] is palindrome",
      "Build from smaller lengths: palindrome if chars match and inner is palindrome",
      "Expand around center is more space-efficient: O(1) vs O(n²)",
      "Manacher's algorithm can solve in O(n) time but complex to implement"
    ],
    whenToUse: [
      "Finding palindromic patterns in DNA sequences",
      "Text analysis and pattern recognition",
      "String similarity and matching problems"
    ]
  },
  {
    id: "DP_019",
    name: "Regular Expression Matching",
    category: "Dynamic Programming",
    difficulty: "Advanced",
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(m*n)",
    description: "Implements regex matching with '.' (any character) and '*' (zero or more of preceding element).",
    longDescription: "Regular Expression Matching implements pattern matching where '.' matches any single character and '*' matches zero or more of the preceding element. The DP solution uses a 2D table where dp[i][j] represents whether the first i characters of the string match the first j characters of the pattern. The star operator requires special handling as it can match zero occurrences or one-or-more occurrences. This problem demonstrates complex state transitions in DP and is fundamental to compiler design, text editors, search engines, and validation systems.",
    icon: "code",
    complexityScore: 0.9,
    tags: ["strings", "pattern-matching", "regex", "2d-dp", "complex-transitions"],
    leetcodeProblems: [
      "Regular Expression Matching",
      "Wildcard Matching",
      "Edit Distance"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function isMatch(s: string, p: string): boolean {
  const m = s.length;
  const n = p.length;

  // dp[i][j] = true if s[0:i] matches p[0:j]
  const dp: boolean[][] = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(false));

  dp[0][0] = true; // Empty string matches empty pattern

  // Handle patterns like a*, a*b*, a*b*c* (can match empty string)
  for (let j = 2; j <= n; j++) {
    if (p[j - 1] === '*') {
      dp[0][j] = dp[0][j - 2];
    }
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === '*') {
        // Star can match zero or more of preceding element
        // Zero occurrences: dp[i][j-2]
        dp[i][j] = dp[i][j - 2];

        // One or more occurrences: check if preceding element matches
        if (p[j - 2] === s[i - 1] || p[j - 2] === '.') {
          dp[i][j] = dp[i][j] || dp[i - 1][j];
        }
      } else if (p[j - 1] === '.' || p[j - 1] === s[i - 1]) {
        // Current characters match
        dp[i][j] = dp[i - 1][j - 1];
      }
    }
  }

  return dp[m][n];
}`,
        steps: [
          {
            lines: [1, 2, 3, 4, 5, 6, 7, 8],
            title: "Initialize DP table",
            description: "Create a 2D boolean table where dp[i][j] indicates whether the first i characters of string s match the first j characters of pattern p. Size is (m+1) x (n+1) to handle empty string cases."
          },
          {
            lines: [10],
            title: "Set base case",
            description: "dp[0][0] = true because an empty string matches an empty pattern. This is the foundation for building up all other matches."
          },
          {
            lines: [12, 13, 14, 15, 16, 17],
            title: "Handle star patterns matching empty string",
            description: "Patterns like 'a*', 'a*b*', 'a*b*c*' can match empty string when stars match zero occurrences. If p[j-1] is '*', check if pattern up to j can match empty string by looking at dp[0][j-2] (skip the char and star)."
          },
          {
            lines: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
            title: "Process each character pair",
            description: "For each position (i,j), handle three cases: (1) if pattern has '*', try matching zero occurrences (dp[i][j-2]) or if preceding char matches, try one-or-more occurrences (dp[i-1][j]); (2) if pattern has '.' or chars match exactly, carry forward dp[i-1][j-1]; (3) otherwise stay false."
          },
          {
            lines: [36],
            title: "Return match result",
            description: "dp[m][n] indicates whether the entire string s matches the entire pattern p. This is built from optimal solutions to all prefix matching subproblems, handling complex star semantics."
          }
        ]
      },
      {
        language: "python",
        code: `def is_match(s: str, p: str) -> bool:
    """Implement regex matching with . and * operators."""
    m, n = len(s), len(p)

    # dp[i][j] = True if s[0:i] matches p[0:j]
    dp = [[False] * (n + 1) for _ in range(m + 1)]

    dp[0][0] = True  # Empty matches empty

    # Handle patterns like a*, a*b*, a*b*c*
    for j in range(2, n + 1):
        if p[j - 1] == '*':
            dp[0][j] = dp[0][j - 2]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j - 1] == '*':
                # Star matches zero or more
                # Zero occurrences
                dp[i][j] = dp[i][j - 2]

                # One or more occurrences
                if p[j - 2] == s[i - 1] or p[j - 2] == '.':
                    dp[i][j] = dp[i][j] or dp[i - 1][j]

            elif p[j - 1] == '.' or p[j - 1] == s[i - 1]:
                # Characters match
                dp[i][j] = dp[i - 1][j - 1]

    return dp[m][n]

def is_match_recursive(s: str, p: str) -> bool:
    """Recursive approach with memoization."""
    memo = {}

    def dp(i: int, j: int) -> bool:
        if (i, j) in memo:
            return memo[(i, j)]

        # Pattern exhausted
        if j == len(p):
            return i == len(s)

        # Check if first characters match
        first_match = i < len(s) and (p[j] == s[i] or p[j] == '.')

        # Handle star operator
        if j + 1 < len(p) and p[j + 1] == '*':
            # Zero occurrences or one-or-more
            result = (dp(i, j + 2) or
                     (first_match and dp(i + 1, j)))
        else:
            # Must match current character
            result = first_match and dp(i + 1, j + 1)

        memo[(i, j)] = result
        return result

    return dp(0, 0)`
      ,
        steps: [
                  {
                            "lines": [
                                      1,
                                      2,
                                      3,
                                      5,
                                      6,
                                      8,
                                      10
                            ],
                            "title": "Define is_match",
                            "description": "Define the is_match function which takes s, p as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      11,
                                      12,
                                      13
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(2, n + 1) using variable 'j'. Each iteration processes one element."
                  },
                  {
                            "lines": [
                                      15,
                                      16,
                                      17,
                                      18,
                                      19,
                                      20,
                                      22,
                                      23
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(1, m + 1) using variable 'i'. Each iteration processes one element."
                  },
                  {
                            "lines": [
                                      30
                            ],
                            "title": "Return Result",
                            "description": "Return the computed result: dp[m][n]. This is the final output of the function."
                  },
                  {
                            "lines": [
                                      32,
                                      33,
                                      34
                            ],
                            "title": "Define is_match_recursive",
                            "description": "Define the is_match_recursive function which takes s, p as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      36,
                                      37,
                                      38,
                                      40,
                                      41,
                                      42,
                                      44,
                                      45
                            ],
                            "title": "Define dp",
                            "description": "Define the dp function which takes i, j as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      59
                            ],
                            "title": "Return Result",
                            "description": "Return the computed result: dp(0, 0). This is the final output of the function."
                  }
        ]
      }
    ],
    keyInsights: [
      "Star operator has two cases: match zero occurrences or one-or-more",
      "Dot operator matches any single character unconditionally",
      "Must handle patterns like a*b*c* that can match empty string",
      "Recursive solution with memoization provides cleaner logic than bottom-up"
    ],
    whenToUse: [
      "Implementing regex engines and pattern matchers",
      "Text validation and search functionality",
      "Compiler design for lexical analysis"
    ]
  },
  {
    id: "DP_020",
    name: "Interleaving String",
    category: "Dynamic Programming",
    difficulty: "Advanced",
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(m*n)",
    description: "Determines if s3 is formed by interleaving s1 and s2 while preserving their character orders.",
    longDescription: "The Interleaving String problem checks whether a string s3 can be formed by interleaving characters from s1 and s2 while maintaining the relative order of characters from each string. The DP solution uses a 2D table where dp[i][j] represents whether the first i characters of s1 and first j characters of s2 can form the first i+j characters of s3. At each cell, we check if we can extend from either the cell above (using s1) or the cell to the left (using s2). This problem demonstrates path-based DP and has applications in DNA sequence analysis and string merging problems.",
    icon: "shuffle",
    complexityScore: 0.75,
    tags: ["strings", "2d-dp", "path-based", "interleaving", "sequences"],
    leetcodeProblems: [
      "Interleaving String",
      "Distinct Subsequences",
      "Scramble String"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function isInterleave(s1: string, s2: string, s3: string): boolean {
  const m = s1.length;
  const n = s2.length;

  if (m + n !== s3.length) return false;

  // dp[i][j] = true if s1[0:i] and s2[0:j] can form s3[0:i+j]
  const dp: boolean[][] = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(false));

  dp[0][0] = true;

  // Fill first column (only using s1)
  for (let i = 1; i <= m; i++) {
    dp[i][0] = dp[i - 1][0] && s1[i - 1] === s3[i - 1];
  }

  // Fill first row (only using s2)
  for (let j = 1; j <= n; j++) {
    dp[0][j] = dp[0][j - 1] && s2[j - 1] === s3[j - 1];
  }

  // Fill the rest of the table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const k = i + j - 1; // Current position in s3

      // Can extend from cell above (use char from s1)
      if (s1[i - 1] === s3[k]) {
        dp[i][j] = dp[i][j] || dp[i - 1][j];
      }

      // Can extend from cell to left (use char from s2)
      if (s2[j - 1] === s3[k]) {
        dp[i][j] = dp[i][j] || dp[i][j - 1];
      }
    }
  }

  return dp[m][n];
}

// Space-optimized version
function isInterleaveOptimized(s1: string, s2: string, s3: string): boolean {
  const m = s1.length;
  const n = s2.length;

  if (m + n !== s3.length) return false;

  const dp: boolean[] = Array(n + 1).fill(false);
  dp[0] = true;

  for (let j = 1; j <= n; j++) {
    dp[j] = dp[j - 1] && s2[j - 1] === s3[j - 1];
  }

  for (let i = 1; i <= m; i++) {
    dp[0] = dp[0] && s1[i - 1] === s3[i - 1];

    for (let j = 1; j <= n; j++) {
      const k = i + j - 1;
      dp[j] = (dp[j] && s1[i - 1] === s3[k]) ||
              (dp[j - 1] && s2[j - 1] === s3[k]);
    }
  }

  return dp[n];
}`,
        steps: [
          {
            lines: [1, 2, 3, 4, 5],
            title: "Validate lengths and initialize",
            description: "First check if s1 and s2 lengths sum to s3 length. If not, interleaving is impossible. Store lengths m and n for array bounds."
          },
          {
            lines: [7, 8, 9, 10, 11, 12],
            title: "Create DP table",
            description: "Initialize a 2D boolean table where dp[i][j] indicates whether the first i characters of s1 and first j characters of s2 can form the first i+j characters of s3. Set dp[0][0]=true (empty strings form empty string)."
          },
          {
            lines: [14, 15, 16, 17, 18, 19, 20, 21, 22],
            title: "Initialize base cases",
            description: "Fill first column (using only s1 characters) and first row (using only s2 characters). Each cell depends on the previous cell in the same row/column and whether the current character matches s3."
          },
          {
            lines: [24, 25, 26, 27],
            title: "Fill DP table",
            description: "For each position (i,j), calculate k = i+j-1 as the current position in s3 that we're trying to form. Check if we can extend from above (using s1) or from left (using s2)."
          },
          {
            lines: [29, 30, 31, 32, 33, 34, 35, 36, 37],
            title: "Check both interleaving paths",
            description: "If s1[i-1] matches s3[k], we can extend from dp[i-1][j] (add character from s1). If s2[j-1] matches s3[k], we can extend from dp[i][j-1] (add character from s2). Either path being valid makes the current position valid."
          },
          {
            lines: [41],
            title: "Return interleaving result",
            description: "dp[m][n] indicates whether all of s1 and s2 can be interleaved to form all of s3. This represents exploring all valid paths through the interleaving decision tree."
          }
        ]
      },
      {
        language: "python",
        code: `def is_interleave(s1: str, s2: str, s3: str) -> bool:
    """Check if s3 is formed by interleaving s1 and s2."""
    m, n = len(s1), len(s2)

    if m + n != len(s3):
        return False

    # dp[i][j] = True if s1[0:i] and s2[0:j] form s3[0:i+j]
    dp = [[False] * (n + 1) for _ in range(m + 1)]

    dp[0][0] = True

    # Fill first column (only s1)
    for i in range(1, m + 1):
        dp[i][0] = dp[i - 1][0] and s1[i - 1] == s3[i - 1]

    # Fill first row (only s2)
    for j in range(1, n + 1):
        dp[0][j] = dp[0][j - 1] and s2[j - 1] == s3[j - 1]

    # Fill the table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            k = i + j - 1  # Position in s3

            # Use char from s1
            if s1[i - 1] == s3[k]:
                dp[i][j] = dp[i][j] or dp[i - 1][j]

            # Use char from s2
            if s2[j - 1] == s3[k]:
                dp[i][j] = dp[i][j] or dp[i][j - 1]

    return dp[m][n]

def is_interleave_optimized(s1: str, s2: str, s3: str) -> bool:
    """Space-optimized version using O(n) space."""
    m, n = len(s1), len(s2)

    if m + n != len(s3):
        return False

    dp = [False] * (n + 1)
    dp[0] = True

    # First row
    for j in range(1, n + 1):
        dp[j] = dp[j - 1] and s2[j - 1] == s3[j - 1]

    for i in range(1, m + 1):
        dp[0] = dp[0] and s1[i - 1] == s3[i - 1]

        for j in range(1, n + 1):
            k = i + j - 1
            dp[j] = ((dp[j] and s1[i - 1] == s3[k]) or
                    (dp[j - 1] and s2[j - 1] == s3[k]))

    return dp[n]`
      ,
        steps: [
                  {
                            "lines": [
                                      1,
                                      2,
                                      3,
                                      5,
                                      6,
                                      8,
                                      9,
                                      11,
                                      13
                            ],
                            "title": "Define is_interleave",
                            "description": "Define the is_interleave function which takes s1, s2, s3 as parameters. This sets up the function signature and documents its interface. Check the condition: m + n != len(s3). This determines the path of execution based on the current state."
                  },
                  {
                            "lines": [
                                      14,
                                      15,
                                      17,
                                      18,
                                      19,
                                      21
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(1, m + 1) using variable 'i'. Each iteration processes one element. Iterate through range(1, n + 1) using variable 'j'. Each iteration processes one element."
                  },
                  {
                            "lines": [
                                      22,
                                      23,
                                      24,
                                      26,
                                      27,
                                      28,
                                      30,
                                      31
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(1, m + 1) using variable 'i'. Each iteration processes one element."
                  },
                  {
                            "lines": [
                                      34,
                                      36,
                                      37,
                                      38
                            ],
                            "title": "Return Result",
                            "description": "Return the computed result: dp[m][n]. This is the final output of the function. Define the is_interleave_optimized function which takes s1, s2, s3 as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      40,
                                      41,
                                      43,
                                      44,
                                      46
                            ],
                            "title": "Conditional Check",
                            "description": "Check the condition: m + n != len(s3). This determines the path of execution based on the current state."
                  },
                  {
                            "lines": [
                                      47,
                                      48,
                                      50,
                                      51,
                                      53,
                                      54,
                                      55,
                                      56,
                                      58
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(1, n + 1) using variable 'j'. Each iteration processes one element. Iterate through range(1, m + 1) using variable 'i'. Each iteration processes one element. Return the computed result: dp[n]. This is the final output of the function."
                  }
        ]
      }
    ],
    keyInsights: [
      "dp[i][j] represents if first i+j chars of s3 can be formed",
      "Can extend from above (use s1 char) or left (use s2 char)",
      "Quick validation: lengths must sum to s3 length",
      "Space can be optimized from O(mn) to O(n) using rolling array"
    ],
    whenToUse: [
      "String merging and interleaving validation",
      "DNA sequence analysis for checking merged sequences",
      "Text processing with order-preserving constraints"
    ]
  },
  {
    id: "DP_021",
    name: "Burst Balloons",
    category: "Dynamic Programming",
    difficulty: "Advanced",
    timeComplexity: "O(n³)",
    spaceComplexity: "O(n²)",
    description: "Maximizes coins from bursting balloons where each burst gives coins based on adjacent balloons.",
    longDescription: "Burst Balloons is a challenging interval DP problem where you burst n balloons to collect maximum coins. When you burst balloon i, you get nums[i-1] * nums[i] * nums[i+1] coins, and then balloons i-1 and i+1 become adjacent. The key insight is to think in reverse: instead of choosing which balloon to burst first, choose which balloon to burst last in each interval. The DP solution tries all possible last balloons for each interval and takes the maximum. This problem demonstrates advanced interval DP thinking and has applications in resource allocation and game theory.",
    icon: "bubble_chart",
    complexityScore: 0.9,
    tags: ["interval-dp", "optimization", "game-theory", "reverse-thinking", "complex"],
    leetcodeProblems: [
      "Burst Balloons",
      "Minimum Cost Tree From Leaf Values",
      "Remove Boxes"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function maxCoins(nums: number[]): number {
  // Add virtual balloons with value 1 at both ends
  const balloons = [1, ...nums, 1];
  const n = balloons.length;

  // dp[i][j] = max coins from bursting balloons (i, j) exclusive
  const dp: number[][] = Array(n)
    .fill(0)
    .map(() => Array(n).fill(0));

  // len is the distance between left and right boundaries
  for (let len = 2; len < n; len++) {
    for (let left = 0; left < n - len; left++) {
      const right = left + len;

      // Try each balloon k as the last one to burst in (left, right)
      for (let k = left + 1; k < right; k++) {
        // Coins from bursting k last:
        // - All balloons in (left, k) already burst: dp[left][k]
        // - All balloons in (k, right) already burst: dp[k][right]
        // - Burst k when only left and right remain: balloons[left] * balloons[k] * balloons[right]
        const coins = dp[left][k] + dp[k][right] +
                     balloons[left] * balloons[k] * balloons[right];

        dp[left][right] = Math.max(dp[left][right], coins);
      }
    }
  }

  return dp[0][n - 1];
}`,
        steps: [
          {
            lines: [1, 2, 3, 4],
            title: "Add boundary balloons",
            description: "Prepend and append virtual balloons with value 1 to handle edge cases. This allows treating all balloons uniformly without special boundary logic. The virtual balloons never burst."
          },
          {
            lines: [6, 7, 8, 9],
            title: "Initialize DP table",
            description: "Create a 2D table where dp[i][j] represents the maximum coins obtainable by bursting all balloons in the open interval (i, j) - exclusive of i and j. Initialize with zeros since bursting no balloons yields 0 coins."
          },
          {
            lines: [11, 12, 13, 14],
            title: "Iterate by interval length",
            description: "Process intervals of increasing length from 2 to n. Length represents the distance between boundaries. This ensures when computing dp[left][right], all smaller subintervals are already solved."
          },
          {
            lines: [16, 17],
            title: "Try each balloon as last to burst",
            description: "Key insight: instead of choosing which balloon to burst first (which changes adjacent balloons), choose which balloon k to burst LAST in interval (left, right). This way, when k bursts, its neighbors are predictably balloons[left] and balloons[right]."
          },
          {
            lines: [18, 19, 20, 21, 22, 23, 24, 25],
            title: "Calculate coins for bursting k last",
            description: "If k is the last balloon burst in (left, right): (1) get dp[left][k] coins from left subinterval, (2) get dp[k][right] coins from right subinterval, (3) burst k with neighbors left and right: balloons[left]*balloons[k]*balloons[right]. Sum these and take maximum over all k."
          },
          {
            lines: [30],
            title: "Return maximum coins",
            description: "dp[0][n-1] contains maximum coins from bursting all balloons between the two virtual boundaries (index 0 and n-1). This represents the optimal order to burst all original balloons."
          }
        ]
      },
      {
        language: "python",
        code: `def max_coins(nums: list[int]) -> int:
    """Find maximum coins from bursting balloons optimally."""
    # Add virtual balloons with value 1
    balloons = [1] + nums + [1]
    n = len(balloons)

    # dp[i][j] = max coins from bursting balloons in (i, j) exclusive
    dp = [[0] * n for _ in range(n)]

    # len is distance between boundaries
    for length in range(2, n):
        for left in range(n - length):
            right = left + length

            # Try each balloon k as last to burst in (left, right)
            for k in range(left + 1, right):
                # Coins from bursting k last
                coins = (dp[left][k] + dp[k][right] +
                        balloons[left] * balloons[k] * balloons[right])

                dp[left][right] = max(dp[left][right], coins)

    return dp[0][n - 1]

def max_coins_memo(nums: list[int]) -> int:
    """Top-down approach with memoization."""
    balloons = [1] + nums + [1]
    memo = {}

    def dp(left: int, right: int) -> int:
        if left + 1 == right:
            return 0

        if (left, right) in memo:
            return memo[(left, right)]

        result = 0

        # Try each balloon as last to burst
        for k in range(left + 1, right):
            coins = (dp(left, k) + dp(k, right) +
                    balloons[left] * balloons[k] * balloons[right])
            result = max(result, coins)

        memo[(left, right)] = result
        return result

    return dp(0, len(balloons) - 1)`
      ,
        steps: [
                  {
                            "lines": [
                                      1,
                                      2,
                                      3,
                                      4,
                                      5,
                                      7,
                                      8,
                                      10
                            ],
                            "title": "Define max_coins",
                            "description": "Define the max_coins function which takes nums as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      11,
                                      12,
                                      13,
                                      15,
                                      16,
                                      17,
                                      18,
                                      19
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(2, n) using variable 'length'. Each iteration processes one element."
                  },
                  {
                            "lines": [
                                      23
                            ],
                            "title": "Return Result",
                            "description": "Return the computed result: dp[0][n - 1]. This is the final output of the function."
                  },
                  {
                            "lines": [
                                      25,
                                      26,
                                      27,
                                      28
                            ],
                            "title": "Define max_coins_memo",
                            "description": "Define the max_coins_memo function which takes nums as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      30,
                                      31,
                                      32,
                                      34,
                                      35,
                                      37,
                                      39,
                                      40
                            ],
                            "title": "Define dp",
                            "description": "Define the dp function which takes left, right as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      48
                            ],
                            "title": "Return Result",
                            "description": "Return the computed result: dp(0, len(balloons) - 1). This is the final output of the function."
                  }
        ]
      }
    ],
    keyInsights: [
      "Think in reverse: choose which balloon to burst LAST, not first",
      "Add virtual balloons with value 1 at boundaries for easier calculation",
      "dp[i][j] represents max coins from bursting balloons between i and j (exclusive)",
      "For each interval, try all possible last balloons and take maximum"
    ],
    whenToUse: [
      "Complex optimization problems requiring reverse thinking",
      "Game theory problems with sequential decisions",
      "Interval-based optimization with dependent subproblems"
    ]
  }
];
