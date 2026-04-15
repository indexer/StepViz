import type { Algorithm } from '../types/algorithm';

export const structureAlgorithms: Algorithm[] = [
  // Linked Lists
  {
    id: 'LIN_001',
    name: "Floyd's Cycle Detection",
    category: 'Linked Lists',
    difficulty: 'Medium',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    complexityScore: 0.45,
    icon: 'all_inclusive',
    description: 'Detects cycles in linked lists using two pointers moving at different speeds.',
    longDescription: "Floyd's Cycle Detection, also known as the tortoise and hare algorithm, uses two pointers moving at different speeds to detect cycles in a linked list. The slow pointer moves one step at a time while the fast pointer moves two steps. If a cycle exists, the pointers will eventually meet. This elegant algorithm requires only constant space and is widely used in cycle detection problems. It can also find the cycle's starting point by resetting one pointer to the head after detection.",
    tags: ['Two Pointers', 'Cycle Detection', 'Fast and Slow Pointers', 'Linked List'],
    leetcodeProblems: ['Linked List Cycle', 'Linked List Cycle II', 'Find the Duplicate Number'],
    codeExamples: [
      {
        language: 'typescript',
        code: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function hasCycle(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;

    if (slow === fast) {
      return true;
    }
  }

  return false;
}`,
        steps: [
          {
            lines: [11, 12],
            title: 'Initialize Two Pointers',
            description: 'Create slow and fast pointers both starting at the head. The slow pointer will move one step at a time, while fast moves two steps.',
            variables: { slow: 'head', fast: 'head' }
          },
          {
            lines: [14],
            title: 'Check Traversal Validity',
            description: 'Verify that fast pointer and its next node exist. If fast reaches null, the list has no cycle.',
            variables: { 'fast !== null': 'true', 'fast.next !== null': 'true' }
          },
          {
            lines: [15, 16],
            title: 'Move Pointers',
            description: 'Advance slow pointer by one step and fast pointer by two steps. This speed difference is key to cycle detection.',
            variables: { slow: 'slow.next', fast: 'fast.next.next' }
          },
          {
            lines: [18, 19],
            title: 'Check for Cycle',
            description: 'If slow and fast pointers meet, a cycle exists. The different speeds guarantee they will meet inside the cycle.',
            variables: { 'slow === fast': 'true (cycle found)' }
          },
          {
            lines: [22],
            title: 'No Cycle Found',
            description: 'If the loop exits without pointers meeting, fast reached the end of the list, confirming no cycle exists.',
            variables: { result: 'false' }
          }
        ]
      },
      {
        language: 'python',
        code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def has_cycle(head: ListNode) -> bool:
    slow = head
    fast = head

    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

        if slow == fast:
            return True

    return False`,
        steps: [
          {
            lines: [7, 8],
            title: 'Initialize Two Pointers',
            description: 'Create slow and fast pointers both starting at the head. The slow pointer will move one step at a time, while fast moves two steps.',
            variables: { slow: 'head', fast: 'head' }
          },
          {
            lines: [10],
            title: 'Check Traversal Validity',
            description: 'Verify that fast pointer and its next node exist. If fast reaches None, the list has no cycle.',
            variables: { 'fast': 'not None', 'fast.next': 'not None' }
          },
          {
            lines: [11, 12],
            title: 'Move Pointers',
            description: 'Advance slow pointer by one step and fast pointer by two steps. This speed difference is key to cycle detection.',
            variables: { slow: 'slow.next', fast: 'fast.next.next' }
          },
          {
            lines: [14, 15],
            title: 'Check for Cycle',
            description: 'If slow and fast pointers meet, a cycle exists. The different speeds guarantee they will meet inside the cycle.',
            variables: { 'slow == fast': 'True (cycle found)' }
          },
          {
            lines: [17],
            title: 'No Cycle Found',
            description: 'If the loop exits without pointers meeting, fast reached the end of the list, confirming no cycle exists.',
            variables: { result: 'False' }
          }
        ]
      }
    ],
    keyInsights: [
      'Two pointers moving at different speeds will meet if a cycle exists',
      'Requires only O(1) space, making it more efficient than hash set approaches',
      'Can be extended to find the cycle start by resetting one pointer after detection',
      'Works for any linked structure, including arrays with index-based cycles'
    ],
    whenToUse: [
      'Detecting cycles in linked lists or graph-like structures',
      'Finding duplicate numbers in arrays with specific constraints',
      'Memory-constrained environments where O(1) space is required'
    ]
  },
  {
    id: 'LIN_002',
    name: 'Merge Two Sorted Lists',
    category: 'Linked Lists',
    difficulty: 'Beginner',
    timeComplexity: 'O(n+m)',
    spaceComplexity: 'O(1)',
    complexityScore: 0.25,
    icon: 'merge_type',
    description: 'Combines two sorted linked lists into a single sorted list.',
    longDescription: 'Merge Two Sorted Lists is a fundamental algorithm that combines two pre-sorted linked lists into one sorted list by comparing nodes from both lists. The algorithm uses a pointer-based approach to traverse both lists simultaneously, selecting the smaller node at each step. This technique is the foundation for more complex algorithms like merge sort and merging k sorted lists. The iterative solution uses O(1) space while maintaining the sorted order efficiently.',
    tags: ['Merge', 'Sorted Lists', 'Two Pointers', 'Linked List Manipulation'],
    leetcodeProblems: ['Merge Two Sorted Lists', 'Merge k Sorted Lists'],
    codeExamples: [
      {
        language: 'typescript',
        code: `function mergeTwoLists(
  list1: ListNode | null,
  list2: ListNode | null
): ListNode | null {
  const dummy = new ListNode(0);
  let current = dummy;

  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      current.next = list1;
      list1 = list1.next;
    } else {
      current.next = list2;
      list2 = list2.next;
    }
    current = current.next;
  }

  current.next = list1 !== null ? list1 : list2;
  return dummy.next;
}`,
        steps: [
          {
            lines: [5, 6],
            title: 'Create Dummy Node',
            description: 'Initialize a dummy node to simplify edge cases. The current pointer tracks where to add the next node in the merged list.',
            variables: { dummy: 'ListNode(0)', current: 'dummy' }
          },
          {
            lines: [8],
            title: 'Check Both Lists',
            description: 'Continue merging while both lists have remaining nodes to compare.',
            variables: { 'list1 !== null': 'true', 'list2 !== null': 'true' }
          },
          {
            lines: [9, 10, 11],
            title: 'Choose Smaller Node (List1)',
            description: 'If list1 node is smaller or equal, link it to the merged list and advance list1 pointer.',
            variables: { 'list1.val': '1', 'list2.val': '2', chosen: 'list1' }
          },
          {
            lines: [12, 13, 14],
            title: 'Choose Smaller Node (List2)',
            description: 'If list2 node is smaller, link it to the merged list and advance list2 pointer.',
            variables: { chosen: 'list2' }
          },
          {
            lines: [16],
            title: 'Advance Current Pointer',
            description: 'Move current pointer forward after adding a node, preparing for the next merge step.',
            variables: { current: 'current.next' }
          },
          {
            lines: [19],
            title: 'Attach Remaining Nodes',
            description: 'After one list is exhausted, attach all remaining nodes from the non-empty list.',
            variables: { remaining: 'list1 or list2' }
          },
          {
            lines: [20],
            title: 'Return Merged List',
            description: 'Return dummy.next to skip the placeholder dummy node and get the actual merged list head.',
            variables: { result: 'dummy.next' }
          }
        ]
      },
      {
        language: 'python',
        code: `def merge_two_lists(
    list1: ListNode,
    list2: ListNode
) -> ListNode:
    dummy = ListNode(0)
    current = dummy

    while list1 and list2:
        if list1.val <= list2.val:
            current.next = list1
            list1 = list1.next
        else:
            current.next = list2
            list2 = list2.next
        current = current.next

    current.next = list1 if list1 else list2
    return dummy.next`,
        steps: [
          {
            lines: [5, 6],
            title: 'Create Dummy Node',
            description: 'Initialize a dummy node to simplify edge cases. The current pointer tracks where to add the next node in the merged list.',
            variables: { dummy: 'ListNode(0)', current: 'dummy' }
          },
          {
            lines: [8],
            title: 'Check Both Lists',
            description: 'Continue merging while both lists have remaining nodes to compare.',
            variables: { list1: 'not None', list2: 'not None' }
          },
          {
            lines: [9, 10, 11],
            title: 'Choose Smaller Node (List1)',
            description: 'If list1 node is smaller or equal, link it to the merged list and advance list1 pointer.',
            variables: { 'list1.val': '1', 'list2.val': '2', chosen: 'list1' }
          },
          {
            lines: [12, 13, 14],
            title: 'Choose Smaller Node (List2)',
            description: 'If list2 node is smaller, link it to the merged list and advance list2 pointer.',
            variables: { chosen: 'list2' }
          },
          {
            lines: [15],
            title: 'Advance Current Pointer',
            description: 'Move current pointer forward after adding a node, preparing for the next merge step.',
            variables: { current: 'current.next' }
          },
          {
            lines: [17],
            title: 'Attach Remaining Nodes',
            description: 'After one list is exhausted, attach all remaining nodes from the non-empty list.',
            variables: { remaining: 'list1 or list2' }
          },
          {
            lines: [18],
            title: 'Return Merged List',
            description: 'Return dummy.next to skip the placeholder dummy node and get the actual merged list head.',
            variables: { result: 'dummy.next' }
          }
        ]
      }
    ],
    keyInsights: [
      'Dummy node simplifies edge cases and provides a stable starting point',
      'Only need to traverse each list once, making it linear time',
      'Can be done in-place by rearranging pointers without creating new nodes',
      'Foundation for divide-and-conquer sorting algorithms'
    ],
    whenToUse: [
      'Merging pre-sorted data structures',
      'Implementing merge sort for linked lists',
      'Combining sorted streams of data in real-time systems'
    ]
  },
  {
    id: 'LIN_003',
    name: 'Reverse Linked List',
    category: 'Linked Lists',
    difficulty: 'Beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    complexityScore: 0.15,
    icon: 'undo',
    description: 'Reverses the direction of pointers in a linked list.',
    longDescription: 'Reverse Linked List is a classic algorithm that reverses the direction of all pointers in a singly linked list. The iterative approach maintains three pointers (previous, current, next) to reverse each link while traversing the list. This fundamental operation is used in many advanced linked list problems and demonstrates pointer manipulation skills. Both iterative and recursive solutions exist, with the iterative version being more space-efficient.',
    tags: ['Linked List', 'Pointer Manipulation', 'In-Place', 'Reversal'],
    leetcodeProblems: ['Reverse Linked List', 'Reverse Linked List II', 'Palindrome Linked List'],
    codeExamples: [
      {
        language: 'typescript',
        code: `function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let current = head;

  while (current !== null) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }

  return prev;
}`,
        steps: [
          {
            lines: [2, 3],
            title: 'Initialize Pointers',
            description: 'Set prev to null (new tail) and current to head. These pointers will help reverse the links.',
            variables: { prev: 'null', current: 'head' }
          },
          {
            lines: [5],
            title: 'Check Current Node',
            description: 'Continue while current node exists. When current is null, we have processed all nodes.',
            variables: { 'current !== null': 'true' }
          },
          {
            lines: [6],
            title: 'Save Next Node',
            description: 'Store reference to next node before reversing the link, preventing loss of the rest of the list.',
            variables: { next: 'current.next' }
          },
          {
            lines: [7],
            title: 'Reverse Link',
            description: 'Point current node to previous node, reversing the direction of this link.',
            variables: { 'current.next': 'prev' }
          },
          {
            lines: [8, 9],
            title: 'Advance Pointers',
            description: 'Move prev to current and current to next, progressing through the list.',
            variables: { prev: 'current', current: 'next' }
          },
          {
            lines: [12],
            title: 'Return New Head',
            description: 'Return prev, which points to the old tail (now the new head of the reversed list).',
            variables: { result: 'prev (new head)' }
          }
        ]
      },
      {
        language: 'python',
        code: `def reverse_list(head: ListNode) -> ListNode:
    prev = None
    current = head

    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node

    return prev`,
        steps: [
          {
            lines: [2, 3],
            title: 'Initialize Pointers',
            description: 'Set prev to None (new tail) and current to head. These pointers will help reverse the links.',
            variables: { prev: 'None', current: 'head' }
          },
          {
            lines: [5],
            title: 'Check Current Node',
            description: 'Continue while current node exists. When current is None, we have processed all nodes.',
            variables: { current: 'not None' }
          },
          {
            lines: [6],
            title: 'Save Next Node',
            description: 'Store reference to next node before reversing the link, preventing loss of the rest of the list.',
            variables: { next_node: 'current.next' }
          },
          {
            lines: [7],
            title: 'Reverse Link',
            description: 'Point current node to previous node, reversing the direction of this link.',
            variables: { 'current.next': 'prev' }
          },
          {
            lines: [8, 9],
            title: 'Advance Pointers',
            description: 'Move prev to current and current to next, progressing through the list.',
            variables: { prev: 'current', current: 'next_node' }
          },
          {
            lines: [11],
            title: 'Return New Head',
            description: 'Return prev, which points to the old tail (now the new head of the reversed list).',
            variables: { result: 'prev (new head)' }
          }
        ]
      }
    ],
    keyInsights: [
      'Three pointers (prev, current, next) are needed to reverse links safely',
      'Each node\'s next pointer is reversed to point to the previous node',
      'The original head becomes the tail, and the original tail becomes the head',
      'Can be implemented recursively, but iterative is more space-efficient'
    ],
    whenToUse: [
      'Reversing entire linked lists or sublists',
      'Checking for palindromes by comparing with reversed version',
      'Problems requiring backward traversal of singly linked lists'
    ]
  },

  // Stacks & Queues
  {
    id: 'STK_001',
    name: 'Valid Parentheses',
    category: 'Stacks & Queues',
    difficulty: 'Beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    complexityScore: 0.2,
    icon: 'data_object',
    description: 'Validates if brackets are properly matched and nested using a stack.',
    longDescription: 'Valid Parentheses uses a stack to verify that opening and closing brackets are properly matched and nested. When encountering an opening bracket, push it onto the stack. When encountering a closing bracket, check if it matches the most recent opening bracket on the stack. This LIFO (Last In, First Out) property of stacks makes them perfect for bracket matching problems. The algorithm demonstrates fundamental stack operations and is essential for parsing expressions.',
    tags: ['Stack', 'Bracket Matching', 'String Processing', 'Validation'],
    leetcodeProblems: ['Valid Parentheses', 'Generate Parentheses', 'Longest Valid Parentheses'],
    codeExamples: [
      {
        language: 'typescript',
        code: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = {
    ')': '(',
    ']': '[',
    '}': '{'
  };

  for (const char of s) {
    if (char === '(' || char === '[' || char === '{') {
      stack.push(char);
    } else {
      if (stack.length === 0 || stack.pop() !== pairs[char]) {
        return false;
      }
    }
  }

  return stack.length === 0;
}`,
        steps: [
          {
            lines: [2, 3, 4, 5, 6],
            title: 'Initialize Stack and Pairs',
            description: 'Create empty stack for tracking opening brackets and a map to match closing brackets with their opening counterparts.',
            variables: { stack: '[]', pairs: '{")": "(", "]": "[", "}": "{"}' }
          },
          {
            lines: [9],
            title: 'Iterate Through String',
            description: 'Process each character in the input string one by one.',
            variables: { char: 'current character' }
          },
          {
            lines: [10, 11],
            title: 'Push Opening Bracket',
            description: 'If the character is an opening bracket, push it onto the stack for later matching.',
            variables: { action: 'push to stack', 'stack.length': 'increased' }
          },
          {
            lines: [13],
            title: 'Validate Closing Bracket',
            description: 'For closing brackets, check if stack is empty (no matching opening) or if the popped bracket does not match.',
            variables: { 'stack.length': 'check > 0', 'stack.pop()': 'last opening', 'pairs[char]': 'expected opening' }
          },
          {
            lines: [14],
            title: 'Return False on Mismatch',
            description: 'If closing bracket has no match or wrong match, the string is invalid.',
            variables: { result: 'false' }
          },
          {
            lines: [19],
            title: 'Check Empty Stack',
            description: 'After processing all characters, stack should be empty. Non-empty means unmatched opening brackets exist.',
            variables: { 'stack.length === 0': 'all brackets matched', result: 'true or false' }
          }
        ]
      },
      {
        language: 'python',
        code: `def is_valid(s: str) -> bool:
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}

    for char in s:
        if char in '([{':
            stack.append(char)
        else:
            if not stack or stack.pop() != pairs[char]:
                return False

    return len(stack) == 0`,
        steps: [
          {
            lines: [2, 3],
            title: 'Initialize Stack and Pairs',
            description: 'Create empty stack for tracking opening brackets and a dictionary to match closing brackets with their opening counterparts.',
            variables: { stack: '[]', pairs: '{")": "(", "]": "[", "}": "{"}' }
          },
          {
            lines: [5],
            title: 'Iterate Through String',
            description: 'Process each character in the input string one by one.',
            variables: { char: 'current character' }
          },
          {
            lines: [6, 7],
            title: 'Push Opening Bracket',
            description: 'If the character is an opening bracket, push it onto the stack for later matching.',
            variables: { action: 'append to stack', 'len(stack)': 'increased' }
          },
          {
            lines: [9],
            title: 'Validate Closing Bracket',
            description: 'For closing brackets, check if stack is empty (no matching opening) or if the popped bracket does not match.',
            variables: { 'not stack': 'check empty', 'stack.pop()': 'last opening', 'pairs[char]': 'expected opening' }
          },
          {
            lines: [10],
            title: 'Return False on Mismatch',
            description: 'If closing bracket has no match or wrong match, the string is invalid.',
            variables: { result: 'False' }
          },
          {
            lines: [12],
            title: 'Check Empty Stack',
            description: 'After processing all characters, stack should be empty. Non-empty means unmatched opening brackets exist.',
            variables: { 'len(stack) == 0': 'all brackets matched', result: 'True or False' }
          }
        ]
      }
    ],
    keyInsights: [
      'Stack\'s LIFO property naturally handles nested bracket structures',
      'Each closing bracket must match the most recently opened bracket',
      'Empty stack at the end ensures all brackets were properly closed',
      'Hash map efficiently maps closing brackets to their opening counterparts'
    ],
    whenToUse: [
      'Validating bracket sequences in code parsers and compilers',
      'Checking balanced expressions in mathematical formulas',
      'Implementing syntax checkers and IDE features'
    ]
  },
  {
    id: 'STK_002',
    name: 'Min Stack',
    category: 'Stacks & Queues',
    difficulty: 'Medium',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    complexityScore: 0.35,
    icon: 'vertical_align_bottom',
    description: 'Stack data structure supporting O(1) retrieval of minimum element.',
    longDescription: 'Min Stack is a specialized stack that supports push, pop, top, and retrieving the minimum element in constant time. This is achieved by maintaining two stacks: one for regular values and one for tracking minimum values. Each time a value is pushed, we also push the current minimum onto the min stack. This ensures we can always retrieve the minimum in O(1) time. The design demonstrates how auxiliary data structures can optimize specific operations.',
    tags: ['Stack', 'Design', 'Data Structure', 'Minimum Tracking'],
    leetcodeProblems: ['Min Stack', 'Max Stack'],
    codeExamples: [
      {
        language: 'typescript',
        code: `class MinStack {
  private stack: number[] = [];
  private minStack: number[] = [];

  push(val: number): void {
    this.stack.push(val);
    const min = this.minStack.length === 0
      ? val
      : Math.min(val, this.minStack[this.minStack.length - 1]);
    this.minStack.push(min);
  }

  pop(): void {
    this.stack.pop();
    this.minStack.pop();
  }

  top(): number {
    return this.stack[this.stack.length - 1];
  }

  getMin(): number {
    return this.minStack[this.minStack.length - 1];
  }
}`,
        steps: [
          {
            lines: [2, 3],
            title: 'Initialize Two Stacks',
            description: 'Create main stack for values and minStack to track minimum at each level. Both stacks stay synchronized.',
            variables: { stack: '[]', minStack: '[]' }
          },
          {
            lines: [6],
            title: 'Push Value to Stack',
            description: 'Add the new value to the main stack.',
            variables: { 'stack.push(val)': 'added', val: 'new value' }
          },
          {
            lines: [7, 8, 9],
            title: 'Calculate Current Minimum',
            description: 'Determine minimum by comparing new value with current minimum (top of minStack). If minStack is empty, use the new value.',
            variables: { min: 'Math.min(val, current_min)' }
          },
          {
            lines: [10],
            title: 'Push Minimum to MinStack',
            description: 'Add the minimum value to minStack, ensuring we can retrieve the minimum in O(1) time.',
            variables: { 'minStack.push(min)': 'synchronized' }
          },
          {
            lines: [14, 15],
            title: 'Pop from Both Stacks',
            description: 'Remove elements from both stacks simultaneously to maintain synchronization.',
            variables: { action: 'pop from stack and minStack' }
          },
          {
            lines: [19],
            title: 'Get Top Element',
            description: 'Return the top element from the main stack without removing it.',
            variables: { result: 'stack[stack.length - 1]' }
          },
          {
            lines: [23],
            title: 'Get Minimum in O(1)',
            description: 'Return the top of minStack, which always contains the current minimum value.',
            variables: { result: 'minStack[minStack.length - 1]' }
          }
        ]
      },
      {
        language: 'python',
        code: `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val: int) -> None:
        self.stack.append(val)
        min_val = val if not self.min_stack else min(val, self.min_stack[-1])
        self.min_stack.append(min_val)

    def pop(self) -> None:
        self.stack.pop()
        self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def get_min(self) -> int:
        return self.min_stack[-1]`,
        steps: [
          {
            lines: [2, 3, 4],
            title: 'Initialize Two Stacks',
            description: 'Create main stack for values and min_stack to track minimum at each level. Both stacks stay synchronized.',
            variables: { stack: '[]', min_stack: '[]' }
          },
          {
            lines: [7],
            title: 'Push Value to Stack',
            description: 'Add the new value to the main stack.',
            variables: { 'stack.append(val)': 'added', val: 'new value' }
          },
          {
            lines: [8],
            title: 'Calculate Current Minimum',
            description: 'Determine minimum by comparing new value with current minimum (top of min_stack). If min_stack is empty, use the new value.',
            variables: { min_val: 'min(val, current_min)' }
          },
          {
            lines: [9],
            title: 'Push Minimum to MinStack',
            description: 'Add the minimum value to min_stack, ensuring we can retrieve the minimum in O(1) time.',
            variables: { 'min_stack.append(min_val)': 'synchronized' }
          },
          {
            lines: [12, 13],
            title: 'Pop from Both Stacks',
            description: 'Remove elements from both stacks simultaneously to maintain synchronization.',
            variables: { action: 'pop from stack and min_stack' }
          },
          {
            lines: [16],
            title: 'Get Top Element',
            description: 'Return the top element from the main stack without removing it.',
            variables: { result: 'stack[-1]' }
          },
          {
            lines: [19],
            title: 'Get Minimum in O(1)',
            description: 'Return the top of min_stack, which always contains the current minimum value.',
            variables: { result: 'min_stack[-1]' }
          }
        ]
      }
    ],
    keyInsights: [
      'Auxiliary stack tracks minimum values to achieve O(1) retrieval',
      'Each element in min stack represents minimum for all elements below it',
      'Both stacks must be synchronized during push and pop operations',
      'Space-time tradeoff: uses O(n) extra space for O(1) getMin operation'
    ],
    whenToUse: [
      'Applications requiring frequent access to minimum values in dynamic data',
      'Financial systems tracking minimum prices or values',
      'Real-time monitoring systems needing instant minimum queries'
    ]
  },
  {
    id: 'STK_003',
    name: 'Monotonic Stack',
    category: 'Stacks & Queues',
    difficulty: 'Medium',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    complexityScore: 0.5,
    icon: 'bar_chart',
    description: 'Stack maintaining elements in monotonic order for range queries.',
    longDescription: 'Monotonic Stack maintains elements in either strictly increasing or decreasing order by popping elements that violate the order when pushing new elements. This structure efficiently solves problems involving next greater/smaller elements, temperature spans, and histogram areas. Each element is pushed and popped at most once, resulting in O(n) time complexity. The technique is powerful for problems requiring comparisons with previous elements in a specific order.',
    tags: ['Stack', 'Monotonic', 'Next Greater Element', 'Range Queries'],
    leetcodeProblems: ['Next Greater Element I', 'Daily Temperatures', 'Largest Rectangle in Histogram'],
    codeExamples: [
      {
        language: 'typescript',
        code: `function dailyTemperatures(temperatures: number[]): number[] {
  const n = temperatures.length;
  const result = new Array(n).fill(0);
  const stack: number[] = [];

  for (let i = 0; i < n; i++) {
    while (
      stack.length > 0 &&
      temperatures[i] > temperatures[stack[stack.length - 1]]
    ) {
      const idx = stack.pop()!;
      result[idx] = i - idx;
    }
    stack.push(i);
  }

  return result;
}`,
        steps: [
          {
            lines: [2, 3, 4],
            title: 'Initialize Data Structures',
            description: 'Create result array filled with zeros and an empty stack to store indices. Stack maintains decreasing temperature order.',
            variables: { n: 'temperatures.length', result: '[0, 0, ..., 0]', stack: '[]' }
          },
          {
            lines: [6],
            title: 'Iterate Through Temperatures',
            description: 'Process each temperature from left to right, using index i to track position.',
            variables: { i: 'current index' }
          },
          {
            lines: [7, 8, 9],
            title: 'Check for Warmer Temperature',
            description: 'While stack is not empty and current temperature is warmer than temperature at stack top index, we found a warmer day.',
            variables: { 'temperatures[i]': 'current temp', 'temperatures[stack.top]': 'previous temp' }
          },
          {
            lines: [11],
            title: 'Pop Index from Stack',
            description: 'Remove the index from stack since we found its next warmer temperature.',
            variables: { idx: 'stack.pop()', popped: 'previous colder day' }
          },
          {
            lines: [12],
            title: 'Calculate Days Until Warmer',
            description: 'Compute the difference between current index and popped index to get days until warmer temperature.',
            variables: { 'result[idx]': 'i - idx', days: 'difference' }
          },
          {
            lines: [14],
            title: 'Push Current Index',
            description: 'Add current index to stack, waiting to find its next warmer temperature.',
            variables: { 'stack.push(i)': 'added current index' }
          },
          {
            lines: [17],
            title: 'Return Result Array',
            description: 'Return the result array where each position contains days until warmer temperature (0 if none).',
            variables: { result: 'days array' }
          }
        ]
      },
      {
        language: 'python',
        code: `def daily_temperatures(temperatures: list[int]) -> list[int]:
    n = len(temperatures)
    result = [0] * n
    stack = []

    for i in range(n):
        while stack and temperatures[i] > temperatures[stack[-1]]:
            idx = stack.pop()
            result[idx] = i - idx
        stack.append(i)

    return result`,
        steps: [
          {
            lines: [2, 3, 4],
            title: 'Initialize Data Structures',
            description: 'Create result array filled with zeros and an empty stack to store indices. Stack maintains decreasing temperature order.',
            variables: { n: 'len(temperatures)', result: '[0, 0, ..., 0]', stack: '[]' }
          },
          {
            lines: [6],
            title: 'Iterate Through Temperatures',
            description: 'Process each temperature from left to right, using index i to track position.',
            variables: { i: 'current index' }
          },
          {
            lines: [7],
            title: 'Check for Warmer Temperature',
            description: 'While stack is not empty and current temperature is warmer than temperature at stack top index, we found a warmer day.',
            variables: { 'temperatures[i]': 'current temp', 'temperatures[stack[-1]]': 'previous temp' }
          },
          {
            lines: [8],
            title: 'Pop Index from Stack',
            description: 'Remove the index from stack since we found its next warmer temperature.',
            variables: { idx: 'stack.pop()', popped: 'previous colder day' }
          },
          {
            lines: [9],
            title: 'Calculate Days Until Warmer',
            description: 'Compute the difference between current index and popped index to get days until warmer temperature.',
            variables: { 'result[idx]': 'i - idx', days: 'difference' }
          },
          {
            lines: [10],
            title: 'Push Current Index',
            description: 'Add current index to stack, waiting to find its next warmer temperature.',
            variables: { 'stack.append(i)': 'added current index' }
          },
          {
            lines: [12],
            title: 'Return Result Array',
            description: 'Return the result array where each position contains days until warmer temperature (0 if none).',
            variables: { result: 'days array' }
          }
        ]
      }
    ],
    keyInsights: [
      'Maintains monotonic order by popping violating elements before pushing',
      'Each element is pushed and popped exactly once, ensuring O(n) complexity',
      'Can be increasing or decreasing depending on problem requirements',
      'Efficiently finds next greater/smaller elements without nested loops'
    ],
    whenToUse: [
      'Finding next greater or smaller elements in arrays',
      'Calculating spans, ranges, or windows with specific properties',
      'Histogram and bar chart problems involving maximum areas'
    ]
  },

  // Heaps
  {
    id: 'HEA_001',
    name: 'Kth Largest Element',
    category: 'Heaps',
    difficulty: 'Medium',
    timeComplexity: 'O(n log k)',
    spaceComplexity: 'O(k)',
    complexityScore: 0.5,
    icon: 'leaderboard',
    description: 'Finds the kth largest element using a min heap of size k.',
    longDescription: 'Kth Largest Element efficiently finds the kth largest element in an unsorted array using a min heap of size k. By maintaining only k elements in the heap, we ensure the smallest element in the heap is the kth largest overall. This approach is more space-efficient than sorting the entire array and faster than QuickSelect for multiple queries. The algorithm demonstrates the power of heaps for selection problems and priority-based operations.',
    tags: ['Heap', 'Priority Queue', 'Selection', 'Top K'],
    leetcodeProblems: ['Kth Largest Element in an Array', 'Kth Smallest Element in a Sorted Matrix'],
    codeExamples: [
      {
        language: 'typescript',
        code: `function findKthLargest(nums: number[], k: number): number {
  const minHeap: number[] = [];

  function heapifyUp(idx: number) {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (minHeap[idx] >= minHeap[parent]) break;
      [minHeap[idx], minHeap[parent]] = [minHeap[parent], minHeap[idx]];
      idx = parent;
    }
  }

  for (const num of nums) {
    minHeap.push(num);
    heapifyUp(minHeap.length - 1);

    if (minHeap.length > k) {
      minHeap[0] = minHeap.pop()!;
      let i = 0;
      while (2 * i + 1 < minHeap.length) {
        let smallest = 2 * i + 1;
        if (2 * i + 2 < minHeap.length && minHeap[2 * i + 2] < minHeap[smallest]) {
          smallest = 2 * i + 2;
        }
        if (minHeap[i] <= minHeap[smallest]) break;
        [minHeap[i], minHeap[smallest]] = [minHeap[smallest], minHeap[i]];
        i = smallest;
      }
    }
  }

  return minHeap[0];
}`,
        steps: [
          {
            lines: [2],
            title: 'Initialize Min Heap',
            description: 'Create an empty min heap to store at most k largest elements. The minimum element will be at the root.',
            variables: { minHeap: '[]', capacity: 'k' }
          },
          {
            lines: [4, 5, 6, 7, 8, 9, 10, 11],
            title: 'Define HeapifyUp Function',
            description: 'Helper function to maintain heap property by bubbling up smaller elements toward the root after insertion.',
            variables: { operation: 'bubble up' }
          },
          {
            lines: [14, 15],
            title: 'Insert and Heapify',
            description: 'Add new number to heap and restore min heap property by heapifying up from the last position.',
            variables: { num: 'current number', action: 'push and heapifyUp' }
          },
          {
            lines: [17],
            title: 'Check Heap Size',
            description: 'If heap size exceeds k, remove the smallest element to maintain exactly k largest elements.',
            variables: { 'minHeap.length': '> k', action: 'remove minimum' }
          },
          {
            lines: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
            title: 'Remove Min and Heapify Down',
            description: 'Replace root with last element and heapify down by swapping with smaller child until heap property is restored.',
            variables: { operation: 'bubble down', removed: 'smallest element' }
          },
          {
            lines: [32],
            title: 'Return Kth Largest',
            description: 'After processing all numbers, the root of min heap (smallest in heap) is the kth largest element overall.',
            variables: { result: 'minHeap[0]', meaning: 'kth largest' }
          }
        ]
      },
      {
        language: 'python',
        code: `import heapq

