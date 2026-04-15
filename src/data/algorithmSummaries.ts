import type { AlgorithmSummary, Category } from '../types/algorithm';

export const algorithmSummaries: AlgorithmSummary[] = [
  {
    "id": "BAC_001",
    "name": "N-Queens",
    "category": "Backtracking",
    "difficulty": "Advanced",
    "timeComplexity": "O(n!)",
    "description": "Place N queens on an N×N chessboard so that no two queens threaten each other.",
    "icon": "grid_4x4",
    "complexityScore": 0.85,
    "tags": [
      "backtracking",
      "chess",
      "constraint-satisfaction",
      "recursion",
      "combinatorics"
    ]
  },
  {
    "id": "BAC_002",
    "name": "Sudoku Solver",
    "category": "Backtracking",
    "difficulty": "Advanced",
    "timeComplexity": "O(9^m)",
    "description": "Fill a 9×9 Sudoku grid following the rules: each row, column, and 3×3 box contains digits 1-9 exactly once.",
    "icon": "grid_3x3",
    "complexityScore": 0.9,
    "tags": [
      "backtracking",
      "constraint-satisfaction",
      "puzzle",
      "recursion",
      "grid"
    ]
  },
  {
    "id": "BAC_003",
    "name": "Permutations Generator",
    "category": "Backtracking",
    "difficulty": "Medium",
    "timeComplexity": "O(n!)",
    "description": "Generate all possible permutations of a collection of distinct elements.",
    "icon": "sync",
    "complexityScore": 0.6,
    "tags": [
      "backtracking",
      "permutations",
      "recursion",
      "combinatorics",
      "arrays"
    ]
  },
  {
    "id": "BAC_004",
    "name": "Combination Sum",
    "category": "Backtracking",
    "difficulty": "Medium",
    "timeComplexity": "O(2^n)",
    "description": "Find all unique combinations of candidates that sum to a target value, allowing repeated use of candidates.",
    "icon": "add_circle",
    "complexityScore": 0.55,
    "tags": [
      "backtracking",
      "combinations",
      "recursion",
      "sum",
      "arrays"
    ]
  },
  {
    "id": "BIT_001",
    "name": "Single Number (XOR)",
    "category": "Bit Manipulation",
    "difficulty": "Beginner",
    "timeComplexity": "O(n)",
    "description": "Finds unique element in array where others appear twice using XOR.",
    "icon": "memory",
    "complexityScore": 0.15,
    "tags": [
      "XOR",
      "Bit Manipulation",
      "Array",
      "Unique Element"
    ]
  },
  {
    "id": "BIT_002",
    "name": "Counting Bits",
    "category": "Bit Manipulation",
    "difficulty": "Medium",
    "timeComplexity": "O(n)",
    "description": "Counts set bits for all numbers from 0 to n using dynamic programming.",
    "icon": "pin",
    "complexityScore": 0.35,
    "tags": [
      "Bit Manipulation",
      "Dynamic Programming",
      "Popcount",
      "Binary"
    ]
  },
  {
    "id": "BIT_003",
    "name": "Power of Two",
    "category": "Bit Manipulation",
    "difficulty": "Beginner",
    "timeComplexity": "O(1)",
    "description": "Checks if number is power of two using bit manipulation trick.",
    "icon": "bolt",
    "complexityScore": 0.1,
    "tags": [
      "Bit Manipulation",
      "Power of Two",
      "Binary",
      "Constant Time"
    ]
  },
  {
    "id": "DAC_001",
    "name": "Merge Sort (D&C)",
    "category": "Divide & Conquer",
    "difficulty": "Medium",
    "timeComplexity": "O(n log n)",
    "description": "A classic divide-and-conquer sorting algorithm that recursively divides the array and merges sorted halves.",
    "icon": "call_split",
    "complexityScore": 0.55,
    "tags": [
      "divide-and-conquer",
      "sorting",
      "stable-sort",
      "recursion",
      "merging"
    ]
  },
  {
    "id": "DAC_002",
    "name": "Closest Pair of Points",
    "category": "Divide & Conquer",
    "difficulty": "Advanced",
    "timeComplexity": "O(n log n)",
    "description": "Finds the minimum distance between any two points in 2D space using divide-and-conquer with optimal strip checking.",
    "icon": "place",
    "complexityScore": 0.75,
    "tags": [
      "divide-and-conquer",
      "geometry",
      "closest-pair",
      "2d-points",
      "optimization"
    ]
  },
  {
    "id": "DP_001",
    "name": "Fibonacci (Memoization)",
    "category": "Dynamic Programming",
    "difficulty": "Beginner",
    "timeComplexity": "O(n)",
    "description": "Calculates Fibonacci numbers using memoization to avoid redundant calculations.",
    "icon": "function",
    "complexityScore": 0.2,
    "tags": [
      "recursion",
      "memoization",
      "sequences",
      "optimization",
      "cache"
    ]
  },
  {
    "id": "DP_002",
    "name": "Longest Common Subsequence",
    "category": "Dynamic Programming",
    "difficulty": "Medium",
    "timeComplexity": "O(m*n)",
    "description": "Finds the longest subsequence common to two sequences without requiring consecutive elements.",
    "icon": "compare_arrows",
    "complexityScore": 0.6,
    "tags": [
      "strings",
      "sequences",
      "2d-dp",
      "optimization",
      "comparison"
    ]
  },
  {
    "id": "DP_003",
    "name": "Longest Increasing Subsequence",
    "category": "Dynamic Programming",
    "difficulty": "Medium",
    "timeComplexity": "O(n log n)",
    "description": "Finds the length of the longest strictly increasing subsequence in an array.",
    "icon": "trending_up",
    "complexityScore": 0.6,
    "tags": [
      "sequences",
      "binary-search",
      "optimization",
      "greedy",
      "patience-sorting"
    ]
  },
  {
    "id": "DP_004",
    "name": "0/1 Knapsack",
    "category": "Dynamic Programming",
    "difficulty": "Medium",
    "timeComplexity": "O(n*W)",
    "description": "Maximizes value by selecting items with given weights and values, each item taken at most once.",
    "icon": "backpack",
    "complexityScore": 0.65,
    "tags": [
      "optimization",
      "subset-selection",
      "2d-dp",
      "combinatorial",
      "resource-allocation"
    ]
  },
  {
    "id": "DP_005",
    "name": "Coin Change",
    "category": "Dynamic Programming",
    "difficulty": "Medium",
    "timeComplexity": "O(n*S)",
    "description": "Finds the minimum number of coins needed to make a given amount using unlimited coins of given denominations.",
    "icon": "payments",
    "complexityScore": 0.55,
    "tags": [
      "unbounded-knapsack",
      "optimization",
      "greedy-fails",
      "currency",
      "combinatorial"
    ]
  },
  {
    "id": "DP_006",
    "name": "Edit Distance",
    "category": "Dynamic Programming",
    "difficulty": "Medium",
    "timeComplexity": "O(m*n)",
    "description": "Computes minimum edit operations (insert, delete, replace) to transform one string into another.",
    "icon": "edit_note",
    "complexityScore": 0.65,
    "tags": [
      "strings",
      "transformation",
      "2d-dp",
      "nlp",
      "similarity"
    ]
  },
  {
    "id": "DP_007",
    "name": "Matrix Chain Multiplication",
    "category": "Dynamic Programming",
    "difficulty": "Advanced",
    "timeComplexity": "O(n³)",
    "description": "Finds optimal parenthesization to minimize scalar multiplications when multiplying a chain of matrices.",
    "icon": "grid_view",
    "complexityScore": 0.8,
    "tags": [
      "interval-dp",
      "optimization",
      "matrices",
      "parenthesization",
      "combinatorial"
    ]
  },
  {
    "id": "DP_008",
    "name": "Rod Cutting",
    "category": "Dynamic Programming",
    "difficulty": "Medium",
    "timeComplexity": "O(n²)",
    "description": "Maximizes profit by cutting a rod into pieces of various lengths, each with different prices.",
    "icon": "straighten",
    "complexityScore": 0.55,
    "tags": [
      "unbounded-knapsack",
      "optimization",
      "cutting-stock",
      "profit-maximization",
      "intervals"
    ]
  },
  {
    "id": "DP_009",
    "name": "Subset Sum",
    "category": "Dynamic Programming",
    "difficulty": "Medium",
    "timeComplexity": "O(n*S)",
    "description": "Determines if there exists a subset of numbers that sum to a target value.",
    "icon": "checklist",
    "complexityScore": 0.6,
    "tags": [
      "subset-selection",
      "boolean-dp",
      "knapsack-variant",
      "np-complete",
      "combinatorial"
    ]
  },
  {
    "id": "DP_010",
    "name": "Palindrome Partitioning",
    "category": "Dynamic Programming",
    "difficulty": "Advanced",
    "timeComplexity": "O(n²)",
    "description": "Finds minimum cuts needed to partition a string into palindromic substrings.",
    "icon": "content_cut",
    "complexityScore": 0.75,
    "tags": [
      "strings",
      "palindromes",
      "optimization",
      "2d-dp",
      "partitioning"
    ]
  },
  {
    "id": "DP_011",
    "name": "Word Break",
    "category": "Dynamic Programming",
    "difficulty": "Medium",
    "timeComplexity": "O(n²)",
    "description": "Determines if a string can be segmented into space-separated dictionary words.",
    "icon": "spellcheck",
    "complexityScore": 0.55,
    "tags": [
      "strings",
      "segmentation",
      "dictionary",
      "boolean-dp",
      "nlp"
    ]
  },
  {
    "id": "DP_012",
    "name": "House Robber",
    "category": "Dynamic Programming",
    "difficulty": "Medium",
    "timeComplexity": "O(n)",
    "description": "Maximizes money robbed from houses without robbing adjacent ones.",
    "icon": "house",
    "complexityScore": 0.4,
    "tags": [
      "optimization",
      "state-machine",
      "constraints",
      "linear-dp",
      "greedy-fails"
    ]
  },
  {
    "id": "DP_013",
    "name": "Unique Paths",
    "category": "Dynamic Programming",
    "difficulty": "Beginner",
    "timeComplexity": "O(m*n)",
    "description": "Counts unique paths from top-left to bottom-right in a grid, moving only right or down.",
    "icon": "grid_on",
    "complexityScore": 0.35,
    "tags": [
      "grid",
      "paths",
      "combinatorics",
      "2d-dp",
      "beginner-friendly"
    ]
  },
  {
    "id": "DP_014",
    "name": "Maximum Subarray (Kadane's)",
    "category": "Dynamic Programming",
    "difficulty": "Beginner",
    "timeComplexity": "O(n)",
    "description": "Finds the contiguous subarray with the largest sum using Kadane's algorithm.",
    "icon": "show_chart",
    "complexityScore": 0.25,
    "tags": [
      "arrays",
      "optimization",
      "linear-dp",
      "kadanes",
      "streaming"
    ]
  },
  {
    "id": "DP_015",
    "name": "Climbing Stairs",
    "category": "Dynamic Programming",
    "difficulty": "Beginner",
    "timeComplexity": "O(n)",
    "description": "Counts distinct ways to climb n stairs taking 1 or 2 steps at a time.",
    "icon": "stairs",
    "complexityScore": 0.2,
    "tags": [
      "fibonacci-variant",
      "combinatorics",
      "paths",
      "beginner-friendly",
      "recursion"
    ]
  },
  {
    "id": "DP_016",
    "name": "Best Time to Buy/Sell Stock",
    "category": "Dynamic Programming",
    "difficulty": "Beginner",
    "timeComplexity": "O(n)",
    "description": "Finds maximum profit from buying and selling stock with various transaction constraints.",
    "icon": "candlestick_chart",
    "complexityScore": 0.25,
    "tags": [
      "state-machine",
      "optimization",
      "trading",
      "finance",
      "greedy"
    ]
  },
  {
    "id": "DP_017",
    "name": "Decode Ways",
    "category": "Dynamic Programming",
    "difficulty": "Medium",
    "timeComplexity": "O(n)",
    "description": "Counts ways to decode a digit string where 'A'=1, 'B'=2, ..., 'Z'=26.",
    "icon": "password",
    "complexityScore": 0.5,
    "tags": [
      "strings",
      "decoding",
      "fibonacci-variant",
      "constraints",
      "combinatorics"
    ]
  },
  {
    "id": "DP_018",
    "name": "Longest Palindromic Substring",
    "category": "Dynamic Programming",
    "difficulty": "Medium",
    "timeComplexity": "O(n²)",
    "description": "Finds the longest palindromic substring within a given string.",
    "icon": "text_rotation_none",
    "complexityScore": 0.6,
    "tags": [
      "strings",
      "palindromes",
      "2d-dp",
      "expand-around-center",
      "optimization"
    ]
  },
  {
    "id": "DP_019",
    "name": "Regular Expression Matching",
    "category": "Dynamic Programming",
    "difficulty": "Advanced",
    "timeComplexity": "O(m*n)",
    "description": "Implements regex matching with '.' (any character) and '*' (zero or more of preceding element).",
    "icon": "code",
    "complexityScore": 0.9,
    "tags": [
      "strings",
      "pattern-matching",
      "regex",
      "2d-dp",
      "complex-transitions"
    ]
  },
  {
    "id": "DP_020",
    "name": "Interleaving String",
    "category": "Dynamic Programming",
    "difficulty": "Advanced",
    "timeComplexity": "O(m*n)",
    "description": "Determines if s3 is formed by interleaving s1 and s2 while preserving their character orders.",
    "icon": "shuffle",
    "complexityScore": 0.75,
    "tags": [
      "strings",
      "2d-dp",
      "path-based",
      "interleaving",
      "sequences"
    ]
  },
  {
    "id": "DP_021",
    "name": "Burst Balloons",
    "category": "Dynamic Programming",
    "difficulty": "Advanced",
    "timeComplexity": "O(n³)",
    "description": "Maximizes coins from bursting balloons where each burst gives coins based on adjacent balloons.",
    "icon": "bubble_chart",
    "complexityScore": 0.9,
    "tags": [
      "interval-dp",
      "optimization",
      "game-theory",
      "reverse-thinking",
      "complex"
    ]
  },
  {
    "id": "GRA_001",
    "name": "Dijkstra's Algorithm",
    "category": "Graphs",
    "difficulty": "Advanced",
    "timeComplexity": "O(E log V)",
    "description": "Finds the shortest path from a source vertex to all other vertices in a weighted graph with non-negative edge weights.",
    "icon": "share",
    "complexityScore": 0.8,
    "tags": [
      "shortest-path",
      "greedy",
      "priority-queue",
      "weighted-graph"
    ]
  },
  {
    "id": "GRA_002",
    "name": "Bellman-Ford Algorithm",
    "category": "Graphs",
    "difficulty": "Advanced",
    "timeComplexity": "O(VE)",
    "description": "Computes shortest paths from a single source to all vertices in a weighted graph, handling negative edge weights and detecting negative cycles.",
    "icon": "sync_alt",
    "complexityScore": 0.75,
    "tags": [
      "shortest-path",
      "dynamic-programming",
      "negative-weights",
      "cycle-detection"
    ]
  },
  {
    "id": "GRA_003",
    "name": "Floyd-Warshall Algorithm",
    "category": "Graphs",
    "difficulty": "Advanced",
    "timeComplexity": "O(V³)",
    "description": "Finds shortest paths between all pairs of vertices in a weighted graph using dynamic programming.",
    "icon": "hub",
    "complexityScore": 0.85,
    "tags": [
      "all-pairs-shortest-path",
      "dynamic-programming",
      "matrix",
      "transitive-closure"
    ]
  },
  {
    "id": "GRA_004",
    "name": "Kruskal's Algorithm",
    "category": "Graphs",
    "difficulty": "Medium",
    "timeComplexity": "O(E log E)",
    "description": "Finds the minimum spanning tree of a weighted undirected graph by sorting edges and using union-find.",
    "icon": "device_hub",
    "complexityScore": 0.65,
    "tags": [
      "minimum-spanning-tree",
      "greedy",
      "union-find",
      "sorting"
    ]
  },
  {
    "id": "GRA_005",
    "name": "Prim's Algorithm",
    "category": "Graphs",
    "difficulty": "Medium",
    "timeComplexity": "O(E log V)",
    "description": "Builds a minimum spanning tree by growing it from a starting vertex using a priority queue.",
    "icon": "lan",
    "complexityScore": 0.65,
    "tags": [
      "minimum-spanning-tree",
      "greedy",
      "priority-queue",
      "dense-graphs"
    ]
  },
  {
    "id": "GRA_006",
    "name": "A* Search Algorithm",
    "category": "Graphs",
    "difficulty": "Advanced",
    "timeComplexity": "O(E)",
    "description": "Finds the shortest path using heuristics to guide the search, combining actual cost and estimated cost to goal.",
    "icon": "star",
    "complexityScore": 0.85,
    "tags": [
      "shortest-path",
      "heuristic",
      "informed-search",
      "pathfinding"
    ]
  },
  {
    "id": "GRA_007",
    "name": "Tarjan's Algorithm (SCC)",
    "category": "Graphs",
    "difficulty": "Advanced",
    "timeComplexity": "O(V+E)",
    "description": "Finds strongly connected components in a directed graph using a single DFS traversal with low-link values.",
    "icon": "loop",
    "complexityScore": 0.9,
    "tags": [
      "strongly-connected-components",
      "dfs",
      "graph-theory",
      "low-link"
    ]
  },
  {
    "id": "GRA_008",
    "name": "Kosaraju's Algorithm",
    "category": "Graphs",
    "difficulty": "Advanced",
    "timeComplexity": "O(V+E)",
    "description": "Finds strongly connected components using two DFS passes: one on the original graph and one on the transposed graph.",
    "icon": "autorenew",
    "complexityScore": 0.85,
    "tags": [
      "strongly-connected-components",
      "dfs",
      "graph-transpose",
      "two-pass"
    ]
  },
  {
    "id": "GRA_009",
    "name": "Kahn's Algorithm (Topological Sort)",
    "category": "Graphs",
    "difficulty": "Medium",
    "timeComplexity": "O(V+E)",
    "description": "Produces a topological ordering of a directed acyclic graph by repeatedly removing vertices with no incoming edges.",
    "icon": "low_priority",
    "complexityScore": 0.6,
    "tags": [
      "topological-sort",
      "bfs",
      "dag",
      "in-degree"
    ]
  },
  {
    "id": "GRA_010",
    "name": "Cycle Detection",
    "category": "Graphs",
    "difficulty": "Medium",
    "timeComplexity": "O(V+E)",
    "description": "Detects cycles in directed and undirected graphs using DFS with recursion stack tracking.",
    "icon": "replay",
    "complexityScore": 0.5,
    "tags": [
      "cycle-detection",
      "dfs",
      "graph-validation",
      "back-edge"
    ]
  },
  {
    "id": "GRA_011",
    "name": "Bipartite Check",
    "category": "Graphs",
    "difficulty": "Medium",
    "timeComplexity": "O(V+E)",
    "description": "Determines if a graph is bipartite by attempting to color vertices with two colors such that no adjacent vertices share the same color.",
    "icon": "dashboard",
    "complexityScore": 0.5,
    "tags": [
      "bipartite",
      "graph-coloring",
      "bfs",
      "two-coloring"
    ]
  },
  {
    "id": "GRA_012",
    "name": "Eulerian Path",
    "category": "Graphs",
    "difficulty": "Advanced",
    "timeComplexity": "O(E)",
    "description": "Finds a path that visits every edge exactly once using Hierholzer's algorithm.",
    "icon": "timeline",
    "complexityScore": 0.8,
    "tags": [
      "eulerian-path",
      "graph-traversal",
      "hierholzer",
      "edge-traversal"
    ]
  },
  {
    "id": "GRA_013",
    "name": "Network Flow (Ford-Fulkerson)",
    "category": "Graphs",
    "difficulty": "Advanced",
    "timeComplexity": "O(VE²)",
    "description": "Computes maximum flow in a flow network by finding augmenting paths using DFS or BFS.",
    "icon": "water_drop",
    "complexityScore": 0.95,
    "tags": [
      "max-flow",
      "network-flow",
      "augmenting-path",
      "min-cut"
    ]
  },
  {
    "id": "GRA_014",
    "name": "Minimum Spanning Tree",
    "category": "Graphs",
    "difficulty": "Medium",
    "timeComplexity": "O(E log V)",
    "description": "Finds a subset of edges that connects all vertices with minimum total weight using Kruskal's or Prim's algorithm.",
    "icon": "polyline",
    "complexityScore": 0.6,
    "tags": [
      "mst",
      "spanning-tree",
      "greedy",
      "optimization"
    ]
  },
  {
    "id": "GRE_001",
    "name": "Activity Selection",
    "category": "Greedy",
    "difficulty": "Medium",
    "timeComplexity": "O(n log n)",
    "description": "Select the maximum number of non-overlapping activities from a set of activities with start and finish times.",
    "icon": "event",
    "complexityScore": 0.5,
    "tags": [
      "greedy",
      "intervals",
      "scheduling",
      "sorting",
      "optimization"
    ]
  },
  {
    "id": "GRE_002",
    "name": "Huffman Coding",
    "category": "Greedy",
    "difficulty": "Advanced",
    "timeComplexity": "O(n log n)",
    "description": "Build an optimal prefix-free binary code for data compression using character frequencies.",
    "icon": "compress",
    "complexityScore": 0.75,
    "tags": [
      "greedy",
      "compression",
      "trees",
      "priority-queue",
      "encoding"
    ]
  },
  {
    "id": "GRE_003",
    "name": "Fractional Knapsack",
    "category": "Greedy",
    "difficulty": "Medium",
    "timeComplexity": "O(n log n)",
    "description": "Maximize the total value in a knapsack by taking fractions of items based on value-to-weight ratio.",
    "icon": "shopping_bag",
    "complexityScore": 0.45,
    "tags": [
      "greedy",
      "optimization",
      "sorting",
      "knapsack",
      "ratios"
    ]
  },
  {
    "id": "GRE_004",
    "name": "Job Scheduling",
    "category": "Greedy",
    "difficulty": "Medium",
    "timeComplexity": "O(n log n)",
    "description": "Schedule jobs with deadlines and profits to maximize total profit.",
    "icon": "schedule",
    "complexityScore": 0.5,
    "tags": [
      "greedy",
      "scheduling",
      "deadlines",
      "sorting",
      "optimization"
    ]
  },
  {
    "id": "HAS_001",
    "name": "Two Sum (Hash Map)",
    "category": "Hashing",
    "difficulty": "Beginner",
    "timeComplexity": "O(n)",
    "description": "Finds two numbers that sum to target using hash map for O(1) lookups.",
    "icon": "fingerprint",
    "complexityScore": 0.15,
    "tags": [
      "Hash Map",
      "Two Sum",
      "Array",
      "Complement Search"
    ]
  },
  {
    "id": "HAS_002",
    "name": "Group Anagrams",
    "category": "Hashing",
    "difficulty": "Medium",
    "timeComplexity": "O(nk)",
    "description": "Groups strings that are anagrams using sorted strings as hash keys.",
    "icon": "group_work",
    "complexityScore": 0.4,
    "tags": [
      "Hash Map",
      "Anagram",
      "String",
      "Grouping",
      "Sorting"
    ]
  },
  {
    "id": "HAS_003",
    "name": "LRU Cache",
    "category": "Hashing",
    "difficulty": "Medium",
    "timeComplexity": "O(1)",
    "description": "Cache with O(1) get/put operations using hash map and doubly linked list.",
    "icon": "cached",
    "complexityScore": 0.6,
    "tags": [
      "Hash Map",
      "Doubly Linked List",
      "Cache",
      "LRU",
      "Design"
    ]
  },
  {
    "id": "HEA_001",
    "name": "Kth Largest Element",
    "category": "Heaps",
    "difficulty": "Medium",
    "timeComplexity": "O(n log k)",
    "description": "Finds the kth largest element using a min heap of size k.",
    "icon": "leaderboard",
    "complexityScore": 0.5,
    "tags": [
      "Heap",
      "Priority Queue",
      "Selection",
      "Top K"
    ]
  },
  {
    "id": "HEA_002",
    "name": "Merge K Sorted Lists",
    "category": "Heaps",
    "difficulty": "Advanced",
    "timeComplexity": "O(n log k)",
    "description": "Merges k sorted linked lists using a min heap for efficient selection.",
    "icon": "call_merge",
    "complexityScore": 0.7,
    "tags": [
      "Heap",
      "Merge",
      "Linked Lists",
      "Priority Queue",
      "Multi-way Merge"
    ]
  },
  {
    "id": "HEA_003",
    "name": "Top K Frequent Elements",
    "category": "Heaps",
    "difficulty": "Medium",
    "timeComplexity": "O(n log k)",
    "description": "Finds k most frequent elements using hash map and min heap.",
    "icon": "insights",
    "complexityScore": 0.55,
    "tags": [
      "Heap",
      "Hash Map",
      "Frequency Count",
      "Top K",
      "Priority Queue"
    ]
  },
  {
    "id": "LIN_001",
    "name": "Floyd's Cycle Detection",
    "category": "Linked Lists",
    "difficulty": "Medium",
    "timeComplexity": "O(n)",
    "description": "Detects cycles in linked lists using two pointers moving at different speeds.",
    "icon": "all_inclusive",
    "complexityScore": 0.45,
    "tags": [
      "Two Pointers",
      "Cycle Detection",
      "Fast and Slow Pointers",
      "Linked List"
    ]
  },
  {
    "id": "LIN_002",
    "name": "Merge Two Sorted Lists",
    "category": "Linked Lists",
    "difficulty": "Beginner",
    "timeComplexity": "O(n+m)",
    "description": "Combines two sorted linked lists into a single sorted list.",
    "icon": "merge_type",
    "complexityScore": 0.25,
    "tags": [
      "Merge",
      "Sorted Lists",
      "Two Pointers",
      "Linked List Manipulation"
    ]
  },
  {
    "id": "LIN_003",
    "name": "Reverse Linked List",
    "category": "Linked Lists",
    "difficulty": "Beginner",
    "timeComplexity": "O(n)",
    "description": "Reverses the direction of pointers in a linked list.",
    "icon": "undo",
    "complexityScore": 0.15,
    "tags": [
      "Linked List",
      "Pointer Manipulation",
      "In-Place",
      "Reversal"
    ]
  },
  {
    "id": "MAT_001",
    "name": "Sieve of Eratosthenes",
    "category": "Math",
    "difficulty": "Medium",
    "timeComplexity": "O(n log log n)",
    "description": "An ancient algorithm for finding all prime numbers up to a given limit by iteratively marking multiples of each prime.",
    "icon": "filter_alt",
    "complexityScore": 0.45,
    "tags": [
      "primes",
      "number-theory",
      "array",
      "optimization",
      "mathematical"
    ]
  },
  {
    "id": "MAT_002",
    "name": "GCD (Euclidean Algorithm)",
    "category": "Math",
    "difficulty": "Beginner",
    "timeComplexity": "O(log min(a,b))",
    "description": "An efficient algorithm for computing the greatest common divisor of two numbers using the principle that GCD(a,b) = GCD(b, a mod b).",
    "icon": "calculate",
    "complexityScore": 0.2,
    "tags": [
      "number-theory",
      "recursion",
      "gcd",
      "mathematics",
      "divisibility"
    ]
  },
  {
    "id": "MAT_003",
    "name": "Fast Exponentiation",
    "category": "Math",
    "difficulty": "Medium",
    "timeComplexity": "O(log n)",
    "description": "An efficient method for computing large powers using binary exponentiation by repeatedly squaring the base.",
    "icon": "superscript",
    "complexityScore": 0.4,
    "tags": [
      "exponentiation",
      "binary",
      "optimization",
      "recursion",
      "modular-arithmetic"
    ]
  },
  {
    "id": "SEA_001",
    "name": "Binary Search",
    "category": "Searching",
    "difficulty": "Beginner",
    "timeComplexity": "O(log n)",
    "description": "Efficiently searches a sorted array by repeatedly dividing the search interval in half, comparing the target value with the middle element.",
    "icon": "search",
    "complexityScore": 0.25,
    "tags": [
      "divide-and-conquer",
      "sorted-array",
      "logarithmic",
      "iterative",
      "recursive"
    ]
  },
  {
    "id": "SEA_002",
    "name": "Linear Search",
    "category": "Searching",
    "difficulty": "Beginner",
    "timeComplexity": "O(n)",
    "description": "Sequentially checks each element in a collection until the target is found or all elements have been examined.",
    "icon": "manage_search",
    "complexityScore": 0.1,
    "tags": [
      "sequential",
      "simple",
      "unsorted",
      "brute-force",
      "basic"
    ]
  },
  {
    "id": "SEA_003",
    "name": "Depth-First Search (DFS)",
    "category": "Searching",
    "difficulty": "Medium",
    "timeComplexity": "O(V + E)",
    "description": "Explores a graph or tree by going as deep as possible along each branch before backtracking to explore other branches.",
    "icon": "account_tree",
    "complexityScore": 0.5,
    "tags": [
      "graph-traversal",
      "recursion",
      "stack",
      "backtracking",
      "tree"
    ]
  },
  {
    "id": "SEA_004",
    "name": "Breadth-First Search (BFS)",
    "category": "Searching",
    "difficulty": "Medium",
    "timeComplexity": "O(V + E)",
    "description": "Explores a graph or tree level by level, visiting all neighbors at the current depth before moving to the next level.",
    "icon": "grid_on",
    "complexityScore": 0.5,
    "tags": [
      "graph-traversal",
      "queue",
      "level-order",
      "shortest-path",
      "tree"
    ]
  },
  {
    "id": "SEA_005",
    "name": "Jump Search",
    "category": "Searching",
    "difficulty": "Medium",
    "timeComplexity": "O(√n)",
    "description": "Searches a sorted array by jumping ahead by fixed steps and performing linear search in the identified block where the element may exist.",
    "icon": "skip_next",
    "complexityScore": 0.35,
    "tags": [
      "sorted-array",
      "block-search",
      "jump",
      "forward-only",
      "square-root"
    ]
  },
  {
    "id": "SEA_006",
    "name": "Interpolation Search",
    "category": "Searching",
    "difficulty": "Medium",
    "timeComplexity": "O(log log n)",
    "description": "An improved variant of binary search that calculates probe position based on the value being searched, working best on uniformly distributed sorted data.",
    "icon": "trending_up",
    "complexityScore": 0.4,
    "tags": [
      "sorted-array",
      "interpolation",
      "uniform-distribution",
      "probe-position",
      "adaptive"
    ]
  },
  {
    "id": "SEA_007",
    "name": "Exponential Search",
    "category": "Searching",
    "difficulty": "Medium",
    "timeComplexity": "O(log n)",
    "description": "Finds the range where an element exists by exponentially increasing the search range, then applies binary search within that range.",
    "icon": "speed",
    "complexityScore": 0.4,
    "tags": [
      "sorted-array",
      "binary-search",
      "doubling",
      "unbounded",
      "range-finding"
    ]
  },
  {
    "id": "SEA_008",
    "name": "Ternary Search",
    "category": "Searching",
    "difficulty": "Medium",
    "timeComplexity": "O(log₃n)",
    "description": "Divides the search space into three parts instead of two, using two mid-points to determine which third contains the target element.",
    "icon": "view_column",
    "complexityScore": 0.35,
    "tags": [
      "divide-and-conquer",
      "sorted-array",
      "three-way-split",
      "unimodal",
      "optimization"
    ]
  },
  {
    "id": "SLI_001",
    "name": "Maximum Sum Subarray of Size K",
    "category": "Sliding Window",
    "difficulty": "Beginner",
    "timeComplexity": "O(n)",
    "description": "Find the maximum sum of any contiguous subarray of size K using a sliding window.",
    "icon": "tab",
    "complexityScore": 0.2,
    "tags": [
      "sliding-window",
      "arrays",
      "subarray",
      "sum",
      "optimization"
    ]
  },
  {
    "id": "SLI_002",
    "name": "Longest Substring Without Repeating",
    "category": "Sliding Window",
    "difficulty": "Medium",
    "timeComplexity": "O(n)",
    "description": "Find the length of the longest substring without repeating characters using a dynamic sliding window.",
    "icon": "text_fields",
    "complexityScore": 0.45,
    "tags": [
      "sliding-window",
      "strings",
      "hash-map",
      "substrings",
      "optimization"
    ]
  },
  {
    "id": "SLI_003",
    "name": "Minimum Window Substring",
    "category": "Sliding Window",
    "difficulty": "Advanced",
    "timeComplexity": "O(n)",
    "description": "Find the minimum window in string S that contains all characters from string T.",
    "icon": "crop",
    "complexityScore": 0.75,
    "tags": [
      "sliding-window",
      "strings",
      "hash-map",
      "substrings",
      "optimization"
    ]
  },
  {
    "id": "SRT_001",
    "name": "Quick Sort",
    "category": "Sorting",
    "difficulty": "Medium",
    "timeComplexity": "O(n log n) average, O(n²) worst",
    "description": "A divide-and-conquer algorithm that selects a pivot element and partitions the array around it, recursively sorting the subarrays.",
    "icon": "reorder",
    "complexityScore": 0.65,
    "tags": [
      "divide-and-conquer",
      "in-place",
      "unstable",
      "recursive",
      "comparison-based"
    ]
  },
  {
    "id": "SRT_002",
    "name": "Merge Sort",
    "category": "Sorting",
    "difficulty": "Medium",
    "timeComplexity": "O(n log n)",
    "description": "A stable divide-and-conquer algorithm that recursively divides the array into halves, sorts them, and merges the sorted halves.",
    "icon": "merge",
    "complexityScore": 0.6,
    "tags": [
      "divide-and-conquer",
      "stable",
      "recursive",
      "comparison-based",
      "predictable"
    ]
  },
  {
    "id": "SRT_003",
    "name": "Heap Sort",
    "category": "Sorting",
    "difficulty": "Medium",
    "timeComplexity": "O(n log n)",
    "description": "A comparison-based sorting algorithm that uses a binary heap data structure to sort elements in-place with guaranteed O(n log n) time complexity.",
    "icon": "filter_list",
    "complexityScore": 0.7,
    "tags": [
      "comparison-based",
      "in-place",
      "unstable",
      "heap-structure",
      "guaranteed-performance"
    ]
  },
  {
    "id": "SRT_004",
    "name": "Bubble Sort",
    "category": "Sorting",
    "difficulty": "Beginner",
    "timeComplexity": "O(n²)",
    "description": "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they're in the wrong order.",
    "icon": "swap_vert",
    "complexityScore": 0.3,
    "tags": [
      "comparison-based",
      "stable",
      "in-place",
      "simple",
      "educational"
    ]
  },
  {
    "id": "SRT_005",
    "name": "Insertion Sort",
    "category": "Sorting",
    "difficulty": "Beginner",
    "timeComplexity": "O(n²)",
    "description": "A simple sorting algorithm that builds the final sorted array one item at a time by inserting elements into their correct position.",
    "icon": "input",
    "complexityScore": 0.25,
    "tags": [
      "comparison-based",
      "stable",
      "in-place",
      "adaptive",
      "online"
    ]
  },
  {
    "id": "SRT_006",
    "name": "Selection Sort",
    "category": "Sorting",
    "difficulty": "Beginner",
    "timeComplexity": "O(n²)",
    "description": "A simple comparison-based algorithm that repeatedly finds the minimum element from the unsorted portion and places it at the beginning.",
    "icon": "check_circle",
    "complexityScore": 0.2,
    "tags": [
      "comparison-based",
      "unstable",
      "in-place",
      "simple",
      "minimal-swaps"
    ]
  },
  {
    "id": "SRT_007",
    "name": "Counting Sort",
    "category": "Sorting",
    "difficulty": "Medium",
    "timeComplexity": "O(n + k)",
    "description": "A non-comparison based integer sorting algorithm that counts occurrences of each distinct element and uses arithmetic to determine positions.",
    "icon": "tag",
    "complexityScore": 0.5,
    "tags": [
      "non-comparison",
      "stable",
      "linear-time",
      "integer-sorting",
      "auxiliary-space"
    ]
  },
  {
    "id": "SRT_008",
    "name": "Radix Sort",
    "category": "Sorting",
    "difficulty": "Medium",
    "timeComplexity": "O(nk)",
    "description": "A non-comparison sorting algorithm that sorts integers by processing individual digits from least significant to most significant digit.",
    "icon": "numbers",
    "complexityScore": 0.55,
    "tags": [
      "non-comparison",
      "stable",
      "digit-based",
      "linear-time",
      "multi-pass"
    ]
  },
  {
    "id": "SRT_009",
    "name": "Bucket Sort",
    "category": "Sorting",
    "difficulty": "Medium",
    "timeComplexity": "O(n + k)",
    "description": "A distribution-based sorting algorithm that distributes elements into buckets, sorts each bucket individually, and concatenates the results.",
    "icon": "inventory_2",
    "complexityScore": 0.5,
    "tags": [
      "distribution-based",
      "stable",
      "uniform-distribution",
      "hybrid",
      "divide-and-conquer"
    ]
  },
  {
    "id": "SRT_010",
    "name": "Tim Sort",
    "category": "Sorting",
    "difficulty": "Advanced",
    "timeComplexity": "O(n log n)",
    "description": "A hybrid stable sorting algorithm derived from merge sort and insertion sort, designed to perform well on real-world data with natural runs.",
    "icon": "auto_awesome",
    "complexityScore": 0.85,
    "tags": [
      "hybrid",
      "stable",
      "adaptive",
      "production-grade",
      "runs-based"
    ]
  },
  {
    "id": "SRT_011",
    "name": "Shell Sort",
    "category": "Sorting",
    "difficulty": "Medium",
    "timeComplexity": "O(n log²n)",
    "description": "An in-place comparison sort that generalizes insertion sort by allowing exchanges of elements that are far apart, using a gap sequence.",
    "icon": "layers",
    "complexityScore": 0.6,
    "tags": [
      "comparison-based",
      "in-place",
      "unstable",
      "gap-sequence",
      "adaptive"
    ]
  },
  {
    "id": "SRT_012",
    "name": "Topological Sort",
    "category": "Graphs",
    "difficulty": "Medium",
    "timeComplexity": "O(V + E)",
    "description": "A linear ordering of vertices in a directed acyclic graph (DAG) where for every directed edge (u, v), vertex u comes before v in the ordering.",
    "icon": "route",
    "complexityScore": 0.65,
    "tags": [
      "graph-algorithm",
      "dag",
      "dependency-resolution",
      "dfs",
      "bfs"
    ]
  },
  {
    "id": "STK_001",
    "name": "Valid Parentheses",
    "category": "Stacks & Queues",
    "difficulty": "Beginner",
    "timeComplexity": "O(n)",
    "description": "Validates if brackets are properly matched and nested using a stack.",
    "icon": "data_object",
    "complexityScore": 0.2,
    "tags": [
      "Stack",
      "Bracket Matching",
      "String Processing",
      "Validation"
    ]
  },
  {
    "id": "STK_002",
    "name": "Min Stack",
    "category": "Stacks & Queues",
    "difficulty": "Medium",
    "timeComplexity": "O(1)",
    "description": "Stack data structure supporting O(1) retrieval of minimum element.",
    "icon": "vertical_align_bottom",
    "complexityScore": 0.35,
    "tags": [
      "Stack",
      "Design",
      "Data Structure",
      "Minimum Tracking"
    ]
  },
  {
    "id": "STK_003",
    "name": "Monotonic Stack",
    "category": "Stacks & Queues",
    "difficulty": "Medium",
    "timeComplexity": "O(n)",
    "description": "Stack maintaining elements in monotonic order for range queries.",
    "icon": "bar_chart",
    "complexityScore": 0.5,
    "tags": [
      "Stack",
      "Monotonic",
      "Next Greater Element",
      "Range Queries"
    ]
  },
  {
    "id": "STR_001",
    "name": "KMP Pattern Matching",
    "category": "String",
    "difficulty": "Advanced",
    "timeComplexity": "O(n+m)",
    "description": "The Knuth-Morris-Pratt algorithm efficiently searches for pattern occurrences in text by avoiding redundant character comparisons using a prefix table.",
    "icon": "text_snippet",
    "complexityScore": 0.75,
    "tags": [
      "string-matching",
      "pattern-search",
      "lps-array",
      "preprocessing",
      "linear-time"
    ]
  },
  {
    "id": "STR_002",
    "name": "Rabin-Karp Algorithm",
    "category": "String",
    "difficulty": "Medium",
    "timeComplexity": "O(n+m)",
    "description": "A string searching algorithm that uses hashing to find pattern matches, using rolling hash for efficient comparison.",
    "icon": "tag",
    "complexityScore": 0.6,
    "tags": [
      "hashing",
      "rolling-hash",
      "string-matching",
      "pattern-search",
      "rabin-fingerprint"
    ]
  },
  {
    "id": "STR_003",
    "name": "Manacher's Algorithm",
    "category": "String",
    "difficulty": "Advanced",
    "timeComplexity": "O(n)",
    "description": "An elegant linear-time algorithm for finding all palindromic substrings by exploiting palindrome symmetry properties.",
    "icon": "format_align_center",
    "complexityScore": 0.85,
    "tags": [
      "palindrome",
      "string-manipulation",
      "linear-time",
      "symmetry",
      "preprocessing"
    ]
  },
  {
    "id": "TRE_001",
    "name": "AVL Tree Rotation",
    "category": "Trees",
    "difficulty": "Advanced",
    "timeComplexity": "O(log n)",
    "description": "Self-balancing binary search tree that maintains height balance through rotations. Each node stores a balance factor to ensure the tree remains balanced.",
    "icon": "account_tree",
    "complexityScore": 0.75,
    "tags": [
      "self-balancing",
      "binary-search-tree",
      "rotations",
      "height-balance"
    ]
  },
  {
    "id": "TRE_002",
    "name": "Red-Black Tree",
    "category": "Trees",
    "difficulty": "Advanced",
    "timeComplexity": "O(log n)",
    "description": "Self-balancing binary search tree with color properties that ensure the tree remains approximately balanced. Guarantees O(log n) operations with less strict balancing than AVL trees.",
    "icon": "park",
    "complexityScore": 0.85,
    "tags": [
      "self-balancing",
      "binary-search-tree",
      "color-properties",
      "rotations"
    ]
  },
  {
    "id": "TRE_003",
    "name": "B-Tree Operations",
    "category": "Trees",
    "difficulty": "Advanced",
    "timeComplexity": "O(log n)",
    "description": "Self-balancing tree data structure optimized for systems that read and write large blocks of data. Commonly used in databases and file systems.",
    "icon": "storage",
    "complexityScore": 0.9,
    "tags": [
      "self-balancing",
      "database-indexing",
      "file-systems",
      "multi-way-tree"
    ]
  },
  {
    "id": "TRE_004",
    "name": "Segment Tree",
    "category": "Trees",
    "difficulty": "Advanced",
    "timeComplexity": "O(log n)",
    "description": "Tree data structure for storing intervals or segments, allowing efficient range queries and updates. Each node represents an interval and stores aggregate information.",
    "icon": "stacked_bar_chart",
    "complexityScore": 0.85,
    "tags": [
      "range-queries",
      "interval-tree",
      "lazy-propagation",
      "divide-and-conquer"
    ]
  },
  {
    "id": "TRE_005",
    "name": "Binary Indexed Tree (Fenwick)",
    "category": "Trees",
    "difficulty": "Advanced",
    "timeComplexity": "O(log n)",
    "description": "Space-efficient data structure using bit manipulation to compute prefix sums and handle updates efficiently. Also known as Fenwick Tree.",
    "icon": "analytics",
    "complexityScore": 0.8,
    "tags": [
      "prefix-sums",
      "bit-manipulation",
      "fenwick-tree",
      "cumulative-frequency"
    ]
  },
  {
    "id": "TRE_006",
    "name": "Trie Operations",
    "category": "Trie",
    "difficulty": "Medium",
    "timeComplexity": "O(m)",
    "description": "Tree-like data structure for storing strings efficiently, enabling fast prefix-based searches. Each node represents a character and paths form words.",
    "icon": "schema",
    "complexityScore": 0.6,
    "tags": [
      "prefix-tree",
      "string-storage",
      "autocomplete",
      "dictionary"
    ]
  },
  {
    "id": "TRE_007",
    "name": "Lowest Common Ancestor",
    "category": "Trees",
    "difficulty": "Medium",
    "timeComplexity": "O(log n)",
    "description": "Finding the lowest common ancestor of two nodes in a tree. Multiple approaches exist including binary lifting, Tarjan's algorithm, and simple recursion.",
    "icon": "family_restroom",
    "complexityScore": 0.65,
    "tags": [
      "tree-traversal",
      "binary-lifting",
      "recursion",
      "ancestor-queries"
    ]
  },
  {
    "id": "TRE_008",
    "name": "Tree Traversals (In/Pre/Post)",
    "category": "Trees",
    "difficulty": "Beginner",
    "timeComplexity": "O(n)",
    "description": "Three fundamental ways to visit all nodes in a binary tree: inorder (left-root-right), preorder (root-left-right), and postorder (left-right-root).",
    "icon": "swap_calls",
    "complexityScore": 0.3,
    "tags": [
      "tree-traversal",
      "recursion",
      "depth-first-search",
      "binary-tree"
    ]
  },
  {
    "id": "TRE_009",
    "name": "Morris Traversal",
    "category": "Trees",
    "difficulty": "Advanced",
    "timeComplexity": "O(n)",
    "description": "Tree traversal technique that achieves O(1) space complexity by using threaded binary trees. Temporarily modifies tree structure during traversal.",
    "icon": "moving",
    "complexityScore": 0.8,
    "tags": [
      "tree-traversal",
      "space-optimization",
      "threaded-tree",
      "constant-space"
    ]
  },
  {
    "id": "TRI_001",
    "name": "Implement Trie",
    "category": "Trie",
    "difficulty": "Medium",
    "timeComplexity": "O(m)",
    "description": "A tree-based data structure for efficient storage and retrieval of strings, supporting prefix-based operations.",
    "icon": "schema",
    "complexityScore": 0.55,
    "tags": [
      "prefix-tree",
      "string-storage",
      "autocomplete",
      "dictionary",
      "tree-structure"
    ]
  },
  {
    "id": "TRI_002",
    "name": "Word Search II",
    "category": "Trie",
    "difficulty": "Advanced",
    "timeComplexity": "O(m*n*4^l)",
    "description": "Combines Trie with DFS backtracking to efficiently find all words from a dictionary on a 2D board.",
    "icon": "find_in_page",
    "complexityScore": 0.8,
    "tags": [
      "trie",
      "backtracking",
      "dfs",
      "2d-grid",
      "word-search"
    ]
  },
  {
    "id": "TWO_001",
    "name": "Two Sum (Sorted)",
    "category": "Two Pointers",
    "difficulty": "Beginner",
    "timeComplexity": "O(n)",
    "description": "Find two numbers in a sorted array that sum to a target value using two pointers.",
    "icon": "compare_arrows",
    "complexityScore": 0.2,
    "tags": [
      "two-pointers",
      "arrays",
      "sorted",
      "sum",
      "search"
    ]
  },
  {
    "id": "TWO_002",
    "name": "Container With Most Water",
    "category": "Two Pointers",
    "difficulty": "Medium",
    "timeComplexity": "O(n)",
    "description": "Find two lines that together with the x-axis form a container holding the maximum water.",
    "icon": "water",
    "complexityScore": 0.4,
    "tags": [
      "two-pointers",
      "arrays",
      "greedy",
      "area",
      "optimization"
    ]
  },
  {
    "id": "TWO_003",
    "name": "Three Sum",
    "category": "Two Pointers",
    "difficulty": "Medium",
    "timeComplexity": "O(n²)",
    "description": "Find all unique triplets in an array that sum to zero.",
    "icon": "looks_3",
    "complexityScore": 0.5,
    "tags": [
      "two-pointers",
      "arrays",
      "sorting",
      "triplets",
      "sum"
    ]
  },
  {
    "id": "UNI_001",
    "name": "Union-Find with Path Compression",
    "category": "Union Find",
    "difficulty": "Medium",
    "timeComplexity": "O(alpha(n))",
    "description": "A disjoint-set data structure with path compression and union by rank optimizations for near-constant time operations.",
    "icon": "device_hub",
    "complexityScore": 0.55,
    "tags": [
      "disjoint-set",
      "path-compression",
      "union-by-rank",
      "graph-connectivity",
      "data-structure"
    ]
  },
  {
    "id": "UNI_002",
    "name": "Number of Connected Components",
    "category": "Union Find",
    "difficulty": "Medium",
    "timeComplexity": "O(n*alpha(n))",
    "description": "Uses Union-Find to efficiently count the number of connected components in an undirected graph.",
    "icon": "scatter_plot",
    "complexityScore": 0.5,
    "tags": [
      "graph-components",
      "union-find",
      "connectivity",
      "graph-theory",
      "disjoint-sets"
    ]
  }
] as AlgorithmSummary[];

export function getAlgorithmSummaryById(id: string): AlgorithmSummary | undefined {
  return algorithmSummaries.find((algorithm) => algorithm.id === id);
}

export function getAllCategories(): Category[] {
  const categories = new Set(algorithmSummaries.map((algorithm) => algorithm.category));
  return Array.from(categories) as Category[];
}

export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const algorithm of algorithmSummaries) {
    counts[algorithm.category] = (counts[algorithm.category] || 0) + 1;
  }
  return counts;
}
