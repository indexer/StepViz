import type { Algorithm } from "../types/algorithm";

export const searchingAlgorithms: Algorithm[] = [
  {
    id: "SEA_001",
    name: "Binary Search",
    category: "Searching",
    difficulty: "Beginner",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    description: "Efficiently searches a sorted array by repeatedly dividing the search interval in half, comparing the target value with the middle element.",
    longDescription: "Binary search is a fundamental divide-and-conquer algorithm that works on sorted arrays. It starts by comparing the target value with the middle element of the array. If they match, the search is successful. If the target is less than the middle element, the search continues in the lower half; otherwise, it continues in the upper half. This process repeats until the element is found or the search space is exhausted. The logarithmic time complexity makes it exceptionally efficient for large datasets.",
    icon: "search",
    complexityScore: 0.25,
    tags: ["divide-and-conquer", "sorted-array", "logarithmic", "iterative", "recursive"],
    leetcodeProblems: [
      "Binary Search",
      "Search Insert Position",
      "Find First and Last Position of Element in Sorted Array"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function binarySearch(arr: number[], target: number): number {
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
const notFound = binarySearch(sortedArr, 42);     // → -1`,
        steps: [
          {
            lines: [2, 3],
            title: "Initialize Search Boundaries",
            description: "Set up two pointers: 'left' at the start of the array (index 0) and 'right' at the end (last index). These pointers define the current search space that potentially contains the target.",
            variables: { left: "0", right: "arr.length - 1" }
          },
          {
            lines: [5],
            title: "Check Search Space",
            description: "The while loop continues as long as left <= right, meaning there's still a valid search space. When left > right, we've exhausted all possibilities and the element doesn't exist.",
            variables: { left: "0", right: "arr.length - 1" }
          },
          {
            lines: [6],
            title: "Calculate Middle Index",
            description: "Find the middle element using 'left + (right - left) / 2' instead of '(left + right) / 2' to avoid potential integer overflow. This is the pivot point that divides the search space in half.",
            variables: { left: "0", right: "9", mid: "4" }
          },
          {
            lines: [8, 9, 10],
            title: "Check for Match",
            description: "Compare the middle element with the target. If they match, we've found the element and return its index immediately. This is the best-case scenario with O(1) time.",
            variables: { mid: "4", "arr[mid]": "50", target: "50" }
          },
          {
            lines: [12, 13],
            title: "Search Right Half",
            description: "If the middle element is less than the target, the target must be in the right half (since the array is sorted). Move 'left' to mid + 1, eliminating the left half from consideration.",
            variables: { "arr[mid]": "30", target: "70", left: "mid + 1 (5)" }
          },
          {
            lines: [14, 15],
            title: "Search Left Half",
            description: "If the middle element is greater than the target, the target must be in the left half. Move 'right' to mid - 1, eliminating the right half from consideration.",
            variables: { "arr[mid]": "80", target: "50", right: "mid - 1 (3)" }
          },
          {
            lines: [19],
            title: "Element Not Found",
            description: "If the loop exits without finding the target (left > right), return -1 to indicate the element doesn't exist in the array. At this point, we've eliminated all possible locations.",
            variables: { left: "5", right: "4", result: "-1" }
          }
        ]
      },
      {
        language: "python",
        code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = left + (right - left) // 2

        if arr[mid] == target:
            return mid

        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1  # Element not found

# Recursive implementation
def binary_search_recursive(arr, target, left=0, right=None):
    if right is None:
        right = len(arr) - 1

    if left > right:
        return -1

    mid = left + (right - left) // 2

    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, right)
    else:
        return binary_search_recursive(arr, target, left, mid - 1)

# --- Example ---
sorted_arr = [10, 20, 30, 40, 50, 60, 70, 80, 90]
idx = binary_search(sorted_arr, 40)              # -> 3
idx_rec = binary_search_recursive(sorted_arr, 80) # -> 7
not_found = binary_search(sorted_arr, 42)        # -> -1`,
        steps: [
          {
            lines: [2],
            title: "Initialize Search Boundaries",
            description: "Set up two pointers: 'left' at the start of the array (index 0) and 'right' at the end (last index). These pointers define the current search space that potentially contains the target.",
            variables: { left: "0", right: "len(arr) - 1" }
          },
          {
            lines: [4],
            title: "Check Search Space",
            description: "The while loop continues as long as left <= right, meaning there's still a valid search space. When left > right, we've exhausted all possibilities and the element doesn't exist.",
            variables: { left: "0", right: "9" }
          },
          {
            lines: [5],
            title: "Calculate Middle Index",
            description: "Find the middle element using 'left + (right - left) // 2' instead of '(left + right) // 2' to avoid potential integer overflow. This is the pivot point that divides the search space in half.",
            variables: { left: "0", right: "9", mid: "4" }
          },
          {
            lines: [7, 8],
            title: "Check for Match",
            description: "Compare the middle element with the target. If they match, we've found the element and return its index immediately. This is the best-case scenario with O(1) time.",
            variables: { mid: "4", "arr[mid]": "50", target: "50" }
          },
          {
            lines: [10, 11],
            title: "Search Right Half",
            description: "If the middle element is less than the target, the target must be in the right half (since the array is sorted). Move 'left' to mid + 1, eliminating the left half from consideration.",
            variables: { "arr[mid]": "30", target: "70", left: "mid + 1 (5)" }
          },
          {
            lines: [12, 13],
            title: "Search Left Half",
            description: "If the middle element is greater than the target, the target must be in the left half. Move 'right' to mid - 1, eliminating the right half from consideration.",
            variables: { "arr[mid]": "80", target: "50", right: "mid - 1 (3)" }
          },
          {
            lines: [15],
            title: "Element Not Found",
            description: "If the loop exits without finding the target (left > right), return -1 to indicate the element doesn't exist in the array. At this point, we've eliminated all possible locations.",
            variables: { left: "5", right: "4", result: "-1" }
          }
        ]
      }
    ],
    keyInsights: [
      "Array must be sorted for binary search to work correctly",
      "Each comparison eliminates half of the remaining elements",
      "Use mid = left + (right - left) / 2 to avoid integer overflow",
      "Can be implemented both iteratively and recursively with same time complexity"
    ],
    whenToUse: [
      "When searching in a sorted array or list",
      "When you need O(log n) search performance",
      "When the dataset is static or changes infrequently"
    ]
  },
  {
    id: "SEA_002",
    name: "Linear Search",
    category: "Searching",
    difficulty: "Beginner",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    description: "Sequentially checks each element in a collection until the target is found or all elements have been examined.",
    longDescription: "Linear search, also known as sequential search, is the simplest searching algorithm. It works by examining each element in the collection one by one from the beginning until the target element is found or the end is reached. Unlike binary search, it doesn't require the data to be sorted. While it has a linear time complexity making it slower for large datasets, it's straightforward to implement and works on any collection type. It's particularly useful for small datasets or unsorted collections where the overhead of sorting would exceed the search cost.",
    icon: "manage_search",
    complexityScore: 0.1,
    tags: ["sequential", "simple", "unsorted", "brute-force", "basic"],
    leetcodeProblems: [
      "Search in Rotated Sorted Array",
      "Find All Numbers Disappeared in an Array",
      "First Unique Character in a String"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function linearSearch(arr: number[], target: number): number {
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
const missing = linearSearch(nums, 42);              // → -1`,
        steps: [
          {
            lines: [1],
            title: "Function Signature",
            description: "Linear search takes an array of numbers and a target value, returning the index of the first occurrence or -1 if not found. Unlike binary search, no sorting is required.",
            variables: { arr: "[4, 2, 7, 1, 9]", target: "7" }
          },
          {
            lines: [2],
            title: "Start Sequential Iteration",
            description: "Begin a for loop that iterates through every element in the array from index 0 to the end. This is the 'linear' part - we check each element one by one in sequence.",
            variables: { i: "0", "arr.length": "5" }
          },
          {
            lines: [3, 4],
            title: "Check Current Element",
            description: "Compare the current element arr[i] with the target. If they match, we've found the target and immediately return its index. This early return optimizes for the best case.",
            variables: { i: "2", "arr[i]": "7", target: "7" }
          },
          {
            lines: [2, 3, 4, 5],
            title: "Continue Until Match or End",
            description: "If the current element doesn't match, the loop continues to the next element. This process repeats until either a match is found or all elements have been examined.",
            variables: { i: "0 → 1 → 2", checked: "4, 2, 7" }
          },
          {
            lines: [7],
            title: "No Match Found",
            description: "If the loop completes without finding a match (we've checked all elements), return -1 to indicate the target doesn't exist in the array. This is the worst-case scenario requiring O(n) comparisons.",
            variables: { i: "5", result: "-1", message: "Element not in array" }
          }
        ]
      },
      {
        language: "python",
        code: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1  # Element not found

# Find all occurrences
def linear_search_all(arr, target):
    indices = []

    for i in range(len(arr)):
        if arr[i] == target:
            indices.append(i)

    return indices

# Using predicate function
def linear_search_predicate(arr, predicate):
    for i, item in enumerate(arr):
        if predicate(item):
            return i
    return -1

# --- Example ---
arr = [4, 2, 7, 1, 9, 5]
index = linear_search(arr, 7)                          # -> 2
all_indices = linear_search_all([1, 3, 7, 3, 5], 3)    # -> [1, 3]
first_even = linear_search_predicate(arr, lambda n: n % 2 == 0)  # -> 0
missing = linear_search(arr, 42)                       # -> -1`,
        steps: [
          {
            lines: [1],
            title: "Function Signature",
            description: "Linear search takes an array and a target value, returning the index of the first occurrence or -1 if not found. Unlike binary search, no sorting is required.",
            variables: { arr: "[4, 2, 7, 1, 9]", target: "7" }
          },
          {
            lines: [2],
            title: "Start Sequential Iteration",
            description: "Begin a for loop that iterates through every element in the array from index 0 to the end. This is the 'linear' part - we check each element one by one in sequence.",
            variables: { i: "0", "len(arr)": "5" }
          },
          {
            lines: [3, 4],
            title: "Check Current Element",
            description: "Compare the current element arr[i] with the target. If they match, we've found the target and immediately return its index. This early return optimizes for the best case.",
            variables: { i: "2", "arr[i]": "7", target: "7" }
          },
          {
            lines: [2, 3, 4],
            title: "Continue Until Match or End",
            description: "If the current element doesn't match, the loop continues to the next element. This process repeats until either a match is found or all elements have been examined.",
            variables: { i: "0 → 1 → 2", checked: "4, 2, 7" }
          },
          {
            lines: [5],
            title: "No Match Found",
            description: "If the loop completes without finding a match (we've checked all elements), return -1 to indicate the target doesn't exist in the array. This is the worst-case scenario requiring O(n) comparisons.",
            variables: { i: "5", result: "-1", message: "Element not in array" }
          }
        ]
      }
    ],
    keyInsights: [
      "Works on both sorted and unsorted collections",
      "Best case O(1) when element is at the beginning",
      "Worst case O(n) when element is at the end or not present",
      "No preprocessing required unlike binary search"
    ],
    whenToUse: [
      "When the array is unsorted and sorting cost is high",
      "For small datasets where O(n) performance is acceptable",
      "When you need to find all occurrences of an element"
    ]
  },
  {
    id: "SEA_003",
    name: "Depth-First Search (DFS)",
    category: "Searching",
    difficulty: "Medium",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    description: "Explores a graph or tree by going as deep as possible along each branch before backtracking to explore other branches.",
    longDescription: "Depth-First Search is a fundamental graph traversal algorithm that explores vertices by going as far as possible along each branch before backtracking. It uses a stack data structure (either explicitly or through recursion) to keep track of vertices to visit. DFS starts at a source vertex and explores each branch completely before moving to the next branch. This makes it particularly useful for problems involving path finding, cycle detection, topological sorting, and solving puzzles. The algorithm can be implemented recursively or iteratively, with the recursive approach being more intuitive but potentially causing stack overflow for very deep graphs.",
    icon: "account_tree",
    complexityScore: 0.5,
    tags: ["graph-traversal", "recursion", "stack", "backtracking", "tree"],
    leetcodeProblems: [
      "Number of Islands",
      "Clone Graph",
      "Path Sum"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `// Graph representation using adjacency list
type Graph = Map<number, number[]>;

function dfsRecursive(
  graph: Graph,
  start: number,
  visited: Set<number> = new Set()
): number[] {
  const result: number[] = [];

  function dfs(node: number): void {
    visited.add(node);
    result.push(node);

    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
  }

  dfs(start);
  return result;
}

function dfsIterative(graph: Graph, start: number): number[] {
  const visited = new Set<number>();
  const stack = [start];
  const result: number[] = [];

  while (stack.length > 0) {
    const node = stack.pop()!;

    if (!visited.has(node)) {
      visited.add(node);
      result.push(node);

      const neighbors = graph.get(node) || [];
      for (let i = neighbors.length - 1; i >= 0; i--) {
        if (!visited.has(neighbors[i])) {
          stack.push(neighbors[i]);
        }
      }
    }
  }

  return result;
}

// --- Example ---
const graph: Graph = new Map([
  [1, [2, 3]],
  [2, [4]],
  [3, [4]],
  [4, []],
]);
const rec = dfsRecursive(graph, 1);   // → [1, 2, 4, 3]
const iter = dfsIterative(graph, 1);  // → [1, 2, 4, 3]`,
        steps: [
          {
            lines: [1, 2],
            title: "Graph Representation",
            description: "Define the graph as an adjacency list using a Map where each key (node) maps to an array of its neighboring nodes. This allows efficient lookup of neighbors for any given node.",
            variables: { "graph": "Map { 1→[2,3], 2→[4], 3→[4], 4→[] }" }
          },
          {
            lines: [9, 10],
            title: "Initialize Result and Helper",
            description: "Create a result array to store the traversal order. The inner 'dfs' function will be called recursively to explore the graph depth-first, utilizing the call stack for backtracking.",
            variables: { result: "[]", visited: "Set {}" }
          },
          {
            lines: [12, 13],
            title: "Mark as Visited and Record",
            description: "Mark the current node as visited to prevent revisiting (avoid infinite loops in cyclic graphs) and add it to the result array. This ensures each node is processed exactly once.",
            variables: { node: "1", visited: "Set {1}", result: "[1]" }
          },
          {
            lines: [15, 16],
            title: "Get Neighbors",
            description: "Retrieve all neighbors of the current node from the graph. If the node has no entry (isolated node), use an empty array. These neighbors are candidates for further exploration.",
            variables: { node: "1", neighbors: "[2, 3]" }
          },
          {
            lines: [17, 18],
            title: "Recursively Explore Unvisited",
            description: "For each neighbor, check if it hasn't been visited yet. If unvisited, recursively call dfs() on it to go deeper. This is where 'depth-first' happens - we go as deep as possible before backtracking.",
            variables: { neighbor: "2", visited: "Set {1}", "will explore": "2 deeply before 3" }
          },
          {
            lines: [23, 24],
            title: "Start Traversal and Return",
            description: "Initiate the DFS traversal from the start node and return the result array containing all visited nodes in depth-first order. The recursion naturally handles backtracking when branches are exhausted.",
            variables: { start: "1", result: "[1, 2, 4, 3]" }
          }
        ]
      },
      {
        language: "python",
        code: `from typing import List, Set, Dict

# Graph representation using adjacency list
Graph = Dict[int, List[int]]

def dfs_recursive(graph: Graph, start: int, visited: Set[int] = None) -> List[int]:
    if visited is None:
        visited = set()

    result = []

    def dfs(node: int):
        visited.add(node)
        result.append(node)

        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                dfs(neighbor)

    dfs(start)
    return result

def dfs_iterative(graph: Graph, start: int) -> List[int]:
    visited = set()
    stack = [start]
    result = []

    while stack:
        node = stack.pop()

        if node not in visited:
            visited.add(node)
            result.append(node)

            # Add neighbors in reverse order to maintain left-to-right traversal
            for neighbor in reversed(graph.get(node, [])):
                if neighbor not in visited:
                    stack.append(neighbor)

    return result

# --- Example ---
graph = {1: [2, 3], 2: [4], 3: [4], 4: []}
rec = dfs_recursive(graph, 1)   # -> [1, 2, 4, 3]
itr = dfs_iterative(graph, 1)   # -> [1, 2, 4, 3]`,
        steps: [
          {
            lines: [4],
            title: "Graph Representation",
            description: "Define the graph as an adjacency list using a dictionary where each key (node) maps to a list of its neighboring nodes. This allows efficient lookup of neighbors for any given node.",
            variables: { "graph": "{1: [2,3], 2: [4], 3: [4], 4: []}" }
          },
          {
            lines: [6, 7, 8, 10],
            title: "Initialize Visited Set and Result",
            description: "Create a visited set to track processed nodes and a result list to store the traversal order. The inner 'dfs' function will be called recursively to explore the graph depth-first.",
            variables: { result: "[]", visited: "set()" }
          },
          {
            lines: [13, 14],
            title: "Mark as Visited and Record",
            description: "Mark the current node as visited to prevent revisiting (avoid infinite loops in cyclic graphs) and add it to the result list. This ensures each node is processed exactly once.",
            variables: { node: "1", visited: "{1}", result: "[1]" }
          },
          {
            lines: [16],
            title: "Get Neighbors",
            description: "Retrieve all neighbors of the current node from the graph. If the node has no entry (isolated node), use an empty list. These neighbors are candidates for further exploration.",
            variables: { node: "1", neighbors: "[2, 3]" }
          },
          {
            lines: [17, 18],
            title: "Recursively Explore Unvisited",
            description: "For each neighbor, check if it hasn't been visited yet. If unvisited, recursively call dfs() on it to go deeper. This is where 'depth-first' happens - we go as deep as possible before backtracking.",
            variables: { neighbor: "2", visited: "{1}", "will explore": "2 deeply before 3" }
          },
          {
            lines: [20, 21],
            title: "Start Traversal and Return",
            description: "Initiate the DFS traversal from the start node and return the result list containing all visited nodes in depth-first order. The recursion naturally handles backtracking when branches are exhausted.",
            variables: { start: "1", result: "[1, 2, 4, 3]" }
          }
        ]
      }
    ],
    keyInsights: [
      "Uses stack (LIFO) structure, either explicitly or via recursion",
      "Explores one branch completely before moving to the next",
      "Space complexity is O(V) due to recursion stack or explicit stack",
      "Can be used to detect cycles in graphs"
    ],
    whenToUse: [
      "When you need to explore all paths or find any path to a target",
      "For topological sorting in directed acyclic graphs",
      "When solving maze or puzzle problems with backtracking"
    ]
  },
  {
    id: "SEA_004",
    name: "Breadth-First Search (BFS)",
    category: "Searching",
    difficulty: "Medium",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    description: "Explores a graph or tree level by level, visiting all neighbors at the current depth before moving to the next level.",
    longDescription: "Breadth-First Search is a graph traversal algorithm that explores vertices level by level, visiting all neighbors at the current depth before proceeding to vertices at the next depth level. It uses a queue data structure (FIFO) to maintain the order of exploration. BFS starts at a source vertex and explores all its direct neighbors first, then moves to their neighbors, and so on. This approach guarantees finding the shortest path in unweighted graphs and is particularly useful for level-order traversal of trees, finding connected components, and solving shortest path problems. Unlike DFS, BFS always finds the shortest path in terms of number of edges.",
    icon: "grid_on",
    complexityScore: 0.5,
    tags: ["graph-traversal", "queue", "level-order", "shortest-path", "tree"],
    leetcodeProblems: [
      "Binary Tree Level Order Traversal",
      "Rotting Oranges",
      "Word Ladder"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `// Graph representation using adjacency list
type Graph = Map<number, number[]>;

function bfs(graph: Graph, start: number): number[] {
  const visited = new Set<number>();
  const queue: number[] = [start];
  const result: number[] = [];

  visited.add(start);

  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);

    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return result;
}

// BFS with level tracking
function bfsWithLevels(graph: Graph, start: number): number[][] {
  const visited = new Set<number>();
  const queue: number[] = [start];
  const levels: number[][] = [];

  visited.add(start);

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      currentLevel.push(node);

      const neighbors = graph.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    levels.push(currentLevel);
  }

  return levels;
}

// --- Example ---
const graph: Graph = new Map([
  [1, [2, 3]],
  [2, [4, 5]],
  [3, []],
  [4, []],
  [5, []],
]);
const order = bfs(graph, 1);            // → [1, 2, 3, 4, 5]
const levels = bfsWithLevels(graph, 1); // → [[1], [2, 3], [4, 5]]`,
        steps: [
          {
            lines: [5, 6, 7, 9],
            title: "Initialize BFS Data Structures",
            description: "Set up three key components: a 'visited' set to track processed nodes, a 'queue' (FIFO) initialized with the start node, and a 'result' array. Mark the start node as visited immediately to prevent re-queuing.",
            variables: { visited: "Set {1}", queue: "[1]", result: "[]" }
          },
          {
            lines: [11],
            title: "Process Queue",
            description: "The while loop continues as long as there are nodes in the queue. This ensures all reachable nodes are explored level by level. When the queue is empty, traversal is complete.",
            variables: { queue: "[1, 2, 3]", "queue.length": "3" }
          },
          {
            lines: [12, 13],
            title: "Dequeue and Record Node",
            description: "Remove the first node from the queue using shift() (FIFO behavior) and add it to the result. This node represents the current level being processed, maintaining breadth-first order.",
            variables: { node: "1", queue: "[2, 3]", result: "[1]" }
          },
          {
            lines: [15, 16],
            title: "Retrieve Neighbors",
            description: "Get all neighbors of the current node from the adjacency list. These neighbors are at the next level and will be explored after all nodes at the current level are processed.",
            variables: { node: "1", neighbors: "[2, 3]" }
          },
          {
            lines: [17, 18, 19],
            title: "Enqueue Unvisited Neighbors",
            description: "For each unvisited neighbor, mark it as visited and add it to the end of the queue. This ensures we explore all nodes at the current level before moving to the next level (breadth-first property).",
            variables: { neighbor: "2", visited: "Set {1,2}", queue: "[3, 2]" }
          },
          {
            lines: [24],
            title: "Return Traversal Result",
            description: "After the queue is empty, return the result array containing all reachable nodes in level-order (breadth-first) sequence. This guarantees the shortest path in terms of edge count from the start node.",
            variables: { result: "[1, 2, 3, 4, 5]", levels: "Level 0: [1], Level 1: [2,3], Level 2: [4,5]" }
          }
        ]
      },
      {
        language: "python",
        code: `from typing import List, Set, Dict
from collections import deque

# Graph representation using adjacency list
Graph = Dict[int, List[int]]

def bfs(graph: Graph, start: int) -> List[int]:
    visited = set()
    queue = deque([start])
    result = []

    visited.add(start)

    while queue:
        node = queue.popleft()
        result.append(node)

        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return result

# BFS with level tracking
def bfs_with_levels(graph: Graph, start: int) -> List[List[int]]:
    visited = set()
    queue = deque([start])
    levels = []

    visited.add(start)

    while queue:
        level_size = len(queue)
        current_level = []

        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node)

            for neighbor in graph.get(node, []):
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)

        levels.append(current_level)

    return levels

# --- Example ---
graph = {1: [2, 3], 2: [4, 5], 3: [], 4: [], 5: []}
order = bfs(graph, 1)                # -> [1, 2, 3, 4, 5]
levels = bfs_with_levels(graph, 1)   # -> [[1], [2, 3], [4, 5]]`,
        steps: [
          {
            lines: [8, 9, 10, 12],
            title: "Initialize BFS Data Structures",
            description: "Set up three key components: a 'visited' set to track processed nodes, a 'queue' (FIFO) initialized with the start node using deque, and a 'result' list. Mark the start node as visited immediately to prevent re-queuing.",
            variables: { visited: "{1}", queue: "deque([1])", result: "[]" }
          },
          {
            lines: [14],
            title: "Process Queue",
            description: "The while loop continues as long as there are nodes in the queue. This ensures all reachable nodes are explored level by level. When the queue is empty, traversal is complete.",
            variables: { queue: "deque([1, 2, 3])", "len(queue)": "3" }
          },
          {
            lines: [15, 16],
            title: "Dequeue and Record Node",
            description: "Remove the first node from the queue using popleft() (FIFO behavior) and add it to the result. This node represents the current level being processed, maintaining breadth-first order.",
            variables: { node: "1", queue: "deque([2, 3])", result: "[1]" }
          },
          {
            lines: [18],
            title: "Retrieve Neighbors",
            description: "Get all neighbors of the current node from the adjacency list. These neighbors are at the next level and will be explored after all nodes at the current level are processed.",
            variables: { node: "1", neighbors: "[2, 3]" }
          },
          {
            lines: [19, 20, 21],
            title: "Enqueue Unvisited Neighbors",
            description: "For each unvisited neighbor, mark it as visited and add it to the end of the queue. This ensures we explore all nodes at the current level before moving to the next level (breadth-first property).",
            variables: { neighbor: "2", visited: "{1, 2}", queue: "deque([3, 2])" }
          },
          {
            lines: [23],
            title: "Return Traversal Result",
            description: "After the queue is empty, return the result list containing all reachable nodes in level-order (breadth-first) sequence. This guarantees the shortest path in terms of edge count from the start node.",
            variables: { result: "[1, 2, 3, 4, 5]", levels: "Level 0: [1], Level 1: [2,3], Level 2: [4,5]" }
          }
        ]
      }
    ],
    keyInsights: [
      "Uses queue (FIFO) structure for level-by-level traversal",
      "Guarantees shortest path in unweighted graphs",
      "Visits all nodes at distance k before visiting nodes at distance k+1",
      "Better for finding shortest paths; DFS better for exploring all paths"
    ],
    whenToUse: [
      "When finding shortest path in unweighted graphs",
      "For level-order traversal of trees",
      "When you need to explore neighbors before going deeper"
    ]
  },
  {
    id: "SEA_005",
    name: "Jump Search",
    category: "Searching",
    difficulty: "Medium",
    timeComplexity: "O(√n)",
    spaceComplexity: "O(1)",
    description: "Searches a sorted array by jumping ahead by fixed steps and performing linear search in the identified block where the element may exist.",
    longDescription: "Jump Search is an algorithm for searching in sorted arrays that works by jumping ahead by fixed steps (typically √n) instead of checking every element. It first finds the block where the element might exist by making jumps, then performs a linear search within that block. The optimal jump size is √n, which balances the number of jumps and the linear search within a block. This algorithm performs better than linear search but worse than binary search, offering a middle ground. It's particularly useful for systems where jumping backward is costly, as it only moves forward through the array.",
    icon: "skip_next",
    complexityScore: 0.35,
    tags: ["sorted-array", "block-search", "jump", "forward-only", "square-root"],
    leetcodeProblems: [
      "Search in Rotated Sorted Array",
      "Find Minimum in Rotated Sorted Array",
      "Search a 2D Matrix"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function jumpSearch(arr: number[], target: number): number {
  const n = arr.length;
  const jump = Math.floor(Math.sqrt(n));
  let prev = 0;
  let curr = 0;

  // Find the block where element may be present
  while (curr < n && arr[curr] < target) {
    prev = curr;
    curr = Math.min(curr + jump, n - 1);

    // If we've jumped past the target
    if (prev > 0 && arr[prev] > target) {
      return -1;
    }
  }

  // Linear search in the identified block
  for (let i = prev; i <= Math.min(curr, n - 1); i++) {
    if (arr[i] === target) {
      return i;
    }
    // Early exit if we've gone past the target
    if (arr[i] > target) {
      return -1;
    }
  }

  return -1; // Element not found
}

// Alternative implementation with clearer block boundaries
function jumpSearchAlt(arr: number[], target: number): number {
  const n = arr.length;
  const step = Math.floor(Math.sqrt(n));
  let prev = 0;

  // Jump to find the block
  while (prev < n && arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }

  // Linear search in block
  while (arr[prev] < target) {
    prev++;
    if (prev === Math.min(step, n)) return -1;
  }

  return arr[prev] === target ? prev : -1;
}

// --- Example ---
const sortedArr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31];
const idx = jumpSearch(sortedArr, 13);    // → 6
const idxAlt = jumpSearchAlt(sortedArr, 21); // → 10
const missing = jumpSearch(sortedArr, 10);  // → -1`,
        steps: [
          {
            lines: [2, 3],
            title: "Calculate Optimal Jump Size",
            description: "Determine the jump size as the square root of the array length. This is mathematically optimal for balancing the number of jumps and the linear search within a block, giving O(√n) complexity.",
            variables: { n: "16", jump: "4", "√n": "4" }
          },
          {
            lines: [4, 5],
            title: "Initialize Block Pointers",
            description: "Set up two pointers: 'prev' marks the start of the current block, and 'curr' marks the end. Both start at 0, and we'll jump forward by 'jump' size to find the right block.",
            variables: { prev: "0", curr: "0", jump: "4" }
          },
          {
            lines: [8, 9, 10],
            title: "Jump Forward to Find Block",
            description: "Jump forward by 'jump' steps while the current position is less than the target. Update 'prev' to the old 'curr', then jump 'curr' forward. This phase locates the block that may contain the target.",
            variables: { prev: "0→4→8", curr: "4→8→12", target: "50", "arr[curr]": "30→45→60" }
          },
          {
            lines: [12, 13, 14],
            title: "Check for Overshoot",
            description: "If we've jumped past the target value, it means the target doesn't exist in the array. Return -1 immediately for early termination, avoiding unnecessary linear search.",
            variables: { prev: "8", "arr[prev]": "55", target: "50", result: "-1" }
          },
          {
            lines: [18, 19, 20, 21],
            title: "Linear Search Within Block",
            description: "Perform a linear search from 'prev' to 'curr' within the identified block. Check each element sequentially - if found, return its index. This completes the two-phase search strategy.",
            variables: { prev: "8", curr: "12", target: "50", i: "8→9→10", "arr[10]": "50" }
          },
          {
            lines: [23, 24, 25],
            title: "Early Exit on Overshoot",
            description: "During linear search, if we encounter a value greater than the target, we can exit early since the array is sorted. This optimization prevents checking remaining elements in the block.",
            variables: { i: "9", "arr[i]": "52", target: "50", result: "-1" }
          },
          {
            lines: [28],
            title: "Element Not Found",
            description: "If both the jumping phase and linear search complete without finding the target, return -1. The element doesn't exist in the sorted array.",
            variables: { result: "-1", message: "Target not in array" }
          }
        ]
      },
      {
        language: "python",
        code: `import math

def jump_search(arr, target):
    n = len(arr)
    jump = int(math.sqrt(n))
    prev = 0
    curr = 0

    # Find the block where element may be present
    while curr < n and arr[curr] < target:
        prev = curr
        curr = min(curr + jump, n - 1)

        # If we've jumped past the target
        if prev > 0 and arr[prev] > target:
            return -1

    # Linear search in the identified block
    for i in range(prev, min(curr + 1, n)):
        if arr[i] == target:
            return i
        # Early exit if we've gone past the target
        if arr[i] > target:
            return -1

    return -1  # Element not found

# Alternative implementation
def jump_search_alt(arr, target):
    n = len(arr)
    step = int(math.sqrt(n))
    prev = 0

    # Jump to find the block
    while prev < n and arr[min(step, n) - 1] < target:
        prev = step
        step += int(math.sqrt(n))
        if prev >= n:
            return -1

    # Linear search in block
    while arr[prev] < target:
        prev += 1
        if prev == min(step, n):
            return -1

    return prev if arr[prev] == target else -1

# --- Example ---
sorted_arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31]
idx = jump_search(sorted_arr, 13)        # -> 6
idx_alt = jump_search_alt(sorted_arr, 21) # -> 10
missing = jump_search(sorted_arr, 10)    # -> -1`,
        steps: [
          {
            lines: [4, 5],
            title: "Calculate Optimal Jump Size",
            description: "Determine the jump size as the square root of the array length. This is mathematically optimal for balancing the number of jumps and the linear search within a block, giving O(√n) complexity.",
            variables: { n: "16", jump: "4", "√n": "4" }
          },
          {
            lines: [6, 7],
            title: "Initialize Block Pointers",
            description: "Set up two pointers: 'prev' marks the start of the current block, and 'curr' marks the end. Both start at 0, and we'll jump forward by 'jump' size to find the right block.",
            variables: { prev: "0", curr: "0", jump: "4" }
          },
          {
            lines: [10, 11, 12],
            title: "Jump Forward to Find Block",
            description: "Jump forward by 'jump' steps while the current position is less than the target. Update 'prev' to the old 'curr', then jump 'curr' forward. This phase locates the block that may contain the target.",
            variables: { prev: "0→4→8", curr: "4→8→12", target: "50", "arr[curr]": "30→45→60" }
          },
          {
            lines: [15, 16],
            title: "Check for Overshoot",
            description: "If we've jumped past the target value, it means the target doesn't exist in the array. Return -1 immediately for early termination, avoiding unnecessary linear search.",
            variables: { prev: "8", "arr[prev]": "55", target: "50", result: "-1" }
          },
          {
            lines: [19, 20, 21],
            title: "Linear Search Within Block",
            description: "Perform a linear search from 'prev' to 'curr' within the identified block. Check each element sequentially - if found, return its index. This completes the two-phase search strategy.",
            variables: { prev: "8", curr: "12", target: "50", i: "8→9→10", "arr[10]": "50" }
          },
          {
            lines: [23, 24],
            title: "Early Exit on Overshoot",
            description: "During linear search, if we encounter a value greater than the target, we can exit early since the array is sorted. This optimization prevents checking remaining elements in the block.",
            variables: { i: "9", "arr[i]": "52", target: "50", result: "-1" }
          },
          {
            lines: [26],
            title: "Element Not Found",
            description: "If both the jumping phase and linear search complete without finding the target, return -1. The element doesn't exist in the sorted array.",
            variables: { result: "-1", message: "Target not in array" }
          }
        ]
      }
    ],
    keyInsights: [
      "Optimal jump size is √n for balanced performance",
      "Only moves forward, making it suitable for systems where backward movement is costly",
      "Better than linear search but slower than binary search",
      "Works only on sorted arrays like binary search"
    ],
    whenToUse: [
      "When backward traversal is expensive (e.g., tape storage)",
      "For sorted arrays where binary search might be overkill",
      "When you want better than O(n) but simpler than binary search"
    ]
  },
  {
    id: "SEA_006",
    name: "Interpolation Search",
    category: "Searching",
    difficulty: "Medium",
    timeComplexity: "O(log log n)",
    spaceComplexity: "O(1)",
    description: "An improved variant of binary search that calculates probe position based on the value being searched, working best on uniformly distributed sorted data.",
    longDescription: "Interpolation Search is an advanced searching algorithm that improves upon binary search for uniformly distributed sorted arrays. Instead of always checking the middle element like binary search, it calculates the probable position of the target using interpolation formula based on the values at the boundaries. This allows it to make educated guesses about where the target might be, similar to how humans search in a phone book. For uniformly distributed data, it achieves O(log log n) time complexity, significantly better than binary search's O(log n). However, for non-uniform data, it can degrade to O(n) in the worst case.",
    icon: "trending_up",
    complexityScore: 0.4,
    tags: ["sorted-array", "interpolation", "uniform-distribution", "probe-position", "adaptive"],
    leetcodeProblems: [
      "Search Insert Position",
      "Find First and Last Position of Element in Sorted Array",
      "Search in Rotated Sorted Array II"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function interpolationSearch(arr: number[], target: number): number {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high && target >= arr[low] && target <= arr[high]) {
    // If array has only one element
    if (low === high) {
      return arr[low] === target ? low : -1;
    }

    // Calculate probe position using interpolation formula
    const pos = low + Math.floor(
      ((target - arr[low]) * (high - low)) / (arr[high] - arr[low])
    );

    // Target found
    if (arr[pos] === target) {
      return pos;
    }

    // Target is in the right sub-array
    if (arr[pos] < target) {
      low = pos + 1;
    }
    // Target is in the left sub-array
    else {
      high = pos - 1;
    }
  }

  return -1; // Element not found
}

// Recursive implementation
function interpolationSearchRecursive(
  arr: number[],
  target: number,
  low: number = 0,
  high: number = arr.length - 1
): number {
  if (low > high || target < arr[low] || target > arr[high]) {
    return -1;
  }

  if (low === high) {
    return arr[low] === target ? low : -1;
  }

  const pos = low + Math.floor(
    ((target - arr[low]) * (high - low)) / (arr[high] - arr[low])
  );

  if (arr[pos] === target) return pos;
  if (arr[pos] < target) return interpolationSearchRecursive(arr, target, pos + 1, high);
  return interpolationSearchRecursive(arr, target, low, pos - 1);
}

// --- Example ---
// Uniformly distributed sorted data → best case for interpolation search
const uniform = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const idx = interpolationSearch(uniform, 70);         // → 6
const idxRec = interpolationSearchRecursive(uniform, 30); // → 2
const missing = interpolationSearch(uniform, 55);     // → -1`,
        steps: [
          {
            lines: [2, 3],
            title: "Initialize Boundary Pointers",
            description: "Set 'low' to the start and 'high' to the end of the array. These boundaries define the current search range and will be adjusted based on interpolated probe positions.",
            variables: { low: "0", high: "arr.length - 1" }
          },
          {
            lines: [5],
            title: "Validate Search Range",
            description: "Check three conditions: low <= high (valid range), target >= arr[low] and target <= arr[high] (target is within range). These ensure the target could possibly exist in the current range.",
            variables: { low: "0", high: "9", "arr[low]": "10", "arr[high]": "100", target: "55" }
          },
          {
            lines: [7, 8],
            title: "Handle Single Element",
            description: "When the range has narrowed to a single element (low === high), simply check if it matches the target. This is a base case that prevents division by zero in the interpolation formula.",
            variables: { low: "5", high: "5", "arr[5]": "55", target: "55" }
          },
          {
            lines: [11, 12, 13],
            title: "Calculate Interpolated Position",
            description: "Use the interpolation formula to estimate where the target should be based on its value. This assumes uniform distribution: if target is 75% between arr[low] and arr[high], probe at 75% between low and high indices.",
            variables: { low: "0", high: "9", "arr[low]": "10", "arr[high]": "100", target: "55", pos: "5" }
          },
          {
            lines: [16, 17, 18],
            title: "Check Probe Position",
            description: "If the element at the interpolated position matches the target, we've found it! Return the position. This intelligent guessing can find elements much faster than binary search for uniform data.",
            variables: { pos: "5", "arr[pos]": "55", target: "55", result: "5" }
          },
          {
            lines: [21, 22, 23, 26, 27],
            title: "Adjust Search Range",
            description: "If arr[pos] < target, the target must be in the right portion, so move 'low' to pos + 1. If arr[pos] > target, move 'high' to pos - 1. This narrows the search range for the next interpolation.",
            variables: { "arr[pos]": "45", target: "55", "new low": "pos + 1 (6)" }
          },
          {
            lines: [30],
            title: "Target Not Found",
            description: "If the loop exits without finding the target (conditions failed or range exhausted), return -1. Either the target is outside the array's value range or doesn't exist.",
            variables: { result: "-1", message: "Element not in array" }
          }
        ]
      },
      {
        language: "python",
        code: `def interpolation_search(arr, target):
    low = 0
    high = len(arr) - 1

    while low <= high and arr[low] <= target <= arr[high]:
        # If array has only one element
        if low == high:
            return low if arr[low] == target else -1

        # Calculate probe position using interpolation formula
        pos = low + int(
            ((target - arr[low]) * (high - low)) / (arr[high] - arr[low])
        )

        # Target found
        if arr[pos] == target:
            return pos

        # Target is in the right sub-array
        if arr[pos] < target:
            low = pos + 1
        # Target is in the left sub-array
        else:
            high = pos - 1

    return -1  # Element not found

# Recursive implementation
def interpolation_search_recursive(arr, target, low=0, high=None):
    if high is None:
        high = len(arr) - 1

    if low > high or target < arr[low] or target > arr[high]:
        return -1

    if low == high:
        return low if arr[low] == target else -1

    pos = low + int(
        ((target - arr[low]) * (high - low)) / (arr[high] - arr[low])
    )

    if arr[pos] == target:
        return pos
    elif arr[pos] < target:
        return interpolation_search_recursive(arr, target, pos + 1, high)
    else:
        return interpolation_search_recursive(arr, target, low, pos - 1)

# --- Example ---
# Uniformly distributed sorted data -> best case for interpolation search
uniform = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
idx = interpolation_search(uniform, 70)              # -> 6
idx_rec = interpolation_search_recursive(uniform, 30) # -> 2
missing = interpolation_search(uniform, 55)          # -> -1`,
        steps: [
          {
            lines: [2, 3],
            title: "Initialize Boundary Pointers",
            description: "Set 'low' to the start and 'high' to the end of the array. These boundaries define the current search range and will be adjusted based on interpolated probe positions.",
            variables: { low: "0", high: "len(arr) - 1" }
          },
          {
            lines: [5],
            title: "Validate Search Range",
            description: "Check three conditions: low <= high (valid range), target >= arr[low] and target <= arr[high] (target is within range). These ensure the target could possibly exist in the current range.",
            variables: { low: "0", high: "9", "arr[low]": "10", "arr[high]": "100", target: "55" }
          },
          {
            lines: [7, 8],
            title: "Handle Single Element",
            description: "When the range has narrowed to a single element (low == high), simply check if it matches the target. This is a base case that prevents division by zero in the interpolation formula.",
            variables: { low: "5", high: "5", "arr[5]": "55", target: "55" }
          },
          {
            lines: [10, 11, 12],
            title: "Calculate Interpolated Position",
            description: "Use the interpolation formula to estimate where the target should be based on its value. This assumes uniform distribution: if target is 75% between arr[low] and arr[high], probe at 75% between low and high indices.",
            variables: { low: "0", high: "9", "arr[low]": "10", "arr[high]": "100", target: "55", pos: "5" }
          },
          {
            lines: [15, 16],
            title: "Check Probe Position",
            description: "If the element at the interpolated position matches the target, we've found it! Return the position. This intelligent guessing can find elements much faster than binary search for uniform data.",
            variables: { pos: "5", "arr[pos]": "55", target: "55", result: "5" }
          },
          {
            lines: [19, 20, 22, 23],
            title: "Adjust Search Range",
            description: "If arr[pos] < target, the target must be in the right portion, so move 'low' to pos + 1. If arr[pos] > target, move 'high' to pos - 1. This narrows the search range for the next interpolation.",
            variables: { "arr[pos]": "45", target: "55", "new low": "pos + 1 (6)" }
          },
          {
            lines: [25],
            title: "Target Not Found",
            description: "If the loop exits without finding the target (conditions failed or range exhausted), return -1. Either the target is outside the array's value range or doesn't exist.",
            variables: { result: "-1", message: "Element not in array" }
          }
        ]
      }
    ],
    keyInsights: [
      "Achieves O(log log n) for uniformly distributed sorted arrays",
      "Uses interpolation formula to estimate target position based on values",
      "Can degrade to O(n) for non-uniformly distributed data",
      "Particularly effective when values are evenly distributed"
    ],
    whenToUse: [
      "When searching in large sorted arrays with uniform distribution",
      "When you know the data distribution is relatively uniform",
      "When you want better than binary search performance for specific datasets"
    ]
  },
  {
    id: "SEA_007",
    name: "Exponential Search",
    category: "Searching",
    difficulty: "Medium",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    description: "Finds the range where an element exists by exponentially increasing the search range, then applies binary search within that range.",
    longDescription: "Exponential Search, also known as galloping search or doubling search, is a two-phase algorithm designed for searching in unbounded or infinite sorted arrays. In the first phase, it finds a range where the element might exist by repeatedly doubling the index (1, 2, 4, 8, 16, ...) until it finds a value greater than the target. In the second phase, it performs binary search within the identified range. This approach is particularly useful when the target is closer to the beginning of the array, as it can find the range very quickly. The algorithm combines the benefits of linear search for small ranges and binary search for larger ranges.",
    icon: "speed",
    complexityScore: 0.4,
    tags: ["sorted-array", "binary-search", "doubling", "unbounded", "range-finding"],
    leetcodeProblems: [
      "Search in a Sorted Array of Unknown Size",
      "Find First and Last Position of Element in Sorted Array",
      "Single Element in a Sorted Array"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function exponentialSearch(arr: number[], target: number): number {
  const n = arr.length;

  // If target is at first position
  if (arr[0] === target) {
    return 0;
  }

  // Find range for binary search by repeated doubling
  let i = 1;
  while (i < n && arr[i] <= target) {
    i *= 2;
  }

  // Perform binary search in the found range
  return binarySearch(arr, target, i / 2, Math.min(i, n - 1));
}

function binarySearch(
  arr: number[],
  target: number,
  left: number,
  right: number
): number {
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

  return -1;
}

// For unbounded/infinite arrays
function exponentialSearchUnbounded(
  arr: number[],
  target: number,
  getElement: (index: number) => number | null
): number {
  if (getElement(0) === target) return 0;

  let i = 1;
  while (getElement(i) !== null && getElement(i)! <= target) {
    if (getElement(i) === target) return i;
    i *= 2;
  }

  return binarySearch(arr, target, i / 2, i);
}

// --- Example ---
const sortedArr = [2, 4, 6, 10, 14, 19, 25, 31, 42, 55, 68, 79, 88, 95, 100];
const idx = exponentialSearch(sortedArr, 42);   // → 8
const idxFirst = exponentialSearch(sortedArr, 2); // → 0 (fast path)
const missing = exponentialSearch(sortedArr, 50); // → -1`,
        steps: [
          {
            lines: [2, 5, 6],
            title: "Check First Element",
            description: "Before starting the exponential search, check if the first element is the target. This handles the edge case and provides O(1) best-case performance when the target is at the beginning.",
            variables: { n: "100", "arr[0]": "10", target: "10", result: "0" }
          },
          {
            lines: [10],
            title: "Initialize Exponential Index",
            description: "Start with index i = 1. This will be doubled repeatedly (1, 2, 4, 8, 16, ...) to quickly find a range where the target might exist. This 'galloping' approach is efficient for targets near the start.",
            variables: { i: "1" }
          },
          {
            lines: [11, 12],
            title: "Exponentially Expand Range",
            description: "Double the index 'i' repeatedly while arr[i] <= target and we haven't exceeded the array bounds. This rapidly identifies an upper bound, creating a range [i/2, i] that must contain the target if it exists.",
            variables: { i: "1→2→4→8→16", "arr[i]": "12→25→45→82→150", target: "100" }
          },
          {
            lines: [16],
            title: "Perform Binary Search in Range",
            description: "Once we've found that arr[i] > target (or reached the end), we know the target must be in the range [i/2, min(i, n-1)]. Apply binary search to this identified range for efficient O(log n) search.",
            variables: { "range start": "i/2 (8)", "range end": "min(i, n-1) (16)", target: "100" }
          },
          {
            lines: [19, 20, 21, 22, 23],
            title: "Binary Search Helper",
            description: "The binarySearch helper function performs standard binary search within the specified range. It uses the divide-and-conquer approach to efficiently locate the target in O(log n) time.",
            variables: { left: "8", right: "16", target: "100" }
          },
          {
            lines: [26, 27, 28, 29, 33, 34, 35],
            title: "Binary Search Logic",
            description: "Calculate the middle index and compare with target. If arr[mid] === target, return the index. If arr[mid] < target, search the right half; otherwise, search the left half. Return -1 if not found.",
            variables: { mid: "12", "arr[mid]": "100", target: "100", result: "12" }
          }
        ]
      },
      {
        language: "python",
        code: `def exponential_search(arr, target):
    n = len(arr)

    # If target is at first position
    if arr[0] == target:
        return 0

    # Find range for binary search by repeated doubling
    i = 1
    while i < n and arr[i] <= target:
        i *= 2

    # Perform binary search in the found range
    return binary_search(arr, target, i // 2, min(i, n - 1))

def binary_search(arr, target, left, right):
    while left <= right:
        mid = left + (right - left) // 2

        if arr[mid] == target:
            return mid

        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1

# For unbounded/infinite arrays
def exponential_search_unbounded(get_element, target):
    if get_element(0) == target:
        return 0

    i = 1
    while get_element(i) is not None and get_element(i) <= target:
        if get_element(i) == target:
            return i
        i *= 2

    # Binary search in range [i/2, i]
    left, right = i // 2, i
    while left <= right:
        mid = left + (right - left) // 2
        val = get_element(mid)

        if val is None or val > target:
            right = mid - 1
        elif val < target:
            left = mid + 1
        else:
            return mid

    return -1

# --- Example ---
sorted_arr = [2, 4, 6, 10, 14, 19, 25, 31, 42, 55, 68, 79, 88, 95, 100]
idx = exponential_search(sorted_arr, 42)    # -> 8
idx_first = exponential_search(sorted_arr, 2) # -> 0 (fast path)
missing = exponential_search(sorted_arr, 50)  # -> -1`,
        steps: [
          {
            lines: [2, 5, 6],
            title: "Check First Element",
            description: "Before starting the exponential search, check if the first element is the target. This handles the edge case and provides O(1) best-case performance when the target is at the beginning.",
            variables: { n: "100", "arr[0]": "10", target: "10", result: "0" }
          },
          {
            lines: [9],
            title: "Initialize Exponential Index",
            description: "Start with index i = 1. This will be doubled repeatedly (1, 2, 4, 8, 16, ...) to quickly find a range where the target might exist. This 'galloping' approach is efficient for targets near the start.",
            variables: { i: "1" }
          },
          {
            lines: [10, 11],
            title: "Exponentially Expand Range",
            description: "Double the index 'i' repeatedly while arr[i] <= target and we haven't exceeded the array bounds. This rapidly identifies an upper bound, creating a range [i//2, i] that must contain the target if it exists.",
            variables: { i: "1→2→4→8→16", "arr[i]": "12→25→45→82→150", target: "100" }
          },
          {
            lines: [13, 14],
            title: "Perform Binary Search in Range",
            description: "Once we've found that arr[i] > target (or reached the end), we know the target must be in the range [i//2, min(i, n-1)]. Apply binary search to this identified range for efficient O(log n) search.",
            variables: { "range start": "i//2 (8)", "range end": "min(i, n-1) (16)", target: "100" }
          },
          {
            lines: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
            title: "Binary Search Helper",
            description: "The binary_search helper function performs standard binary search within the specified range. It calculates the middle index, compares with target, and adjusts boundaries accordingly. Returns the index if found, -1 otherwise.",
            variables: { left: "8", right: "16", mid: "12", target: "100" }
          }
        ]
      }
    ],
    keyInsights: [
      "Particularly efficient when target is near the beginning of array",
      "Combines benefits of linear and binary search approaches",
      "Useful for unbounded or infinite sorted lists",
      "First phase finds range in O(log i) where i is target position"
    ],
    whenToUse: [
      "When searching in unbounded or infinite sorted arrays",
      "When the target is likely to be near the beginning",
      "When you don't know the size of the array in advance"
    ]
  },
  {
    id: "SEA_008",
    name: "Ternary Search",
    category: "Searching",
    difficulty: "Medium",
    timeComplexity: "O(log₃n)",
    spaceComplexity: "O(1)",
    description: "Divides the search space into three parts instead of two, using two mid-points to determine which third contains the target element.",
    longDescription: "Ternary Search is a divide-and-conquer algorithm similar to binary search, but it divides the array into three parts instead of two using two mid-points (mid1 and mid2). At each step, it compares the target with values at these two positions and eliminates two-thirds or one-third of the search space. While theoretically it has a time complexity of O(log₃n), it typically performs more comparisons than binary search in practice. However, ternary search is particularly useful for finding the maximum or minimum of unimodal functions (functions that first increase then decrease, or vice versa), where it's more efficient than binary search.",
    icon: "view_column",
    complexityScore: 0.35,
    tags: ["divide-and-conquer", "sorted-array", "three-way-split", "unimodal", "optimization"],
    leetcodeProblems: [
      "Find Peak Element",
      "Peak Index in a Mountain Array",
      "Find in Mountain Array"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `// Ternary search for finding element in sorted array
function ternarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    // Divide array into three parts
    const mid1 = left + Math.floor((right - left) / 3);
    const mid2 = right - Math.floor((right - left) / 3);

    // Check if target is at mid points
    if (arr[mid1] === target) return mid1;
    if (arr[mid2] === target) return mid2;

    // Target is in left third
    if (target < arr[mid1]) {
      right = mid1 - 1;
    }
    // Target is in right third
    else if (target > arr[mid2]) {
      left = mid2 + 1;
    }
    // Target is in middle third
    else {
      left = mid1 + 1;
      right = mid2 - 1;
    }
  }

  return -1; // Element not found
}

// Ternary search for finding maximum in unimodal function
function ternarySearchMax(
  func: (x: number) => number,
  left: number,
  right: number,
  epsilon: number = 1e-9
): number {
  while (right - left > epsilon) {
    const mid1 = left + (right - left) / 3;
    const mid2 = right - (right - left) / 3;

    if (func(mid1) < func(mid2)) {
      left = mid1;
    } else {
      right = mid2;
    }
  }

  return (left + right) / 2;
}

// Recursive implementation
function ternarySearchRecursive(
  arr: number[],
  target: number,
  left: number = 0,
  right: number = arr.length - 1
): number {
  if (left > right) return -1;

  const mid1 = left + Math.floor((right - left) / 3);
  const mid2 = right - Math.floor((right - left) / 3);

  if (arr[mid1] === target) return mid1;
  if (arr[mid2] === target) return mid2;

  if (target < arr[mid1]) return ternarySearchRecursive(arr, target, left, mid1 - 1);
  if (target > arr[mid2]) return ternarySearchRecursive(arr, target, mid2 + 1, right);
  return ternarySearchRecursive(arr, target, mid1 + 1, mid2 - 1);
}

// --- Example ---
const sortedArr = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
const idx = ternarySearch(sortedArr, 40);         // → 7
const idxRec = ternarySearchRecursive(sortedArr, 15); // → 2
// Find max of unimodal function f(x) = -(x-3)^2 + 9 on [0,6] -> peak near x=3
const peak = ternarySearchMax((x) => -(x - 3) * (x - 3) + 9, 0, 6); // ≈ 3`,
        steps: [
          {
            lines: [3, 4],
            title: "Initialize Search Boundaries",
            description: "Set 'left' to the start and 'right' to the end of the array. Unlike binary search which uses one midpoint, ternary search will divide this range into three parts using two midpoints.",
            variables: { left: "0", right: "arr.length - 1" }
          },
          {
            lines: [6, 8, 9],
            title: "Calculate Two Midpoints",
            description: "Divide the array into three equal parts by calculating mid1 (at 1/3 position) and mid2 (at 2/3 position). This creates three sections: [left, mid1), [mid1, mid2), and [mid2, right].",
            variables: { left: "0", right: "8", mid1: "2", mid2: "6", "sections": "[0-2), [2-6), [6-8]" }
          },
          {
            lines: [12, 13],
            title: "Check Both Midpoints",
            description: "First check if either mid1 or mid2 is the target. This gives two chances to find the element immediately before narrowing the search space, unlike binary search which checks only one midpoint.",
            variables: { mid1: "2", mid2: "6", "arr[mid1]": "25", "arr[mid2]": "75", target: "75" }
          },
          {
            lines: [16, 17],
            title: "Search Left Third",
            description: "If target < arr[mid1], the target must be in the leftmost third of the array. Eliminate the middle and right thirds by moving 'right' to mid1 - 1, reducing search space by ~2/3.",
            variables: { target: "20", "arr[mid1]": "25", "new right": "mid1 - 1 (1)" }
          },
          {
            lines: [20, 21],
            title: "Search Right Third",
            description: "If target > arr[mid2], the target must be in the rightmost third. Eliminate the left and middle thirds by moving 'left' to mid2 + 1, again reducing search space by ~2/3.",
            variables: { target: "80", "arr[mid2]": "75", "new left": "mid2 + 1 (7)" }
          },
          {
            lines: [24, 25, 26],
            title: "Search Middle Third",
            description: "If arr[mid1] < target < arr[mid2], the target is in the middle third. Narrow the search to [mid1 + 1, mid2 - 1], eliminating both outer thirds. This is the unique aspect of ternary search.",
            variables: { "arr[mid1]": "25", target: "50", "arr[mid2]": "75", "new range": "[3, 5]" }
          },
          {
            lines: [30],
            title: "Element Not Found",
            description: "If the loop completes without finding the target (left > right), return -1. While ternary search has O(log₃n) complexity, it often performs more comparisons than binary search in practice.",
            variables: { left: "5", right: "4", result: "-1" }
          }
        ]
      },
      {
        language: "python",
        code: `# Ternary search for finding element in sorted array
def ternary_search(arr, target):
    left, right = 0, len(arr) - 1

    while left <= right:
        # Divide array into three parts
        mid1 = left + (right - left) // 3
        mid2 = right - (right - left) // 3

        # Check if target is at mid points
        if arr[mid1] == target:
            return mid1
        if arr[mid2] == target:
            return mid2

        # Target is in left third
        if target < arr[mid1]:
            right = mid1 - 1
        # Target is in right third
        elif target > arr[mid2]:
            left = mid2 + 1
        # Target is in middle third
        else:
            left = mid1 + 1
            right = mid2 - 1

    return -1  # Element not found

# Ternary search for finding maximum in unimodal function
def ternary_search_max(func, left, right, epsilon=1e-9):
    while right - left > epsilon:
        mid1 = left + (right - left) / 3
        mid2 = right - (right - left) / 3

        if func(mid1) < func(mid2):
            left = mid1
        else:
            right = mid2

    return (left + right) / 2

# Recursive implementation
def ternary_search_recursive(arr, target, left=0, right=None):
    if right is None:
        right = len(arr) - 1

    if left > right:
        return -1

    mid1 = left + (right - left) // 3
    mid2 = right - (right - left) // 3

    if arr[mid1] == target:
        return mid1
    if arr[mid2] == target:
        return mid2

    if target < arr[mid1]:
        return ternary_search_recursive(arr, target, left, mid1 - 1)
    elif target > arr[mid2]:
        return ternary_search_recursive(arr, target, mid2 + 1, right)
    else:
        return ternary_search_recursive(arr, target, mid1 + 1, mid2 - 1)

# --- Example ---
sorted_arr = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]
idx = ternary_search(sorted_arr, 40)              # -> 7
idx_rec = ternary_search_recursive(sorted_arr, 15) # -> 2
# Find max of unimodal f(x) = -(x-3)^2 + 9 on [0,6] -> peak near x=3
peak = ternary_search_max(lambda x: -(x - 3) ** 2 + 9, 0, 6) # ~ 3`,
        steps: [
          {
            lines: [3],
            title: "Initialize Search Boundaries",
            description: "Set 'left' to the start and 'right' to the end of the array. Unlike binary search which uses one midpoint, ternary search will divide this range into three parts using two midpoints.",
            variables: { left: "0", right: "len(arr) - 1" }
          },
          {
            lines: [5, 7, 8],
            title: "Calculate Two Midpoints",
            description: "Divide the array into three equal parts by calculating mid1 (at 1/3 position) and mid2 (at 2/3 position). This creates three sections: [left, mid1), [mid1, mid2), and [mid2, right].",
            variables: { left: "0", right: "8", mid1: "2", mid2: "6", "sections": "[0-2), [2-6), [6-8]" }
          },
          {
            lines: [11, 12, 13, 14],
            title: "Check Both Midpoints",
            description: "First check if either mid1 or mid2 is the target. This gives two chances to find the element immediately before narrowing the search space, unlike binary search which checks only one midpoint.",
            variables: { mid1: "2", mid2: "6", "arr[mid1]": "25", "arr[mid2]": "75", target: "75" }
          },
          {
            lines: [17, 18],
            title: "Search Left Third",
            description: "If target < arr[mid1], the target must be in the leftmost third of the array. Eliminate the middle and right thirds by moving 'right' to mid1 - 1, reducing search space by ~2/3.",
            variables: { target: "20", "arr[mid1]": "25", "new right": "mid1 - 1 (1)" }
          },
          {
            lines: [20, 21],
            title: "Search Right Third",
            description: "If target > arr[mid2], the target must be in the rightmost third. Eliminate the left and middle thirds by moving 'left' to mid2 + 1, again reducing search space by ~2/3.",
            variables: { target: "80", "arr[mid2]": "75", "new left": "mid2 + 1 (7)" }
          },
          {
            lines: [23, 24, 25],
            title: "Search Middle Third",
            description: "If arr[mid1] < target < arr[mid2], the target is in the middle third. Narrow the search to [mid1 + 1, mid2 - 1], eliminating both outer thirds. This is the unique aspect of ternary search.",
            variables: { "arr[mid1]": "25", target: "50", "arr[mid2]": "75", "new range": "[3, 5]" }
          },
          {
            lines: [27],
            title: "Element Not Found",
            description: "If the loop completes without finding the target (left > right), return -1. While ternary search has O(log₃n) complexity, it often performs more comparisons than binary search in practice.",
            variables: { left: "5", right: "4", result: "-1" }
          }
        ]
      }
    ],
    keyInsights: [
      "Divides search space into three parts using two mid-points",
      "Has O(log₃n) complexity but makes more comparisons than binary search",
      "Particularly effective for unimodal function optimization problems",
      "Can be more efficient than binary search for finding peaks or valleys"
    ],
    whenToUse: [
      "When finding maximum/minimum of unimodal functions",
      "For optimization problems with single peak or valley",
      "When searching in mountain arrays or bitonic sequences"
    ]
  }
];