def find_kth_largest(nums: list[int], k: int) -> int:
    min_heap = []

    for num in nums:
        heapq.heappush(min_heap, num)

        if len(min_heap) > k:
            heapq.heappop(min_heap)

    return min_heap[0]`,
        steps: [
          {
            lines: [4],
            title: 'Initialize Min Heap',
            description: 'Create an empty min heap to store at most k largest elements. The minimum element will be at the root.',
            variables: { min_heap: '[]', capacity: 'k' }
          },
          {
            lines: [6],
            title: 'Iterate Through Numbers',
            description: 'Process each number in the input array.',
            variables: { num: 'current number' }
          },
          {
            lines: [7],
            title: 'Insert into Heap',
            description: 'Add new number to heap. Python\'s heapq automatically maintains min heap property.',
            variables: { action: 'heappush(min_heap, num)' }
          },
          {
            lines: [9, 10],
            title: 'Maintain Heap Size',
            description: 'If heap size exceeds k, remove the smallest element to maintain exactly k largest elements.',
            variables: { 'len(min_heap) > k': 'True', action: 'heappop' }
          },
          {
            lines: [12],
            title: 'Return Kth Largest',
            description: 'After processing all numbers, the root of min heap (smallest in heap) is the kth largest element overall.',
            variables: { result: 'min_heap[0]', meaning: 'kth largest' }
          }
        ]
      }
    ],
    keyInsights: [
      'Min heap of size k ensures the root is always the kth largest element',
      'More space-efficient than sorting when k is small compared to n',
      'Each insertion and deletion takes O(log k) time',
      'Can be used for streaming data where elements arrive continuously'
    ],
    whenToUse: [
      'Finding top k elements in large datasets',
      'Processing streaming data with limited memory',
      'Maintaining a sliding window of largest/smallest elements'
    ]
  },
  {
    id: 'HEA_002',
    name: 'Merge K Sorted Lists',
    category: 'Heaps',
    difficulty: 'Advanced',
    timeComplexity: 'O(n log k)',
    spaceComplexity: 'O(k)',
    complexityScore: 0.7,
    icon: 'call_merge',
    description: 'Merges k sorted linked lists using a min heap for efficient selection.',
    longDescription: 'Merge K Sorted Lists combines k sorted linked lists into one sorted list using a min heap to efficiently select the next smallest element. Instead of comparing all k lists at each step, the heap maintains only the current head of each list, providing O(log k) selection time. This approach is significantly more efficient than merging lists pairwise. The algorithm demonstrates how heaps optimize multi-way merge operations and is used in external sorting and database operations.',
    tags: ['Heap', 'Merge', 'Linked Lists', 'Priority Queue', 'Multi-way Merge'],
    leetcodeProblems: ['Merge k Sorted Lists', 'Smallest Range Covering Elements from K Lists'],
    codeExamples: [
      {
        language: 'typescript',
        code: `function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  const minHeap: Array<[number, number, ListNode]> = [];

  for (let i = 0; i < lists.length; i++) {
    if (lists[i] !== null) {
      minHeap.push([lists[i]!.val, i, lists[i]!]);
    }
  }

  minHeap.sort((a, b) => a[0] - b[0]);

  const dummy = new ListNode(0);
  let current = dummy;

  while (minHeap.length > 0) {
    const [val, listIdx, node] = minHeap.shift()!;
    current.next = node;
    current = current.next;

    if (node.next !== null) {
      const insertIdx = minHeap.findIndex(([v]) => v > node.next!.val);
      const newEntry: [number, number, ListNode] = [node.next.val, listIdx, node.next];
      if (insertIdx === -1) minHeap.push(newEntry);
      else minHeap.splice(insertIdx, 0, newEntry);
    }
  }

  return dummy.next;
}`,
        steps: [
          {
            lines: [2],
            title: 'Initialize Min Heap',
            description: 'Create heap to store tuples of [value, list index, node]. This allows selecting the minimum across all k lists efficiently.',
            variables: { minHeap: '[]' }
          },
          {
            lines: [4, 5, 6, 7, 8],
            title: 'Add First Nodes to Heap',
            description: 'Push the head node from each non-empty list into the heap, representing the current front of each list.',
            variables: { heapSize: 'k lists', action: 'push head nodes' }
          },
          {
            lines: [10],
            title: 'Sort Heap Initially',
            description: 'Sort the heap by node values to establish min heap property.',
            variables: { sorted: 'by value (first element)' }
          },
          {
            lines: [12, 13],
            title: 'Create Dummy Node',
            description: 'Initialize dummy node and current pointer to build the merged result list.',
            variables: { dummy: 'ListNode(0)', current: 'dummy' }
          },
          {
            lines: [16, 17, 18],
            title: 'Extract Minimum Node',
            description: 'Remove the smallest node from heap, attach it to result list, and advance current pointer.',
            variables: { extracted: 'minHeap.shift()', action: 'add to result' }
          },
          {
            lines: [20, 21, 22, 23, 24],
            title: 'Add Next Node from Same List',
            description: 'If extracted node has a next node, insert it into heap at correct sorted position to maintain min heap property.',
            variables: { newEntry: 'node.next', action: 'insert sorted' }
          },
          {
            lines: [28],
            title: 'Return Merged List',
            description: 'After heap is empty, all nodes are merged. Return dummy.next as the final merged list.',
            variables: { result: 'dummy.next' }
          }
        ]
      },
      {
        language: 'python',
        code: `import heapq

