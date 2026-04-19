import type { Algorithm } from '../types/algorithm';

export const techniqueAlgorithms: Algorithm[] = [
  // GREEDY ALGORITHMS
  {
    id: 'GRE_001',
    name: 'Activity Selection',
    category: 'Greedy',
    difficulty: 'Medium',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    description: 'Select the maximum number of non-overlapping activities from a set of activities with start and finish times.',
    longDescription: 'The Activity Selection problem is a classic greedy algorithm that selects the maximum number of activities that can be performed by a single person, assuming that a person can only work on a single activity at a time. The greedy choice is to always pick the activity that finishes first, which leaves the most room for remaining activities. This approach guarantees an optimal solution by sorting activities by finish time and iteratively selecting non-overlapping activities. The algorithm demonstrates the power of greedy strategies in scheduling and interval optimization problems.',
    icon: 'event',
    complexityScore: 0.5,
    tags: ['greedy', 'intervals', 'scheduling', 'sorting', 'optimization'],
    leetcodeProblems: ['Non-overlapping Intervals', 'Meeting Rooms', 'Minimum Number of Arrows to Burst Balloons'],
    codeExamples: [
      {
        language: 'typescript',
        code: `interface Activity {
  start: number;
  finish: number;
}

function activitySelection(activities: Activity[]): Activity[] {
  // Sort by finish time
  activities.sort((a, b) => a.finish - b.finish);

  const selected: Activity[] = [];
  let lastFinish = -Infinity;

  for (const activity of activities) {
    if (activity.start >= lastFinish) {
      selected.push(activity);
      lastFinish = activity.finish;
    }
  }

  return selected;
}

// --- Example ---
const activities: Activity[] = [{start: 1, finish: 3}, {start: 2, finish: 5}, {start: 4, finish: 7}, {start: 1, finish: 8}, {start: 5, finish: 9}];
const result = activitySelection(activities);  // → [{start: 1, finish: 3}, {start: 4, finish: 7}, {start: 5, finish: 9}]`,
        steps: [
          {
            lines: [1, 2, 3, 4],
            title: 'Define Activity Interface',
            description: 'Define the Activity type with start and finish times to represent each activity interval.',
            variables: {}
          },
          {
            lines: [6, 7, 8],
            title: 'Sort by Finish Time',
            description: 'Sort activities by their finish time in ascending order. This greedy choice ensures we select activities that end earliest, leaving maximum room for future activities.',
            variables: { 'activities': 'sorted array' }
          },
          {
            lines: [10, 11],
            title: 'Initialize Tracking Variables',
            description: 'Create an empty array to store selected activities and set lastFinish to negative infinity to ensure the first activity can always be selected.',
            variables: { 'selected': '[]', 'lastFinish': '-Infinity' }
          },
          {
            lines: [13, 14],
            title: 'Check Activity Compatibility',
            description: 'For each activity, check if its start time is greater than or equal to the last selected activity\'s finish time, ensuring no overlap.',
            variables: {}
          },
          {
            lines: [15, 16],
            title: 'Select Compatible Activity',
            description: 'If the activity is compatible (non-overlapping), add it to the selected list and update lastFinish to this activity\'s finish time.',
            variables: { 'selected': 'updated array', 'lastFinish': 'current finish time' }
          },
          {
            lines: [20],
            title: 'Return Result',
            description: 'Return the array of selected non-overlapping activities that maximizes the total number of activities.',
            variables: { 'selected': 'maximum set of activities' }
          }
        ]
      },
      {
        language: 'python',
        code: `def activity_selection(activities):
    """Select maximum number of non-overlapping activities"""
    # Sort by finish time
    activities.sort(key=lambda x: x[1])

    selected = []
    last_finish = float('-inf')

    for start, finish in activities:
        if start >= last_finish:
            selected.append((start, finish))
            last_finish = finish

    return selected

# --- Example ---
activities = [(1, 3), (2, 5), (4, 7), (1, 8), (5, 9)]
result = activity_selection(activities)  # -> [(1, 3), (4, 7), (5, 9)]`,
        steps: [
          {
            lines: [1, 2, 3, 4],
            title: 'Sort by Finish Time',
            description: 'Sort activities by their finish time using a lambda function. This greedy choice ensures we always consider activities that end earliest first.',
            variables: { 'activities': 'sorted by finish time' }
          },
          {
            lines: [6, 7],
            title: 'Initialize Tracking Variables',
            description: 'Create an empty list for selected activities and set last_finish to negative infinity so the first activity can always be selected.',
            variables: { 'selected': '[]', 'last_finish': '-inf' }
          },
          {
            lines: [9, 10],
            title: 'Check Activity Compatibility',
            description: 'For each activity, check if its start time is greater than or equal to the last selected activity\'s finish time to ensure no overlap.',
            variables: { 'start': 'activity start', 'finish': 'activity finish' }
          },
          {
            lines: [11, 12],
            title: 'Select Compatible Activity',
            description: 'If the activity is compatible, add it to the selected list and update last_finish to this activity\'s finish time.',
            variables: { 'selected': 'activity added', 'last_finish': 'current finish' }
          },
          {
            lines: [14],
            title: 'Return Result',
            description: 'Return the list of selected non-overlapping activities that maximizes the total number of activities.',
            variables: { 'selected': 'maximum set of activities' }
          }
        ]
      }
    ],
    keyInsights: [
      'Always select the activity with the earliest finish time to maximize remaining opportunities',
      'Sorting by finish time is crucial for the greedy approach to work correctly',
      'Once an activity is selected, all overlapping activities are automatically excluded',
      'This greedy strategy provides an optimal solution without needing dynamic programming'
    ],
    whenToUse: [
      'When you need to maximize the number of non-overlapping intervals or events',
      'In scheduling problems where activities cannot overlap',
      'When a greedy choice (earliest finish) leads to global optimum'
    ]
  },
  {
    id: 'GRE_002',
    name: 'Huffman Coding',
    category: 'Greedy',
    difficulty: 'Advanced',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    description: 'Build an optimal prefix-free binary code for data compression using character frequencies.',
    longDescription: 'Huffman Coding is a lossless data compression algorithm that assigns variable-length codes to characters based on their frequency of occurrence. Characters that appear more frequently receive shorter codes, while less frequent characters get longer codes. The algorithm builds a binary tree from the bottom up by repeatedly combining the two nodes with the smallest frequencies. The resulting Huffman tree provides an optimal prefix-free code, meaning no code is a prefix of another, which allows for unambiguous decoding. This greedy approach minimizes the average code length and is widely used in file compression formats like ZIP and JPEG.',
    icon: 'compress',
    complexityScore: 0.75,
    tags: ['greedy', 'compression', 'trees', 'priority-queue', 'encoding'],
    leetcodeProblems: ['Minimum Cost to Connect Sticks', 'Encode and Decode Strings'],
    codeExamples: [
      {
        language: 'typescript',
        code: `class HuffmanNode {
  char: string;
  freq: number;
  left: HuffmanNode | null = null;
  right: HuffmanNode | null = null;
}

function huffmanCoding(text: string): Map<string, string> {
  const freqMap = new Map<string, number>();
  for (const char of text) {
    freqMap.set(char, (freqMap.get(char) || 0) + 1);
  }

  const heap: HuffmanNode[] = [];
  for (const [char, freq] of freqMap) {
    heap.push({ char, freq, left: null, right: null });
  }

  while (heap.length > 1) {
    heap.sort((a, b) => a.freq - b.freq);
    const left = heap.shift()!;
    const right = heap.shift()!;
    const parent: HuffmanNode = {
      char: '',
      freq: left.freq + right.freq,
      left,
      right
    };
    heap.push(parent);
  }

  const codes = new Map<string, string>();
  const buildCodes = (node: HuffmanNode | null, code: string) => {
    if (!node) return;
    if (node.char) codes.set(node.char, code);
    buildCodes(node.left, code + '0');
    buildCodes(node.right, code + '1');
  };
  buildCodes(heap[0], '');
  return codes;
}

// --- Example ---
const text = 'aabbbcccc';
const codes = huffmanCoding(text);  // → Map{'c' => '0', 'b' => '10', 'a' => '11'}`,
        steps: [
          {
            lines: [1, 2, 3, 4, 5, 6],
            title: 'Define Huffman Node',
            description: 'Create a node class to represent characters with their frequencies and left/right children for building the Huffman tree.',
            variables: {}
          },
          {
            lines: [9, 10, 11, 12],
            title: 'Calculate Character Frequencies',
            description: 'Count the frequency of each character in the input text using a hash map. These frequencies determine the priority of characters in the encoding.',
            variables: { 'freqMap': 'character frequencies' }
          },
          {
            lines: [14, 15, 16, 17],
            title: 'Create Leaf Nodes',
            description: 'Convert each character and its frequency into a leaf node and add to the heap. Each leaf represents a single character in the Huffman tree.',
            variables: { 'heap': 'array of leaf nodes' }
          },
          {
            lines: [19, 20, 21, 22],
            title: 'Extract Two Minimum Nodes',
            description: 'Sort the heap by frequency and extract the two nodes with the lowest frequencies. This greedy choice minimizes the total code length.',
            variables: { 'left': 'min node', 'right': 'second min node' }
          },
          {
            lines: [23, 24, 25, 26, 27, 28, 29],
            title: 'Merge Nodes',
            description: 'Create a parent node with frequency equal to the sum of its children. Add the parent back to the heap. Repeat until only one node (the root) remains.',
            variables: { 'parent.freq': 'left.freq + right.freq' }
          },
          {
            lines: [31, 32, 33, 34, 35, 36, 37],
            title: 'Build Huffman Codes',
            description: 'Traverse the tree recursively. For leaf nodes, store the path as the code (0 for left, 1 for right). This generates optimal prefix-free codes.',
            variables: { 'codes': 'character to binary code mapping' }
          },
          {
            lines: [38, 39],
            title: 'Return Code Map',
            description: 'Return the complete mapping of characters to their Huffman codes, where more frequent characters have shorter codes.',
            variables: { 'codes': 'optimized encoding map' }
          }
        ]
      },
      {
        language: 'python',
        code: `import heapq
from collections import defaultdict

class HuffmanNode:
    def __init__(self, char, freq):
        self.char = char
        self.freq = freq
        self.left = None
        self.right = None

    def __lt__(self, other):
        return self.freq < other.freq

def huffman_coding(text):
    """Build Huffman codes for text compression"""
    freq_map = defaultdict(int)
    for char in text:
        freq_map[char] += 1

    heap = [HuffmanNode(char, freq) for char, freq in freq_map.items()]
    heapq.heapify(heap)

    while len(heap) > 1:
        left = heapq.heappop(heap)
        right = heapq.heappop(heap)
        parent = HuffmanNode('', left.freq + right.freq)
        parent.left, parent.right = left, right
        heapq.heappush(heap, parent)

    codes = {}
    def build_codes(node, code=''):
        if node.char:
            codes[node.char] = code
            return
        if node.left:
            build_codes(node.left, code + '0')
        if node.right:
            build_codes(node.right, code + '1')

    build_codes(heap[0])
    return codes

# --- Example ---
text = 'aabbbcccc'
codes = huffman_coding(text)  # -> {'c': '0', 'b': '10', 'a': '11'}`,
        steps: [
          {
            lines: [4, 5, 6, 7, 8, 9, 10, 11, 12],
            title: 'Define Huffman Node Class',
            description: 'Create a node class with character, frequency, and child pointers. The __lt__ method enables heap comparison based on frequency.',
            variables: {}
          },
          {
            lines: [16, 17, 18],
            title: 'Calculate Character Frequencies',
            description: 'Count the frequency of each character in the input text using a defaultdict. These frequencies determine encoding priorities.',
            variables: { 'freq_map': 'character frequencies' }
          },
          {
            lines: [20, 21],
            title: 'Build Initial Heap',
            description: 'Create leaf nodes for each character with its frequency and build a min-heap. The heap prioritizes nodes with lowest frequencies.',
            variables: { 'heap': 'min-heap of leaf nodes' }
          },
          {
            lines: [23, 24, 25],
            title: 'Extract Two Minimum Nodes',
            description: 'Pop the two nodes with smallest frequencies from the heap. This greedy choice builds the optimal tree bottom-up.',
            variables: { 'left': 'min node', 'right': 'second min node' }
          },
          {
            lines: [26, 27, 28],
            title: 'Merge and Push Parent',
            description: 'Create a parent node with combined frequency, set its children, and push back to heap. Repeat until one node remains (the root).',
            variables: { 'parent.freq': 'left.freq + right.freq' }
          },
          {
            lines: [30, 31, 32, 33, 34, 35, 36, 37, 38],
            title: 'Build Huffman Codes',
            description: 'Traverse the tree recursively, building binary codes. For leaf nodes, store the path as the code (0 for left, 1 for right).',
            variables: { 'codes': 'character to code mapping' }
          },
          {
            lines: [40],
            title: 'Return Code Map',
            description: 'Return the complete mapping where more frequent characters have shorter codes for optimal compression.',
            variables: { 'codes': 'optimized encoding dictionary' }
          }
        ]
      }
    ],
    keyInsights: [
      'Always combine the two nodes with the lowest frequencies to build optimal tree',
      'More frequent characters end up higher in the tree, resulting in shorter codes',
      'The algorithm guarantees a prefix-free code where no code is a prefix of another',
      'Using a priority queue (min-heap) efficiently manages node selection'
    ],
    whenToUse: [
      'When implementing lossless data compression algorithms',
      'When character frequencies vary significantly and variable-length encoding is beneficial',
      'In applications requiring optimal prefix-free codes like file compression or network protocols'
    ]
  },
  {
    id: 'GRE_003',
    name: 'Fractional Knapsack',
    category: 'Greedy',
    difficulty: 'Medium',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    description: 'Maximize the total value in a knapsack by taking fractions of items based on value-to-weight ratio.',
    longDescription: 'The Fractional Knapsack problem allows taking fractions of items to maximize total value within a weight capacity constraint. Unlike the 0/1 Knapsack problem, items can be broken into smaller pieces, making a greedy approach optimal. The strategy is to calculate the value-to-weight ratio for each item, sort items by this ratio in descending order, and greedily select items starting with the highest ratio. If an item cannot fit entirely, take a fraction of it to fill the remaining capacity. This problem demonstrates how greedy algorithms can solve optimization problems when constraints allow flexibility.',
    icon: 'shopping_bag',
    complexityScore: 0.45,
    tags: ['greedy', 'optimization', 'sorting', 'knapsack', 'ratios'],
    leetcodeProblems: ['Maximum Units on a Truck', 'Assign Cookies'],
    codeExamples: [
      {
        language: 'typescript',
        code: `interface Item {
  value: number;
  weight: number;
}

function fractionalKnapsack(items: Item[], capacity: number): number {
  // Calculate value-to-weight ratio and sort
  const ratios = items.map((item, index) => ({
    index,
    ratio: item.value / item.weight,
    ...item
  }));

  ratios.sort((a, b) => b.ratio - a.ratio);

  let totalValue = 0;
  let remainingCapacity = capacity;

  for (const item of ratios) {
    if (remainingCapacity === 0) break;

    const taken = Math.min(item.weight, remainingCapacity);
    totalValue += taken * item.ratio;
    remainingCapacity -= taken;
  }

  return totalValue;
}

// --- Example ---
const items: Item[] = [{value: 60, weight: 10}, {value: 100, weight: 20}, {value: 120, weight: 30}];
const maxValue = fractionalKnapsack(items, 50);  // → 240`,
        steps: [
          {
            lines: [1, 2, 3, 4],
            title: 'Define Item Interface',
            description: 'Define the Item type with value and weight properties to represent each item available for the knapsack.',
            variables: {}
          },
          {
            lines: [7, 8, 9, 10, 11, 12],
            title: 'Calculate Value-to-Weight Ratios',
            description: 'Compute the value-to-weight ratio for each item. This ratio represents the efficiency or "bang for buck" of each item.',
            variables: { 'ratios': 'items with efficiency ratios' }
          },
          {
            lines: [14],
            title: 'Sort by Ratio (Descending)',
            description: 'Sort items by their value-to-weight ratio in descending order. This greedy choice ensures we take the most efficient items first.',
            variables: { 'ratios': 'sorted by efficiency' }
          },
          {
            lines: [16, 17],
            title: 'Initialize Variables',
            description: 'Set totalValue to 0 and remainingCapacity to the knapsack capacity. These track the accumulated value and available space.',
            variables: { 'totalValue': '0', 'remainingCapacity': 'capacity' }
          },
          {
            lines: [19, 20, 21, 22, 23],
            title: 'Take Items Greedily',
            description: 'For each item, take as much as possible (either the full weight or remaining capacity). Add the proportional value to totalValue and reduce remainingCapacity.',
            variables: { 'taken': 'min(weight, remaining)', 'totalValue': 'accumulated value' }
          },
          {
            lines: [26],
            title: 'Return Maximum Value',
            description: 'Return the total maximum value obtained by greedily selecting items based on their value-to-weight ratios.',
            variables: { 'totalValue': 'optimized knapsack value' }
          }
        ]
      },
      {
        language: 'python',
        code: `def fractional_knapsack(items, capacity):
    """Maximize value using fractional items"""
    # Calculate value-to-weight ratios
    ratios = []
    for value, weight in items:
        ratios.append((value / weight, value, weight))

    # Sort by ratio in descending order
    ratios.sort(reverse=True)

    total_value = 0
    remaining_capacity = capacity

    for ratio, value, weight in ratios:
        if remaining_capacity == 0:
            break

        # Take as much as possible
        taken = min(weight, remaining_capacity)
        total_value += taken * ratio
        remaining_capacity -= taken

    return total_value

# --- Example ---
items = [(60, 10), (100, 20), (120, 30)]
result = fractional_knapsack(items, 50)  # -> 240.0`,
        steps: [
          {
            lines: [3, 4, 5, 6],
            title: 'Calculate Value-to-Weight Ratios',
            description: 'Compute the efficiency ratio (value/weight) for each item and store with original value and weight. This ratio determines selection priority.',
            variables: { 'ratios': 'list of (ratio, value, weight) tuples' }
          },
          {
            lines: [8, 9],
            title: 'Sort by Ratio Descending',
            description: 'Sort items by their value-to-weight ratio in descending order. This greedy approach ensures most efficient items are selected first.',
            variables: { 'ratios': 'sorted by efficiency' }
          },
          {
            lines: [11, 12],
            title: 'Initialize Accumulators',
            description: 'Set total_value to 0 and remaining_capacity to the knapsack capacity to track accumulated value and available space.',
            variables: { 'total_value': '0', 'remaining_capacity': 'capacity' }
          },
          {
            lines: [14, 15, 16],
            title: 'Check Capacity Exhausted',
            description: 'For each item, check if knapsack is full. If remaining capacity is 0, stop taking items.',
            variables: { 'remaining_capacity': 'remaining space' }
          },
          {
            lines: [18, 19, 20],
            title: 'Take Fractional Item',
            description: 'Take as much as possible (min of item weight or remaining capacity). Add proportional value and reduce remaining capacity.',
            variables: { 'taken': 'min(weight, remaining)', 'total_value': 'accumulated value' }
          },
          {
            lines: [23],
            title: 'Return Maximum Value',
            description: 'Return the total value obtained by greedily selecting items based on their value-to-weight ratios.',
            variables: { 'total_value': 'optimal knapsack value' }
          }
        ]
      }
    ],
    keyInsights: [
      'Greedy approach works because items can be fractionally divided',
      'Sorting by value-to-weight ratio ensures maximum value per unit weight is prioritized',
      'Taking items with highest efficiency first guarantees optimal solution',
      'This differs from 0/1 Knapsack where greedy approach does not work'
    ],
    whenToUse: [
      'When items can be divided and partial amounts can be taken',
      'In resource allocation problems where fractional allocation is allowed',
      'When optimizing value within weight or capacity constraints with divisible items'
    ]
  },
  {
    id: 'GRE_004',
    name: 'Job Scheduling',
    category: 'Greedy',
    difficulty: 'Medium',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    description: 'Schedule jobs with deadlines and profits to maximize total profit.',
    longDescription: 'Job Scheduling with deadlines is a greedy algorithm that schedules jobs to maximize total profit while respecting individual job deadlines. Each job has a profit and a deadline, and the goal is to complete as many high-profit jobs as possible before their deadlines expire. The greedy strategy sorts jobs by profit in descending order and schedules each job in the latest available time slot before its deadline. This approach uses a time slot tracking mechanism to ensure no two jobs are scheduled at the same time. The algorithm demonstrates how greedy choices based on profit maximization can lead to optimal scheduling solutions.',
    icon: 'schedule',
    complexityScore: 0.5,
    tags: ['greedy', 'scheduling', 'deadlines', 'sorting', 'optimization'],
    leetcodeProblems: ['Job Sequencing Problem', 'Maximum Profit in Job Scheduling', 'Course Schedule III'],
    codeExamples: [
      {
        language: 'typescript',
        code: `interface Job {
  id: string;
  profit: number;
  deadline: number;
}

function jobScheduling(jobs: Job[]): { jobs: Job[], totalProfit: number } {
  // Sort by profit (descending)
  jobs.sort((a, b) => b.profit - a.profit);

  const maxDeadline = Math.max(...jobs.map(j => j.deadline));
  const slots = new Array(maxDeadline).fill(null);
  const scheduled: Job[] = [];
  let totalProfit = 0;

  for (const job of jobs) {
    // Find latest available slot before deadline
    for (let slot = job.deadline - 1; slot >= 0; slot--) {
      if (slots[slot] === null) {
        slots[slot] = job;
        scheduled.push(job);
        totalProfit += job.profit;
        break;
      }
    }
  }

  return { jobs: scheduled, totalProfit };
}

// --- Example ---
const jobs: Job[] = [{id: 'A', profit: 100, deadline: 2}, {id: 'B', profit: 19, deadline: 1}, {id: 'C', profit: 27, deadline: 2}, {id: 'D', profit: 25, deadline: 1}];
const schedule = jobScheduling(jobs);  // → {jobs: [...], totalProfit: 127}`,
        steps: [
          {
            lines: [1, 2, 3, 4, 5],
            title: 'Define Job Interface',
            description: 'Define the Job type with id, profit, and deadline properties to represent each job with its constraints and value.',
            variables: {}
          },
          {
            lines: [8, 9],
            title: 'Sort by Profit (Descending)',
            description: 'Sort jobs by profit in descending order. This greedy strategy prioritizes high-value jobs to maximize total profit.',
            variables: { 'jobs': 'sorted by profit' }
          },
          {
            lines: [11, 12],
            title: 'Initialize Time Slots',
            description: 'Find the maximum deadline and create an array to track which job is assigned to each time slot. Initialize all slots to null.',
            variables: { 'maxDeadline': 'latest deadline', 'slots': 'empty time slots' }
          },
          {
            lines: [13, 14],
            title: 'Initialize Result Variables',
            description: 'Create an array to store scheduled jobs and a counter for total profit accumulated from scheduled jobs.',
            variables: { 'scheduled': '[]', 'totalProfit': '0' }
          },
          {
            lines: [16, 17, 18],
            title: 'Find Latest Available Slot',
            description: 'For each job, search backwards from its deadline to find the latest available time slot. This maximizes flexibility for future jobs.',
            variables: { 'slot': 'deadline - 1 to 0' }
          },
          {
            lines: [19, 20, 21, 22, 23],
            title: 'Schedule Job',
            description: 'If an available slot is found, assign the job to that slot, add it to scheduled jobs, and increase total profit.',
            variables: { 'scheduled': 'updated with job', 'totalProfit': 'accumulated profit' }
          },
          {
            lines: [27],
            title: 'Return Result',
            description: 'Return the array of scheduled jobs and the total profit achieved by the greedy scheduling strategy.',
            variables: { 'totalProfit': 'maximum achievable profit' }
          }
        ]
      },
      {
        language: 'python',
        code: `def job_scheduling(jobs):
    """Schedule jobs to maximize profit within deadlines"""
    # Sort by profit in descending order
    jobs.sort(key=lambda x: x[1], reverse=True)

    # Find maximum deadline
    max_deadline = max(job[2] for job in jobs)

    # Track time slots
    slots = [None] * max_deadline
    scheduled = []
    total_profit = 0

    for job_id, profit, deadline in jobs:
        # Find latest available slot before deadline
        for slot in range(deadline - 1, -1, -1):
            if slots[slot] is None:
                slots[slot] = job_id
                scheduled.append((job_id, profit))
                total_profit += profit
                break

    return scheduled, total_profit

# --- Example ---
jobs = [('A', 100, 2), ('B', 19, 1), ('C', 27, 2), ('D', 25, 1)]
result = job_scheduling(jobs)  # -> ([('A', 100), ('C', 27)], 127)`,
        steps: [
          {
            lines: [3, 4],
            title: 'Sort by Profit Descending',
            description: 'Sort jobs by profit in descending order using a lambda function. This greedy strategy prioritizes high-value jobs.',
            variables: { 'jobs': 'sorted by profit' }
          },
          {
            lines: [6, 7],
            title: 'Find Maximum Deadline',
            description: 'Determine the latest deadline among all jobs to know how many time slots are needed for scheduling.',
            variables: { 'max_deadline': 'highest deadline value' }
          },
          {
            lines: [9, 10, 11, 12],
            title: 'Initialize Tracking Structures',
            description: 'Create slots array to track which job is in each time slot, scheduled list for results, and profit accumulator.',
            variables: { 'slots': 'empty time slots', 'scheduled': '[]', 'total_profit': '0' }
          },
          {
            lines: [14, 15, 16],
            title: 'Find Latest Available Slot',
            description: 'For each job, search backwards from its deadline to find the latest available time slot. This maximizes flexibility for future jobs.',
            variables: { 'slot': 'deadline-1 down to 0' }
          },
          {
            lines: [17, 18, 19, 20, 21],
            title: 'Schedule Job',
            description: 'If an available slot is found, assign the job to that slot, add to scheduled list, and increase total profit. Break after scheduling.',
            variables: { 'slots[slot]': 'job_id', 'scheduled': 'job added', 'total_profit': 'profit added' }
          },
          {
            lines: [23],
            title: 'Return Results',
            description: 'Return the list of scheduled jobs and the maximum total profit achieved through greedy scheduling.',
            variables: { 'scheduled': 'scheduled jobs', 'total_profit': 'maximum profit' }
          }
        ]
      }
    ],
    keyInsights: [
      'Sorting by profit ensures high-value jobs are prioritized for scheduling',
      'Scheduling jobs in latest available slots maximizes flexibility for other jobs',
      'Time slot tracking prevents double-booking and ensures deadline compliance',
      'Greedy selection by profit leads to optimal solution for this problem'
    ],
    whenToUse: [
      'When scheduling tasks with deadlines to maximize total value or profit',
      'In project management where high-priority tasks must be completed first',
      'When each task takes unit time and has a specific deadline constraint'
    ]
  },

  // BACKTRACKING ALGORITHMS
  {
    id: 'BAC_001',
    name: 'N-Queens',
    category: 'Backtracking',
    difficulty: 'Advanced',
    timeComplexity: 'O(n!)',
    spaceComplexity: 'O(n²)',
    description: 'Place N queens on an N×N chessboard so that no two queens threaten each other.',
    longDescription: 'The N-Queens problem is a classic backtracking puzzle where N chess queens must be placed on an N×N board such that no two queens can attack each other. Queens can attack along rows, columns, and diagonals, making valid placement challenging. The backtracking algorithm tries placing queens row by row, checking if each placement is safe before proceeding. If a conflict is detected, the algorithm backtracks and tries a different position. This problem demonstrates the power of backtracking in exploring all possible configurations while pruning invalid paths early. The solution requires careful tracking of occupied columns and diagonals.',
    icon: 'grid_4x4',
    complexityScore: 0.85,
    tags: ['backtracking', 'chess', 'constraint-satisfaction', 'recursion', 'combinatorics'],
    leetcodeProblems: ['N-Queens', 'N-Queens II'],
    codeExamples: [
      {
        language: 'typescript',
        code: `function solveNQueens(n: number): string[][] {
  const solutions: string[][] = [];
  const board: string[] = Array(n).fill('.'.repeat(n));
  const cols = new Set<number>();
  const diag1 = new Set<number>();
  const diag2 = new Set<number>();

  function backtrack(row: number) {
    if (row === n) {
      solutions.push([...board]);
      return;
    }

    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) {
        continue;
      }

      // Place queen
      board[row] = '.'.repeat(col) + 'Q' + '.'.repeat(n - col - 1);
      cols.add(col);
      diag1.add(row - col);
      diag2.add(row + col);

      backtrack(row + 1);

      // Remove queen (backtrack)
      cols.delete(col);
      diag1.delete(row - col);
      diag2.delete(row + col);
    }
  }

  backtrack(0);
  return solutions;
}

// --- Example ---
const n = 4;
const allSolutions = solveNQueens(n);  // → [[".Q..", "...Q", "Q...", "..Q."], ["..Q.", "Q...", "...Q", ".Q.."]]`,
        steps: [
          {
            lines: [1, 2, 3],
            title: 'Initialize Data Structures',
            description: 'Create solutions array to store all valid board configurations and initialize board with empty rows. Each row will be modified as queens are placed.',
            variables: { 'solutions': '[]', 'board': 'n empty rows' }
          },
          {
            lines: [4, 5, 6],
            title: 'Track Attack Positions',
            description: 'Use three sets to track occupied columns and diagonals. diag1 uses row-col for main diagonals, diag2 uses row+col for anti-diagonals.',
            variables: { 'cols': 'Set()', 'diag1': 'Set()', 'diag2': 'Set()' }
          },
          {
            lines: [9, 10, 11, 12],
            title: 'Check Complete Solution',
            description: 'Base case: if all n rows have queens placed, we found a valid solution. Add a copy of the current board configuration to solutions.',
            variables: { 'row': 'n', 'solutions': 'updated with board' }
          },
          {
            lines: [14, 15, 16, 17],
            title: 'Check Queen Safety',
            description: 'For each column in the current row, check if placing a queen would conflict with existing queens by checking column and diagonal sets.',
            variables: { 'col': '0 to n-1' }
          },
          {
            lines: [19, 20, 21, 22],
            title: 'Place Queen',
            description: 'Place queen at current row and column. Update the board string and mark the column and both diagonals as occupied in the tracking sets.',
            variables: { 'board[row]': 'row with Q', 'cols': 'col added', 'diag1': 'row-col added', 'diag2': 'row+col added' }
          },
          {
            lines: [24],
            title: 'Recurse to Next Row',
            description: 'Recursively try to place a queen in the next row. The algorithm explores all possibilities from this state.',
            variables: { 'row': 'row + 1' }
          },
          {
            lines: [26, 27, 28, 29],
            title: 'Backtrack',
            description: 'Remove the queen and undo all changes to restore the previous state. This allows exploring alternative placements.',
            variables: { 'cols': 'col removed', 'diag1': 'row-col removed', 'diag2': 'row+col removed' }
          },
          {
            lines: [32, 33],
            title: 'Start Backtracking',
            description: 'Begin the backtracking process from row 0 and return all found solutions.',
            variables: { 'solutions': 'all valid N-Queens configurations' }
          }
        ]
      },
      {
        language: 'python',
        code: `def solve_n_queens(n):
    """Find all solutions to N-Queens problem"""
    solutions = []
    board = []
    cols = set()
    diag1 = set()  # row - col
    diag2 = set()  # row + col

    def backtrack(row):
        if row == n:
            solutions.append([''.join(row) for row in board])
            return

        for col in range(n):
            if col in cols or (row - col) in diag1 or (row + col) in diag2:
                continue

            # Place queen
            board.append('.' * col + 'Q' + '.' * (n - col - 1))
            cols.add(col)
            diag1.add(row - col)
            diag2.add(row + col)

            backtrack(row + 1)

            # Remove queen (backtrack)
            board.pop()
            cols.remove(col)
            diag1.remove(row - col)
            diag2.remove(row + col)

    backtrack(0)
    return solutions

# --- Example ---
n = 4
all_solutions = solve_n_queens(n)  # -> [['.Q..', '...Q', 'Q...', '..Q.'], ['..Q.', 'Q...', '...Q', '.Q..']]`,
        steps: [
          {
            lines: [3, 4, 5, 6, 7],
            title: 'Initialize Data Structures',
            description: 'Create solutions list, board list for row strings, and sets to track occupied columns and diagonals (row-col and row+col).',
            variables: { 'solutions': '[]', 'board': '[]', 'cols': 'set()', 'diag1': 'set()', 'diag2': 'set()' }
          },
          {
            lines: [10, 11, 12],
            title: 'Check Complete Solution',
            description: 'Base case: if all n rows have queens placed, we found a valid solution. Add the current board configuration to solutions.',
            variables: { 'row': 'n', 'solutions': 'board added' }
          },
          {
            lines: [14, 15, 16],
            title: 'Check Queen Safety',
            description: 'For each column in current row, check if placing a queen conflicts with existing queens using column and diagonal sets.',
            variables: { 'col': '0 to n-1' }
          },
          {
            lines: [18, 19, 20, 21, 22],
            title: 'Place Queen',
            description: 'Place queen by creating a row string with Q at the column position. Mark column and both diagonals as occupied.',
            variables: { 'board': 'row added', 'cols': 'col added', 'diag1': 'row-col added', 'diag2': 'row+col added' }
          },
          {
            lines: [24],
            title: 'Recurse to Next Row',
            description: 'Recursively try to place a queen in the next row. Explore all possibilities from this state.',
            variables: { 'row': 'row + 1' }
          },
          {
            lines: [26, 27, 28, 29, 30],
            title: 'Backtrack',
            description: 'Remove the queen and undo all changes to restore previous state. This allows exploring alternative placements.',
            variables: { 'board': 'row removed', 'cols': 'col removed', 'diag1': 'row-col removed', 'diag2': 'row+col removed' }
          },
          {
            lines: [32, 33],
            title: 'Return All Solutions',
            description: 'Start backtracking from row 0 and return all valid N-Queens configurations found.',
            variables: { 'solutions': 'all valid board configurations' }
          }
        ]
      }
    ],
    keyInsights: [
      'Track columns and diagonals using sets for O(1) conflict detection',
      'Diagonals can be identified by row-col (main diagonal) and row+col (anti-diagonal)',
      'Placing queens row by row reduces search space significantly',
      'Backtracking prunes invalid paths early, avoiding unnecessary exploration'
    ],
    whenToUse: [
      'When solving constraint satisfaction problems with multiple constraints',
      'In combinatorial problems requiring exhaustive search with pruning',
      'When you need to find all valid configurations of a placement problem'
    ]
  },
  {
    id: 'BAC_002',
    name: 'Sudoku Solver',
    category: 'Backtracking',
    difficulty: 'Advanced',
    timeComplexity: 'O(9^m)',
    spaceComplexity: 'O(m)',
    description: 'Fill a 9×9 Sudoku grid following the rules: each row, column, and 3×3 box contains digits 1-9 exactly once.',
    longDescription: 'The Sudoku Solver uses backtracking to fill a partially completed 9×9 grid with digits 1-9 while satisfying all Sudoku constraints. Each row, column, and 3×3 sub-grid must contain all digits from 1 to 9 without repetition. The algorithm finds empty cells and tries placing digits 1-9, checking validity after each placement. If a digit leads to a valid state, the algorithm recursively continues; otherwise, it backtracks and tries the next digit. This problem showcases backtracking\'s ability to solve complex constraint satisfaction problems by systematically exploring possibilities and backtracking when constraints are violated.',
    icon: 'grid_3x3',
    complexityScore: 0.9,
    tags: ['backtracking', 'constraint-satisfaction', 'puzzle', 'recursion', 'grid'],
    leetcodeProblems: ['Sudoku Solver', 'Valid Sudoku'],
    codeExamples: [
      {
        language: 'typescript',
        code: `function solveSudoku(board: string[][]): boolean {
  function isValid(row: number, col: number, num: string): boolean {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (board[x][col] === num) return false;
    }

    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) return false;
      }
    }

    return true;
  }

  function solve(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === '.') {
          for (let num = 1; num <= 9; num++) {
            const numStr = num.toString();
            if (isValid(row, col, numStr)) {
              board[row][col] = numStr;

              if (solve()) return true;

              board[row][col] = '.';  // Backtrack
            }
          }
          return false;  // No valid number found
        }
      }
    }
    return true;  // All cells filled
  }

  return solve();
}

// --- Example ---
const sudokuBoard: string[][] = [['5','3','.','.','7','.','.','.','.'],['6','.','.','1','9','5','.','.','.'],['.','9','8','.','.','.','.','6','.'],['8','.','.','.','6','.','.','.','3'],['4','.','.','8','.','3','.','.','1'],['7','.','.','.','2','.','.','.','6'],['.','6','.','.','.','.','2','8','.'],['.','.','.','4','1','9','.','.','5'],['.','.','.','.','8','.','.','7','9']];
const solved = solveSudoku(sudokuBoard);  // → true`,
        steps: [
          {
            lines: [2, 3, 4, 5, 6],
            title: 'Validate Row',
            description: 'Check if the number already exists in the current row. If found, the placement is invalid.',
            variables: { 'num': 'candidate number' }
          },
          {
            lines: [8, 9, 10, 11],
            title: 'Validate Column',
            description: 'Check if the number already exists in the current column. This ensures column-wise uniqueness.',
            variables: {}
          },
          {
            lines: [13, 14, 15, 16, 17, 18, 19, 20],
            title: 'Validate 3x3 Box',
            description: 'Calculate the starting position of the 3x3 box and check if the number exists within it. All three constraints must be satisfied.',
            variables: { 'startRow': 'box row start', 'startCol': 'box col start' }
          },
          {
            lines: [25, 26, 27],
            title: 'Find Empty Cell',
            description: 'Scan the board row by row to find the next empty cell (marked with "." ). This is where we\'ll try placing a number.',
            variables: { 'row': '0-8', 'col': '0-8' }
          },
          {
            lines: [28, 29, 30, 31],
            title: 'Try Number Placement',
            description: 'For each empty cell, try placing digits 1-9. Use isValid to check if the placement satisfies all Sudoku constraints.',
            variables: { 'num': '1 to 9', 'numStr': 'string digit' }
          },
          {
            lines: [32, 33],
            title: 'Recurse',
            description: 'If placement is valid, recursively solve the rest of the board. If recursion succeeds, we found a complete solution.',
            variables: { 'board[row][col]': 'numStr' }
          },
          {
            lines: [35],
            title: 'Backtrack',
            description: 'If recursion fails, reset the cell to empty and try the next number. This is the backtracking step.',
            variables: { 'board[row][col]': '.' }
          },
          {
            lines: [41, 44],
            title: 'Return Solution',
            description: 'If all cells are filled, return true (solved). If no valid number works for a cell, return false (need to backtrack).',
            variables: { 'board': 'completely filled or needs backtracking' }
          }
        ]
      },
      {
        language: 'python',
        code: `def solve_sudoku(board):
    """Solve Sudoku puzzle using backtracking"""
    def is_valid(row, col, num):
        # Check row
        if num in board[row]:
            return False

        # Check column
        if num in [board[i][col] for i in range(9)]:
            return False

        # Check 3x3 box
        start_row, start_col = 3 * (row // 3), 3 * (col // 3)
        for i in range(start_row, start_row + 3):
            for j in range(start_col, start_col + 3):
                if board[i][j] == num:
                    return False

        return True

    def solve():
        for row in range(9):
            for col in range(9):
                if board[row][col] == '.':
                    for num in '123456789':
                        if is_valid(row, col, num):
                            board[row][col] = num

                            if solve():
                                return True

                            board[row][col] = '.'  # Backtrack

                    return False  # No valid number found
        return True  # All cells filled

    return solve()

# --- Example ---
board = [['5','3','.','.','7','.','.','.','.'],['6','.','.','1','9','5','.','.','.'],['.','9','8','.','.','.','.','6','.'],['8','.','.','.','6','.','.','.','3'],['4','.','.','8','.','3','.','.','1'],['7','.','.','.','2','.','.','.','6'],['.','6','.','.','.','.','2','8','.'],['.','.','.','4','1','9','.','.','5'],['.','.','.','.','8','.','.','7','9']]
solved = solve_sudoku(board)  # -> True`,
        steps: [
          {
            lines: [4, 5, 6],
            title: 'Validate Row',
            description: 'Check if the number already exists in the current row. If found, the placement violates Sudoku rules.',
            variables: { 'num': 'candidate number' }
          },
          {
            lines: [8, 9, 10],
            title: 'Validate Column',
            description: 'Check if the number exists in the current column using list comprehension. Ensures column-wise uniqueness.',
            variables: {}
          },
          {
            lines: [12, 13, 14, 15, 16, 17],
            title: 'Validate 3x3 Box',
            description: 'Calculate the starting position of the 3x3 box and check if the number exists within it. All three constraints must pass.',
            variables: { 'start_row': 'box row start', 'start_col': 'box col start' }
          },
          {
            lines: [22, 23, 24],
            title: 'Find Empty Cell',
            description: 'Scan the board row by row to find the next empty cell (marked with "."). This is where we\'ll attempt to place a number.',
            variables: { 'row': '0-8', 'col': '0-8' }
          },
          {
            lines: [25, 26, 27],
            title: 'Try Number Placement',
            description: 'For each empty cell, try placing digits 1-9. Use is_valid to check if placement satisfies all Sudoku constraints.',
            variables: { 'num': '1 to 9 as string' }
          },
          {
            lines: [29, 30],
            title: 'Recurse',
            description: 'If placement is valid, recursively solve the rest of the board. If recursion returns True, we found a complete solution.',
            variables: { 'board[row][col]': 'num' }
          },
          {
            lines: [32],
            title: 'Backtrack',
            description: 'If recursion fails, reset the cell to empty and try the next number. This is the backtracking step.',
            variables: { 'board[row][col]': '.' }
          },
          {
            lines: [34, 35],
            title: 'Return Solution Status',
            description: 'Return False if no valid number works for a cell (need to backtrack). Return True if all cells are filled (solved).',
            variables: { 'board': 'solved or needs backtracking' }
          }
        ]
      }
    ],
    keyInsights: [
      'Validate each placement against row, column, and 3×3 box constraints',
      'Try digits 1-9 for each empty cell and backtrack when constraints are violated',
      'Early validation prevents unnecessary deep recursion into invalid states',
      'The algorithm explores possibilities systematically until a solution is found'
    ],
    whenToUse: [
      'When solving Sudoku puzzles or similar constraint-based grid problems',
      'In applications requiring systematic exploration of valid configurations',
      'When multiple constraints must be satisfied simultaneously in a search problem'
    ]
  },
  {
    id: 'BAC_003',
    name: 'Permutations Generator',
    category: 'Backtracking',
    difficulty: 'Medium',
    timeComplexity: 'O(n!)',
    spaceComplexity: 'O(n)',
    description: 'Generate all possible permutations of a collection of distinct elements.',
    longDescription: 'The Permutations Generator uses backtracking to create all possible arrangements of a set of distinct elements. The algorithm builds permutations incrementally by choosing one element at a time and recursively generating permutations of the remaining elements. When all elements are used, a complete permutation is found and added to the result. The algorithm then backtracks, removes the last added element, and tries the next possibility. This approach systematically explores all n! permutations where n is the number of elements. It demonstrates how backtracking can efficiently generate all combinations through recursive exploration and state restoration.',
    icon: 'sync',
    complexityScore: 0.6,
    tags: ['backtracking', 'permutations', 'recursion', 'combinatorics', 'arrays'],
    leetcodeProblems: ['Permutations', 'Permutations II', 'Next Permutation'],
    codeExamples: [
      {
        language: 'typescript',
        code: `function permute(nums: number[]): number[][] {
  const result: number[][] = [];
  const current: number[] = [];
  const used = new Set<number>();

  function backtrack() {
    if (current.length === nums.length) {
      result.push([...current]);
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (used.has(i)) continue;

      // Choose
      current.push(nums[i]);
      used.add(i);

      // Explore
      backtrack();

      // Unchoose (backtrack)
      current.pop();
      used.delete(i);
    }
  }

  backtrack();
  return result;
}

// --- Example ---
const nums = [1, 2, 3];
const allPermutations = permute(nums);  // → [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]`,
        steps: [
          {
            lines: [1, 2, 3, 4],
            title: 'Initialize Data Structures',
            description: 'Create result array for all permutations, current array for building a permutation, and used set to track which indices are already in current permutation.',
            variables: { 'result': '[]', 'current': '[]', 'used': 'Set()' }
          },
          {
            lines: [7, 8, 9, 10],
            title: 'Check Complete Permutation',
            description: 'Base case: if current permutation has all elements, add a copy to result. The copy is needed because current array will be modified.',
            variables: { 'current.length': 'nums.length' }
          },
          {
            lines: [12, 13],
            title: 'Skip Used Elements',
            description: 'Iterate through all elements. Skip any element whose index is already in the used set to avoid duplicates in the current permutation.',
            variables: { 'i': '0 to nums.length-1' }
          },
          {
            lines: [15, 16, 17],
            title: 'Choose Element',
            description: 'Add the current element to the permutation being built and mark its index as used. This is the "choose" step of the backtracking pattern.',
            variables: { 'current': 'element added', 'used': 'index added' }
          },
          {
            lines: [19, 20],
            title: 'Explore Recursively',
            description: 'Recursively build the rest of the permutation. This explores all possible permutations with the current element in this position.',
            variables: {}
          },
          {
            lines: [22, 23, 24],
            title: 'Unchoose (Backtrack)',
            description: 'Remove the element from current and mark index as unused. This restores the state so we can try the next element in this position.',
            variables: { 'current': 'element removed', 'used': 'index removed' }
          },
          {
            lines: [27, 28],
            title: 'Return All Permutations',
            description: 'Start the backtracking from an empty permutation and return all generated permutations.',
            variables: { 'result': 'all n! permutations' }
          }
        ]
      },
      {
        language: 'python',
        code: `def permute(nums):
    """Generate all permutations of distinct numbers"""
    result = []
    current = []
    used = set()

    def backtrack():
        if len(current) == len(nums):
            result.append(current[:])
            return

        for i in range(len(nums)):
            if i in used:
                continue

            # Choose
            current.append(nums[i])
            used.add(i)

            # Explore
            backtrack()

            # Unchoose (backtrack)
            current.pop()
            used.remove(i)

    backtrack()
    return result

# --- Example ---
nums = [1, 2, 3]
result = permute(nums)  # -> [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]`,
        steps: [
          {
            lines: [3, 4, 5],
            title: 'Initialize Data Structures',
            description: 'Create result list for all permutations, current list for building a permutation, and used set to track which indices are in current.',
            variables: { 'result': '[]', 'current': '[]', 'used': 'set()' }
          },
          {
            lines: [8, 9, 10],
            title: 'Check Complete Permutation',
            description: 'Base case: if current permutation has all elements, add a copy to result using slicing. The copy is needed as current will be modified.',
            variables: { 'len(current)': 'len(nums)' }
          },
          {
            lines: [12, 13, 14],
            title: 'Skip Used Elements',
            description: 'Iterate through all element indices. Skip any index already in the used set to avoid duplicates in current permutation.',
            variables: { 'i': '0 to len(nums)-1' }
          },
          {
            lines: [16, 17, 18],
            title: 'Choose Element',
            description: 'Add the element at current index to the permutation being built and mark its index as used. This is the "choose" step.',
            variables: { 'current': 'nums[i] added', 'used': 'i added' }
          },
          {
            lines: [20, 21],
            title: 'Explore Recursively',
            description: 'Recursively build the rest of the permutation. This explores all possible permutations with current element in this position.',
            variables: {}
          },
          {
            lines: [23, 24, 25],
            title: 'Unchoose (Backtrack)',
            description: 'Remove element from current and mark index as unused. This restores state so we can try the next element in this position.',
            variables: { 'current': 'element removed', 'used': 'i removed' }
          },
          {
            lines: [27, 28],
            title: 'Return All Permutations',
            description: 'Start backtracking from empty permutation and return all generated permutations (n! total).',
            variables: { 'result': 'all permutations' }
          }
        ]
      }
    ],
    keyInsights: [
      'Track used elements with a set to avoid duplicates in current permutation',
      'Build permutations incrementally by adding one element at a time',
      'Backtrack by removing the last element and trying next possibility',
      'Total permutations equals n! for n distinct elements'
    ],
    whenToUse: [
      'When you need all possible orderings of a set of elements',
      'In problems requiring exhaustive exploration of arrangements',
      'When solving combinatorial problems that depend on element ordering'
    ]
  },
  {
    id: 'BAC_004',
    name: 'Combination Sum',
    category: 'Backtracking',
    difficulty: 'Medium',
    timeComplexity: 'O(2^n)',
    spaceComplexity: 'O(n)',
    description: 'Find all unique combinations of candidates that sum to a target value, allowing repeated use of candidates.',
    longDescription: 'The Combination Sum problem uses backtracking to find all unique combinations of numbers that sum to a target value. Each number can be used multiple times, and the solution must avoid duplicate combinations. The algorithm explores possibilities by including each candidate number and recursively searching for remaining sum combinations. When the current sum equals the target, a valid combination is found. If the sum exceeds the target, the algorithm backtracks. To avoid duplicates, candidates are processed in order, and each recursive call only considers candidates from the current index onward. This demonstrates backtracking\'s effectiveness in exploring combination spaces with constraints.',
    icon: 'add_circle',
    complexityScore: 0.55,
    tags: ['backtracking', 'combinations', 'recursion', 'sum', 'arrays'],
    leetcodeProblems: ['Combination Sum', 'Combination Sum II', 'Combinations'],
    codeExamples: [
      {
        language: 'typescript',
        code: `function combinationSum(candidates: number[], target: number): number[][] {
  const result: number[][] = [];
  const current: number[] = [];

  function backtrack(start: number, remaining: number) {
    if (remaining === 0) {
      result.push([...current]);
      return;
    }

    if (remaining < 0) return;

    for (let i = start; i < candidates.length; i++) {
      // Choose candidate
      current.push(candidates[i]);

      // Explore with same index (can reuse candidate)
      backtrack(i, remaining - candidates[i]);

      // Unchoose (backtrack)
      current.pop();
    }
  }

  backtrack(0, target);
  return result;
}

// --- Example ---
const candidates = [2, 3, 6, 7];
const targetSum = 7;
const combinations = combinationSum(candidates, targetSum);  // → [[2,2,3], [7]]`,
        steps: [
          {
            lines: [1, 2, 3],
            title: 'Initialize Data Structures',
            description: 'Create result array to store all valid combinations and current array to build a single combination.',
            variables: { 'result': '[]', 'current': '[]' }
          },
          {
            lines: [6, 7, 8, 9],
            title: 'Check Target Reached',
            description: 'Base case: if remaining sum is 0, we found a valid combination. Add a copy of current to result.',
            variables: { 'remaining': '0', 'current': 'valid combination' }
          },
          {
            lines: [11],
            title: 'Prune Invalid Path',
            description: 'If remaining sum goes negative, this path is invalid. Return early to backtrack and try other combinations.',
            variables: { 'remaining': '< 0' }
          },
          {
            lines: [13, 14, 15],
            title: 'Choose Candidate',
            description: 'Iterate from start index to allow reusing candidates. Add current candidate to the combination being built.',
            variables: { 'start': 'starting index', 'current': 'candidate added' }
          },
          {
            lines: [17, 18],
            title: 'Explore with Reuse',
            description: 'Recursively explore with same index (allowing reuse of current candidate) and reduced remaining sum.',
            variables: { 'remaining': 'remaining - candidates[i]' }
          },
          {
            lines: [20, 21],
            title: 'Unchoose (Backtrack)',
            description: 'Remove the last added candidate to restore state and try the next candidate. This is the backtracking step.',
            variables: { 'current': 'candidate removed' }
          },
          {
            lines: [25, 26],
            title: 'Return All Combinations',
            description: 'Start backtracking from index 0 with full target and return all valid combinations that sum to target.',
            variables: { 'result': 'all valid combinations' }
          }
        ]
      },
      {
        language: 'python',
        code: `def combination_sum(candidates, target):
    """Find all combinations that sum to target"""
    result = []
    current = []

    def backtrack(start, remaining):
        if remaining == 0:
            result.append(current[:])
            return

        if remaining < 0:
            return

        for i in range(start, len(candidates)):
            # Choose candidate
            current.append(candidates[i])

            # Explore (can reuse same candidate)
            backtrack(i, remaining - candidates[i])

            # Unchoose (backtrack)
            current.pop()

    backtrack(0, target)
    return result

# --- Example ---
candidates = [2, 3, 6, 7]
target = 7
result = combination_sum(candidates, target)  # -> [[2, 2, 3], [7]]`,
        steps: [
          {
            lines: [3, 4],
            title: 'Initialize Data Structures',
            description: 'Create result list to store all valid combinations and current list to build a single combination.',
            variables: { 'result': '[]', 'current': '[]' }
          },
          {
            lines: [7, 8, 9],
            title: 'Check Target Reached',
            description: 'Base case: if remaining sum is 0, we found a valid combination. Add a copy of current to result using slicing.',
            variables: { 'remaining': '0', 'current': 'valid combination' }
          },
          {
            lines: [11, 12],
            title: 'Prune Invalid Path',
            description: 'If remaining sum goes negative, this path cannot lead to a solution. Return early to backtrack.',
            variables: { 'remaining': '< 0' }
          },
          {
            lines: [14, 15, 16],
            title: 'Choose Candidate',
            description: 'Iterate from start index onward to allow reusing candidates. Add current candidate to the combination being built.',
            variables: { 'start': 'starting index', 'current': 'candidate added' }
          },
          {
            lines: [18, 19],
            title: 'Explore with Reuse',
            description: 'Recursively explore with same index (allowing reuse of current candidate) and reduced remaining sum.',
            variables: { 'remaining': 'remaining - candidates[i]' }
          },
          {
            lines: [21, 22],
            title: 'Unchoose (Backtrack)',
            description: 'Remove the last added candidate to restore state and try the next candidate. This is the backtracking step.',
            variables: { 'current': 'candidate removed' }
          },
          {
            lines: [24, 25],
            title: 'Return All Combinations',
            description: 'Start backtracking from index 0 with full target and return all valid combinations that sum to target.',
            variables: { 'result': 'all valid combinations' }
          }
        ]
      }
    ],
    keyInsights: [
      'Start index parameter prevents duplicate combinations by enforcing order',
      'Candidates can be reused by passing same index in recursive call',
      'Early termination when remaining sum becomes negative improves efficiency',
      'Backtracking explores all valid combination paths systematically'
    ],
    whenToUse: [
      'When finding all combinations of numbers that meet a sum constraint',
      'In subset sum problems where elements can be reused',
      'When exploring combination spaces with specific target values'
    ]
  },

  // TWO POINTERS ALGORITHMS
  {
    id: 'TWO_001',
    name: 'Two Sum (Sorted)',
    category: 'Two Pointers',
    difficulty: 'Beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    description: 'Find two numbers in a sorted array that sum to a target value using two pointers.',
    longDescription: 'The Two Sum problem on a sorted array uses the two-pointer technique to find a pair of numbers that sum to a target value. One pointer starts at the beginning and another at the end of the array. If the sum of elements at both pointers equals the target, the pair is found. If the sum is less than the target, move the left pointer right to increase the sum. If the sum is greater, move the right pointer left to decrease the sum. This technique efficiently narrows the search space in O(n) time without extra space. The sorted nature of the array is crucial for the two-pointer approach to work correctly.',
    icon: 'compare_arrows',
    complexityScore: 0.2,
    tags: ['two-pointers', 'arrays', 'sorted', 'sum', 'search'],
    leetcodeProblems: ['Two Sum II', 'Remove Duplicates from Sorted Array'],
    codeExamples: [
      {
        language: 'typescript',
        code: `function twoSum(numbers: number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];

    if (sum === target) {
      return [left + 1, right + 1];  // 1-indexed
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return [];  // No solution found
}

// --- Example ---
const numbers = [2, 7, 11, 15];
const target = 9;
const result = twoSum(numbers, target);  // → [1, 2]`,
        steps: [
          {
            lines: [1, 2, 3],
            title: 'Initialize Two Pointers',
            description: 'Set left pointer to the start and right pointer to the end of the sorted array. These pointers will converge toward the solution.',
            variables: { 'left': '0', 'right': 'numbers.length - 1' }
          },
          {
            lines: [5, 6],
            title: 'Calculate Current Sum',
            description: 'While pointers haven\'t crossed, calculate the sum of elements at both pointers. This is our candidate pair.',
            variables: { 'sum': 'numbers[left] + numbers[right]' }
          },
          {
            lines: [8, 9],
            title: 'Check if Target Found',
            description: 'If the sum equals the target, we found the solution. Return 1-indexed positions of the two numbers.',
            variables: { 'sum': 'target' }
          },
          {
            lines: [10, 11],
            title: 'Sum Too Small - Move Left',
            description: 'If sum is less than target, increase it by moving the left pointer right to a larger value.',
            variables: { 'left': 'left + 1' }
          },
          {
            lines: [12, 13],
            title: 'Sum Too Large - Move Right',
            description: 'If sum is greater than target, decrease it by moving the right pointer left to a smaller value.',
            variables: { 'right': 'right - 1' }
          },
          {
            lines: [17],
            title: 'Return Empty if Not Found',
            description: 'If pointers cross without finding the target, return empty array indicating no solution exists.',
            variables: {}
          }
        ]
      },
      {
        language: 'python',
        code: `def two_sum(numbers, target):
    """Find two numbers that sum to target in sorted array"""
    left = 0
    right = len(numbers) - 1

    while left < right:
        current_sum = numbers[left] + numbers[right]

        if current_sum == target:
            return [left + 1, right + 1]  # 1-indexed
        elif current_sum < target:
            left += 1
        else:
            right -= 1

    return []  # No solution found

# --- Example ---
numbers = [2, 7, 11, 15]
target = 9
result = two_sum(numbers, target)  # -> [1, 2]`,
        steps: [
          {
            lines: [3, 4],
            title: 'Initialize Two Pointers',
            description: 'Set left pointer at the start and right pointer at the end of the sorted array. These will converge toward the solution.',
            variables: { 'left': '0', 'right': 'len(numbers) - 1' }
          },
          {
            lines: [6, 7],
            title: 'Calculate Current Sum',
            description: 'While pointers haven\'t crossed, calculate the sum of elements at both pointers. This is our candidate pair.',
            variables: { 'current_sum': 'numbers[left] + numbers[right]' }
          },
          {
            lines: [9, 10],
            title: 'Check if Target Found',
            description: 'If sum equals target, we found the solution. Return 1-indexed positions of the two numbers.',
            variables: { 'current_sum': 'target' }
          },
          {
            lines: [11, 12],
            title: 'Sum Too Small - Move Left',
            description: 'If sum is less than target, increase it by moving the left pointer right to a larger value in the sorted array.',
            variables: { 'left': 'left + 1' }
          },
          {
            lines: [13, 14],
            title: 'Sum Too Large - Move Right',
            description: 'If sum is greater than target, decrease it by moving the right pointer left to a smaller value in the sorted array.',
            variables: { 'right': 'right - 1' }
          },
          {
            lines: [16],
            title: 'Return Empty if Not Found',
            description: 'If pointers cross without finding target, return empty list indicating no solution exists.',
            variables: {}
          }
        ]
      }
    ],
    keyInsights: [
      'Two pointers converge toward the solution by eliminating impossible pairs',
      'Sorted array allows directional movement based on sum comparison',
      'O(1) space complexity as no additional data structures are needed',
      'Each iteration eliminates at least one element from consideration'
    ],
    whenToUse: [
      'When working with sorted arrays and searching for pairs with specific properties',
      'In problems requiring O(n) time and O(1) space for pair finding',
      'When the sorted nature of data can be leveraged for efficient search'
    ]
  },
  {
    id: 'TWO_002',
    name: 'Container With Most Water',
    category: 'Two Pointers',
    difficulty: 'Medium',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    description: 'Find two lines that together with the x-axis form a container holding the maximum water.',
    longDescription: 'The Container With Most Water problem uses two pointers to find the maximum area that can be formed between two vertical lines. The area is calculated as the minimum height of the two lines multiplied by the distance between them. Starting with pointers at both ends maximizes width. The algorithm moves the pointer at the shorter line inward, as moving the taller line cannot increase the area (the height is limited by the shorter line). This greedy approach efficiently explores potential containers and finds the maximum area in linear time. The problem demonstrates how two pointers can optimize area calculations through strategic pointer movement.',
    icon: 'water',
    complexityScore: 0.4,
    tags: ['two-pointers', 'arrays', 'greedy', 'area', 'optimization'],
    leetcodeProblems: ['Container With Most Water', 'Trapping Rain Water'],
    codeExamples: [
      {
        language: 'typescript',
        code: `function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;

  while (left < right) {
    const width = right - left;
    const minHeight = Math.min(height[left], height[right]);
    const area = width * minHeight;

    maxWater = Math.max(maxWater, area);

    // Move pointer at shorter line
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxWater;
}

// --- Example ---
const heights = [1, 8, 6, 2, 5, 4, 8, 3, 7];
const maxWaterArea = maxArea(heights);  // → 49`,
        steps: [
          {
            lines: [1, 2, 3, 4],
            title: 'Initialize Pointers and Max',
            description: 'Set left at start, right at end to maximize initial width. Initialize maxWater to track the largest area found.',
            variables: { 'left': '0', 'right': 'height.length - 1', 'maxWater': '0' }
          },
          {
            lines: [6, 7],
            title: 'Calculate Width and Height',
            description: 'Calculate the distance between pointers (width) and find the minimum height of the two lines (water height is limited by shorter line).',
            variables: { 'width': 'right - left', 'minHeight': 'min(height[left], height[right])' }
          },
          {
            lines: [8, 9],
            title: 'Calculate Current Area',
            description: 'Multiply width by minimum height to get the area of water that can be contained between the two lines.',
            variables: { 'area': 'width * minHeight' }
          },
          {
            lines: [11],
            title: 'Update Maximum',
            description: 'Update maxWater if the current area is larger than any previously found area.',
            variables: { 'maxWater': 'max(maxWater, area)' }
          },
          {
            lines: [13, 14, 15, 16, 17, 18],
            title: 'Move Shorter Line Pointer',
            description: 'Move the pointer at the shorter line inward. Moving the taller line cannot increase area (limited by shorter line), so this greedy choice is optimal.',
            variables: { 'left or right': 'moved toward center' }
          },
          {
            lines: [21],
            title: 'Return Maximum Area',
            description: 'Return the maximum water area found after exploring all possible container configurations.',
            variables: { 'maxWater': 'maximum container area' }
          }
        ]
      },
      {
        language: 'python',
        code: `def max_area(height):
    """Find maximum water container area"""
    left = 0
    right = len(height) - 1
    max_water = 0

    while left < right:
        width = right - left
        min_height = min(height[left], height[right])
        area = width * min_height

        max_water = max(max_water, area)

        # Move pointer at shorter line
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1

    return max_water

# --- Example ---
height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
result = max_area(height)  # -> 49`,
        steps: [
          {
            lines: [3, 4, 5],
            title: 'Initialize Pointers and Max',
            description: 'Set left at start, right at end to maximize initial width. Initialize max_water to track the largest area found.',
            variables: { 'left': '0', 'right': 'len(height) - 1', 'max_water': '0' }
          },
          {
            lines: [7, 8, 9],
            title: 'Calculate Width and Height',
            description: 'Calculate distance between pointers (width) and find minimum height of the two lines (water height is limited by shorter line).',
            variables: { 'width': 'right - left', 'min_height': 'min(height[left], height[right])' }
          },
          {
            lines: [10, 11],
            title: 'Calculate Current Area',
            description: 'Multiply width by minimum height to get the area of water that can be contained between the two lines.',
            variables: { 'area': 'width * min_height' }
          },
          {
            lines: [13],
            title: 'Update Maximum',
            description: 'Update max_water if the current area is larger than any previously found area.',
            variables: { 'max_water': 'max(max_water, area)' }
          },
          {
            lines: [15, 16, 17, 18],
            title: 'Move Shorter Line Pointer',
            description: 'Move the pointer at the shorter line inward. Moving the taller line cannot increase area (limited by shorter line), so this greedy choice is optimal.',
            variables: { 'left or right': 'moved toward center' }
          },
          {
            lines: [20],
            title: 'Return Maximum Area',
            description: 'Return the maximum water area found after exploring all possible container configurations.',
            variables: { 'max_water': 'maximum container area' }
          }
        ]
      }
    ],
    keyInsights: [
      'Always move the pointer at the shorter line to potentially find taller lines',
      'Starting with maximum width ensures no potential solution is missed',
      'Area is limited by the shorter of the two lines, making greedy choice optimal',
      'Each iteration eliminates one line from consideration, ensuring O(n) time'
    ],
    whenToUse: [
      'When optimizing area calculations between pairs of elements',
      'In problems where width and height both affect the result',
      'When greedy pointer movement based on element values leads to optimal solution'
    ]
  },
  {
    id: 'TWO_003',
    name: 'Three Sum',
    category: 'Two Pointers',
    difficulty: 'Medium',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Find all unique triplets in an array that sum to zero.',
    longDescription: 'The Three Sum problem extends two-pointer technique to find all unique triplets that sum to a target (typically zero). The algorithm first sorts the array, then fixes one element and uses two pointers to find pairs that complete the triplet. For each fixed element, the two-pointer approach finds all valid pairs in the remaining array. To avoid duplicates, the algorithm skips repeated values when moving pointers or selecting the fixed element. The sorting step enables efficient duplicate detection and two-pointer searching. This problem demonstrates how two pointers can be combined with iteration to solve higher-order sum problems while maintaining reasonable time complexity.',
    icon: 'looks_3',
    complexityScore: 0.5,
    tags: ['two-pointers', 'arrays', 'sorting', 'triplets', 'sum'],
    leetcodeProblems: ['3Sum', '3Sum Closest', '4Sum'],
    codeExamples: [
      {
        language: 'typescript',
        code: `function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];

  for (let i = 0; i < nums.length - 2; i++) {
    // Skip duplicates for first element
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);

        // Skip duplicates
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;

        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }

  return result;
}

// --- Example ---
const numbers = [-1, 0, 1, 2, -1, -4];
const triplets = threeSum(numbers);  // → [[-1, -1, 2], [-1, 0, 1]]`,
        steps: [
          {
            lines: [1, 2, 3],
            title: 'Sort Array',
            description: 'Sort the array in ascending order. This enables two-pointer technique and makes duplicate detection easier.',
            variables: { 'nums': 'sorted array', 'result': '[]' }
          },
          {
            lines: [5, 6, 7],
            title: 'Fix First Element',
            description: 'Iterate through array, fixing one element as the first of the triplet. Skip duplicates to avoid duplicate triplets in result.',
            variables: { 'i': '0 to length-2', 'nums[i]': 'fixed element' }
          },
          {
            lines: [9, 10],
            title: 'Initialize Two Pointers',
            description: 'Set left pointer after the fixed element and right pointer at array end. These will find the remaining two elements.',
            variables: { 'left': 'i + 1', 'right': 'length - 1' }
          },
          {
            lines: [12, 13],
            title: 'Calculate Triplet Sum',
            description: 'Calculate the sum of the three elements: fixed element plus elements at left and right pointers.',
            variables: { 'sum': 'nums[i] + nums[left] + nums[right]' }
          },
          {
            lines: [15, 16, 17, 18, 19, 20, 21, 22],
            title: 'Handle Zero Sum',
            description: 'If sum is 0, found a valid triplet. Add to result, then skip duplicates for both left and right pointers to avoid duplicate triplets.',
            variables: { 'result': 'triplet added', 'left': 'moved right', 'right': 'moved left' }
          },
          {
            lines: [23, 24, 25, 26, 27],
            title: 'Adjust Pointers',
            description: 'If sum is negative, move left pointer right to increase sum. If sum is positive, move right pointer left to decrease sum.',
            variables: { 'left or right': 'adjusted based on sum' }
          },
          {
            lines: [31],
            title: 'Return All Triplets',
            description: 'Return all unique triplets found that sum to zero.',
            variables: { 'result': 'all unique zero-sum triplets' }
          }
        ]
      },
      {
        language: 'python',
        code: `def three_sum(nums):
    """Find all unique triplets that sum to zero"""
    nums.sort()
    result = []

    for i in range(len(nums) - 2):
        # Skip duplicates for first element
        if i > 0 and nums[i] == nums[i - 1]:
            continue

        left = i + 1
        right = len(nums) - 1

        while left < right:
            current_sum = nums[i] + nums[left] + nums[right]

            if current_sum == 0:
                result.append([nums[i], nums[left], nums[right]])

                # Skip duplicates
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1

                left += 1
                right -= 1
            elif current_sum < 0:
                left += 1
            else:
                right -= 1

    return result

# --- Example ---
nums = [-1, 0, 1, 2, -1, -4]
triplets = three_sum(nums)  # -> [[-1, -1, 2], [-1, 0, 1]]`,
        steps: [
          {
            lines: [3, 4],
            title: 'Sort Array',
            description: 'Sort the array in ascending order. This enables two-pointer technique and makes duplicate detection easier.',
            variables: { 'nums': 'sorted array', 'result': '[]' }
          },
          {
            lines: [6, 7, 8, 9],
            title: 'Fix First Element',
            description: 'Iterate through array, fixing one element as first of the triplet. Skip duplicates to avoid duplicate triplets in result.',
            variables: { 'i': '0 to len(nums)-3', 'nums[i]': 'fixed element' }
          },
          {
            lines: [11, 12],
            title: 'Initialize Two Pointers',
            description: 'Set left pointer after the fixed element and right pointer at array end. These will find the remaining two elements.',
            variables: { 'left': 'i + 1', 'right': 'len(nums) - 1' }
          },
          {
            lines: [14, 15],
            title: 'Calculate Triplet Sum',
            description: 'Calculate the sum of three elements: fixed element plus elements at left and right pointers.',
            variables: { 'current_sum': 'nums[i] + nums[left] + nums[right]' }
          },
          {
            lines: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
            title: 'Handle Zero Sum',
            description: 'If sum is 0, found a valid triplet. Add to result, skip duplicates for both pointers, then move both inward.',
            variables: { 'result': 'triplet added', 'left': 'moved right', 'right': 'moved left' }
          },
          {
            lines: [27, 28, 29, 30],
            title: 'Adjust Pointers',
            description: 'If sum is negative, move left pointer right to increase sum. If sum is positive, move right pointer left to decrease sum.',
            variables: { 'left or right': 'adjusted based on sum' }
          },
          {
            lines: [32],
            title: 'Return All Triplets',
            description: 'Return all unique triplets found that sum to zero.',
            variables: { 'result': 'all unique zero-sum triplets' }
          }
        ]
      }
    ],
    keyInsights: [
      'Sorting enables efficient duplicate detection and two-pointer technique',
      'Fix one element and use two pointers to find remaining pair',
      'Skip duplicate values to ensure only unique triplets are included',
      'O(n²) time complexity from outer loop combined with two-pointer inner loop'
    ],
    whenToUse: [
      'When finding combinations of three elements with specific sum properties',
      'In problems requiring unique triplets or quadruplets from arrays',
      'When sorted array allows efficient multi-element combination search'
    ]
  },

  // SLIDING WINDOW ALGORITHMS
  {
    id: 'SLI_001',
    name: 'Maximum Sum Subarray of Size K',
    category: 'Sliding Window',
    difficulty: 'Beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    description: 'Find the maximum sum of any contiguous subarray of size K using a sliding window.',
    longDescription: 'The Maximum Sum Subarray of Size K problem uses the sliding window technique to efficiently find the contiguous subarray with the largest sum. Instead of recalculating the sum for each window from scratch, the algorithm maintains a running sum and slides the window by adding the next element and removing the first element of the previous window. This approach reduces time complexity from O(n*k) to O(n). The fixed-size window slides through the array once, updating the maximum sum whenever a larger sum is found. This problem introduces the fundamental sliding window pattern that efficiently processes contiguous subarrays.',
    icon: 'tab',
    complexityScore: 0.2,
    tags: ['sliding-window', 'arrays', 'subarray', 'sum', 'optimization'],
    leetcodeProblems: ['Maximum Average Subarray I', 'Contains Duplicate II'],
    codeExamples: [
      {
        language: 'typescript',
        code: `function maxSumSubarray(arr: number[], k: number): number {
  if (arr.length < k) return -1;

  // Calculate sum of first window
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }

  let maxSum = windowSum;

  // Slide the window
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

// --- Example ---
const arr = [2, 1, 5, 1, 3, 2];
const k = 3;
const maxSubarraySum = maxSumSubarray(arr, k);  // → 9`,
        steps: [
          {
            lines: [1, 2],
            title: 'Validate Input',
            description: 'Check if array has enough elements for window size k. Return -1 if invalid.',
            variables: { 'arr.length': 'array size', 'k': 'window size' }
          },
          {
            lines: [4, 5, 6, 7, 8],
            title: 'Initialize First Window',
            description: 'Calculate the sum of the first k elements. This forms our initial window and avoids recalculating from scratch.',
            variables: { 'windowSum': 'sum of first k elements', 'i': '0 to k-1' }
          },
          {
            lines: [10],
            title: 'Set Initial Maximum',
            description: 'Initialize maxSum with the sum of the first window. This will be updated as we slide the window.',
            variables: { 'maxSum': 'windowSum' }
          },
          {
            lines: [12, 13],
            title: 'Slide Window',
            description: 'Start from index k and slide the window one position at a time. Remove leftmost element and add new rightmost element.',
            variables: { 'i': 'k to arr.length-1' }
          },
          {
            lines: [14],
            title: 'Update Window Sum',
            description: 'Efficiently update sum by subtracting element leaving the window and adding element entering the window. This avoids O(k) recalculation.',
            variables: { 'windowSum': 'windowSum - arr[i-k] + arr[i]' }
          },
          {
            lines: [15],
            title: 'Update Maximum',
            description: 'Compare current window sum with maxSum and update if current is larger.',
            variables: { 'maxSum': 'max(maxSum, windowSum)' }
          },
          {
            lines: [18],
            title: 'Return Result',
            description: 'Return the maximum sum found among all windows of size k.',
            variables: { 'maxSum': 'maximum subarray sum' }
          }
        ]
      },
      {
        language: 'python',
        code: `def max_sum_subarray(arr, k):
    """Find maximum sum of subarray of size k"""
    if len(arr) < k:
        return -1

    # Calculate sum of first window
    window_sum = sum(arr[:k])
    max_sum = window_sum

    # Slide the window
    for i in range(k, len(arr)):
        window_sum = window_sum - arr[i - k] + arr[i]
        max_sum = max(max_sum, window_sum)

    return max_sum

# --- Example ---
arr = [2, 1, 5, 1, 3, 2]
k = 3
result = max_sum_subarray(arr, k)  # -> 9`,
        steps: [
          {
            lines: [3, 4],
            title: 'Validate Input',
            description: 'Check if array has enough elements for window size k. Return -1 if array is too short.',
            variables: { 'len(arr)': 'array size', 'k': 'window size' }
          },
          {
            lines: [6, 7, 8],
            title: 'Initialize First Window',
            description: 'Calculate the sum of the first k elements using slicing and sum(). This forms our initial window.',
            variables: { 'window_sum': 'sum of first k elements', 'max_sum': 'window_sum' }
          },
          {
            lines: [10, 11],
            title: 'Slide Window',
            description: 'Start from index k and slide the window one position at a time. Remove leftmost element and add new rightmost element efficiently.',
            variables: { 'i': 'k to len(arr)-1' }
          },
          {
            lines: [12],
            title: 'Update Window Sum',
            description: 'Efficiently update sum by subtracting element leaving window and adding element entering window. Avoids O(k) recalculation.',
            variables: { 'window_sum': 'window_sum - arr[i-k] + arr[i]' }
          },
          {
            lines: [13],
            title: 'Update Maximum',
            description: 'Compare current window sum with max_sum and update if current is larger.',
            variables: { 'max_sum': 'max(max_sum, window_sum)' }
          },
          {
            lines: [15],
            title: 'Return Result',
            description: 'Return the maximum sum found among all windows of size k.',
            variables: { 'max_sum': 'maximum subarray sum' }
          }
        ]
      }
    ],
    keyInsights: [
      'Sliding window avoids recalculating sum from scratch for each position',
      'Remove leftmost element and add rightmost element to update window sum',
      'Fixed window size makes the pattern simple and efficient',
      'Single pass through array achieves O(n) time complexity'
    ],
    whenToUse: [
      'When finding optimal contiguous subarrays of fixed size',
      'In problems requiring efficient processing of fixed-length windows',
      'When repeated calculations can be optimized through incremental updates'
    ]
  },
  {
    id: 'SLI_002',
    name: 'Longest Substring Without Repeating',
    category: 'Sliding Window',
    difficulty: 'Medium',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(min(n,m))',
    description: 'Find the length of the longest substring without repeating characters using a dynamic sliding window.',
    longDescription: 'The Longest Substring Without Repeating Characters problem uses a dynamic sliding window with a hash map to track character positions. The window expands by moving the right pointer and adding characters to the map. When a duplicate character is encountered, the left pointer moves to exclude the previous occurrence of that character. The window size is calculated at each step, and the maximum length is updated. The hash map stores the most recent position of each character, enabling O(1) lookup and efficient window adjustment. This problem demonstrates the power of combining sliding window with hash maps for dynamic window size problems.',
    icon: 'text_fields',
    complexityScore: 0.45,
    tags: ['sliding-window', 'strings', 'hash-map', 'substrings', 'optimization'],
    leetcodeProblems: ['Longest Substring Without Repeating Characters', 'Longest Repeating Character Replacement'],
    codeExamples: [
      {
        language: 'typescript',
        code: `function lengthOfLongestSubstring(s: string): number {
  const charIndex = new Map<string, number>();
  let maxLength = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    // If character seen before in current window, move left pointer
    if (charIndex.has(char) && charIndex.get(char)! >= left) {
      left = charIndex.get(char)! + 1;
    }

    charIndex.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

// --- Example ---
const s = "abcabcbb";
const longestLength = lengthOfLongestSubstring(s);  // → 3`,
        steps: [
          {
            lines: [1, 2, 3, 4],
            title: 'Initialize Variables',
            description: 'Create a map to track the most recent index of each character. Initialize maxLength to 0 and left pointer to start of string.',
            variables: { 'charIndex': 'Map()', 'maxLength': '0', 'left': '0' }
          },
          {
            lines: [6, 7],
            title: 'Expand Window Right',
            description: 'Move right pointer through the string, adding each character to the current window. Process each character one by one.',
            variables: { 'right': '0 to s.length-1', 'char': 's[right]' }
          },
          {
            lines: [9, 10, 11, 12],
            title: 'Handle Duplicate Character',
            description: 'If current character was seen before and is within the current window, move left pointer just past the previous occurrence to maintain uniqueness.',
            variables: { 'left': 'charIndex.get(char) + 1' }
          },
          {
            lines: [14],
            title: 'Update Character Index',
            description: 'Store or update the current position of the character in the map. This tracks the most recent occurrence.',
            variables: { 'charIndex': 'char mapped to right' }
          },
          {
            lines: [15],
            title: 'Update Maximum Length',
            description: 'Calculate current window size (right - left + 1) and update maxLength if this window is longer than any previous.',
            variables: { 'maxLength': 'max(maxLength, right - left + 1)' }
          },
          {
            lines: [18],
            title: 'Return Result',
            description: 'Return the length of the longest substring found without repeating characters.',
            variables: { 'maxLength': 'longest unique substring length' }
          }
        ]
      },
      {
        language: 'python',
        code: `def length_of_longest_substring(s):
    """Find length of longest substring without repeating chars"""
    char_index = {}
    max_length = 0
    left = 0

    for right in range(len(s)):
        char = s[right]

        # If char seen in current window, move left pointer
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1

        char_index[char] = right
        max_length = max(max_length, right - left + 1)

    return max_length

# --- Example ---
s = "abcabcbb"
result = length_of_longest_substring(s)  # -> 3`,
        steps: [
          {
            lines: [3, 4, 5],
            title: 'Initialize Variables',
            description: 'Create a dictionary to track the most recent index of each character. Initialize max_length to 0 and left pointer to start.',
            variables: { 'char_index': '{}', 'max_length': '0', 'left': '0' }
          },
          {
            lines: [7, 8],
            title: 'Expand Window Right',
            description: 'Move right pointer through the string, adding each character to the current window. Process each character one by one.',
            variables: { 'right': '0 to len(s)-1', 'char': 's[right]' }
          },
          {
            lines: [10, 11, 12],
            title: 'Handle Duplicate Character',
            description: 'If current character was seen before and is within the current window (index >= left), move left pointer just past the previous occurrence.',
            variables: { 'left': 'char_index[char] + 1' }
          },
          {
            lines: [14],
            title: 'Update Character Index',
            description: 'Store or update the current position of the character in the dictionary. This tracks the most recent occurrence.',
            variables: { 'char_index[char]': 'right' }
          },
          {
            lines: [15],
            title: 'Update Maximum Length',
            description: 'Calculate current window size (right - left + 1) and update max_length if this window is longer than any previous.',
            variables: { 'max_length': 'max(max_length, right - left + 1)' }
          },
          {
            lines: [17],
            title: 'Return Result',
            description: 'Return the length of the longest substring found without repeating characters.',
            variables: { 'max_length': 'longest unique substring length' }
          }
        ]
      }
    ],
    keyInsights: [
      'Hash map tracks most recent position of each character for O(1) lookup',
      'Left pointer jumps to position after last occurrence of duplicate character',
      'Window dynamically expands and contracts based on character uniqueness',
      'Maximum length is updated at each step as window changes'
    ],
    whenToUse: [
      'When finding optimal substrings or subarrays with uniqueness constraints',
      'In problems requiring dynamic window size based on element properties',
      'When hash maps can efficiently track element occurrences within the window'
    ]
  },
  {
    id: 'SLI_003',
    name: 'Minimum Window Substring',
    category: 'Sliding Window',
    difficulty: 'Advanced',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(m)',
    description: 'Find the minimum window in string S that contains all characters from string T.',
    longDescription: 'The Minimum Window Substring problem uses a sliding window with two hash maps to find the smallest substring containing all characters from a target string. One map tracks required character frequencies, while another tracks the current window\'s characters. The window expands by moving the right pointer until all required characters are included. Once valid, the window contracts by moving the left pointer to find the minimum length while maintaining validity. The algorithm tracks the count of satisfied character requirements to efficiently determine window validity. This advanced sliding window problem demonstrates optimal substring search with multiple character frequency constraints.',
    icon: 'crop',
    complexityScore: 0.75,
    tags: ['sliding-window', 'strings', 'hash-map', 'substrings', 'optimization'],
    leetcodeProblems: ['Minimum Window Substring', 'Substring with Concatenation of All Words', 'Minimum Size Subarray Sum'],
    codeExamples: [
      {
        language: 'typescript',
        code: `function minWindow(s: string, t: string): string {
  const required = new Map<string, number>();
  for (const char of t) {
    required.set(char, (required.get(char) || 0) + 1);
  }

  const window = new Map<string, number>();
  let left = 0, right = 0;
  let formed = 0;
  const requiredCount = required.size;
  let minLen = Infinity;
  let minWindow = "";

  while (right < s.length) {
    const char = s[right];
    window.set(char, (window.get(char) || 0) + 1);

    if (required.has(char) && window.get(char) === required.get(char)) {
      formed++;
    }

    while (formed === requiredCount && left <= right) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        minWindow = s.substring(left, right + 1);
      }

      const leftChar = s[left];
      window.set(leftChar, window.get(leftChar)! - 1);
      if (required.has(leftChar) && window.get(leftChar)! < required.get(leftChar)!) {
        formed--;
      }
      left++;
    }

    right++;
  }

  return minWindow;
}

// --- Example ---
const sourceString = "ADOBECODEBANC";
const targetString = "ABC";
const minimumWindow = minWindow(sourceString, targetString);  // → "BANC"`,
        steps: [
          {
            lines: [1, 2, 3, 4, 5],
            title: 'Build Required Character Map',
            description: 'Count the frequency of each character in target string t. This defines what our window must contain.',
            variables: { 'required': 'character frequencies from t' }
          },
          {
            lines: [7, 8, 9, 10, 11, 12],
            title: 'Initialize Window Variables',
            description: 'Create window map to track current window characters. Initialize pointers, formed counter (tracks satisfied character requirements), and minimum window tracking variables.',
            variables: { 'window': 'Map()', 'left': '0', 'right': '0', 'formed': '0', 'minLen': 'Infinity' }
          },
          {
            lines: [14, 15, 16],
            title: 'Expand Window Right',
            description: 'Add character at right pointer to window and increment its frequency. This expands the window to potentially include all required characters.',
            variables: { 'char': 's[right]', 'window': 'char frequency updated' }
          },
          {
            lines: [18, 19, 20],
            title: 'Check Character Requirement',
            description: 'If the current character is required and its frequency in window now matches requirement, increment formed counter.',
            variables: { 'formed': 'incremented if requirement met' }
          },
          {
            lines: [22, 23, 24, 25, 26],
            title: 'Contract Window (Valid)',
            description: 'While window contains all required characters, try to minimize it. Update minimum window if current is smaller.',
            variables: { 'minLen': 'updated if smaller', 'minWindow': 'smallest valid substring' }
          },
          {
            lines: [28, 29, 30, 31, 32],
            title: 'Remove Left Character',
            description: 'Remove character at left pointer from window. If this breaks a requirement, decrement formed counter. Move left pointer right to contract window.',
            variables: { 'window': 'leftChar frequency decreased', 'formed': 'decremented if requirement broken', 'left': 'left + 1' }
          },
          {
            lines: [35],
            title: 'Advance Right Pointer',
            description: 'Move right pointer forward to continue expanding the window and exploring new substrings.',
            variables: { 'right': 'right + 1' }
          },
          {
            lines: [38],
            title: 'Return Minimum Window',
            description: 'Return the smallest substring found that contains all characters from t with required frequencies.',
            variables: { 'minWindow': 'minimum window substring or empty string' }
          }
        ]
      },
      {
        language: 'python',
        code: `from collections import Counter, defaultdict

def min_window(s, t):
    """Find minimum window containing all chars from t"""
    if not s or not t:
        return ""

    required = Counter(t)
    window = defaultdict(int)

    left = 0
    formed = 0
    required_count = len(required)
    min_len = float('inf')
    min_window = ""

    for right in range(len(s)):
        char = s[right]
        window[char] += 1

        if char in required and window[char] == required[char]:
            formed += 1

        while formed == required_count and left <= right:
            if right - left + 1 < min_len:
                min_len = right - left + 1
                min_window = s[left:right + 1]

            left_char = s[left]
            window[left_char] -= 1
            if left_char in required and window[left_char] < required[left_char]:
                formed -= 1
            left += 1

    return min_window

# --- Example ---
s = "ADOBECODEBANC"
t = "ABC"
result = min_window(s, t)  # -> "BANC"`,
        steps: [
          {
            lines: [5, 6, 7],
            title: 'Validate Input',
            description: 'Check if either string is empty. Return empty string if there\'s nothing to search.',
            variables: {}
          },
          {
            lines: [8, 9],
            title: 'Build Required Character Map',
            description: 'Use Counter to count frequency of each character in target string t. Create window defaultdict to track current window.',
            variables: { 'required': 'character frequencies from t', 'window': 'defaultdict(int)' }
          },
          {
            lines: [11, 12, 13, 14, 15],
            title: 'Initialize Window Variables',
            description: 'Initialize pointers, formed counter (tracks satisfied character requirements), and minimum window tracking variables.',
            variables: { 'left': '0', 'formed': '0', 'required_count': 'len(required)', 'min_len': 'inf' }
          },
          {
            lines: [17, 18, 19],
            title: 'Expand Window Right',
            description: 'Add character at right pointer to window and increment its frequency. This expands the window to potentially include all required characters.',
            variables: { 'char': 's[right]', 'window[char]': 'incremented' }
          },
          {
            lines: [21, 22],
            title: 'Check Character Requirement',
            description: 'If current character is required and its frequency in window now matches requirement, increment formed counter.',
            variables: { 'formed': 'incremented if requirement met' }
          },
          {
            lines: [24, 25, 26, 27],
            title: 'Contract Window (Valid)',
            description: 'While window contains all required characters, try to minimize it. Update minimum window if current is smaller.',
            variables: { 'min_len': 'updated if smaller', 'min_window': 'smallest valid substring' }
          },
          {
            lines: [29, 30, 31, 32, 33],
            title: 'Remove Left Character',
            description: 'Remove character at left pointer from window. If this breaks a requirement, decrement formed counter. Move left pointer right.',
            variables: { 'window[left_char]': 'decremented', 'formed': 'decremented if broken', 'left': 'left + 1' }
          },
          {
            lines: [35],
            title: 'Return Minimum Window',
            description: 'Return the smallest substring found that contains all characters from t with required frequencies, or empty string if none exists.',
            variables: { 'min_window': 'minimum window substring or empty' }
          }
        ]
      }
    ],
    keyInsights: [
      'Two hash maps track required characters and current window characters',
      'Expand window until valid, then contract to find minimum while maintaining validity',
      'Track count of satisfied character requirements for O(1) validity check',
      'Window contracts from left only when all requirements are met'
    ],
    whenToUse: [
      'When finding minimum substring containing all characters from another string',
      'In problems requiring optimal window with multiple frequency constraints',
      'When both expansion and contraction of window are needed for optimization'
    ]
  }
];
