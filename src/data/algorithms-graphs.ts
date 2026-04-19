import type { Algorithm } from '../types/algorithm';

export const graphAlgorithms: Algorithm[] = [
  {
    id: 'GRA_001',
    name: "Dijkstra's Algorithm",
    category: 'Graphs',
    difficulty: 'Advanced',
    timeComplexity: 'O(E log V)',
    spaceComplexity: 'O(V)',
    complexityScore: 0.8,
    icon: 'share',
    description: 'Finds the shortest path from a source vertex to all other vertices in a weighted graph with non-negative edge weights.',
    longDescription: "Dijkstra's algorithm is a greedy algorithm that solves the single-source shortest path problem for graphs with non-negative edge weights. It maintains a set of vertices whose shortest distance from the source is known and repeatedly selects the vertex with the minimum distance to process. Using a priority queue (min-heap) implementation, it efficiently updates the distances to neighboring vertices. The algorithm guarantees optimal solutions for graphs without negative weights and is widely used in routing protocols and navigation systems.",
    tags: ['shortest-path', 'greedy', 'priority-queue', 'weighted-graph'],
    leetcodeProblems: [
      'Network Delay Time',
      'Path with Maximum Probability',
      'Cheapest Flights Within K Stops'
    ],
    codeExamples: [
      {
        language: 'typescript',
        code: `function dijkstra(graph: number[][][], start: number): number[] {
  const n = graph.length;
  const distances = new Array(n).fill(Infinity);
  distances[start] = 0;

  const pq: [number, number][] = [[0, start]]; // [distance, node]

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [currentDist, u] = pq.shift()!;

    if (currentDist > distances[u]) continue;

    for (const [v, weight] of graph[u]) {
      const newDist = distances[u] + weight;

      if (newDist < distances[v]) {
        distances[v] = newDist;
        pq.push([newDist, v]);
      }
    }
  }

  return distances;
}

// --- Example ---
const graph: number[][][] = [
  [[1, 4], [2, 1]],        // 0 -> 1 (weight 4), 0 -> 2 (weight 1)
  [[3, 1]],                // 1 -> 3 (weight 1)
  [[1, 2], [3, 5]],        // 2 -> 1 (weight 2), 2 -> 3 (weight 5)
  []                       // 3 has no outgoing edges
];
const result = dijkstra(graph, 0);  // → [0, 3, 1, 4]
`,
        steps: [
          {
            lines: [1, 2, 3, 4],
            title: 'Initialize distances array',
            description: 'Create array to store shortest distances from start vertex to all others. Set all distances to Infinity except the start vertex which is 0.',
            variables: {
              'n': '5',
              'distances': '[0, Infinity, Infinity, Infinity, Infinity]',
              'start': '0'
            }
          },
          {
            lines: [6],
            title: 'Initialize priority queue',
            description: 'Create a priority queue to store vertices to process. Each entry contains [distance, node]. Start with the source vertex at distance 0.',
            variables: {
              'pq': '[[0, 0]]'
            }
          },
          {
            lines: [8, 9, 10, 11],
            title: 'Extract minimum distance vertex',
            description: 'Sort the priority queue by distance and extract the vertex with minimum distance. Skip if we already found a better path to this vertex.',
            variables: {
              'currentDist': '0',
              'u': '0',
              'pq': '[]'
            }
          },
          {
            lines: [13, 14],
            title: 'Iterate through neighbors',
            description: 'For each neighbor of the current vertex, calculate the new distance by adding the edge weight to the current vertex distance.',
            variables: {
              'v': '1',
              'weight': '4',
              'newDist': '4'
            }
          },
          {
            lines: [16, 17, 18],
            title: 'Relax edge if shorter path found',
            description: 'If the new distance is shorter than the previously known distance, update it and add the neighbor to the priority queue for processing.',
            variables: {
              'distances[v]': '4',
              'pq': '[[4, 1]]'
            }
          },
          {
            lines: [23],
            title: 'Return shortest distances',
            description: 'After processing all reachable vertices, return the distances array containing shortest paths from start to all vertices.',
            variables: {
              'distances': '[0, 4, 7, 9, 11]'
            }
          }
        ]
      },
      {
        language: 'python',
        code: `import heapq
from typing import List, Tuple

def dijkstra(graph: List[List[Tuple[int, int]]], start: int) -> List[int]:
    n = len(graph)
    distances = [float('inf')] * n
    distances[start] = 0

    pq = [(0, start)]  # (distance, node)

    while pq:
        current_dist, u = heapq.heappop(pq)

        if current_dist > distances[u]:
            continue

        for v, weight in graph[u]:
            new_dist = distances[u] + weight

            if new_dist < distances[v]:
                distances[v] = new_dist
                heapq.heappush(pq, (new_dist, v))

    return distances

# --- Example ---
graph = [
    [(1, 4), (2, 1)],      # 0 -> 1 (weight 4), 0 -> 2 (weight 1)
    [(3, 1)],              # 1 -> 3 (weight 1)
    [(1, 2), (3, 5)],      # 2 -> 1 (weight 2), 2 -> 3 (weight 5)
    []                     # 3 has no outgoing edges
]
result = dijkstra(graph, 0)  # -> [0, 3, 1, 4]
`,
        steps: [
          {
            lines: [5, 6, 7],
            title: 'Initialize distances array',
            description: 'Create array to store shortest distances from start vertex to all others. Set all distances to infinity except the start vertex which is 0.',
            variables: {
              'n': '5',
              'distances': '[0, inf, inf, inf, inf]',
              'start': '0'
            }
          },
          {
            lines: [9],
            title: 'Initialize priority queue',
            description: 'Create a min-heap priority queue with the start vertex at distance 0. Python\'s heapq automatically maintains min-heap property.',
            variables: {
              'pq': '[(0, 0)]'
            }
          },
          {
            lines: [11, 12],
            title: 'Extract minimum distance vertex',
            description: 'Pop the vertex with minimum distance from the priority queue using heappop.',
            variables: {
              'current_dist': '0',
              'u': '0'
            }
          },
          {
            lines: [14, 15],
            title: 'Skip if better path already found',
            description: 'If we already found a better path to this vertex (current_dist > distances[u]), skip processing to avoid unnecessary work.',
            variables: {
              'current_dist': '5',
              'distances[u]': '3'
            }
          },
          {
            lines: [17, 18],
            title: 'Calculate new distance to neighbors',
            description: 'For each neighbor of the current vertex, calculate the new distance by adding the edge weight to the current vertex distance.',
            variables: {
              'v': '1',
              'weight': '4',
              'new_dist': '4'
            }
          },
          {
            lines: [20, 21, 22],
            title: 'Relax edge if shorter path found',
            description: 'If the new distance is shorter than the previously known distance, update it and add the neighbor to the priority queue for processing.',
            variables: {
              'distances[v]': '4',
              'pq': '[(4, 1), (7, 2)]'
            }
          },
          {
            lines: [24],
            title: 'Return shortest distances',
            description: 'After processing all reachable vertices, return the distances array containing shortest paths from start to all vertices.',
            variables: {
              'distances': '[0, 4, 7, 9, 11]'
            }
          }
        ]
      }
    ],
    keyInsights: [
      'Works only with non-negative edge weights',
      'Greedy approach: always processes the closest unvisited vertex',
      'Priority queue implementation provides O(E log V) complexity',
      'Cannot handle graphs with negative weight cycles'
    ],
    whenToUse: [
      'Finding shortest paths in road networks or GPS navigation',
      'Network routing protocols (OSPF)',
      'When graph has non-negative edge weights'
    ]
  },
  {
    id: 'GRA_002',
    name: 'Bellman-Ford Algorithm',
    category: 'Graphs',
    difficulty: 'Advanced',
    timeComplexity: 'O(VE)',
    spaceComplexity: 'O(V)',
    complexityScore: 0.75,
    icon: 'sync_alt',
    description: 'Computes shortest paths from a single source to all vertices in a weighted graph, handling negative edge weights and detecting negative cycles.',
    longDescription: 'The Bellman-Ford algorithm solves the single-source shortest path problem for graphs that may contain negative edge weights. Unlike Dijkstra\'s algorithm, it can detect negative weight cycles and report their existence. The algorithm works by iteratively relaxing all edges V-1 times, where V is the number of vertices. After V-1 iterations, all shortest paths are guaranteed to be found unless a negative cycle exists. It\'s less efficient than Dijkstra\'s but more versatile in handling different graph types.',
    tags: ['shortest-path', 'dynamic-programming', 'negative-weights', 'cycle-detection'],
    leetcodeProblems: [
      'Network Delay Time',
      'Cheapest Flights Within K Stops',
      'Find the City With the Smallest Number of Neighbors at a Threshold Distance'
    ],
    codeExamples: [
      {
        language: 'typescript',
        code: `function bellmanFord(edges: number[][], n: number, start: number): number[] | null {
  const distances = new Array(n).fill(Infinity);
  distances[start] = 0;

  // Relax all edges V-1 times
  for (let i = 0; i < n - 1; i++) {
    for (const [u, v, weight] of edges) {
      if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
        distances[v] = distances[u] + weight;
      }
    }
  }

  // Check for negative weight cycles
  for (const [u, v, weight] of edges) {
    if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
      return null; // Negative cycle detected
    }
  }

  return distances;
}

// --- Example ---
const edges: number[][] = [
  [0, 1, 4],   // 0 -> 1, weight 4
  [0, 2, 2],   // 0 -> 2, weight 2
  [1, 2, -3],  // 1 -> 2, weight -3 (negative edge)
  [2, 3, 2],   // 2 -> 3, weight 2
  [1, 3, 5]    // 1 -> 3, weight 5
];
const result = bellmanFord(edges, 4, 0);  // → [0, 4, 1, 3]
`,
        steps: [
          {
            lines: [1, 2, 3],
            title: 'Initialize distances array',
            description: 'Set all distances to Infinity except the start vertex which is 0. This represents unknown distances initially.',
            variables: {
              'n': '4',
              'distances': '[0, Infinity, Infinity, Infinity]',
              'start': '0'
            }
          },
          {
            lines: [5, 6],
            title: 'Begin edge relaxation loop',
            description: 'Relax all edges exactly V-1 times. This guarantees finding shortest paths if no negative cycles exist.',
            variables: {
              'i': '0',
              'n - 1': '3'
            }
          },
          {
            lines: [7, 8, 9],
            title: 'Relax each edge',
            description: 'For each edge (u, v) with weight w, if distance[u] + w < distance[v], update distance[v]. This improves path estimates.',
            variables: {
              'u': '0',
              'v': '1',
              'weight': '5',
              'distances[v]': '5'
            }
          },
          {
            lines: [14, 15, 16],
            title: 'Check for negative cycles',
            description: 'After V-1 relaxations, try relaxing edges once more. If any distance can still improve, a negative cycle exists.',
            variables: {
              'u': '2',
              'v': '3',
              'weight': '-10'
            }
          },
          {
            lines: [17],
            title: 'Negative cycle detected',
            description: 'If edge relaxation succeeds in round V, return null to indicate a negative weight cycle was detected.',
            variables: {
              'return': 'null'
            }
          },
          {
            lines: [20],
            title: 'Return shortest distances',
            description: 'No negative cycle found. Return the distances array containing shortest paths from start to all vertices.',
            variables: {
              'distances': '[0, 5, 3, 7]'
            }
          }
        ]
      },
      {
        language: 'python',
        code: `from typing import List, Optional, Tuple

def bellman_ford(edges: List[Tuple[int, int, int]], n: int, start: int) -> Optional[List[float]]:
    distances = [float('inf')] * n
    distances[start] = 0

    # Relax all edges V-1 times
    for _ in range(n - 1):
        for u, v, weight in edges:
            if distances[u] != float('inf') and distances[u] + weight < distances[v]:
                distances[v] = distances[u] + weight

    # Check for negative weight cycles
    for u, v, weight in edges:
        if distances[u] != float('inf') and distances[u] + weight < distances[v]:
            return None  # Negative cycle detected

    return distances

# --- Example ---
edges = [
    (0, 1, 4),   # 0 -> 1, weight 4
    (0, 2, 2),   # 0 -> 2, weight 2
    (1, 2, -3),  # 1 -> 2, weight -3 (negative edge)
    (2, 3, 2),   # 2 -> 3, weight 2
    (1, 3, 5)    # 1 -> 3, weight 5
]
result = bellman_ford(edges, 4, 0)  # -> [0, 4, 1, 3]
`,
        steps: [
          {
            lines: [4, 5],
            title: 'Initialize distances array',
            description: 'Set all distances to infinity except the start vertex which is 0. This represents unknown distances initially.',
            variables: {
              'n': '4',
              'distances': '[0, inf, inf, inf]',
              'start': '0'
            }
          },
          {
            lines: [8],
            title: 'Begin edge relaxation loop',
            description: 'Relax all edges exactly V-1 times. This guarantees finding shortest paths if no negative cycles exist.',
            variables: {
              'n - 1': '3',
              'iteration': '0'
            }
          },
          {
            lines: [9, 10, 11],
            title: 'Relax each edge',
            description: 'For each edge (u, v) with weight w, if distance[u] + w < distance[v], update distance[v]. This improves path estimates by considering all edges.',
            variables: {
              'u': '0',
              'v': '1',
              'weight': '5',
              'distances[v]': '5'
            }
          },
          {
            lines: [14, 15, 16],
            title: 'Check for negative cycles',
            description: 'After V-1 relaxations, try relaxing edges once more. If any distance can still improve, a negative weight cycle exists in the graph.',
            variables: {
              'u': '2',
              'v': '3',
              'weight': '-10',
              'cycle_detected': 'true'
            }
          },
          {
            lines: [16],
            title: 'Return None for negative cycle',
            description: 'If edge relaxation succeeds in round V, return None to indicate a negative weight cycle was detected.',
            variables: {
              'return': 'None'
            }
          },
          {
            lines: [18],
            title: 'Return shortest distances',
            description: 'No negative cycle found. Return the distances array containing shortest paths from start to all vertices.',
            variables: {
              'distances': '[0, 5, 3, 7]'
            }
          }
        ]
      }
    ],
    keyInsights: [
      'Can handle negative edge weights unlike Dijkstra\'s algorithm',
      'Detects negative weight cycles in the graph',
      'Relaxes all edges V-1 times to guarantee shortest paths',
      'Slower than Dijkstra\'s but more versatile'
    ],
    whenToUse: [
      'Graphs with negative edge weights',
      'Need to detect negative cycles',
      'Currency arbitrage detection in financial systems'
    ]
  },
  {
    id: 'GRA_003',
    name: 'Floyd-Warshall Algorithm',
    category: 'Graphs',
    difficulty: 'Advanced',
    timeComplexity: 'O(V³)',
    spaceComplexity: 'O(V²)',
    complexityScore: 0.85,
    icon: 'hub',
    description: 'Finds shortest paths between all pairs of vertices in a weighted graph using dynamic programming.',
    longDescription: 'The Floyd-Warshall algorithm is a dynamic programming approach that computes shortest paths between all pairs of vertices in a weighted graph. It works by considering all vertices as intermediate points and gradually improving path estimates. The algorithm uses a 3D DP approach conceptually but can be optimized to use 2D space. It can handle negative edge weights (but not negative cycles) and is particularly useful when you need the complete distance matrix. The algorithm\'s simplicity and ability to detect negative cycles make it valuable despite its cubic time complexity.',
    tags: ['all-pairs-shortest-path', 'dynamic-programming', 'matrix', 'transitive-closure'],
    leetcodeProblems: [
      'Find the City With the Smallest Number of Neighbors at a Threshold Distance',
      'Network Delay Time',
      'Minimum Cost to Reach Destination in Time'
    ],
    codeExamples: [
      {
        language: 'typescript',
        code: `function floydWarshall(graph: number[][]): number[][] {
  const n = graph.length;
  const dist = graph.map(row => [...row]);

  // Initialize distances
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) dist[i][j] = 0;
      else if (dist[i][j] === 0) dist[i][j] = Infinity;
    }
  }

  // Floyd-Warshall main loop
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
          dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
        }
      }
    }
  }

  return dist;
}

// --- Example ---
const graphMatrix: number[][] = [
  [0, 3, Infinity, 7],
  [8, 0, 2, Infinity],
  [5, Infinity, 0, 1],
  [2, Infinity, Infinity, 0]
];
const result = floydWarshall(graphMatrix);  // → all-pairs shortest paths matrix
// result[0][3] → 4 (shortest path from 0 to 3)
`,
        steps: [
          {
            lines: [1, 2, 3],
            title: 'Create distance matrix copy',
            description: 'Initialize the distance matrix by copying the input graph. This matrix will be updated in-place.',
            variables: {
              'n': '4',
              'dist': '[[0, 3, ∞, 7], [8, 0, 2, ∞], ...]'
            }
          },
          {
            lines: [5, 6, 7, 8, 9],
            title: 'Initialize diagonal and missing edges',
            description: 'Set diagonal elements to 0 (distance from vertex to itself). Convert 0 weights (except diagonal) to Infinity to represent no edge.',
            variables: {
              'i': '0',
              'j': '0',
              'dist[0][0]': '0'
            }
          },
          {
            lines: [13, 14],
            title: 'Iterate through intermediate vertices',
            description: 'The outer loop tries each vertex k as an intermediate point. For each k, check if going through k shortens any path from i to j.',
            variables: {
              'k': '0',
              'n': '4'
            }
          },
          {
            lines: [15, 16],
            title: 'Check all vertex pairs',
            description: 'For the current intermediate vertex k, examine all pairs of vertices (i, j) to see if path i→k→j is shorter than direct path i→j.',
            variables: {
              'i': '1',
              'j': '3',
              'k': '0'
            }
          },
          {
            lines: [17, 18],
            title: 'Update shortest path',
            description: 'If both dist[i][k] and dist[k][j] exist (not Infinity), compare i→j with i→k→j and keep the minimum.',
            variables: {
              'dist[i][j]': '15',
              'dist[i][k] + dist[k][j]': '12',
              'updated dist[i][j]': '12'
            }
          },
          {
            lines: [23],
            title: 'Return all-pairs shortest paths',
            description: 'Return the final distance matrix containing shortest paths between all pairs of vertices.',
            variables: {
              'dist': '[[0, 3, 5, 7], [8, 0, 2, 15], ...]'
            }
          }
        ]
      },
      {
        language: 'python',
        code: `from typing import List

def floyd_warshall(graph: List[List[int]]) -> List[List[float]]:
    n = len(graph)
    dist = [row[:] for row in graph]

    # Initialize distances
    for i in range(n):
        for j in range(n):
            if i == j:
                dist[i][j] = 0
            elif dist[i][j] == 0:
                dist[i][j] = float('inf')

    # Floyd-Warshall main loop
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] != float('inf') and dist[k][j] != float('inf'):
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])

    return dist

# --- Example ---
graph_matrix = [
    [0, 3, float('inf'), 7],
    [8, 0, 2, float('inf')],
    [5, float('inf'), 0, 1],
    [2, float('inf'), float('inf'), 0]
]
result = floyd_warshall(graph_matrix)  # -> all-pairs shortest paths matrix
# result[0][3] -> 4 (shortest path from 0 to 3)
`,
        steps: [
          {
            lines: [4, 5],
            title: 'Create distance matrix copy',
            description: 'Initialize the distance matrix by creating a deep copy of the input graph. This matrix will be updated in-place with shortest paths.',
            variables: {
              'n': '4',
              'dist': '[[0, 3, inf, 7], [8, 0, 2, inf], ...]'
            }
          },
          {
            lines: [8, 9, 10, 11, 12, 13],
            title: 'Initialize diagonal and missing edges',
            description: 'Set diagonal elements to 0 (distance from vertex to itself). Convert 0 weights (except diagonal) to infinity to represent no edge.',
            variables: {
              'i': '0',
              'j': '0',
              'dist[0][0]': '0'
            }
          },
          {
            lines: [16],
            title: 'Iterate through intermediate vertices',
            description: 'The outer loop tries each vertex k as an intermediate point. For each k, check if going through k shortens any path from i to j.',
            variables: {
              'k': '0',
              'n': '4'
            }
          },
          {
            lines: [17, 18],
            title: 'Check all vertex pairs',
            description: 'For the current intermediate vertex k, examine all pairs of vertices (i, j) to see if path i→k→j is shorter than direct path i→j.',
            variables: {
              'i': '1',
              'j': '3',
              'k': '0'
            }
          },
          {
            lines: [19, 20],
            title: 'Update shortest path',
            description: 'If both dist[i][k] and dist[k][j] exist (not infinity), compare i→j with i→k→j and keep the minimum distance.',
            variables: {
              'dist[i][j]': 'inf',
              'dist[i][k] + dist[k][j]': '12',
              'updated dist[i][j]': '12'
            }
          },
          {
            lines: [22],
            title: 'Return all-pairs shortest paths',
            description: 'Return the final distance matrix containing shortest paths between all pairs of vertices after considering all intermediate vertices.',
            variables: {
              'dist': '[[0, 3, 5, 7], [8, 0, 2, 10], ...]'
            }
          }
        ]
      }
    ],
    keyInsights: [
      'Computes shortest paths between all pairs of vertices',
      'Uses dynamic programming with intermediate vertices',
      'Can detect negative cycles by checking diagonal elements',
      'Space-efficient implementation possible with in-place updates'
    ],
    whenToUse: [
      'Need shortest paths between all pairs of vertices',
      'Dense graphs where all-pairs solution is required',
      'Computing transitive closure of a graph'
    ]
  },
  {
    id: 'GRA_004',
    name: "Kruskal's Algorithm",
    category: 'Graphs',
    difficulty: 'Medium',
    timeComplexity: 'O(E log E)',
    spaceComplexity: 'O(V)',
    complexityScore: 0.65,
    icon: 'device_hub',
    description: 'Finds the minimum spanning tree of a weighted undirected graph by sorting edges and using union-find.',
    longDescription: "Kruskal's algorithm is a greedy approach to finding the minimum spanning tree (MST) of a connected, weighted, undirected graph. It works by sorting all edges by weight and iteratively adding the smallest edge that doesn't create a cycle. The algorithm uses the Union-Find (Disjoint Set Union) data structure to efficiently detect cycles. This edge-based approach makes it particularly efficient for sparse graphs. The resulting MST connects all vertices with the minimum total edge weight, which is useful in network design and clustering applications.",
    tags: ['minimum-spanning-tree', 'greedy', 'union-find', 'sorting'],
    leetcodeProblems: [
      'Min Cost to Connect All Points',
      'Connecting Cities With Minimum Cost',
      'Find Critical and Pseudo-Critical Edges in MST'
    ],
    codeExamples: [
      {
        language: 'typescript',
        code: `class UnionFind {
  parent: number[];
  rank: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    return true;
  }
}

function kruskal(n: number, edges: number[][]): number {
  edges.sort((a, b) => a[2] - b[2]);
  const uf = new UnionFind(n);
  let mstWeight = 0;

  for (const [u, v, weight] of edges) {
    if (uf.union(u, v)) {
      mstWeight += weight;
    }
  }

  return mstWeight;
}

// --- Example ---
const n = 4;
const edgeList: number[][] = [
  [0, 1, 10],  // edge 0-1 with weight 10
  [0, 2, 6],   // edge 0-2 with weight 6
  [0, 3, 5],   // edge 0-3 with weight 5
  [1, 3, 15],  // edge 1-3 with weight 15
  [2, 3, 4]    // edge 2-3 with weight 4
];
const mstWeight = kruskal(n, edgeList);  // → 19 (edges: 2-3, 0-3, 0-2)
`,
        steps: [
          {
            lines: [5, 6, 7],
            title: 'Initialize Union-Find structure',
            description: 'Create parent array where each vertex is its own parent initially, and rank array for union by rank optimization.',
            variables: {
              'n': '5',
              'parent': '[0, 1, 2, 3, 4]',
              'rank': '[0, 0, 0, 0, 0]'
            }
          },
          {
            lines: [35, 36],
            title: 'Sort edges by weight',
            description: 'Sort all edges in ascending order by weight. This greedy approach ensures we consider smallest edges first for MST.',
            variables: {
              'edges': '[[0,1,1], [1,2,3], [0,2,4], [2,3,5]]'
            }
          },
          {
            lines: [37, 38],
            title: 'Initialize MST weight tracker',
            description: 'Create Union-Find structure for cycle detection and initialize MST weight accumulator to 0.',
            variables: {
              'mstWeight': '0'
            }
          },
          {
            lines: [40, 41],
            title: 'Process edge if no cycle formed',
            description: 'For each edge in sorted order, attempt to union its endpoints. If successful (no cycle), add edge weight to MST.',
            variables: {
              'u': '0',
              'v': '1',
              'weight': '1',
              'union success': 'true'
            }
          },
          {
            lines: [10, 11, 12, 13, 14],
            title: 'Find root with path compression',
            description: 'Find operation locates the root of a vertex set. Path compression flattens the tree structure for faster future queries.',
            variables: {
              'x': '2',
              'parent[2]': '1',
              'root': '0'
            }
          },
          {
            lines: [18, 19, 20, 21],
            title: 'Union by rank',
            description: 'Union connects two sets. If roots differ, attach smaller rank tree under larger rank tree to maintain balance.',
            variables: {
              'rootX': '0',
              'rootY': '2',
              'cycle detected': 'false'
            }
          },
          {
            lines: [42],
            title: 'Add edge to MST',
            description: 'After union succeeds, add this edge weight to total MST weight. Continue until all edges processed or n-1 edges added.',
            variables: {
              'mstWeight': '9'
            }
          },
          {
            lines: [46],
            title: 'Return MST weight',
            description: 'Return the total weight of the minimum spanning tree after processing all edges.',
            variables: {
              'mstWeight': '9'
            }
          }
        ]
      },
      {
        language: 'python',
        code: `from typing import List

class UnionFind:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x: int, y: int) -> bool:
        root_x, root_y = self.find(x), self.find(y)

        if root_x == root_y:
            return False

        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        return True

def kruskal(n: int, edges: List[List[int]]) -> int:
    edges.sort(key=lambda x: x[2])
    uf = UnionFind(n)
    mst_weight = 0

    for u, v, weight in edges:
        if uf.union(u, v):
            mst_weight += weight

    return mst_weight

# --- Example ---
n = 4
edge_list = [
    [0, 1, 10],  # edge 0-1 with weight 10
    [0, 2, 6],   # edge 0-2 with weight 6
    [0, 3, 5],   # edge 0-3 with weight 5
    [1, 3, 15],  # edge 1-3 with weight 15
    [2, 3, 4]    # edge 2-3 with weight 4
]
mst_weight = kruskal(n, edge_list)  # -> 19 (edges: 2-3, 0-3, 0-2)
`,
        steps: [
          {
            lines: [4, 5, 6],
            title: 'Initialize Union-Find structure',
            description: 'Create parent list where each vertex is its own parent initially, and rank list for union by rank optimization.',
            variables: {
              'n': '5',
              'parent': '[0, 1, 2, 3, 4]',
              'rank': '[0, 0, 0, 0, 0]'
            }
          },
          {
            lines: [8, 9, 10, 11],
            title: 'Find root with path compression',
            description: 'Find operation locates the root of a vertex set. Path compression flattens the tree structure by making each vertex point directly to root.',
            variables: {
              'x': '2',
              'parent[2]': '1',
              'root': '0'
            }
          },
          {
            lines: [13, 14, 15, 16, 17],
            title: 'Check if vertices in same set',
            description: 'Union finds roots of both vertices. If roots are the same, vertices are already connected - adding edge would create a cycle.',
            variables: {
              'root_x': '0',
              'root_y': '2',
              'same_set': 'false'
            }
          },
          {
            lines: [18, 19, 20, 21, 22, 23, 24, 25],
            title: 'Union by rank to merge sets',
            description: 'Attach smaller rank tree under larger rank tree to maintain balance. If ranks equal, increment rank of new root for optimization.',
            variables: {
              'rank[root_x]': '1',
              'rank[root_y]': '1',
              'parent[root_y]': 'root_x'
            }
          },
          {
            lines: [28, 29],
            title: 'Sort edges by weight',
            description: 'Sort all edges in ascending order by weight. Greedy approach: consider lightest edges first to minimize total MST weight.',
            variables: {
              'edges': '[[0,1,1], [1,2,3], [0,2,4]]'
            }
          },
          {
            lines: [30, 31],
            title: 'Initialize MST weight tracker',
            description: 'Create Union-Find structure for cycle detection and initialize MST weight accumulator to 0.',
            variables: {
              'mst_weight': '0'
            }
          },
          {
            lines: [33, 34, 35],
            title: 'Add edge to MST if no cycle',
            description: 'For each edge in sorted order, attempt to union its endpoints. If successful (no cycle), add edge weight to MST total.',
            variables: {
              'u': '0',
              'v': '1',
              'weight': '1',
              'mst_weight': '1'
            }
          },
          {
            lines: [37],
            title: 'Return total MST weight',
            description: 'Return the total weight of the minimum spanning tree after processing all edges. MST has exactly n-1 edges.',
            variables: {
              'mst_weight': '9'
            }
          }
        ]
      }
    ],
    keyInsights: [
      'Edge-based greedy algorithm for MST',
      'Requires sorting edges by weight',
      'Uses Union-Find to detect cycles efficiently',
      'More efficient than Prim\'s for sparse graphs'
    ],
    whenToUse: [
      'Finding minimum spanning tree in sparse graphs',
      'Network design with minimum cost connections',
      'Clustering and image segmentation'
    ]
  },
  {
    id: 'GRA_005',
    name: "Prim's Algorithm",
    category: 'Graphs',
    difficulty: 'Medium',
    timeComplexity: 'O(E log V)',
    spaceComplexity: 'O(V)',
    complexityScore: 0.65,
    icon: 'lan',
    description: 'Builds a minimum spanning tree by growing it from a starting vertex using a priority queue.',
    longDescription: "Prim's algorithm is a greedy approach that constructs a minimum spanning tree by starting from an arbitrary vertex and repeatedly adding the smallest edge that connects a vertex in the tree to a vertex outside it. Using a priority queue (min-heap) to track the minimum weight edges, the algorithm efficiently grows the MST one vertex at a time. Unlike Kruskal's edge-based approach, Prim's is vertex-based, making it more efficient for dense graphs. The algorithm guarantees finding the MST for connected, weighted, undirected graphs.",
    tags: ['minimum-spanning-tree', 'greedy', 'priority-queue', 'dense-graphs'],
    leetcodeProblems: [
      'Min Cost to Connect All Points',
      'Connecting Cities With Minimum Cost',
      'Optimize Water Distribution in a Village'
    ],
    codeExamples: [
      {
        language: 'typescript',
        code: `function prim(n: number, graph: number[][][]): number {
  const visited = new Array(n).fill(false);
  const pq: [number, number][] = [[0, 0]]; // [weight, vertex]
  let mstWeight = 0;

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [weight, u] = pq.shift()!;

    if (visited[u]) continue;

    visited[u] = true;
    mstWeight += weight;

    for (const [v, edgeWeight] of graph[u]) {
      if (!visited[v]) {
        pq.push([edgeWeight, v]);
      }
    }
  }

  return mstWeight;
}

// --- Example ---
const primGraph: number[][][] = [
  [[1, 10], [2, 6], [3, 5]],   // 0 connects to 1(10), 2(6), 3(5)
  [[0, 10], [3, 15]],          // 1 connects to 0(10), 3(15)
  [[0, 6], [3, 4]],            // 2 connects to 0(6), 3(4)
  [[0, 5], [1, 15], [2, 4]]    // 3 connects to 0(5), 1(15), 2(4)
];
const primMst = prim(4, primGraph);  // → 15 (edges: 0-3, 2-3, 0-2)
`,
        steps: [
          {
            lines: [1, 2, 3, 4],
            title: 'Initialize MST structures',
            description: 'Create visited array to track vertices in MST, priority queue starting with vertex 0 at weight 0, and MST weight accumulator.',
            variables: {
              'visited': '[false, false, false, false]',
              'pq': '[[0, 0]]',
              'mstWeight': '0'
            }
          },
          {
            lines: [6, 7, 8],
            title: 'Extract minimum weight edge',
            description: 'Sort priority queue by edge weight and extract the edge with minimum weight connecting to an unvisited vertex.',
            variables: {
              'weight': '0',
              'u': '0'
            }
          },
          {
            lines: [10],
            title: 'Skip if vertex already in MST',
            description: 'If the extracted vertex is already visited (already in MST), skip it and continue to next iteration.',
            variables: {
              'visited[u]': 'false',
              'continue': 'false'
            }
          },
          {
            lines: [12, 13],
            title: 'Add vertex to MST',
            description: 'Mark the vertex as visited (add to MST) and add the edge weight to the total MST weight.',
            variables: {
              'visited[0]': 'true',
              'mstWeight': '0'
            }
          },
          {
            lines: [15, 16, 17],
            title: 'Add edges to unvisited neighbors',
            description: 'For each neighbor of the newly added vertex, if not already in MST, add the edge to priority queue for consideration.',
            variables: {
              'v': '1',
              'edgeWeight': '2',
              'pq': '[[2, 1], [5, 2]]'
            }
          },
          {
            lines: [21],
            title: 'Return total MST weight',
            description: 'After all vertices are added to MST, return the total weight of edges in the minimum spanning tree.',
            variables: {
              'mstWeight': '11',
              'visited': '[true, true, true, true]'
            }
          }
        ]
      },
      {
        language: 'python',
        code: `import heapq
from typing import List, Tuple

def prim(n: int, graph: List[List[Tuple[int, int]]]) -> int:
    visited = [False] * n
    pq = [(0, 0)]  # (weight, vertex)
    mst_weight = 0

    while pq:
        weight, u = heapq.heappop(pq)

        if visited[u]:
            continue

        visited[u] = True
        mst_weight += weight

        for v, edge_weight in graph[u]:
            if not visited[v]:
                heapq.heappush(pq, (edge_weight, v))

    return mst_weight

# --- Example ---
prim_graph = [
    [(1, 10), (2, 6), (3, 5)],   # 0 connects to 1(10), 2(6), 3(5)
    [(0, 10), (3, 15)],          # 1 connects to 0(10), 3(15)
    [(0, 6), (3, 4)],            # 2 connects to 0(6), 3(4)
    [(0, 5), (1, 15), (2, 4)]    # 3 connects to 0(5), 1(15), 2(4)
]
prim_mst = prim(4, prim_graph)  # -> 15 (edges: 0-3, 2-3, 0-2)
`,
        steps: [
          {
            lines: [5, 6, 7],
            title: 'Initialize MST structures',
            description: 'Create visited array to track vertices in MST, priority queue starting with vertex 0 at weight 0, and MST weight accumulator.',
            variables: {
              'visited': '[False, False, False, False]',
              'pq': '[(0, 0)]',
              'mst_weight': '0'
            }
          },
          {
            lines: [10],
            title: 'Extract minimum weight edge',
            description: 'Pop the edge with minimum weight from the priority queue. Python\'s heapq automatically maintains min-heap property.',
            variables: {
              'weight': '0',
              'u': '0'
            }
          },
          {
            lines: [12, 13],
            title: 'Skip if vertex already in MST',
            description: 'If the extracted vertex is already visited (already in MST), skip it and continue to next iteration to avoid processing twice.',
            variables: {
              'visited[u]': 'False',
              'continue': 'false'
            }
          },
          {
            lines: [15, 16],
            title: 'Add vertex to MST',
            description: 'Mark the vertex as visited (add to MST) and add the edge weight to the total MST weight.',
            variables: {
              'visited[0]': 'True',
              'mst_weight': '0'
            }
          },
          {
            lines: [18, 19, 20],
            title: 'Add edges to unvisited neighbors',
            description: 'For each neighbor of the newly added vertex, if not already in MST, add the edge to priority queue for consideration.',
            variables: {
              'v': '1',
              'edge_weight': '2',
              'pq': '[(2, 1), (5, 2)]'
            }
          },
          {
            lines: [22],
            title: 'Return total MST weight',
            description: 'After all vertices are added to MST, return the total weight of edges in the minimum spanning tree.',
            variables: {
              'mst_weight': '11',
              'visited': '[True, True, True, True]'
            }
          }
        ]
      }
    ],
    keyInsights: [
      'Vertex-based greedy algorithm for MST',
      'Grows tree from a single starting vertex',
      'Priority queue stores edges to unvisited vertices',
      'More efficient than Kruskal\'s for dense graphs'
    ],
    whenToUse: [
      'Finding minimum spanning tree in dense graphs',
      'When graph is represented as adjacency list',
      'Real-time network design where edges are discovered incrementally'
    ]
  },
  {
    id: 'GRA_006',
    name: 'A* Search Algorithm',
    category: 'Graphs',
    difficulty: 'Advanced',
    timeComplexity: 'O(E)',
    spaceComplexity: 'O(V)',
    complexityScore: 0.85,
    icon: 'star',
    description: 'Finds the shortest path using heuristics to guide the search, combining actual cost and estimated cost to goal.',
    longDescription: 'A* (A-star) is an informed search algorithm that finds the shortest path between nodes by using a heuristic function to estimate the cost from any node to the goal. It combines the actual cost from the start (g-score) with the estimated cost to the goal (h-score) to prioritize which nodes to explore. The algorithm is optimal and complete when using an admissible heuristic (one that never overestimates). A* is widely used in pathfinding and graph traversal, particularly in game development, robotics, and GPS navigation where the goal location is known.',
    tags: ['shortest-path', 'heuristic', 'informed-search', 'pathfinding'],
    leetcodeProblems: [
      'Shortest Path in Binary Matrix',
      'Minimum Cost to Make at Least One Valid Path in a Grid',
      'Shortest Path to Get All Keys'
    ],
    codeExamples: [
      {
        language: 'typescript',
        code: `function aStar(grid: number[][], start: [number, number], goal: [number, number]): number {
  const rows = grid.length;
  const cols = grid[0].length;

  const heuristic = (x: number, y: number): number => {
    return Math.abs(x - goal[0]) + Math.abs(y - goal[1]);
  };

  const pq: [number, number, number, number][] = [[0 + heuristic(start[0], start[1]), 0, start[0], start[1]]];
  const visited = new Set<string>();
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [_, cost, x, y] = pq.shift()!;

    if (x === goal[0] && y === goal[1]) return cost;

    const key = \`\${x},\${y}\`;
    if (visited.has(key)) continue;
    visited.add(key);

    for (const [dx, dy] of directions) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && grid[nx][ny] !== 1) {
        const newCost = cost + 1;
        const fScore = newCost + heuristic(nx, ny);
        pq.push([fScore, newCost, nx, ny]);
      }
    }
  }

  return -1;
}

// --- Example ---
const aStarGrid: number[][] = [
  [0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0],
  [0, 0, 0, 0, 0]
];
const pathLength = aStar(aStarGrid, [0, 0], [4, 4]);  // → 8
`,
        steps: [
          {
            lines: [5, 6],
            title: 'Define heuristic function',
            description: 'Create Manhattan distance heuristic function h(n) that estimates distance from any position to goal. Must be admissible (never overestimate).',
            variables: {
              'goal': '[4, 4]',
              'h(2,2)': '4'
            }
          },
          {
            lines: [9, 10, 11],
            title: 'Initialize search structures',
            description: 'Create priority queue with start position. Each entry is [f-score, g-score, x, y] where f = g + h. Initialize visited set and directions.',
            variables: {
              'pq': '[[6, 0, 0, 0]]',
              'start': '[0, 0]',
              'h(start)': '6'
            }
          },
          {
            lines: [13, 14],
            title: 'Extract position with lowest f-score',
            description: 'Sort by f-score (total estimated cost) and extract position with minimum value. This is the greedy choice guided by heuristic.',
            variables: {
              'f-score': '6',
              'cost (g)': '0',
              'x, y': '0, 0'
            }
          },
          {
            lines: [16],
            title: 'Check if goal reached',
            description: 'If current position equals goal, we found the shortest path. Return the actual cost (g-score) to reach goal.',
            variables: {
              'current': '[2, 3]',
              'goal': '[4, 4]',
              'reached': 'false'
            }
          },
          {
            lines: [18, 19, 20],
            title: 'Mark position as visited',
            description: 'Convert position to string key and check if already visited. If not, add to visited set to avoid reprocessing.',
            variables: {
              'key': '"2,3"',
              'visited': '{"0,0", "1,0", "2,3"}'
            }
          },
          {
            lines: [22, 23, 24, 25, 26, 27],
            title: 'Explore neighboring cells',
            description: 'For each valid neighbor (in bounds, not obstacle), calculate new g-score and f-score = g + h, then add to priority queue.',
            variables: {
              'nx, ny': '3, 3',
              'newCost (g)': '4',
              'h(3,3)': '2',
              'fScore': '6'
            }
          },
          {
            lines: [32],
            title: 'Return failure if no path',
            description: 'If priority queue is exhausted without reaching goal, no valid path exists. Return -1 to indicate failure.',
            variables: {
              'return': '-1'
            }
          }
        ]
      },
      {
        language: 'python',
        code: `import heapq
from typing import List, Tuple

def a_star(grid: List[List[int]], start: Tuple[int, int], goal: Tuple[int, int]) -> int:
    rows, cols = len(grid), len(grid[0])

    def heuristic(x: int, y: int) -> int:
        return abs(x - goal[0]) + abs(y - goal[1])

    pq = [(0 + heuristic(start[0], start[1]), 0, start[0], start[1])]
    visited = set()
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

    while pq:
        _, cost, x, y = heapq.heappop(pq)

        if (x, y) == goal:
            return cost

        if (x, y) in visited:
            continue
        visited.add((x, y))

        for dx, dy in directions:
            nx, ny = x + dx, y + dy
            if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] != 1:
                new_cost = cost + 1
                f_score = new_cost + heuristic(nx, ny)
                heapq.heappush(pq, (f_score, new_cost, nx, ny))

    return -1

# --- Example ---
a_star_grid = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0]
]
path_length = a_star(a_star_grid, (0, 0), (4, 4))  # -> 8
`,
        steps: [
          {
            lines: [7, 8],
            title: 'Define heuristic function',
            description: 'Create Manhattan distance heuristic function h(n) that estimates distance from any position to goal. Must be admissible (never overestimate) for optimal paths.',
            variables: {
              'goal': '(4, 4)',
              'h(2, 2)': '4'
            }
          },
          {
            lines: [10, 11, 12],
            title: 'Initialize search structures',
            description: 'Create priority queue with start position and f-score. Each entry is (f-score, g-score, x, y) where f = g + h. Initialize visited set and movement directions.',
            variables: {
              'pq': '[(6, 0, 0, 0)]',
              'start': '(0, 0)',
              'h(start)': '6'
            }
          },
          {
            lines: [15],
            title: 'Extract position with lowest f-score',
            description: 'Pop the position with minimum f-score (total estimated cost) from priority queue. This greedy choice is guided by the heuristic.',
            variables: {
              'f_score': '6',
              'cost (g)': '0',
              'x, y': '0, 0'
            }
          },
          {
            lines: [17, 18],
            title: 'Check if goal reached',
            description: 'If current position equals goal, we found the shortest path. Return the actual cost (g-score) to reach goal.',
            variables: {
              'current': '(4, 4)',
              'goal': '(4, 4)',
              'cost': '8'
            }
          },
          {
            lines: [20, 21, 22],
            title: 'Mark position as visited',
            description: 'Check if position already visited. If not, add to visited set to avoid reprocessing the same position.',
            variables: {
              'x, y': '(2, 3)',
              'visited': '{(0,0), (1,0), (2,3)}'
            }
          },
          {
            lines: [24, 25, 26, 27, 28, 29],
            title: 'Explore neighboring cells',
            description: 'For each valid neighbor (in bounds, not obstacle), calculate new g-score and f-score = g + h, then add to priority queue for consideration.',
            variables: {
              'nx, ny': '(3, 3)',
              'new_cost (g)': '4',
              'h(3, 3)': '2',
              'f_score': '6'
            }
          },
          {
            lines: [31],
            title: 'Return failure if no path',
            description: 'If priority queue is exhausted without reaching goal, no valid path exists. Return -1 to indicate failure.',
            variables: {
              'return': '-1'
            }
          }
        ]
      }
    ],
    keyInsights: [
      'Combines actual cost (g) and heuristic estimate (h) as f = g + h',
      'Heuristic must be admissible (never overestimate) for optimality',
      'More efficient than Dijkstra when good heuristic is available',
      'Common heuristics: Manhattan distance, Euclidean distance'
    ],
    whenToUse: [
      'Pathfinding in games and robotics',
      'GPS navigation with known destination',
      'Puzzle solving where goal state is known'
    ]
  },
  {
    id: 'GRA_007',
    name: "Tarjan's Algorithm (SCC)",
    category: 'Graphs',
    difficulty: 'Advanced',
    timeComplexity: 'O(V+E)',
    spaceComplexity: 'O(V)',
    complexityScore: 0.9,
    icon: 'loop',
    description: 'Finds strongly connected components in a directed graph using a single DFS traversal with low-link values.',
    longDescription: "Tarjan's algorithm is an efficient method for finding strongly connected components (SCCs) in a directed graph using a single depth-first search traversal. It maintains a stack of vertices and assigns each vertex a discovery time and a low-link value (the smallest discovery time reachable from that vertex). When a vertex's low-link value equals its discovery time, it indicates the root of an SCC. The algorithm then pops vertices from the stack until reaching the root, forming one SCC. This linear-time algorithm is elegant and more efficient than running multiple DFS passes.",
    tags: ['strongly-connected-components', 'dfs', 'graph-theory', 'low-link'],
    leetcodeProblems: [
      'Critical Connections in a Network',
      'Number of Provinces',
      'Minimum Number of Vertices to Reach All Nodes'
    ],
    codeExamples: [
      {
        language: 'typescript',
        code: `function tarjanSCC(graph: number[][]): number[][] {
  const n = graph.length;
  const ids = new Array(n).fill(-1);
  const low = new Array(n).fill(0);
  const onStack = new Array(n).fill(false);
  const stack: number[] = [];
  const sccs: number[][] = [];
  let id = 0;

  function dfs(at: number): void {
    ids[at] = low[at] = id++;
    stack.push(at);
    onStack[at] = true;

    for (const to of graph[at]) {
      if (ids[to] === -1) dfs(to);
      if (onStack[to]) low[at] = Math.min(low[at], low[to]);
    }

    if (ids[at] === low[at]) {
      const scc: number[] = [];
      while (true) {
        const node = stack.pop()!;
        onStack[node] = false;
        scc.push(node);
        if (node === at) break;
      }
      sccs.push(scc);
    }
  }

  for (let i = 0; i < n; i++) {
    if (ids[i] === -1) dfs(i);
  }

  return sccs;
}

// --- Example ---
const directedGraph: number[][] = [
  [1],       // 0 -> 1
  [2],       // 1 -> 2
  [0],       // 2 -> 0 (forms SCC with 0,1,2)
  [4],       // 3 -> 4
  [5, 6],    // 4 -> 5, 6
  [3],       // 5 -> 3 (forms SCC with 3,4,5)
  [7],       // 6 -> 7
  []         // 7 (isolated SCC)
];
const sccs = tarjanSCC(directedGraph);  // → [[7], [6], [5, 4, 3], [2, 1, 0]]
`,
        steps: [
          {
            lines: [2, 3, 4, 5, 6, 7, 8],
            title: 'Initialize Tarjan data structures',
            description: 'Create arrays for vertex IDs (discovery time), low-link values, stack membership tracking, DFS stack, SCC list, and ID counter.',
            variables: {
              'ids': '[-1, -1, -1, -1]',
              'low': '[0, 0, 0, 0]',
              'id': '0'
            }
          },
          {
            lines: [11, 12, 13],
            title: 'Assign ID and low-link values',
            description: 'When visiting a vertex, assign it a unique ID and initial low-link value. Push onto stack and mark as on stack.',
            variables: {
              'at': '0',
              'ids[0]': '0',
              'low[0]': '0',
              'stack': '[0]'
            }
          },
          {
            lines: [15, 16],
            title: 'Visit unvisited neighbors',
            description: 'For each neighbor, if unvisited (id === -1), recursively visit it via DFS to explore the component.',
            variables: {
              'to': '1',
              'ids[to]': '-1'
            }
          },
          {
            lines: [17],
            title: 'Update low-link value',
            description: 'If neighbor is on stack (part of current SCC), update current vertex low-link to minimum of its and neighbor\'s low-link.',
            variables: {
              'low[at]': '0',
              'low[to]': '2',
              'updated low[at]': '0'
            }
          },
          {
            lines: [20, 21, 22, 23, 24, 25, 26, 27],
            title: 'Extract SCC when root found',
            description: 'If ids[at] === low[at], vertex is SCC root. Pop stack until reaching root, collecting all vertices in this strongly connected component.',
            variables: {
              'at': '0',
              'ids[at]': '0',
              'low[at]': '0',
              'scc': '[2, 1, 0]'
            }
          },
          {
            lines: [31, 32],
            title: 'Process all vertices',
            description: 'Iterate through all vertices and start DFS from any unvisited vertex to ensure all SCCs are found, even in disconnected graphs.',
            variables: {
              'i': '3',
              'ids[i]': '-1'
            }
          },
          {
            lines: [35],
            title: 'Return all SCCs',
            description: 'Return the list of strongly connected components found. Each SCC is a list of vertices that are mutually reachable.',
            variables: {
              'sccs': '[[2,1,0], [3], [4,5]]'
            }
          }
        ]
      },
      {
        language: 'python',
        code: `from typing import List

def tarjan_scc(graph: List[List[int]]) -> List[List[int]]:
    n = len(graph)
    ids = [-1] * n
    low = [0] * n
    on_stack = [False] * n
    stack = []
    sccs = []
    id_counter = 0

    def dfs(at: int) -> None:
        nonlocal id_counter
        ids[at] = low[at] = id_counter
        id_counter += 1
        stack.append(at)
        on_stack[at] = True

        for to in graph[at]:
            if ids[to] == -1:
                dfs(to)
            if on_stack[to]:
                low[at] = min(low[at], low[to])

        if ids[at] == low[at]:
            scc = []
            while True:
                node = stack.pop()
                on_stack[node] = False
                scc.append(node)
                if node == at:
                    break
            sccs.append(scc)

    for i in range(n):
        if ids[i] == -1:
            dfs(i)

    return sccs

# --- Example ---
directed_graph = [
    [1],       # 0 -> 1
    [2],       # 1 -> 2
    [0],       # 2 -> 0 (forms SCC with 0,1,2)
    [4],       # 3 -> 4
    [5, 6],    # 4 -> 5, 6
    [3],       # 5 -> 3 (forms SCC with 3,4,5)
    [7],       # 6 -> 7
    []         # 7 (isolated SCC)
]
sccs_result = tarjan_scc(directed_graph)  # -> [[7], [6], [5, 4, 3], [2, 1, 0]]
`,
        steps: [
          {
            lines: [4, 5, 6, 7, 8, 9, 10],
            title: 'Initialize Tarjan data structures',
            description: 'Create arrays for vertex IDs (discovery time), low-link values, stack membership tracking, DFS stack, SCC list, and ID counter.',
            variables: {
              'ids': '[-1, -1, -1, -1]',
              'low': '[0, 0, 0, 0]',
              'id_counter': '0'
            }
          },
          {
            lines: [13, 14, 15, 16, 17],
            title: 'Assign ID and low-link values',
            description: 'When visiting a vertex, assign it a unique ID and initial low-link value. Push onto stack and mark as on stack.',
            variables: {
              'at': '0',
              'ids[0]': '0',
              'low[0]': '0',
              'stack': '[0]'
            }
          },
          {
            lines: [19, 20, 21],
            title: 'Visit unvisited neighbors',
            description: 'For each neighbor, if unvisited (id == -1), recursively visit it via DFS to explore the component.',
            variables: {
              'to': '1',
              'ids[to]': '-1'
            }
          },
          {
            lines: [22, 23],
            title: 'Update low-link value',
            description: 'If neighbor is on stack (part of current SCC), update current vertex low-link to minimum of its and neighbor\'s low-link values.',
            variables: {
              'low[at]': '0',
              'low[to]': '2',
              'min(low[at], low[to])': '0'
            }
          },
          {
            lines: [25, 26, 27, 28, 29, 30, 31, 32],
            title: 'Extract SCC when root found',
            description: 'If ids[at] == low[at], vertex is SCC root. Pop stack until reaching root, collecting all vertices in this strongly connected component.',
            variables: {
              'at': '0',
              'ids[at]': '0',
              'low[at]': '0',
              'scc': '[2, 1, 0]'
            }
          },
          {
            lines: [34, 35, 36],
            title: 'Process all vertices',
            description: 'Iterate through all vertices and start DFS from any unvisited vertex to ensure all SCCs are found, even in disconnected graphs.',
            variables: {
              'i': '3',
              'ids[i]': '-1'
            }
          },
          {
            lines: [38],
            title: 'Return all SCCs',
            description: 'Return the list of strongly connected components found. Each SCC is a list of vertices that are mutually reachable.',
            variables: {
              'sccs': '[[2,1,0], [3], [4,5]]'
            }
          }
        ]
      }
    ],
    keyInsights: [
      'Uses single DFS traversal with low-link values',
      'Stack maintains vertices in current DFS path',
      'SCC root identified when ids[v] == low[v]',
      'More efficient than Kosaraju\'s algorithm in practice'
    ],
    whenToUse: [
      'Finding strongly connected components in directed graphs',
      'Analyzing cyclic dependencies in code',
      'Identifying bridge edges and articulation points'
    ]
  },
  {
    id: 'GRA_008',
    name: "Kosaraju's Algorithm",
    category: 'Graphs',
    difficulty: 'Advanced',
    timeComplexity: 'O(V+E)',
    spaceComplexity: 'O(V)',
    complexityScore: 0.85,
    icon: 'autorenew',
    description: 'Finds strongly connected components using two DFS passes: one on the original graph and one on the transposed graph.',
    longDescription: "Kosaraju's algorithm finds strongly connected components in a directed graph through an elegant two-pass approach. The first pass performs DFS on the original graph to determine the finishing order of vertices. The second pass performs DFS on the transposed (reversed) graph in the reverse finishing order from the first pass. Each DFS tree in the second pass represents one strongly connected component. While conceptually simpler than Tarjan's algorithm, it requires two full graph traversals and graph transposition, making it slightly less efficient in practice.",
    tags: ['strongly-connected-components', 'dfs', 'graph-transpose', 'two-pass'],
    leetcodeProblems: [
      'Number of Provinces',
      'Reachable Nodes In Subdivided Graph',
      'Minimum Number of Vertices to Reach All Nodes'
    ],
    codeExamples: [
      {
        language: 'typescript',
        code: `function kosarajuSCC(graph: number[][]): number[][] {
  const n = graph.length;
  const visited = new Array(n).fill(false);
  const stack: number[] = [];

  // First DFS to fill stack with finish times
  function dfs1(v: number): void {
    visited[v] = true;
    for (const neighbor of graph[v]) {
      if (!visited[neighbor]) dfs1(neighbor);
    }
    stack.push(v);
  }

  // Build transposed graph
  const transposed: number[][] = Array.from({ length: n }, () => []);
  for (let v = 0; v < n; v++) {
    for (const neighbor of graph[v]) {
      transposed[neighbor].push(v);
    }
  }

  // Second DFS on transposed graph
  const sccs: number[][] = [];
  visited.fill(false);

  function dfs2(v: number, scc: number[]): void {
    visited[v] = true;
    scc.push(v);
    for (const neighbor of transposed[v]) {
      if (!visited[neighbor]) dfs2(neighbor, scc);
    }
  }

  for (let i = 0; i < n; i++) {
    if (!visited[i]) dfs1(i);
  }

  while (stack.length > 0) {
    const v = stack.pop()!;
    if (!visited[v]) {
      const scc: number[] = [];
      dfs2(v, scc);
      sccs.push(scc);
    }
  }

  return sccs;
}

// --- Example ---
const kosarajuGraph: number[][] = [
  [1],       // 0 -> 1
  [2],       // 1 -> 2
  [0],       // 2 -> 0 (forms SCC with 0,1,2)
  [4],       // 3 -> 4
  [5],       // 4 -> 5
  [3]        // 5 -> 3 (forms SCC with 3,4,5)
];
const kosarajuSccs = kosarajuSCC(kosarajuGraph);  // → [[2, 1, 0], [5, 4, 3]]
`,
        steps: [
          {
            lines: [2, 3, 4],
            title: 'Initialize first pass structures',
            description: 'Create visited array to track processed vertices and stack to store vertices in finish time order.',
            variables: {
              'n': '5',
              'visited': '[false, false, false, false, false]',
              'stack': '[]'
            }
          },
          {
            lines: [7, 8, 9, 10, 11, 12],
            title: 'First DFS: record finish times',
            description: 'Perform DFS on original graph. Visit all neighbors recursively, then push vertex to stack. Stack order represents reverse finish times.',
            variables: {
              'v': '0',
              'visited[0]': 'true',
              'stack': '[3, 1, 0]'
            }
          },
          {
            lines: [15, 16, 17, 18, 19],
            title: 'Build transposed graph',
            description: 'Create graph with all edges reversed. For each edge u→v in original graph, add edge v→u to transposed graph.',
            variables: {
              'graph[0]': '[1, 2]',
              'transposed[1]': '[0]',
              'transposed[2]': '[0]'
            }
          },
          {
            lines: [22, 23, 24],
            title: 'Reset for second pass',
            description: 'Initialize SCC result list and reset visited array for second DFS pass on transposed graph.',
            variables: {
              'sccs': '[]',
              'visited': '[false, false, false, false, false]'
            }
          },
          {
            lines: [26, 27, 28, 29, 30, 31],
            title: 'Second DFS: collect SCC',
            description: 'On transposed graph, DFS from a vertex collects all vertices in its SCC. All reachable vertices form one component.',
            variables: {
              'v': '0',
              'scc': '[0, 1, 2]'
            }
          },
          {
            lines: [38, 39, 40, 41, 42, 43],
            title: 'Process in reverse finish order',
            description: 'Pop vertices from stack (reverse finish order) and run DFS2 on unvisited vertices. Each DFS2 call finds one SCC.',
            variables: {
              'v': '0',
              'visited[0]': 'false',
              'sccs': '[[0,1,2], [3,4]]'
            }
          },
          {
            lines: [47],
            title: 'Return all SCCs',
            description: 'Return the complete list of strongly connected components found via two-pass algorithm.',
            variables: {
              'sccs': '[[0,1,2], [3,4]]'
            }
          }
        ]
      },
      {
        language: 'python',
        code: `from typing import List

def kosaraju_scc(graph: List[List[int]]) -> List[List[int]]:
    n = len(graph)
    visited = [False] * n
    stack = []

    # First DFS to fill stack with finish times
    def dfs1(v: int) -> None:
        visited[v] = True
        for neighbor in graph[v]:
            if not visited[neighbor]:
                dfs1(neighbor)
        stack.append(v)

    # Build transposed graph
    transposed = [[] for _ in range(n)]
    for v in range(n):
        for neighbor in graph[v]:
            transposed[neighbor].append(v)

    # Second DFS on transposed graph
    sccs = []
    visited = [False] * n

    def dfs2(v: int, scc: List[int]) -> None:
        visited[v] = True
        scc.append(v)
        for neighbor in transposed[v]:
            if not visited[neighbor]:
                dfs2(neighbor, scc)

    for i in range(n):
        if not visited[i]:
            dfs1(i)

    while stack:
        v = stack.pop()
        if not visited[v]:
            scc = []
            dfs2(v, scc)
            sccs.append(scc)

    return sccs

# --- Example ---
kosaraju_graph = [
    [1],       # 0 -> 1
    [2],       # 1 -> 2
    [0],       # 2 -> 0 (forms SCC with 0,1,2)
    [4],       # 3 -> 4
    [5],       # 4 -> 5
    [3]        # 5 -> 3 (forms SCC with 3,4,5)
]
kosaraju_sccs = kosaraju_scc(kosaraju_graph)  # -> [[2, 1, 0], [5, 4, 3]]
`,
        steps: [
          {
            lines: [4, 5, 6],
            title: 'Initialize first pass structures',
            description: 'Create visited array to track processed vertices and stack to store vertices in reverse finish time order.',
            variables: {
              'n': '5',
              'visited': '[False, False, False, False, False]',
              'stack': '[]'
            }
          },
          {
            lines: [9, 10, 11, 12, 13, 14],
            title: 'First DFS: record finish times',
            description: 'Perform DFS on original graph. Visit all neighbors recursively, then push vertex to stack. Stack order represents reverse finish times.',
            variables: {
              'v': '0',
              'visited[0]': 'True',
              'stack': '[3, 1, 0]'
            }
          },
          {
            lines: [17, 18, 19, 20],
            title: 'Build transposed graph',
            description: 'Create graph with all edges reversed. For each edge u→v in original graph, add edge v→u to transposed graph.',
            variables: {
              'graph[0]': '[1, 2]',
              'transposed[1]': '[0]',
              'transposed[2]': '[0]'
            }
          },
          {
            lines: [23, 24],
            title: 'Reset for second pass',
            description: 'Initialize SCC result list and reset visited array for second DFS pass on transposed graph.',
            variables: {
              'sccs': '[]',
              'visited': '[False, False, False, False, False]'
            }
          },
          {
            lines: [26, 27, 28, 29, 30, 31],
            title: 'Second DFS: collect SCC',
            description: 'On transposed graph, DFS from a vertex collects all vertices in its SCC. All reachable vertices form one strongly connected component.',
            variables: {
              'v': '0',
              'scc': '[0, 1, 2]'
            }
          },
          {
            lines: [33, 34, 35],
            title: 'Fill stack with finish order',
            description: 'Run first DFS pass to fill stack with vertices in reverse finish time order. Process all unvisited vertices.',
            variables: {
              'i': '2',
              'visited[2]': 'False'
            }
          },
          {
            lines: [37, 38, 39, 40, 41, 42],
            title: 'Process in reverse finish order',
            description: 'Pop vertices from stack (reverse finish order) and run DFS2 on unvisited vertices. Each DFS2 call finds one SCC.',
            variables: {
              'v': '0',
              'visited[0]': 'False',
              'sccs': '[[0,1,2], [3,4]]'
            }
          },
          {
            lines: [44],
            title: 'Return all SCCs',
            description: 'Return the complete list of strongly connected components found via two-pass algorithm.',
            variables: {
              'sccs': '[[0,1,2], [3,4]]'
            }
          }
        ]
      }
    ],
    keyInsights: [
      'Two-pass algorithm: original graph then transposed graph',
      'First pass determines finishing order of vertices',
      'Second pass on transpose finds SCCs in reverse finish order',
      'Conceptually simpler than Tarjan\'s but requires graph transposition'
    ],
    whenToUse: [
      'Finding strongly connected components when simplicity is preferred',
      'Educational purposes to understand SCC properties',
      'When graph transposition is not expensive'
    ]
  },
  {
    id: 'GRA_009',
    name: "Kahn's Algorithm (Topological Sort)",
    category: 'Graphs',
    difficulty: 'Medium',
    timeComplexity: 'O(V+E)',
    spaceComplexity: 'O(V)',
    complexityScore: 0.6,
    icon: 'low_priority',
    description: 'Produces a topological ordering of a directed acyclic graph by repeatedly removing vertices with no incoming edges.',
    longDescription: "Kahn's algorithm generates a topological sort of a directed acyclic graph (DAG) using a BFS-based approach. It maintains a count of incoming edges (in-degree) for each vertex and starts by adding all vertices with in-degree 0 to a queue. As each vertex is processed and added to the result, it decrements the in-degree of its neighbors. When a neighbor's in-degree reaches 0, it's added to the queue. If the algorithm cannot process all vertices, the graph contains a cycle. This algorithm is intuitive and naturally detects cycles.",
    tags: ['topological-sort', 'bfs', 'dag', 'in-degree'],
    leetcodeProblems: [
      'Course Schedule',
      'Course Schedule II',
      'Alien Dictionary'
    ],
    codeExamples: [
      {
        language: 'typescript',
        code: `function kahnTopologicalSort(n: number, edges: number[][]): number[] {
  const graph: number[][] = Array.from({ length: n }, () => []);
  const inDegree = new Array(n).fill(0);

  // Build graph and calculate in-degrees
  for (const [u, v] of edges) {
    graph[u].push(v);
    inDegree[v]++;
  }

  // Initialize queue with vertices having in-degree 0
  const queue: number[] = [];
  for (let i = 0; i < n; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const result: number[] = [];

  while (queue.length > 0) {
    const u = queue.shift()!;
    result.push(u);

    for (const v of graph[u]) {
      inDegree[v]--;
      if (inDegree[v] === 0) queue.push(v);
    }
  }

  // Check for cycle
  return result.length === n ? result : [];
}

// --- Example ---
const kahnEdges: number[][] = [
  [0, 1],  // 0 must come before 1
  [0, 2],  // 0 must come before 2
  [1, 3],  // 1 must come before 3
  [2, 3]   // 2 must come before 3
];
const topoOrder = kahnTopologicalSort(4, kahnEdges);  // → [0, 1, 2, 3] or [0, 2, 1, 3]
`,
        steps: [
          {
            lines: [2, 3],
            title: 'Initialize graph and in-degree',
            description: 'Create adjacency list for the graph and in-degree array to count incoming edges for each vertex.',
            variables: {
              'n': '5',
              'graph': '[[], [], [], [], []]',
              'inDegree': '[0, 0, 0, 0, 0]'
            }
          },
          {
            lines: [5, 6, 7, 8],
            title: 'Build graph and count in-degrees',
            description: 'For each edge u→v, add v to u\'s adjacency list and increment v\'s in-degree count. In-degree represents number of prerequisites.',
            variables: {
              'edge': '[0, 1]',
              'graph[0]': '[1]',
              'inDegree[1]': '1'
            }
          },
          {
            lines: [11, 12, 13, 14],
            title: 'Initialize queue with source vertices',
            description: 'Find all vertices with in-degree 0 (no prerequisites) and add them to the queue. These can be processed first.',
            variables: {
              'queue': '[0, 2]',
              'inDegree': '[0, 1, 0, 2, 1]'
            }
          },
          {
            lines: [19, 20, 21],
            title: 'Process vertex from queue',
            description: 'Remove a vertex from queue and add it to result. This vertex has all prerequisites satisfied.',
            variables: {
              'u': '0',
              'result': '[0]'
            }
          },
          {
            lines: [23, 24, 25],
            title: 'Update neighbors in-degrees',
            description: 'For each neighbor of processed vertex, decrement its in-degree. If in-degree becomes 0, all its prerequisites are satisfied, add to queue.',
            variables: {
              'v': '1',
              'inDegree[1]': '0',
              'queue': '[2, 1]'
            }
          },
          {
            lines: [29],
            title: 'Validate and return result',
            description: 'If result contains all n vertices, topological sort succeeded. Otherwise, a cycle exists and return empty array.',
            variables: {
              'result.length': '5',
              'n': '5',
              'valid': 'true'
            }
          }
        ]
      },
      {
        language: 'python',
        code: `from collections import deque
from typing import List

def kahn_topological_sort(n: int, edges: List[List[int]]) -> List[int]:
    graph = [[] for _ in range(n)]
    in_degree = [0] * n

    # Build graph and calculate in-degrees
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1

    # Initialize queue with vertices having in-degree 0
    queue = deque([i for i in range(n) if in_degree[i] == 0])

    result = []

    while queue:
        u = queue.popleft()
        result.append(u)

        for v in graph[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)

    # Check for cycle
    return result if len(result) == n else []

# --- Example ---
kahn_edges = [
    [0, 1],  # 0 must come before 1
    [0, 2],  # 0 must come before 2
    [1, 3],  # 1 must come before 3
    [2, 3]   # 2 must come before 3
]
topo_order = kahn_topological_sort(4, kahn_edges)  # -> [0, 1, 2, 3] or [0, 2, 1, 3]
`,
        steps: [
          {
            lines: [5, 6],
            title: 'Initialize graph and in-degree',
            description: 'Create adjacency list for the graph and in-degree array to count incoming edges for each vertex.',
            variables: {
              'n': '5',
              'graph': '[[], [], [], [], []]',
              'in_degree': '[0, 0, 0, 0, 0]'
            }
          },
          {
            lines: [9, 10, 11],
            title: 'Build graph and count in-degrees',
            description: 'For each edge u→v, add v to u\'s adjacency list and increment v\'s in-degree count. In-degree represents number of prerequisites.',
            variables: {
              'u': '0',
              'v': '1',
              'graph[0]': '[1]',
              'in_degree[1]': '1'
            }
          },
          {
            lines: [14],
            title: 'Initialize queue with source vertices',
            description: 'Find all vertices with in-degree 0 (no prerequisites) and add them to the queue using list comprehension. These can be processed first.',
            variables: {
              'queue': 'deque([0, 2])',
              'in_degree': '[0, 1, 0, 2, 1]'
            }
          },
          {
            lines: [16],
            title: 'Initialize result list',
            description: 'Create empty result list to store the topological ordering of vertices.',
            variables: {
              'result': '[]'
            }
          },
          {
            lines: [18, 19, 20],
            title: 'Process vertex from queue',
            description: 'Remove a vertex from queue and add it to result. This vertex has all prerequisites satisfied.',
            variables: {
              'u': '0',
              'result': '[0]'
            }
          },
          {
            lines: [22, 23, 24, 25],
            title: 'Update neighbors in-degrees',
            description: 'For each neighbor of processed vertex, decrement its in-degree. If in-degree becomes 0, all its prerequisites are satisfied, add to queue.',
            variables: {
              'v': '1',
              'in_degree[1]': '0',
              'queue': 'deque([2, 1])'
            }
          },
          {
            lines: [28],
            title: 'Validate and return result',
            description: 'If result contains all n vertices, topological sort succeeded. Otherwise, a cycle exists and return empty list.',
            variables: {
              'len(result)': '5',
              'n': '5',
              'valid': 'True'
            }
          }
        ]
      }
    ],
    keyInsights: [
      'BFS-based approach using in-degree tracking',
      'Naturally detects cycles (result length < V)',
      'Processes vertices in order of dependencies',
      'Alternative to DFS-based topological sort'
    ],
    whenToUse: [
      'Task scheduling with dependencies',
      'Build systems and compilation order',
      'Course prerequisite planning'
    ]
  },
  {
    id: 'GRA_010',
    name: 'Cycle Detection',
    category: 'Graphs',
    difficulty: 'Medium',
    timeComplexity: 'O(V+E)',
    spaceComplexity: 'O(V)',
    complexityScore: 0.5,
    icon: 'replay',
    description: 'Detects cycles in directed and undirected graphs using DFS with recursion stack tracking.',
    longDescription: 'Cycle detection algorithms determine whether a graph contains cycles. For undirected graphs, a cycle exists if we revisit a vertex that is not the immediate parent during DFS. For directed graphs, we track vertices in the current recursion stack; revisiting a vertex in the stack indicates a back edge and thus a cycle. The algorithm uses color coding or state tracking: white (unvisited), gray (in progress), and black (finished). Cycle detection is fundamental for validating DAGs, detecting deadlocks, and ensuring consistency in dependency graphs.',
    tags: ['cycle-detection', 'dfs', 'graph-validation', 'back-edge'],
    leetcodeProblems: [
      'Course Schedule',
      'Detect Cycle in an Undirected Graph',
      'Find Eventual Safe States'
    ],
    codeExamples: [
      {
        language: 'typescript',
        code: `// Directed Graph Cycle Detection
function hasCycleDirected(graph: number[][]): boolean {
  const n = graph.length;
  const visited = new Array(n).fill(false);
  const recStack = new Array(n).fill(false);

  function dfs(v: number): boolean {
    visited[v] = true;
    recStack[v] = true;

    for (const neighbor of graph[v]) {
      if (!visited[neighbor]) {
        if (dfs(neighbor)) return true;
      } else if (recStack[neighbor]) {
        return true; // Back edge found
      }
    }

    recStack[v] = false;
    return false;
  }

  for (let i = 0; i < n; i++) {
    if (!visited[i] && dfs(i)) return true;
  }

  return false;
}

// Undirected Graph Cycle Detection
function hasCycleUndirected(graph: number[][]): boolean {
  const n = graph.length;
  const visited = new Array(n).fill(false);

  function dfs(v: number, parent: number): boolean {
    visited[v] = true;

    for (const neighbor of graph[v]) {
      if (!visited[neighbor]) {
        if (dfs(neighbor, v)) return true;
      } else if (neighbor !== parent) {
        return true; // Cycle found
      }
    }

    return false;
  }

  for (let i = 0; i < n; i++) {
    if (!visited[i] && dfs(i, -1)) return true;
  }

  return false;
}

// --- Example ---
const directedCyclic: number[][] = [[1], [2], [0]];  // 0 -> 1 -> 2 -> 0 (cycle)
const hasDirCycle = hasCycleDirected(directedCyclic);  // → true

const undirectedCyclic: number[][] = [[1, 2], [0, 2], [0, 1]];  // triangle
const hasUndirCycle = hasCycleUndirected(undirectedCyclic);  // → true
`,
        steps: [
          {
            lines: [3, 4, 5],
            title: 'Initialize tracking arrays',
            description: 'Create visited array to track all visited vertices and recStack (recursion stack) to track vertices in current DFS path.',
            variables: {
              'n': '4',
              'visited': '[false, false, false, false]',
              'recStack': '[false, false, false, false]'
            }
          },
          {
            lines: [8, 9],
            title: 'Mark vertex as visited and in stack',
            description: 'When entering DFS for a vertex, mark it as visited globally and add to current recursion stack.',
            variables: {
              'v': '0',
              'visited[0]': 'true',
              'recStack[0]': 'true'
            }
          },
          {
            lines: [11, 12, 13],
            title: 'Explore unvisited neighbors',
            description: 'For each unvisited neighbor, recursively perform DFS. If cycle detected in recursion, propagate true up the call stack.',
            variables: {
              'neighbor': '1',
              'visited[1]': 'false'
            }
          },
          {
            lines: [14, 15],
            title: 'Detect back edge (cycle)',
            description: 'If neighbor is already in recursion stack, we found a back edge indicating a cycle. This is the key cycle detection condition.',
            variables: {
              'neighbor': '0',
              'recStack[0]': 'true',
              'cycle': 'true'
            }
          },
          {
            lines: [19],
            title: 'Remove from recursion stack',
            description: 'After exploring all neighbors, remove vertex from recursion stack before backtracking. It\'s no longer in current path.',
            variables: {
              'v': '1',
              'recStack[1]': 'false'
            }
          },
          {
            lines: [23, 24],
            title: 'Check all components',
            description: 'Iterate through all vertices and start DFS from unvisited ones to ensure all components are checked for cycles.',
            variables: {
              'i': '2',
              'visited[2]': 'false'
            }
          },
          {
            lines: [26],
            title: 'Return cycle detection result',
            description: 'Return false if no cycle found after checking all components, true if any cycle was detected.',
            variables: {
              'return': 'false'
            }
          }
        ]
      },
      {
        language: 'python',
        code: `from typing import List

# Directed Graph Cycle Detection
def has_cycle_directed(graph: List[List[int]]) -> bool:
    n = len(graph)
    visited = [False] * n
    rec_stack = [False] * n

    def dfs(v: int) -> bool:
        visited[v] = True
        rec_stack[v] = True

        for neighbor in graph[v]:
            if not visited[neighbor]:
                if dfs(neighbor):
                    return True
            elif rec_stack[neighbor]:
                return True  # Back edge found

        rec_stack[v] = False
        return False

    for i in range(n):
        if not visited[i] and dfs(i):
            return True

    return False

# Undirected Graph Cycle Detection
def has_cycle_undirected(graph: List[List[int]]) -> bool:
    n = len(graph)
    visited = [False] * n

    def dfs(v: int, parent: int) -> bool:
        visited[v] = True

        for neighbor in graph[v]:
            if not visited[neighbor]:
                if dfs(neighbor, v):
                    return True
            elif neighbor != parent:
                return True  # Cycle found

        return False

    for i in range(n):
        if not visited[i] and dfs(i, -1):
            return True

    return False

# --- Example ---
directed_cyclic = [[1], [2], [0]]  # 0 -> 1 -> 2 -> 0 (cycle)
has_dir_cycle = has_cycle_directed(directed_cyclic)  # -> True

undirected_cyclic = [[1, 2], [0, 2], [0, 1]]  # triangle
has_undir_cycle = has_cycle_undirected(undirected_cyclic)  # -> True
`,
        steps: [
          {
            lines: [5, 6, 7],
            title: 'Initialize tracking arrays',
            description: 'Create visited array to track all visited vertices and rec_stack (recursion stack) to track vertices in current DFS path.',
            variables: {
              'n': '4',
              'visited': '[False, False, False, False]',
              'rec_stack': '[False, False, False, False]'
            }
          },
          {
            lines: [10, 11],
            title: 'Mark vertex as visited and in stack',
            description: 'When entering DFS for a vertex, mark it as visited globally and add to current recursion stack.',
            variables: {
              'v': '0',
              'visited[0]': 'True',
              'rec_stack[0]': 'True'
            }
          },
          {
            lines: [13, 14, 15, 16],
            title: 'Explore unvisited neighbors',
            description: 'For each unvisited neighbor, recursively perform DFS. If cycle detected in recursion, propagate true up the call stack.',
            variables: {
              'neighbor': '1',
              'visited[1]': 'False'
            }
          },
          {
            lines: [17, 18],
            title: 'Detect back edge (cycle)',
            description: 'If neighbor is already in recursion stack, we found a back edge indicating a cycle. This is the key cycle detection condition for directed graphs.',
            variables: {
              'neighbor': '0',
              'rec_stack[0]': 'True',
              'cycle': 'True'
            }
          },
          {
            lines: [20],
            title: 'Remove from recursion stack',
            description: 'After exploring all neighbors, remove vertex from recursion stack before backtracking. It\'s no longer in current path.',
            variables: {
              'v': '1',
              'rec_stack[1]': 'False'
            }
          },
          {
            lines: [23, 24, 25],
            title: 'Check all components',
            description: 'Iterate through all vertices and start DFS from unvisited ones to ensure all components are checked for cycles.',
            variables: {
              'i': '2',
              'visited[2]': 'False'
            }
          },
          {
            lines: [27],
            title: 'Return cycle detection result',
            description: 'Return False if no cycle found after checking all components, True if any cycle was detected.',
            variables: {
              'return': 'False'
            }
          }
        ]
      }
    ],
    keyInsights: [
      'Directed graphs: use recursion stack to detect back edges',
      'Undirected graphs: track parent to avoid false cycle detection',
      'Three-state tracking: unvisited, visiting, visited',
      'Can also use Union-Find for undirected graphs'
    ],
    whenToUse: [
      'Validating DAGs for topological sorting',
      'Detecting deadlocks in resource allocation',
      'Course prerequisite validation'
    ]
  },
  {
    id: 'GRA_011',
    name: 'Bipartite Check',
    category: 'Graphs',
    difficulty: 'Medium',
    timeComplexity: 'O(V+E)',
    spaceComplexity: 'O(V)',
    complexityScore: 0.5,
    icon: 'dashboard',
    description: 'Determines if a graph is bipartite by attempting to color vertices with two colors such that no adjacent vertices share the same color.',
    longDescription: 'A bipartite graph is one whose vertices can be divided into two disjoint sets such that every edge connects vertices from different sets. The bipartite check algorithm uses graph coloring with two colors, typically implemented with BFS or DFS. Starting from any vertex, we color it with one color and all its neighbors with the opposite color. If we ever need to color a vertex that is already colored with the wrong color, the graph is not bipartite. This is equivalent to checking if the graph contains odd-length cycles. Bipartite graphs have applications in matching problems, scheduling, and network flow.',
    tags: ['bipartite', 'graph-coloring', 'bfs', 'two-coloring'],
    leetcodeProblems: [
      'Is Graph Bipartite?',
      'Possible Bipartition',
      'Divide Nodes Into the Maximum Number of Groups'
    ],
    codeExamples: [
      {
        language: 'typescript',
        code: `function isBipartite(graph: number[][]): boolean {
  const n = graph.length;
  const colors = new Array(n).fill(-1);

  function bfs(start: number): boolean {
    const queue: number[] = [start];
    colors[start] = 0;

    while (queue.length > 0) {
      const u = queue.shift()!;

      for (const v of graph[u]) {
        if (colors[v] === -1) {
          colors[v] = 1 - colors[u];
          queue.push(v);
        } else if (colors[v] === colors[u]) {
          return false; // Same color as neighbor
        }
      }
    }

    return true;
  }

  // Check all components
  for (let i = 0; i < n; i++) {
    if (colors[i] === -1) {
      if (!bfs(i)) return false;
    }
  }

  return true;
}

// --- Example ---
const bipartiteGraph: number[][] = [
  [1, 3],    // 0 connects to 1, 3
  [0, 2],    // 1 connects to 0, 2
  [1, 3],    // 2 connects to 1, 3
  [0, 2]     // 3 connects to 0, 2 (forms bipartite: {0,2} and {1,3})
];
const isBipart = isBipartite(bipartiteGraph);  // → true
`,
        steps: [
          {
            lines: [2, 3],
            title: 'Initialize color array',
            description: 'Create colors array with -1 for uncolored vertices. We will use 0 and 1 as the two colors for bipartite checking.',
            variables: {
              'n': '5',
              'colors': '[-1, -1, -1, -1, -1]'
            }
          },
          {
            lines: [6, 7],
            title: 'Start BFS with initial color',
            description: 'Initialize BFS queue with start vertex and color it with 0. This is the first vertex of one partition.',
            variables: {
              'start': '0',
              'colors[0]': '0',
              'queue': '[0]'
            }
          },
          {
            lines: [9, 10],
            title: 'Process vertex from queue',
            description: 'Dequeue a vertex and prepare to color all its neighbors with the opposite color.',
            variables: {
              'u': '0',
              'colors[u]': '0'
            }
          },
          {
            lines: [12, 13, 14, 15],
            title: 'Color uncolored neighbors',
            description: 'For each uncolored neighbor, assign it the opposite color (1 - current color) and add to queue for processing.',
            variables: {
              'v': '1',
              'colors[v]': '1',
              'queue': '[1, 2]'
            }
          },
          {
            lines: [16, 17],
            title: 'Detect color conflict',
            description: 'If neighbor already has same color as current vertex, graph is not bipartite (odd cycle exists). Return false immediately.',
            variables: {
              'colors[u]': '0',
              'colors[v]': '0',
              'conflict': 'true'
            }
          },
          {
            lines: [25, 26, 27, 28],
            title: 'Check all connected components',
            description: 'Graph may have multiple components. Check each uncolored vertex by starting new BFS. All components must be bipartite.',
            variables: {
              'i': '3',
              'colors[i]': '-1'
            }
          },
          {
            lines: [31],
            title: 'Return bipartite result',
            description: 'If all components are successfully 2-colored without conflicts, graph is bipartite. Return true.',
            variables: {
              'return': 'true',
              'colors': '[0, 1, 0, 1, 0]'
            }
          }
        ]
      },
      {
        language: 'python',
        code: `from collections import deque
from typing import List

def is_bipartite(graph: List[List[int]]) -> bool:
    n = len(graph)
    colors = [-1] * n

    def bfs(start: int) -> bool:
        queue = deque([start])
        colors[start] = 0

        while queue:
            u = queue.popleft()

            for v in graph[u]:
                if colors[v] == -1:
                    colors[v] = 1 - colors[u]
                    queue.append(v)
                elif colors[v] == colors[u]:
                    return False  # Same color as neighbor

        return True

    # Check all components
    for i in range(n):
        if colors[i] == -1:
            if not bfs(i):
                return False

    return True

# --- Example ---
bipartite_graph = [
    [1, 3],    # 0 connects to 1, 3
    [0, 2],    # 1 connects to 0, 2
    [1, 3],    # 2 connects to 1, 3
    [0, 2]     # 3 connects to 0, 2 (forms bipartite: {0,2} and {1,3})
]
is_bipart = is_bipartite(bipartite_graph)  # -> True
`,
        steps: [
          {
            lines: [5, 6],
            title: 'Initialize color array',
            description: 'Create colors array with -1 for uncolored vertices. We will use 0 and 1 as the two colors for bipartite checking.',
            variables: {
              'n': '5',
              'colors': '[-1, -1, -1, -1, -1]'
            }
          },
          {
            lines: [9, 10],
            title: 'Start BFS with initial color',
            description: 'Initialize BFS queue with start vertex and color it with 0. This is the first vertex of one partition.',
            variables: {
              'start': '0',
              'colors[0]': '0',
              'queue': 'deque([0])'
            }
          },
          {
            lines: [13],
            title: 'Process vertex from queue',
            description: 'Dequeue a vertex and prepare to color all its neighbors with the opposite color.',
            variables: {
              'u': '0',
              'colors[u]': '0'
            }
          },
          {
            lines: [15, 16, 17, 18],
            title: 'Color uncolored neighbors',
            description: 'For each uncolored neighbor, assign it the opposite color (1 - current color) and add to queue for processing.',
            variables: {
              'v': '1',
              'colors[v]': '1',
              'queue': 'deque([1, 2])'
            }
          },
          {
            lines: [19, 20],
            title: 'Detect color conflict',
            description: 'If neighbor already has same color as current vertex, graph is not bipartite (odd cycle exists). Return False immediately.',
            variables: {
              'colors[u]': '0',
              'colors[v]': '0',
              'conflict': 'True'
            }
          },
          {
            lines: [25, 26, 27, 28],
            title: 'Check all connected components',
            description: 'Graph may have multiple components. Check each uncolored vertex by starting new BFS. All components must be bipartite.',
            variables: {
              'i': '3',
              'colors[i]': '-1'
            }
          },
          {
            lines: [30],
            title: 'Return bipartite result',
            description: 'If all components are successfully 2-colored without conflicts, graph is bipartite. Return True.',
            variables: {
              'return': 'True',
              'colors': '[0, 1, 0, 1, 0]'
            }
          }
        ]
      }
    ],
    keyInsights: [
      'Two-coloring problem using BFS or DFS',
      'Bipartite if and only if graph has no odd-length cycles',
      'Must check all connected components',
      'Color conflict indicates non-bipartite graph'
    ],
    whenToUse: [
      'Matching problems (bipartite matching)',
      'Task assignment where conflicts exist',
      'Detecting odd cycles in graphs'
    ]
  },
  {
    id: 'GRA_012',
    name: 'Eulerian Path',
    category: 'Graphs',
    difficulty: 'Advanced',
    timeComplexity: 'O(E)',
    spaceComplexity: 'O(E)',
    complexityScore: 0.8,
    icon: 'timeline',
    description: 'Finds a path that visits every edge exactly once using Hierholzer\'s algorithm.',
    longDescription: 'An Eulerian path is a trail in a graph that visits every edge exactly once. For undirected graphs, an Eulerian path exists if there are exactly 0 or 2 vertices with odd degree. For directed graphs, it exists if at most one vertex has (out-degree - in-degree = 1), at most one has (in-degree - out-degree = 1), and all others have equal in and out degrees. Hierholzer\'s algorithm efficiently finds such a path by following edges and backtracking to insert cycles. This concept has applications in DNA sequencing, network routing, and solving puzzles like the Seven Bridges of Königsberg.',
    tags: ['eulerian-path', 'graph-traversal', 'hierholzer', 'edge-traversal'],
    leetcodeProblems: [
      'Reconstruct Itinerary',
      'Valid Arrangement of Pairs',
      'Cracking the Safe'
    ],
    codeExamples: [
      {
        language: 'typescript',
        code: `function findEulerianPath(graph: Map<string, string[]>): string[] {
  const inDegree = new Map<string, number>();
  const outDegree = new Map<string, number>();

  // Calculate degrees
  for (const [from, neighbors] of graph) {
    outDegree.set(from, (outDegree.get(from) || 0) + neighbors.length);
    for (const to of neighbors) {
      inDegree.set(to, (inDegree.get(to) || 0) + 1);
    }
  }

  // Find start vertex
  let start = graph.keys().next().value;
  for (const [vertex] of graph) {
    if ((outDegree.get(vertex) || 0) - (inDegree.get(vertex) || 0) === 1) {
      start = vertex;
      break;
    }
  }

  const path: string[] = [];
  const stack: string[] = [start];

  while (stack.length > 0) {
    const curr = stack[stack.length - 1];
    const neighbors = graph.get(curr) || [];

    if (neighbors.length > 0) {
      const next = neighbors.pop()!;
      stack.push(next);
    } else {
      path.push(stack.pop()!);
    }
  }

  return path.reverse();
}

// --- Example ---
const eulerGraph = new Map([
  ["A", ["B", "C"]],
  ["B", ["C"]],
  ["C", ["A"]]
]);
const eulerPath = findEulerianPath(eulerGraph);  // → ["A", "B", "C", "A", "C"]
`,
        steps: [
          {
            lines: [2, 3, 4, 5, 6, 7, 8, 9, 10],
            title: 'Calculate in-degree and out-degree',
            description: 'For each vertex, count incoming edges (in-degree) and outgoing edges (out-degree). This determines if Eulerian path exists.',
            variables: {
              'outDegree': '{A: 2, B: 1, C: 1}',
              'inDegree': '{B: 1, C: 2, D: 1}'
            }
          },
          {
            lines: [13, 14, 15, 16, 17, 18],
            title: 'Find start vertex',
            description: 'Find vertex with out-degree - in-degree = 1 as start. If none exists, start from any vertex (Eulerian circuit case).',
            variables: {
              'vertex': 'A',
              'outDegree[A] - inDegree[A]': '1',
              'start': 'A'
            }
          },
          {
            lines: [21, 22],
            title: 'Initialize Hierholzer algorithm',
            description: 'Create path array to store final result and stack for DFS traversal starting from the identified start vertex.',
            variables: {
              'path': '[]',
              'stack': '[A]'
            }
          },
          {
            lines: [25, 26, 27],
            title: 'Get current vertex and neighbors',
            description: 'Peek at top of stack (current vertex) and get its remaining unvisited neighbors from the graph.',
            variables: {
              'curr': 'A',
              'neighbors': '[B, C]'
            }
          },
          {
            lines: [29, 30, 31],
            title: 'Follow unvisited edge',
            description: 'If current vertex has unvisited edges, pop one neighbor (consuming the edge) and push it onto stack to continue path.',
            variables: {
              'next': 'B',
              'stack': '[A, B]'
            }
          },
          {
            lines: [32, 33],
            title: 'Backtrack when stuck',
            description: 'When vertex has no more unvisited edges, pop it from stack and add to path. This builds path in reverse order.',
            variables: {
              'stack': '[A, B, C]',
              'path': '[D, C]'
            }
          },
          {
            lines: [37],
            title: 'Reverse path for correct order',
            description: 'Since we built path backwards during backtracking, reverse it to get the actual Eulerian path from start to end.',
            variables: {
              'path': '[A, B, C, D]'
            }
          }
        ]
      },
      {
        language: 'python',
        code: `from typing import Dict, List
from collections import defaultdict

def find_eulerian_path(graph: Dict[str, List[str]]) -> List[str]:
    in_degree = defaultdict(int)
    out_degree = defaultdict(int)

    # Calculate degrees
    for from_vertex, neighbors in graph.items():
        out_degree[from_vertex] += len(neighbors)
        for to_vertex in neighbors:
            in_degree[to_vertex] += 1

    # Find start vertex
    start = next(iter(graph.keys()))
    for vertex in graph:
        if out_degree[vertex] - in_degree[vertex] == 1:
            start = vertex
            break

    path = []
    stack = [start]

    while stack:
        curr = stack[-1]
        if graph.get(curr):
            next_vertex = graph[curr].pop()
            stack.append(next_vertex)
        else:
            path.append(stack.pop())

    return path[::-1]

# --- Example ---
euler_graph = {
    "A": ["B", "C"],
    "B": ["C"],
    "C": ["A"]
}
euler_path = find_eulerian_path(euler_graph)  # -> ["A", "B", "C", "A", "C"]
`,
        steps: [
          {
            lines: [5, 6, 9, 10, 11, 12],
            title: 'Calculate in-degree and out-degree',
            description: 'For each vertex, count incoming edges (in-degree) and outgoing edges (out-degree) using defaultdict. This determines if Eulerian path exists.',
            variables: {
              'out_degree': '{A: 2, B: 1, C: 1}',
              'in_degree': '{B: 1, C: 2, D: 1}'
            }
          },
          {
            lines: [15, 16, 17, 18, 19],
            title: 'Find start vertex',
            description: 'Find vertex with out-degree - in-degree = 1 as start. If none exists, start from any vertex (Eulerian circuit case).',
            variables: {
              'vertex': 'A',
              'out_degree[A] - in_degree[A]': '1',
              'start': 'A'
            }
          },
          {
            lines: [21, 22],
            title: 'Initialize Hierholzer algorithm',
            description: 'Create path list to store final result and stack for DFS traversal starting from the identified start vertex.',
            variables: {
              'path': '[]',
              'stack': '[A]'
            }
          },
          {
            lines: [25],
            title: 'Get current vertex',
            description: 'Peek at top of stack (current vertex) to check for remaining unvisited neighbors.',
            variables: {
              'curr': 'A',
              'stack': '[A]'
            }
          },
          {
            lines: [26, 27, 28],
            title: 'Follow unvisited edge',
            description: 'If current vertex has unvisited edges in graph, pop one neighbor (consuming the edge) and push it onto stack to continue path.',
            variables: {
              'next_vertex': 'B',
              'stack': '[A, B]'
            }
          },
          {
            lines: [29, 30],
            title: 'Backtrack when stuck',
            description: 'When vertex has no more unvisited edges, pop it from stack and add to path. This builds path in reverse order.',
            variables: {
              'stack': '[A, B, C]',
              'path': '[D, C]'
            }
          },
          {
            lines: [32],
            title: 'Reverse path for correct order',
            description: 'Since we built path backwards during backtracking, reverse it to get the actual Eulerian path from start to end.',
            variables: {
              'path': '[A, B, C, D]'
            }
          }
        ]
      }
    ],
    keyInsights: [
      'Visits every edge exactly once',
      'Degree constraints determine existence of Eulerian path',
      'Hierholzer\'s algorithm uses stack-based approach',
      'Different from Hamiltonian path (visits vertices once)'
    ],
    whenToUse: [
      'DNA sequence reconstruction',
      'Network routing optimization',
      'Solving edge-traversal puzzles'
    ]
  },
  {
    id: 'GRA_013',
    name: 'Network Flow (Ford-Fulkerson)',
    category: 'Graphs',
    difficulty: 'Advanced',
    timeComplexity: 'O(VE²)',
    spaceComplexity: 'O(V²)',
    complexityScore: 0.95,
    icon: 'water_drop',
    description: 'Computes maximum flow in a flow network by finding augmenting paths using DFS or BFS.',
    longDescription: 'The Ford-Fulkerson method computes the maximum flow from a source to a sink in a flow network. It repeatedly finds augmenting paths from source to sink and increases flow along these paths until no more augmenting paths exist. The algorithm uses the concept of residual graphs, which represent remaining capacity on edges. Different implementations use different path-finding strategies: DFS (basic Ford-Fulkerson) or BFS (Edmonds-Karp). The max-flow min-cut theorem states that the maximum flow equals the minimum cut capacity. Applications include network optimization, bipartite matching, and resource allocation.',
    tags: ['max-flow', 'network-flow', 'augmenting-path', 'min-cut'],
    leetcodeProblems: [
      'Maximum Flow in a Network',
      'Find the Maximum Flow',
      'Minimum Cost to Make at Least One Valid Path in a Grid'
    ],
    codeExamples: [
      {
        language: 'typescript',
        code: `function fordFulkerson(capacity: number[][], source: number, sink: number): number {
  const n = capacity.length;
  const residual = capacity.map(row => [...row]);

  function dfs(node: number, target: number, visited: boolean[], minFlow: number): number {
    if (node === target) return minFlow;

    visited[node] = true;

    for (let next = 0; next < n; next++) {
      if (!visited[next] && residual[node][next] > 0) {
        const flow = dfs(next, target, visited, Math.min(minFlow, residual[node][next]));

        if (flow > 0) {
          residual[node][next] -= flow;
          residual[next][node] += flow;
          return flow;
        }
      }
    }

    return 0;
  }

  let maxFlow = 0;

  while (true) {
    const visited = new Array(n).fill(false);
    const flow = dfs(source, sink, visited, Infinity);

    if (flow === 0) break;
    maxFlow += flow;
  }

  return maxFlow;
}

// --- Example ---
const flowCapacity: number[][] = [
  [0, 16, 13, 0],   // source (0) can send 16 to node 1, 13 to node 2
  [0, 0, 10, 12],   // node 1 can send 10 to node 2, 12 to sink (3)
  [0, 4, 0, 14],    // node 2 can send 4 to node 1, 14 to sink (3)
  [0, 0, 0, 0]      // sink (3) has no outgoing edges
];
const maxFlowValue = fordFulkerson(flowCapacity, 0, 3);  // → 23
`,
        steps: [
          {
            lines: [2, 3],
            title: 'Initialize residual graph',
            description: 'Create residual capacity matrix as copy of original capacity matrix. This tracks remaining capacity on each edge.',
            variables: {
              'n': '4',
              'residual[0][1]': '10',
              'residual[0][2]': '5'
            }
          },
          {
            lines: [5, 6],
            title: 'DFS base case: sink reached',
            description: 'When DFS reaches the sink, return the minimum flow along the augmenting path found.',
            variables: {
              'node': '3',
              'target': '3',
              'minFlow': '4'
            }
          },
          {
            lines: [10, 11, 12],
            title: 'Find augmenting path edge',
            description: 'Try each unvisited neighbor with positive residual capacity. Calculate flow as minimum of current path flow and edge capacity.',
            variables: {
              'next': '2',
              'residual[node][next]': '7',
              'minFlow': '4'
            }
          },
          {
            lines: [14, 15, 16, 17],
            title: 'Update residual capacities',
            description: 'When augmenting path found, decrease forward edge capacity and increase backward edge (for flow reversal). Return the flow amount.',
            variables: {
              'flow': '4',
              'residual[node][next]': '3',
              'residual[next][node]': '4'
            }
          },
          {
            lines: [27, 28, 29],
            title: 'Find augmenting path',
            description: 'Search for augmenting path from source to sink using DFS. Start with infinite flow capacity and find bottleneck.',
            variables: {
              'flow': '4',
              'visited': '[true, true, false, true]'
            }
          },
          {
            lines: [31, 32],
            title: 'Accumulate flow',
            description: 'Add the flow of the found augmenting path to total max flow. Continue searching for more augmenting paths.',
            variables: {
              'maxFlow': '8',
              'flow': '4'
            }
          },
          {
            lines: [30],
            title: 'Terminate when no path exists',
            description: 'When no augmenting path with positive flow can be found (flow = 0), maximum flow is reached. Exit loop.',
            variables: {
              'flow': '0',
              'break': 'true'
            }
          },
          {
            lines: [35],
            title: 'Return maximum flow',
            description: 'Return the accumulated maximum flow from source to sink after all augmenting paths have been found.',
            variables: {
              'maxFlow': '23'
            }
          }
        ]
      },
      {
        language: 'python',
        code: `from typing import List

def ford_fulkerson(capacity: List[List[int]], source: int, sink: int) -> int:
    n = len(capacity)
    residual = [row[:] for row in capacity]

    def dfs(node: int, target: int, visited: List[bool], min_flow: float) -> int:
        if node == target:
            return min_flow

        visited[node] = True

        for next_node in range(n):
            if not visited[next_node] and residual[node][next_node] > 0:
                flow = dfs(next_node, target, visited,
                          min(min_flow, residual[node][next_node]))

                if flow > 0:
                    residual[node][next_node] -= flow
                    residual[next_node][node] += flow
                    return flow

        return 0

    max_flow = 0

    while True:
        visited = [False] * n
        flow = dfs(source, sink, visited, float('inf'))

        if flow == 0:
            break
        max_flow += flow

    return max_flow

# --- Example ---
flow_capacity = [
    [0, 16, 13, 0],   # source (0) can send 16 to node 1, 13 to node 2
    [0, 0, 10, 12],   # node 1 can send 10 to node 2, 12 to sink (3)
    [0, 4, 0, 14],    # node 2 can send 4 to node 1, 14 to sink (3)
    [0, 0, 0, 0]      # sink (3) has no outgoing edges
]
max_flow_value = ford_fulkerson(flow_capacity, 0, 3)  # -> 23
`,
        steps: [
          {
            lines: [4, 5],
            title: 'Initialize residual graph',
            description: 'Create residual capacity matrix as deep copy of original capacity matrix. This tracks remaining capacity on each edge.',
            variables: {
              'n': '4',
              'residual[0][1]': '10',
              'residual[0][2]': '5'
            }
          },
          {
            lines: [8, 9],
            title: 'DFS base case: sink reached',
            description: 'When DFS reaches the sink, return the minimum flow (bottleneck) along the augmenting path found.',
            variables: {
              'node': '3',
              'target': '3',
              'min_flow': '4'
            }
          },
          {
            lines: [11],
            title: 'Mark node as visited',
            description: 'Mark current node as visited to avoid revisiting it in the current DFS search.',
            variables: {
              'node': '0',
              'visited[0]': 'True'
            }
          },
          {
            lines: [13, 14, 15, 16],
            title: 'Find augmenting path edge',
            description: 'Try each unvisited neighbor with positive residual capacity. Calculate flow as minimum of current path flow and edge capacity.',
            variables: {
              'next_node': '2',
              'residual[node][next_node]': '7',
              'min_flow': 'inf'
            }
          },
          {
            lines: [18, 19, 20, 21],
            title: 'Update residual capacities',
            description: 'When augmenting path found, decrease forward edge capacity and increase backward edge (for flow reversal). Return the flow amount.',
            variables: {
              'flow': '4',
              'residual[node][next_node]': '3',
              'residual[next_node][node]': '4'
            }
          },
          {
            lines: [27, 28, 29],
            title: 'Find augmenting path',
            description: 'Search for augmenting path from source to sink using DFS. Start with infinite flow capacity and find bottleneck edge.',
            variables: {
              'flow': '4',
              'visited': '[True, True, False, True]'
            }
          },
          {
            lines: [31, 32, 33],
            title: 'Check termination condition',
            description: 'When no augmenting path with positive flow can be found (flow = 0), maximum flow is reached. Exit loop and return result.',
            variables: {
              'flow': '0',
              'break': 'True'
            }
          },
          {
            lines: [35],
            title: 'Return maximum flow',
            description: 'Return the accumulated maximum flow from source to sink after all augmenting paths have been found.',
            variables: {
              'max_flow': '23'
            }
          }
        ]
      }
    ],
    keyInsights: [
      'Uses residual graph to track remaining capacity',
      'Augmenting path found via DFS or BFS',
      'Max-flow equals min-cut by max-flow min-cut theorem',
      'Edmonds-Karp (BFS variant) has better time complexity'
    ],
    whenToUse: [
      'Network capacity optimization',
      'Bipartite matching problems',
      'Resource allocation with constraints'
    ]
  },
  {
    id: 'GRA_014',
    name: 'Minimum Spanning Tree',
    category: 'Graphs',
    difficulty: 'Medium',
    timeComplexity: 'O(E log V)',
    spaceComplexity: 'O(V)',
    complexityScore: 0.6,
    icon: 'polyline',
    description: 'Finds a subset of edges that connects all vertices with minimum total weight using Kruskal\'s or Prim\'s algorithm.',
    longDescription: 'A Minimum Spanning Tree (MST) is a subset of edges in a connected, weighted, undirected graph that connects all vertices with the minimum possible total edge weight, without forming cycles. Two main algorithms solve this problem: Kruskal\'s algorithm (edge-based, using Union-Find) and Prim\'s algorithm (vertex-based, using priority queue). The MST is not necessarily unique, but all MSTs of a graph have the same total weight. MST algorithms are fundamental in network design, clustering, approximation algorithms, and have applications in circuit design, telecommunications, and image segmentation.',
    tags: ['mst', 'spanning-tree', 'greedy', 'optimization'],
    leetcodeProblems: [
      'Min Cost to Connect All Points',
      'Connecting Cities With Minimum Cost',
      'Find Critical and Pseudo-Critical Edges in MST'
    ],
    codeExamples: [
      {
        language: 'typescript',
        code: `// Generic MST interface combining both algorithms
interface Edge {
  u: number;
  v: number;
  weight: number;
}

function minimumSpanningTree(n: number, edges: Edge[]): number {
  // Using Kruskal's algorithm
  edges.sort((a, b) => a.weight - b.weight);

  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);

  function find(x: number): number {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  }

  function union(x: number, y: number): boolean {
    const rootX = find(x);
    const rootY = find(y);

    if (rootX === rootY) return false;

    if (rank[rootX] < rank[rootY]) {
      parent[rootX] = rootY;
    } else if (rank[rootX] > rank[rootY]) {
      parent[rootY] = rootX;
    } else {
      parent[rootY] = rootX;
      rank[rootX]++;
    }
    return true;
  }

  let mstWeight = 0;
  let edgeCount = 0;

  for (const edge of edges) {
    if (union(edge.u, edge.v)) {
      mstWeight += edge.weight;
      edgeCount++;
      if (edgeCount === n - 1) break;
    }
  }

  return mstWeight;
}

// --- Example ---
const mstEdges: Edge[] = [
  { u: 0, v: 1, weight: 10 },
  { u: 0, v: 2, weight: 6 },
  { u: 0, v: 3, weight: 5 },
  { u: 1, v: 3, weight: 15 },
  { u: 2, v: 3, weight: 4 }
];
const totalMstWeight = minimumSpanningTree(4, mstEdges);  // → 19
`,
        steps: [
          {
            lines: [10],
            title: 'Sort edges by weight',
            description: 'Sort all edges in ascending order by weight. Greedy approach: consider lightest edges first to minimize total MST weight.',
            variables: {
              'edges': '[{u:0,v:1,w:1}, {u:1,v:2,w:3}, {u:0,v:2,w:4}]'
            }
          },
          {
            lines: [12, 13],
            title: 'Initialize Union-Find',
            description: 'Create parent array where each vertex is its own parent and rank array for union by rank optimization.',
            variables: {
              'parent': '[0, 1, 2, 3, 4]',
              'rank': '[0, 0, 0, 0, 0]'
            }
          },
          {
            lines: [15, 16, 17, 18, 19],
            title: 'Find with path compression',
            description: 'Find operation returns root of the set containing x. Path compression flattens tree for O(α(n)) amortized time.',
            variables: {
              'x': '3',
              'parent[3]': '1',
              'root': '0'
            }
          },
          {
            lines: [22, 23, 24, 25, 26],
            title: 'Check if edge creates cycle',
            description: 'Union finds roots of both vertices. If roots are same, vertices already connected - adding edge would create cycle.',
            variables: {
              'rootX': '0',
              'rootY': '0',
              'cycle': 'true'
            }
          },
          {
            lines: [28, 29, 30, 31, 32, 33, 34, 35],
            title: 'Union by rank',
            description: 'If no cycle, merge sets by attaching smaller rank tree under larger rank tree. Increment rank if equal to maintain balance.',
            variables: {
              'rank[rootX]': '2',
              'rank[rootY]': '1',
              'parent[rootY]': 'rootX'
            }
          },
          {
            lines: [43, 44, 45, 46, 47],
            title: 'Add edge to MST if no cycle',
            description: 'If union succeeds (no cycle), add edge weight to MST total and increment edge count. Stop when MST has n-1 edges.',
            variables: {
              'mstWeight': '15',
              'edgeCount': '3',
              'n - 1': '4'
            }
          },
          {
            lines: [50],
            title: 'Return MST weight',
            description: 'Return total weight of minimum spanning tree. MST connects all n vertices with exactly n-1 edges of minimum total weight.',
            variables: {
              'mstWeight': '23'
            }
          }
        ]
      },
      {
        language: 'python',
        code: `from typing import List, Tuple

def minimum_spanning_tree(n: int, edges: List[Tuple[int, int, int]]) -> int:
    # Using Kruskal's algorithm
    edges.sort(key=lambda x: x[2])

    parent = list(range(n))
    rank = [0] * n

    def find(x: int) -> int:
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x: int, y: int) -> bool:
        root_x, root_y = find(x), find(y)

        if root_x == root_y:
            return False

        if rank[root_x] < rank[root_y]:
            parent[root_x] = root_y
        elif rank[root_x] > rank[root_y]:
            parent[root_y] = root_x
        else:
            parent[root_y] = root_x
            rank[root_x] += 1
        return True

    mst_weight = 0
    edge_count = 0

    for u, v, weight in edges:
        if union(u, v):
            mst_weight += weight
            edge_count += 1
            if edge_count == n - 1:
                break

    return mst_weight

# --- Example ---
mst_edges = [
    (0, 1, 10),
    (0, 2, 6),
    (0, 3, 5),
    (1, 3, 15),
    (2, 3, 4)
]
total_mst_weight = minimum_spanning_tree(4, mst_edges)  # -> 19
`,
        steps: [
          {
            lines: [1, 3, 4, 5],
            title: "Setup: imports and sorting edges",
            description: "Import type hints and define the function. Sort all edges by weight in ascending order — this greedy ordering ensures we always consider the cheapest edge first (Kruskal's algorithm)."
          },
          {
            lines: [7, 8],
            title: "Initialize Union-Find",
            description: "Create the Union-Find (Disjoint Set Union) data structure. Each vertex starts as its own parent (self-loop), and all ranks start at 0. This tracks which vertices are connected."
          },
          {
            lines: [10, 11, 12, 13],
            title: "Find with path compression",
            description: "The find function locates the root representative of a vertex's set. Path compression flattens the tree by pointing each visited node directly to the root, achieving near O(1) amortized time."
          },
          {
            lines: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
            title: "Union by rank",
            description: "The union function merges two sets. If they share the same root, they're already connected (return False — adding this edge would create a cycle). Otherwise, attach the shorter tree under the taller one to keep the structure balanced."
          },
          {
            lines: [30, 31, 33, 34, 35, 36, 37, 38],
            title: "Build MST greedily",
            description: "Iterate through sorted edges. For each edge, attempt to union its endpoints. If union succeeds, the edge connects two previously disconnected components — add its weight to the MST. Stop early once we have n-1 edges (a spanning tree)."
          },
          {
            lines: [40],
            title: "Return MST weight",
            description: "Return the total weight of the minimum spanning tree. The MST connects all n vertices using exactly n-1 edges with the minimum possible total weight."
          }
        ]
      }
    ],
    keyInsights: [
      'Connects all vertices with minimum total edge weight',
      'Greedy approach: always select minimum weight edge that doesn\'t form cycle',
      'MST has exactly V-1 edges for V vertices',
      'Not necessarily unique, but total weight is'
    ],
    whenToUse: [
      'Network design with minimum cost',
      'Clustering algorithms',
      'Approximation for NP-hard problems like TSP'
    ]
  }
];