def merge_k_lists(lists: list[ListNode]) -> ListNode:
    min_heap = []

    for i, node in enumerate(lists):
        if node:
            heapq.heappush(min_heap, (node.val, i, node))

    dummy = ListNode(0)
    current = dummy

    while min_heap:
        val, list_idx, node = heapq.heappop(min_heap)
        current.next = node
        current = current.next

        if node.next:
            heapq.heappush(min_heap, (node.next.val, list_idx, node.next))

    return dummy.next`,
        steps: [
          {
            lines: [4],
            title: 'Initialize Min Heap',
            description: 'Create heap to store tuples of (value, list index, node). This allows selecting the minimum across all k lists efficiently.',
            variables: { min_heap: '[]' }
          },
          {
            lines: [6, 7, 8],
            title: 'Add First Nodes to Heap',
            description: 'Push the head node from each non-empty list into the heap as a tuple, representing the current front of each list.',
            variables: { heapSize: 'k lists', action: 'heappush head nodes' }
          },
          {
            lines: [10, 11],
            title: 'Create Dummy Node',
            description: 'Initialize dummy node and current pointer to build the merged result list.',
            variables: { dummy: 'ListNode(0)', current: 'dummy' }
          },
          {
            lines: [13],
            title: 'Process While Heap Has Nodes',
            description: 'Continue merging while heap contains nodes from any list.',
            variables: { min_heap: 'not empty' }
          },
          {
            lines: [14, 15, 16],
            title: 'Extract Minimum Node',
            description: 'Remove the smallest node from heap, attach it to result list, and advance current pointer.',
            variables: { extracted: 'heappop(min_heap)', action: 'add to result' }
          },
          {
            lines: [18, 19],
            title: 'Add Next Node from Same List',
            description: 'If extracted node has a next node, push it into heap as a new tuple to maintain all lists in consideration.',
            variables: { newEntry: 'node.next', action: 'heappush' }
          },
          {
            lines: [21],
            title: 'Return Merged List',
            description: 'After heap is empty, all nodes are merged. Return dummy.next as the final merged list.',
            variables: { result: 'dummy.next' }
          }
        ]
      }
    ],
    keyInsights: [
      'Heap reduces comparison complexity from O(k) to O(log k) per element',
      'Only stores k elements in heap regardless of total list size',
      'More efficient than sequential pairwise merging for large k',
      'Fundamental technique for external sorting and distributed systems'
    ],
    whenToUse: [
      'Merging multiple sorted data streams or files',
      'External sorting when data cannot fit in memory',
      'Combining results from multiple sorted databases or APIs'
    ]
  },
  {
    id: 'HEA_003',
    name: 'Top K Frequent Elements',
    category: 'Heaps',
    difficulty: 'Medium',
    timeComplexity: 'O(n log k)',
    spaceComplexity: 'O(n)',
    complexityScore: 0.55,
    icon: 'insights',
    description: 'Finds k most frequent elements using hash map and min heap.',
    longDescription: 'Top K Frequent Elements combines hash map counting with a min heap to efficiently find the k most frequent elements in an array. First, count frequencies using a hash map. Then, maintain a min heap of size k based on frequencies. The heap root contains the kth most frequent element, ensuring all k most frequent elements are retained. This approach is more efficient than sorting all elements by frequency, especially when k is small compared to the number of unique elements.',
    tags: ['Heap', 'Hash Map', 'Frequency Count', 'Top K', 'Priority Queue'],
    leetcodeProblems: ['Top K Frequent Elements', 'Top K Frequent Words', 'Sort Characters By Frequency'],
    codeExamples: [
      {
        language: 'typescript',
        code: `function topKFrequent(nums: number[], k: number): number[] {
  const freqMap = new Map<number, number>();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  const minHeap: Array<[number, number]> = [];

  for (const [num, freq] of freqMap) {
    minHeap.push([freq, num]);
    minHeap.sort((a, b) => a[0] - b[0]);

    if (minHeap.length > k) {
      minHeap.shift();
    }
  }

  return minHeap.map(([_, num]) => num);
}`,
        steps: [
          {
            lines: [2],
            title: 'Initialize Frequency Map',
            description: 'Create a hash map to count the frequency of each number in the array.',
            variables: { freqMap: 'Map<number, count>' }
          },
          {
            lines: [3, 4],
            title: 'Count Frequencies',
            description: 'Iterate through all numbers and increment their count in the frequency map.',
            variables: { num: 'current number', count: 'freqMap.get(num) + 1' }
          },
          {
            lines: [7],
            title: 'Initialize Min Heap',
            description: 'Create a min heap to store [frequency, number] tuples. Will maintain at most k elements.',
            variables: { minHeap: '[]', maxSize: 'k' }
          },
          {
            lines: [10, 11],
            title: 'Add to Heap and Sort',
            description: 'Push each [frequency, number] pair to heap and sort by frequency to maintain min heap property.',
            variables: { pushed: '[freq, num]', sorted: 'by frequency' }
          },
          {
            lines: [13, 14],
            title: 'Maintain Heap Size',
            description: 'If heap size exceeds k, remove the element with minimum frequency, keeping only top k frequent elements.',
            variables: { 'heapSize > k': 'remove minimum', action: 'shift()' }
          },
          {
            lines: [18],
            title: 'Extract Numbers',
            description: 'Extract just the numbers from heap tuples, discarding frequencies. These are the k most frequent elements.',
            variables: { result: 'array of numbers' }
          }
        ]
      },
      {
        language: 'python',
        code: `import heapq
from collections import Counter

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    freq_map = Counter(nums)
    min_heap = []

    for num, freq in freq_map.items():
        heapq.heappush(min_heap, (freq, num))

        if len(min_heap) > k:
            heapq.heappop(min_heap)

    return [num for freq, num in min_heap]`,
        steps: [
          {
            lines: [5],
            title: 'Count Frequencies',
            description: 'Use Counter to create a hash map that counts the frequency of each number in the array.',
            variables: { freq_map: 'Counter(nums)' }
          },
          {
            lines: [6],
            title: 'Initialize Min Heap',
            description: 'Create a min heap to store (frequency, number) tuples. Will maintain at most k elements.',
            variables: { min_heap: '[]', maxSize: 'k' }
          },
          {
            lines: [8],
            title: 'Iterate Through Frequencies',
            description: 'Process each unique number and its frequency from the frequency map.',
            variables: { num: 'number', freq: 'count' }
          },
          {
            lines: [9],
            title: 'Add to Heap',
            description: 'Push (frequency, number) tuple to heap. Heap automatically maintains min heap property based on frequency.',
            variables: { pushed: '(freq, num)', sorted: 'by frequency' }
          },
          {
            lines: [11, 12],
            title: 'Maintain Heap Size',
            description: 'If heap size exceeds k, remove the element with minimum frequency, keeping only top k frequent elements.',
            variables: { 'len(min_heap) > k': 'remove minimum', action: 'heappop()' }
          },
          {
            lines: [14],
            title: 'Extract Numbers',
            description: 'Extract just the numbers from heap tuples using list comprehension. These are the k most frequent elements.',
            variables: { result: 'list of numbers' }
          }
        ]
      }
    ],
    keyInsights: [
      'Combines hash map for counting with heap for top-k selection',
      'Min heap ensures we keep only the k most frequent elements',
      'More efficient than full sorting when k << number of unique elements',
      'Can be optimized further using bucket sort for O(n) complexity'
    ],
    whenToUse: [
      'Finding trending topics or popular items in large datasets',
      'Analytics and reporting on most common events or values',
      'Real-time monitoring of frequent patterns in streaming data'
    ]
  },

  // Hashing
  {
    id: 'HAS_001',
    name: 'Two Sum (Hash Map)',
    category: 'Hashing',
    difficulty: 'Beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    complexityScore: 0.15,
    icon: 'fingerprint',
    description: 'Finds two numbers that sum to target using hash map for O(1) lookups.',
    longDescription: 'Two Sum uses a hash map to find two numbers in an array that add up to a target value in linear time. As we iterate through the array, we check if the complement (target - current number) exists in the hash map. If found, we have our pair; otherwise, we store the current number in the map. This transforms a brute force O(n²) solution into an efficient O(n) solution by trading space for time. The technique is fundamental to many sum-based problems.',
    tags: ['Hash Map', 'Two Sum', 'Array', 'Complement Search'],
    leetcodeProblems: ['Two Sum', 'Subarray Sum Equals K'],
    codeExamples: [
      {
        language: 'typescript',
        code: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }

    map.set(nums[i], i);
  }

  return [];
}`,
        steps: [
          {
            lines: [2],
            title: 'Initialize Hash Map',
            description: 'Create a hash map to store numbers and their indices for O(1) complement lookups.',
            variables: { map: 'Map<number, index>' }
          },
          {
            lines: [4],
            title: 'Iterate Through Array',
            description: 'Process each number in the array with its index.',
            variables: { i: 'current index', 'nums[i]': 'current number' }
          },
          {
            lines: [5],
            title: 'Calculate Complement',
            description: 'Compute the complement value needed to reach the target sum.',
            variables: { complement: 'target - nums[i]' }
          },
          {
            lines: [7, 8],
            title: 'Check for Complement',
            description: 'If complement exists in map, we found the two numbers. Return both indices immediately.',
            variables: { found: 'map.has(complement)', result: '[map.get(complement), i]' }
          },
          {
            lines: [11],
            title: 'Store Current Number',
            description: 'Add current number and index to map for future complement checks.',
            variables: { 'map.set': 'nums[i] -> i' }
          },
          {
            lines: [14],
            title: 'No Solution Found',
            description: 'If loop completes without finding a pair, return empty array.',
            variables: { result: '[]' }
          }
        ]
      },
      {
        language: 'python',
        code: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}

    for i, num in enumerate(nums):
        complement = target - num

        if complement in seen:
            return [seen[complement], i]

        seen[num] = i

    return []`,
        steps: [
          {
            lines: [2],
            title: 'Initialize Hash Map',
            description: 'Create a dictionary to store numbers and their indices for O(1) complement lookups.',
            variables: { seen: '{}' }
          },
          {
            lines: [4],
            title: 'Iterate Through Array',
            description: 'Process each number with its index using enumerate.',
            variables: { i: 'current index', num: 'current number' }
          },
          {
            lines: [5],
            title: 'Calculate Complement',
            description: 'Compute the complement value needed to reach the target sum.',
            variables: { complement: 'target - num' }
          },
          {
            lines: [7, 8],
            title: 'Check for Complement',
            description: 'If complement exists in hash map, we found the two numbers. Return both indices immediately.',
            variables: { found: 'complement in seen', result: '[seen[complement], i]' }
          },
          {
            lines: [10],
            title: 'Store Current Number',
            description: 'Add current number and index to hash map for future complement checks.',
            variables: { 'seen[num]': 'i' }
          },
          {
            lines: [12],
            title: 'No Solution Found',
            description: 'If loop completes without finding a pair, return empty list.',
            variables: { result: '[]' }
          }
        ]
      }
    ],
    keyInsights: [
      'Hash map provides O(1) average-case lookup for complements',
      'Single pass through array is sufficient with proper bookkeeping',
      'Space-time tradeoff: O(n) space for O(n) time instead of O(n²)',
      'Foundation for many sum-based problems including 3Sum and 4Sum'
    ],
    whenToUse: [
      'Finding pairs that sum to a target value',
      'Any problem requiring complement or difference lookups',
      'Optimizing nested loops that search for matching elements'
    ]
  },
  {
    id: 'HAS_002',
    name: 'Group Anagrams',
    category: 'Hashing',
    difficulty: 'Medium',
    timeComplexity: 'O(nk)',
    spaceComplexity: 'O(nk)',
    complexityScore: 0.4,
    icon: 'group_work',
    description: 'Groups strings that are anagrams using sorted strings as hash keys.',
    longDescription: 'Group Anagrams organizes strings into groups where each group contains anagrams of each other. The key insight is that anagrams, when sorted, produce the same string. We use this sorted string as a hash key to group anagrams together in a hash map. Each unique sorted string maps to a list of original strings that are anagrams. This approach efficiently handles grouping in a single pass, making it optimal for large datasets with many anagrams.',
    tags: ['Hash Map', 'Anagram', 'String', 'Grouping', 'Sorting'],
    leetcodeProblems: ['Group Anagrams', 'Valid Anagram', 'Find All Anagrams in a String'],
    codeExamples: [
      {
        language: 'typescript',
        code: `function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();

  for (const str of strs) {
    const key = str.split('').sort().join('');

    if (!map.has(key)) {
      map.set(key, []);
    }

    map.get(key)!.push(str);
  }

  return Array.from(map.values());
}`,
        steps: [
          {
            lines: [2],
            title: 'Initialize Anagram Map',
            description: 'Create hash map where keys are sorted strings and values are arrays of original anagram strings.',
            variables: { map: 'Map<sorted_string, string[]>' }
          },
          {
            lines: [4],
            title: 'Iterate Through Strings',
            description: 'Process each string in the input array.',
            variables: { str: 'current string' }
          },
          {
            lines: [5],
            title: 'Generate Sorted Key',
            description: 'Sort characters alphabetically to create a canonical key. Anagrams produce the same sorted key.',
            variables: { key: 'sorted(str)', example: '"eat" -> "aet"' }
          },
          {
            lines: [7, 8],
            title: 'Initialize Group if Needed',
            description: 'If this sorted key is new, create an empty array to hold its anagram group.',
            variables: { action: 'map.set(key, [])' }
          },
          {
            lines: [11],
            title: 'Add to Anagram Group',
            description: 'Append the original string to the array corresponding to its sorted key.',
            variables: { action: 'map.get(key).push(str)' }
          },
          {
            lines: [14],
            title: 'Return Grouped Anagrams',
            description: 'Extract all value arrays from the map, which are the grouped anagrams.',
            variables: { result: 'array of anagram groups' }
          }
        ]
      },
      {
        language: 'python',
        code: `from collections import defaultdict

def group_anagrams(strs: list[str]) -> list[list[str]]:
    anagram_map = defaultdict(list)

    for s in strs:
        key = ''.join(sorted(s))
        anagram_map[key].append(s)

    return list(anagram_map.values())`,
        steps: [
          {
            lines: [4],
            title: 'Initialize Anagram Map',
            description: 'Create defaultdict where keys are sorted strings and values are lists of original anagram strings.',
            variables: { anagram_map: 'defaultdict(list)' }
          },
          {
            lines: [6],
            title: 'Iterate Through Strings',
            description: 'Process each string in the input list.',
            variables: { s: 'current string' }
          },
          {
            lines: [7],
            title: 'Generate Sorted Key',
            description: 'Sort characters alphabetically to create a canonical key. Anagrams produce the same sorted key.',
            variables: { key: 'sorted(s)', example: '"eat" -> "aet"' }
          },
          {
            lines: [8],
            title: 'Add to Anagram Group',
            description: 'Append the original string to the list corresponding to its sorted key. defaultdict auto-creates empty lists.',
            variables: { action: 'anagram_map[key].append(s)' }
          },
          {
            lines: [10],
            title: 'Return Grouped Anagrams',
            description: 'Extract all value lists from the map, which are the grouped anagrams.',
            variables: { result: 'list of anagram groups' }
          }
        ]
      }
    ],
    keyInsights: [
      'Sorted strings serve as canonical representation for anagram groups',
      'Hash map efficiently groups strings with O(1) average insertion',
      'Alternative: character count arrays can replace sorting for better performance',
      'Single pass through all strings with sorting per string'
    ],
    whenToUse: [
      'Organizing text data by anagram relationships',
      'Word games and puzzles involving anagrams',
      'Deduplication and clustering of similar string patterns'
    ]
  },
  {
    id: 'HAS_003',
    name: 'LRU Cache',
    category: 'Hashing',
    difficulty: 'Medium',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    complexityScore: 0.6,
    icon: 'cached',
    description: 'Cache with O(1) get/put operations using hash map and doubly linked list.',
    longDescription: 'LRU (Least Recently Used) Cache is a data structure that supports O(1) get and put operations while maintaining a capacity limit by evicting the least recently used items. It combines a hash map for O(1) key lookups with a doubly linked list to track access order. The most recently used items are at the front, and least recently used at the back. When capacity is exceeded, the tail node is removed. This design is crucial for caching systems, operating systems, and databases.',
    tags: ['Hash Map', 'Doubly Linked List', 'Cache', 'LRU', 'Design'],
    leetcodeProblems: ['LRU Cache', 'LFU Cache', 'Design HashMap'],
    codeExamples: [
      {
        language: 'typescript',
        code: `class LRUCache {
  private capacity: number;
  private cache: Map<number, number>;
  private order: number[];

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
    this.order = [];
  }

  get(key: number): number {
    if (!this.cache.has(key)) return -1;

    const idx = this.order.indexOf(key);
    this.order.splice(idx, 1);
    this.order.push(key);

    return this.cache.get(key)!;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      const idx = this.order.indexOf(key);
      this.order.splice(idx, 1);
    } else if (this.cache.size >= this.capacity) {
      const lru = this.order.shift()!;
      this.cache.delete(lru);
    }

    this.cache.set(key, value);
    this.order.push(key);
  }
}`,
        steps: [
          {
            lines: [6, 7, 8, 9],
            title: 'Initialize Cache Components',
            description: 'Set up capacity limit, hash map for O(1) key-value access, and array to track access order (most recent at end).',
            variables: { capacity: 'max size', cache: 'Map<key, value>', order: '[]' }
          },
          {
            lines: [13],
            title: 'Check Key Existence (Get)',
            description: 'Return -1 if key does not exist in cache.',
            variables: { 'cache.has(key)': 'false', result: '-1' }
          },
          {
            lines: [15, 16, 17],
            title: 'Update Access Order (Get)',
            description: 'Move accessed key to end of order array, marking it as most recently used.',
            variables: { action: 'remove and push to end' }
          },
          {
            lines: [19],
            title: 'Return Cached Value',
            description: 'Return the value associated with the key from the cache map.',
            variables: { result: 'cache.get(key)' }
          },
          {
            lines: [23, 24, 25],
            title: 'Update Existing Key (Put)',
            description: 'If key exists, remove it from order array (will be re-added at end).',
            variables: { action: 'splice from order' }
          },
          {
            lines: [26, 27, 28],
            title: 'Evict LRU if Full (Put)',
            description: 'If cache is at capacity and key is new, remove least recently used item (first in order array).',
            variables: { lru: 'order[0]', action: 'delete from cache' }
          },
          {
            lines: [31, 32],
            title: 'Insert/Update Key (Put)',
            description: 'Set the key-value in cache and add key to end of order array as most recently used.',
            variables: { action: 'cache.set and order.push' }
          }
        ]
      },
      {
        language: 'python',
        code: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.cache = OrderedDict()
        self.capacity = capacity

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1

        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)

        self.cache[key] = value

        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)`,
        steps: [
          {
            lines: [4, 5, 6],
            title: 'Initialize Cache Components',
            description: 'Set up capacity limit and OrderedDict which maintains insertion order and provides O(1) key-value access.',
            variables: { capacity: 'max size', cache: 'OrderedDict()' }
          },
          {
            lines: [9, 10],
            title: 'Check Key Existence (Get)',
            description: 'Return -1 if key does not exist in cache.',
            variables: { 'key not in cache': 'True', result: '-1' }
          },
          {
            lines: [12],
            title: 'Update Access Order (Get)',
            description: 'Move accessed key to end of OrderedDict, marking it as most recently used.',
            variables: { action: 'move_to_end(key)' }
          },
          {
            lines: [13],
            title: 'Return Cached Value',
            description: 'Return the value associated with the key from the cache.',
            variables: { result: 'cache[key]' }
          },
          {
            lines: [16, 17],
            title: 'Update Existing Key (Put)',
            description: 'If key exists, move it to end to mark as most recently used.',
            variables: { action: 'move_to_end(key)' }
          },
          {
            lines: [19],
            title: 'Insert/Update Key (Put)',
            description: 'Set the key-value in cache. For existing keys, updates value; for new keys, adds to end.',
            variables: { action: 'cache[key] = value' }
          },
          {
            lines: [21, 22],
            title: 'Evict LRU if Full (Put)',
            description: 'If cache exceeds capacity, remove least recently used item (first item) using popitem with last=False.',
            variables: { 'len(cache) > capacity': 'evict LRU', action: 'popitem(last=False)' }
          }
        ]
      }
    ],
    keyInsights: [
      'Hash map enables O(1) key-value lookups',
      'Doubly linked list maintains access order for O(1) eviction',
      'Moving accessed items to front keeps LRU items at the back',
      'Essential pattern for implementing efficient caching systems'
    ],
    whenToUse: [
      'Implementing caching layers in applications and databases',
      'Managing limited memory with frequently accessed data',
      'Browser cache, CDN cache, and operating system page replacement'
    ]
  },

  // Bit Manipulation
  {
    id: 'BIT_001',
    name: 'Single Number (XOR)',
    category: 'Bit Manipulation',
    difficulty: 'Beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    complexityScore: 0.15,
    icon: 'memory',
    description: 'Finds unique element in array where others appear twice using XOR.',
    longDescription: 'Single Number uses the XOR operation to find the unique element in an array where every other element appears exactly twice. XOR has special properties: a ^ a = 0 and a ^ 0 = a, meaning pairs cancel out to zero. By XORing all elements together, duplicate values cancel out, leaving only the single unique value. This elegant solution requires only O(1) space and demonstrates how bit manipulation can solve problems that seem to require hash maps or sorting.',
    tags: ['XOR', 'Bit Manipulation', 'Array', 'Unique Element'],
    leetcodeProblems: ['Single Number', 'Single Number II', 'Single Number III'],
    codeExamples: [
      {
        language: 'typescript',
        code: `function singleNumber(nums: number[]): number {
  let result = 0;

  for (const num of nums) {
    result ^= num;
  }

  return result;
}`,
        steps: [
          {
            lines: [2],
            title: 'Initialize Result to Zero',
            description: 'Start with result = 0. XOR with 0 leaves numbers unchanged (a ^ 0 = a).',
            variables: { result: '0' }
          },
          {
            lines: [4],
            title: 'Iterate Through Array',
            description: 'Process each number in the array.',
            variables: { num: 'current number' }
          },
          {
            lines: [5],
            title: 'XOR with Current Number',
            description: 'XOR result with current number. Duplicate pairs cancel out (a ^ a = 0), leaving only the unique number.',
            variables: { operation: 'result ^= num', property: 'a ^ a = 0' }
          },
          {
            lines: [8],
            title: 'Return Unique Number',
            description: 'After XORing all numbers, duplicates cancel to 0, and result contains the single unique number.',
            variables: { result: 'unique number' }
          }
        ]
      },
      {
        language: 'python',
        code: `def single_number(nums: list[int]) -> int:
    result = 0

    for num in nums:
        result ^= num

    return result`,
        steps: [
          {
            lines: [2],
            title: 'Initialize Result to Zero',
            description: 'Start with result = 0. XOR with 0 leaves numbers unchanged (a ^ 0 = a).',
            variables: { result: '0' }
          },
          {
            lines: [4],
            title: 'Iterate Through Array',
            description: 'Process each number in the array.',
            variables: { num: 'current number' }
          },
          {
            lines: [5],
            title: 'XOR with Current Number',
            description: 'XOR result with current number. Duplicate pairs cancel out (a ^ a = 0), leaving only the unique number.',
            variables: { operation: 'result ^= num', property: 'a ^ a = 0' }
          },
          {
            lines: [7],
            title: 'Return Unique Number',
            description: 'After XORing all numbers, duplicates cancel to 0, and result contains the single unique number.',
            variables: { result: 'unique number' }
          }
        ]
      }
    ],
    keyInsights: [
      'XOR of two identical numbers is 0, enabling cancellation of pairs',
      'XOR is commutative and associative, so order does not matter',
      'Achieves O(1) space compared to O(n) for hash map approaches',
      'Foundation for more complex bit manipulation problems'
    ],
    whenToUse: [
      'Finding unique elements in arrays with paired duplicates',
      'Memory-constrained environments requiring O(1) space',
      'Problems involving parity or detecting differences'
    ]
  },
  {
    id: 'BIT_002',
    name: 'Counting Bits',
    category: 'Bit Manipulation',
    difficulty: 'Medium',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    complexityScore: 0.35,
    icon: 'pin',
    description: 'Counts set bits for all numbers from 0 to n using dynamic programming.',
    longDescription: 'Counting Bits efficiently counts the number of 1-bits in the binary representation of all numbers from 0 to n using dynamic programming. The key insight is that the count for number i is related to i/2: count[i] = count[i >> 1] + (i & 1). The right shift divides by 2, and the bitwise AND checks if the last bit is 1. This recurrence relation allows us to build the solution iteratively without counting bits for each number independently, achieving O(n) time instead of O(n log n).',
    tags: ['Bit Manipulation', 'Dynamic Programming', 'Popcount', 'Binary'],
    leetcodeProblems: ['Counting Bits', 'Number of 1 Bits', 'Reverse Bits'],
    codeExamples: [
      {
        language: 'typescript',
        code: `function countBits(n: number): number[] {
  const result = new Array(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    result[i] = result[i >> 1] + (i & 1);
  }

  return result;
}`,
        steps: [
          {
            lines: [2],
            title: 'Initialize Result Array',
            description: 'Create array of size n+1 filled with zeros. Index i will store count of 1-bits in number i.',
            variables: { result: '[0, 0, ..., 0]', size: 'n + 1' }
          },
          {
            lines: [4],
            title: 'Iterate from 1 to n',
            description: 'Process each number starting from 1 (result[0] = 0 is already correct).',
            variables: { i: 'current number' }
          },
          {
            lines: [5],
            title: 'Apply DP Recurrence',
            description: 'Use relation: count[i] = count[i >> 1] + (i & 1). Right shift divides by 2, and (i & 1) adds 1 if last bit is set.',
            variables: { 'i >> 1': 'i / 2', 'i & 1': 'last bit', formula: 'count[i/2] + last_bit' }
          },
          {
            lines: [8],
            title: 'Return Bit Counts',
            description: 'Return the completed array where result[i] contains the number of 1-bits in binary representation of i.',
            variables: { result: 'array of bit counts' }
          }
        ]
      },
      {
        language: 'python',
        code: `def count_bits(n: int) -> list[int]:
    result = [0] * (n + 1)

    for i in range(1, n + 1):
        result[i] = result[i >> 1] + (i & 1)

    return result`,
        steps: [
          {
            lines: [2],
            title: 'Initialize Result Array',
            description: 'Create list of size n+1 filled with zeros. Index i will store count of 1-bits in number i.',
            variables: { result: '[0, 0, ..., 0]', size: 'n + 1' }
          },
          {
            lines: [4],
            title: 'Iterate from 1 to n',
            description: 'Process each number starting from 1 (result[0] = 0 is already correct).',
            variables: { i: 'current number' }
          },
          {
            lines: [5],
            title: 'Apply DP Recurrence',
            description: 'Use relation: count[i] = count[i >> 1] + (i & 1). Right shift divides by 2, and (i & 1) adds 1 if last bit is set.',
            variables: { 'i >> 1': 'i // 2', 'i & 1': 'last bit', formula: 'count[i//2] + last_bit' }
          },
          {
            lines: [7],
            title: 'Return Bit Counts',
            description: 'Return the completed list where result[i] contains the number of 1-bits in binary representation of i.',
            variables: { result: 'list of bit counts' }
          }
        ]
      }
    ],
    keyInsights: [
      'DP relation: count[i] = count[i >> 1] + (i & 1) leverages previous results',
      'Right shift by 1 is equivalent to dividing by 2 (floor division)',
      'Bitwise AND with 1 checks if the least significant bit is set',
      'Avoids repeated bit counting by reusing computed values'
    ],
    whenToUse: [
      'Computing Hamming weights for ranges of numbers',
      'Preprocessing bit counts for lookup tables',
      'Problems involving binary representations and bit patterns'
    ]
  },
  {
    id: 'BIT_003',
    name: 'Power of Two',
    category: 'Bit Manipulation',
    difficulty: 'Beginner',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    complexityScore: 0.1,
    icon: 'bolt',
    description: 'Checks if number is power of two using bit manipulation trick.',
    longDescription: 'Power of Two determines if a number is a power of two using a clever bit manipulation trick. Powers of two have exactly one bit set in their binary representation (e.g., 8 = 1000, 4 = 100). The expression n & (n-1) clears the lowest set bit. For powers of two, this results in 0 since they have only one bit set. This constant-time check is much faster than using logarithms or division, and demonstrates how understanding binary representation enables elegant solutions.',
    tags: ['Bit Manipulation', 'Power of Two', 'Binary', 'Constant Time'],
    leetcodeProblems: ['Power of Two', 'Power of Three', 'Power of Four'],
    codeExamples: [
      {
        language: 'typescript',
        code: `function isPowerOfTwo(n: number): boolean {
  if (n <= 0) return false;
  return (n & (n - 1)) === 0;
}`,
        steps: [
          {
            lines: [2],
            title: 'Check for Non-Positive',
            description: 'Return false immediately if n is zero or negative. Powers of two are always positive.',
            variables: { 'n <= 0': 'invalid', result: 'false' }
          },
          {
            lines: [3],
            title: 'Apply Bit Trick',
            description: 'Use n & (n-1) to check if only one bit is set. Powers of two have exactly one bit set (e.g., 8 = 1000).',
            variables: { operation: 'n & (n-1)', 'power of 2': 'result === 0' }
          },
          {
            lines: [3],
            title: 'Return Result',
            description: 'If n & (n-1) equals 0, n is a power of two. Subtracting 1 flips all bits after the single set bit.',
            variables: { example: '8 & 7 = 1000 & 0111 = 0', result: 'true or false' }
          }
        ]
      },
      {
        language: 'python',
        code: `def is_power_of_two(n: int) -> bool:
    if n <= 0:
        return False
    return (n & (n - 1)) == 0`,
        steps: [
          {
            lines: [2, 3],
            title: 'Check for Non-Positive',
            description: 'Return False immediately if n is zero or negative. Powers of two are always positive.',
            variables: { 'n <= 0': 'invalid', result: 'False' }
          },
          {
            lines: [4],
            title: 'Apply Bit Trick',
            description: 'Use n & (n-1) to check if only one bit is set. Powers of two have exactly one bit set (e.g., 8 = 0b1000).',
            variables: { operation: 'n & (n-1)', 'power of 2': 'result == 0' }
          },
          {
            lines: [4],
            title: 'Return Result',
            description: 'If n & (n-1) equals 0, n is a power of two. Subtracting 1 flips all bits after the single set bit.',
            variables: { example: '8 & 7 = 0b1000 & 0b0111 = 0', result: 'True or False' }
          }
        ]
      }
    ],
    keyInsights: [
      'Powers of two have exactly one bit set in binary representation',
      'n & (n-1) clears the lowest set bit, resulting in 0 for powers of two',
      'Constant time O(1) check without loops or division',
      'Works because subtracting 1 flips all bits after the single set bit'
    ],
    whenToUse: [
      'Validating power-of-two constraints in algorithms',
      'Optimizing memory allocation and buffer sizes',
      'Bit mask validation and flag checking operations'
    ]
  }
];
