import type { Algorithm } from "../types/algorithm";

export const treeAlgorithms: Algorithm[] = [
  {
    id: "TRE_001",
    name: "AVL Tree Rotation",
    category: "Trees",
    difficulty: "Advanced",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(n)",
    complexityScore: 0.75,
    description: "Self-balancing binary search tree that maintains height balance through rotations. Each node stores a balance factor to ensure the tree remains balanced.",
    longDescription: "AVL trees are height-balanced binary search trees where the heights of the two child subtrees of any node differ by at most one. When this property is violated during insertion or deletion, the tree performs rotations (single or double) to restore balance. The balance factor of a node is calculated as the height of its left subtree minus the height of its right subtree. AVL trees guarantee O(log n) search, insertion, and deletion operations by maintaining strict balance, making them ideal for lookup-intensive applications.",
    icon: "account_tree",
    tags: ["self-balancing", "binary-search-tree", "rotations", "height-balance"],
    leetcodeProblems: [
      "Balance a Binary Search Tree",
      "Count of Smaller Numbers After Self",
      "Range Sum Query - Mutable"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `class AVLNode {
  value: number;
  left: AVLNode | null = null;
  right: AVLNode | null = null;
  height: number = 1;

  constructor(value: number) {
    this.value = value;
  }
}

class AVLTree {
  private getHeight(node: AVLNode | null): number {
    return node ? node.height : 0;
  }

  private getBalance(node: AVLNode | null): number {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  private rightRotate(y: AVLNode): AVLNode {
    const x = y.left!;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    return x;
  }

  private leftRotate(x: AVLNode): AVLNode {
    const y = x.right!;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    return y;
  }

  insert(node: AVLNode | null, value: number): AVLNode {
    if (!node) return new AVLNode(value);

    if (value < node.value) node.left = this.insert(node.left, value);
    else if (value > node.value) node.right = this.insert(node.right, value);
    else return node;

    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    const balance = this.getBalance(node);

    // Left-Left case
    if (balance > 1 && value < node.left!.value) return this.rightRotate(node);
    // Right-Right case
    if (balance < -1 && value > node.right!.value) return this.leftRotate(node);
    // Left-Right case
    if (balance > 1 && value > node.left!.value) {
      node.left = this.leftRotate(node.left!);
      return this.rightRotate(node);
    }
    // Right-Left case
    if (balance < -1 && value < node.right!.value) {
      node.right = this.rightRotate(node.right!);
      return this.leftRotate(node);
    }

    return node;
  }
}

// --- Example ---
const tree = new AVLTree();
let root: AVLNode | null = null;
root = tree.insert(root, 10);  // → AVLNode { value: 10 }
root = tree.insert(root, 20);  // → AVLNode { value: 10, right: 20 }
root = tree.insert(root, 30);  // → AVLNode { value: 20 } (rotated)
`,
        steps: [
          {
            lines: [64, 65],
            title: "Base Case - Insert Node",
            description: "If we reach a null position, create and return a new AVL node with the given value. This is where the new node is inserted into the tree.",
            variables: { value: "value to insert", node: "null" }
          },
          {
            lines: [67, 68, 69],
            title: "Binary Search Tree Insertion",
            description: "Recursively insert the value into the appropriate subtree. Go left if value is smaller, right if larger. If equal, return the node without inserting (no duplicates).",
            variables: { "node.value": "current node value", value: "value to insert" }
          },
          {
            lines: [71, 72],
            title: "Update Height and Calculate Balance",
            description: "After insertion, update the node's height based on the heights of its children. Calculate the balance factor to check if the tree needs rebalancing.",
            variables: { height: "1 + max(left, right)", balance: "left height - right height" }
          },
          {
            lines: [74, 75],
            title: "Left-Left Case Rotation",
            description: "If balance > 1 and insertion was in the left subtree of left child, perform a right rotation to restore balance.",
            variables: { balance: "> 1", case: "Left-Left" }
          },
          {
            lines: [77],
            title: "Right-Right Case Rotation",
            description: "If balance < -1 and insertion was in the right subtree of right child, perform a left rotation to restore balance.",
            variables: { balance: "< -1", case: "Right-Right" }
          },
          {
            lines: [79, 80, 81],
            title: "Left-Right Case Double Rotation",
            description: "If balance > 1 and insertion was in the right subtree of left child, first left rotate the left child, then right rotate the current node.",
            variables: { balance: "> 1", case: "Left-Right" }
          },
          {
            lines: [84, 85, 86],
            title: "Right-Left Case Double Rotation",
            description: "If balance < -1 and insertion was in the left subtree of right child, first right rotate the right child, then left rotate the current node.",
            variables: { balance: "< -1", case: "Right-Left" }
          },
          {
            lines: [89],
            title: "Return Balanced Node",
            description: "After all rotations and updates, return the current node which is now balanced. This node becomes the new root of this subtree.",
            variables: { node: "balanced node" }
          }
        ]
      },
      {
        language: "python",
        code: `class AVLNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
        self.height = 1

class AVLTree:
    def get_height(self, node):
        return node.height if node else 0

    def get_balance(self, node):
        return self.get_height(node.left) - self.get_height(node.right) if node else 0

    def right_rotate(self, y):
        x = y.left
        T2 = x.right
        x.right = y
        y.left = T2
        y.height = max(self.get_height(y.left), self.get_height(y.right)) + 1
        x.height = max(self.get_height(x.left), self.get_height(x.right)) + 1
        return x

    def left_rotate(self, x):
        y = x.right
        T2 = y.left
        y.left = x
        x.right = T2
        x.height = max(self.get_height(x.left), self.get_height(x.right)) + 1
        y.height = max(self.get_height(y.left), self.get_height(y.right)) + 1
        return y

    def insert(self, node, value):
        if not node:
            return AVLNode(value)

        if value < node.value:
            node.left = self.insert(node.left, value)
        elif value > node.value:
            node.right = self.insert(node.right, value)
        else:
            return node

        node.height = 1 + max(self.get_height(node.left), self.get_height(node.right))
        balance = self.get_balance(node)

        # Left-Left case
        if balance > 1 and value < node.left.value:
            return self.right_rotate(node)
        # Right-Right case
        if balance < -1 and value > node.right.value:
            return self.left_rotate(node)
        # Left-Right case
        if balance > 1 and value > node.left.value:
            node.left = self.left_rotate(node.left)
            return self.right_rotate(node)
        # Right-Left case
        if balance < -1 and value < node.right.value:
            node.right = self.right_rotate(node.right)
            return self.left_rotate(node)

        return node

# --- Example ---
tree = AVLTree()
root = None
root = tree.insert(root, 10)  # -> AVLNode(value=10)
root = tree.insert(root, 20)  # -> AVLNode(value=10, right=20)
root = tree.insert(root, 30)  # -> AVLNode(value=20) (rotated)
`,
        steps: [
          {
            lines: [34, 35],
            title: "Base Case - Insert Node",
            description: "If we reach a null position, create and return a new AVL node with the given value. This is where the new node is inserted into the tree.",
            variables: { value: "value to insert", node: "None" }
          },
          {
            lines: [37, 38, 39, 40, 41],
            title: "Binary Search Tree Insertion",
            description: "Recursively insert the value into the appropriate subtree. Go left if value is smaller, right if larger. If equal, return the node without inserting (no duplicates).",
            variables: { "node.value": "current node value", value: "value to insert" }
          },
          {
            lines: [43, 44],
            title: "Update Height and Calculate Balance",
            description: "After insertion, update the node's height based on the heights of its children. Calculate the balance factor to check if the tree needs rebalancing.",
            variables: { height: "1 + max(left, right)", balance: "left height - right height" }
          },
          {
            lines: [46, 47, 48],
            title: "Left-Left Case Rotation",
            description: "If balance > 1 and insertion was in the left subtree of left child, perform a right rotation to restore balance.",
            variables: { balance: "> 1", case: "Left-Left" }
          },
          {
            lines: [49, 50, 51],
            title: "Right-Right Case Rotation",
            description: "If balance < -1 and insertion was in the right subtree of right child, perform a left rotation to restore balance.",
            variables: { balance: "< -1", case: "Right-Right" }
          },
          {
            lines: [52, 53, 54, 55],
            title: "Left-Right Case Double Rotation",
            description: "If balance > 1 and insertion was in the right subtree of left child, first left rotate the left child, then right rotate the current node.",
            variables: { balance: "> 1", case: "Left-Right" }
          },
          {
            lines: [56, 57, 58, 59],
            title: "Right-Left Case Double Rotation",
            description: "If balance < -1 and insertion was in the left subtree of right child, first right rotate the right child, then left rotate the current node.",
            variables: { balance: "< -1", case: "Right-Left" }
          },
          {
            lines: [61],
            title: "Return Balanced Node",
            description: "After all rotations and updates, return the current node which is now balanced. This node becomes the new root of this subtree.",
            variables: { node: "balanced node" }
          }
        ]
      }
    ],
    keyInsights: [
      "Balance factor must be maintained between -1 and 1 for all nodes",
      "Four rotation cases: LL (right rotate), RR (left rotate), LR (left-right), RL (right-left)",
      "Height is updated after every insertion/deletion before checking balance",
      "AVL trees are more strictly balanced than Red-Black trees, providing faster lookups but slower insertions"
    ],
    whenToUse: [
      "When you need frequent lookups and search operations outweigh insertions/deletions",
      "When strict balance is required for predictable performance",
      "In database indexing where read operations dominate"
    ]
  },
  {
    id: "TRE_002",
    name: "Red-Black Tree",
    category: "Trees",
    difficulty: "Advanced",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(n)",
    complexityScore: 0.85,
    description: "Self-balancing binary search tree with color properties that ensure the tree remains approximately balanced. Guarantees O(log n) operations with less strict balancing than AVL trees.",
    longDescription: "Red-Black trees are binary search trees with an extra bit for color (red or black) on each node. They maintain balance through five properties: every node is red or black, root is black, all leaves are black, red nodes have black children, and all paths from a node to its leaves contain the same number of black nodes. These properties ensure the tree height never exceeds 2*log(n+1). Red-Black trees perform fewer rotations than AVL trees during insertion and deletion, making them preferred for applications with frequent modifications. They are used in many standard library implementations including C++ STL map and Java TreeMap.",
    icon: "park",
    tags: ["self-balancing", "binary-search-tree", "color-properties", "rotations"],
    leetcodeProblems: [
      "Design Add and Search Words Data Structure",
      "Implement Trie (Prefix Tree)",
      "Range Sum Query - Mutable"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `enum Color { RED, BLACK }

class RBNode {
  value: number;
  color: Color;
  left: RBNode | null = null;
  right: RBNode | null = null;
  parent: RBNode | null = null;

  constructor(value: number, color: Color = Color.RED) {
    this.value = value;
    this.color = color;
  }
}

class RedBlackTree {
  private root: RBNode | null = null;
  private readonly NIL: RBNode;

  constructor() {
    this.NIL = new RBNode(0, Color.BLACK);
  }

  private leftRotate(x: RBNode): void {
    const y = x.right!;
    x.right = y.left;
    if (y.left !== this.NIL) y.left!.parent = x;
    y.parent = x.parent;
    if (x.parent === null) this.root = y;
    else if (x === x.parent.left) x.parent.left = y;
    else x.parent.right = y;
    y.left = x;
    x.parent = y;
  }

  private rightRotate(x: RBNode): void {
    const y = x.left!;
    x.left = y.right;
    if (y.right !== this.NIL) y.right!.parent = x;
    y.parent = x.parent;
    if (x.parent === null) this.root = y;
    else if (x === x.parent.right) x.parent.right = y;
    else x.parent.left = y;
    y.right = x;
    x.parent = y;
  }

  private fixInsert(k: RBNode): void {
    while (k.parent && k.parent.color === Color.RED) {
      if (k.parent === k.parent.parent?.left) {
        const u = k.parent.parent.right;
        if (u && u.color === Color.RED) {
          k.parent.color = Color.BLACK;
          u.color = Color.BLACK;
          k.parent.parent.color = Color.RED;
          k = k.parent.parent;
        } else {
          if (k === k.parent.right) {
            k = k.parent;
            this.leftRotate(k);
          }
          k.parent!.color = Color.BLACK;
          k.parent!.parent!.color = Color.RED;
          this.rightRotate(k.parent!.parent!);
        }
      } else {
        const u = k.parent.parent?.left;
        if (u && u.color === Color.RED) {
          k.parent.color = Color.BLACK;
          u.color = Color.BLACK;
          k.parent.parent!.color = Color.RED;
          k = k.parent.parent!;
        } else {
          if (k === k.parent.left) {
            k = k.parent;
            this.rightRotate(k);
          }
          k.parent!.color = Color.BLACK;
          k.parent!.parent!.color = Color.RED;
          this.leftRotate(k.parent!.parent!);
        }
      }
    }
    if (this.root) this.root.color = Color.BLACK;
  }
}

// --- Example ---
const rbTree = new RedBlackTree();
const node1 = new RBNode(10);  // → RBNode { value: 10, color: RED }
const node2 = new RBNode(20);  // → RBNode { value: 20, color: RED }
rbTree.fixInsert(node1);       // → root is BLACK after fix
`,
        steps: [
          {
            lines: [239, 240],
            title: "Check Violation - Red Parent",
            description: "Continue fixing violations while the current node's parent is red. This violates the red-black tree property that red nodes cannot have red children.",
            variables: { "k.parent.color": "RED", violation: "red-red conflict" }
          },
          {
            lines: [240, 241, 242],
            title: "Identify Uncle Node",
            description: "Determine if parent is a left or right child, then identify the uncle node (parent's sibling). The uncle's color determines which case we're in.",
            variables: { parent: "left/right child", uncle: "parent's sibling" }
          },
          {
            lines: [242, 243, 244, 245, 246],
            title: "Case 1 - Red Uncle Recoloring",
            description: "If uncle is red, recolor parent and uncle to black, grandparent to red. Move up to grandparent and continue checking for violations.",
            variables: { "uncle.color": "RED", action: "recolor and move up" }
          },
          {
            lines: [248, 249, 250],
            title: "Case 2 - Convert to Case 3",
            description: "If uncle is black and node is a right child (parent is left), rotate parent left to convert this to Case 3 configuration.",
            variables: { "uncle.color": "BLACK", case: "Left-Right" }
          },
          {
            lines: [252, 253, 254],
            title: "Case 3 - Recolor and Rotate",
            description: "Recolor parent to black and grandparent to red, then perform right rotation on grandparent to restore balance.",
            variables: { case: "Left-Left", action: "recolor and rotate" }
          },
          {
            lines: [256, 257, 258, 259, 260, 261, 262],
            title: "Mirror Cases - Right Subtree",
            description: "Handle symmetric cases when parent is right child of grandparent. Same logic but with left and right swapped.",
            variables: { parent: "right child", cases: "mirror of left subtree" }
          },
          {
            lines: [274],
            title: "Ensure Root is Black",
            description: "Final step: ensure the root node is always black, which is a fundamental property of red-black trees.",
            variables: { "root.color": "BLACK" }
          }
        ]
      },
      {
        language: "python",
        code: `class Color:
    RED = 0
    BLACK = 1

class RBNode:
    def __init__(self, value, color=Color.RED):
        self.value = value
        self.color = color
        self.left = None
        self.right = None
        self.parent = None

class RedBlackTree:
    def __init__(self):
        self.NIL = RBNode(0, Color.BLACK)
        self.root = self.NIL

    def left_rotate(self, x):
        y = x.right
        x.right = y.left
        if y.left != self.NIL:
            y.left.parent = x
        y.parent = x.parent
        if x.parent is None:
            self.root = y
        elif x == x.parent.left:
            x.parent.left = y
        else:
            x.parent.right = y
        y.left = x
        x.parent = y

    def right_rotate(self, x):
        y = x.left
        x.left = y.right
        if y.right != self.NIL:
            y.right.parent = x
        y.parent = x.parent
        if x.parent is None:
            self.root = y
        elif x == x.parent.right:
            x.parent.right = y
        else:
            x.parent.left = y
        y.right = x
        x.parent = y

    def fix_insert(self, k):
        while k.parent and k.parent.color == Color.RED:
            if k.parent == k.parent.parent.left:
                u = k.parent.parent.right
                if u.color == Color.RED:
                    k.parent.color = Color.BLACK
                    u.color = Color.BLACK
                    k.parent.parent.color = Color.RED
                    k = k.parent.parent
                else:
                    if k == k.parent.right:
                        k = k.parent
                        self.left_rotate(k)
                    k.parent.color = Color.BLACK
                    k.parent.parent.color = Color.RED
                    self.right_rotate(k.parent.parent)
            else:
                u = k.parent.parent.left
                if u.color == Color.RED:
                    k.parent.color = Color.BLACK
                    u.color = Color.BLACK
                    k.parent.parent.color = Color.RED
                    k = k.parent.parent
                else:
                    if k == k.parent.left:
                        k = k.parent
                        self.right_rotate(k)
                    k.parent.color = Color.BLACK
                    k.parent.parent.color = Color.RED
                    self.left_rotate(k.parent.parent)
        self.root.color = Color.BLACK

# --- Example ---
rb_tree = RedBlackTree()
node1 = RBNode(10)            # -> RBNode(value=10, color=RED)
node2 = RBNode(20)            # -> RBNode(value=20, color=RED)
rb_tree.fix_insert(node1)     # -> root is BLACK after fix
`,
        steps: [
          {
            lines: [48, 49],
            title: "Check Violation - Red Parent",
            description: "Continue fixing violations while the current node's parent is red. This violates the red-black tree property that red nodes cannot have red children.",
            variables: { "k.parent.color": "RED", violation: "red-red conflict" }
          },
          {
            lines: [49, 50],
            title: "Identify Uncle Node",
            description: "Determine if parent is a left or right child, then identify the uncle node (parent's sibling). The uncle's color determines which case we're in.",
            variables: { parent: "left/right child", uncle: "parent's sibling" }
          },
          {
            lines: [51, 52, 53, 54, 55],
            title: "Case 1 - Red Uncle Recoloring",
            description: "If uncle is red, recolor parent and uncle to black, grandparent to red. Move up to grandparent and continue checking for violations.",
            variables: { "uncle.color": "RED", action: "recolor and move up" }
          },
          {
            lines: [57, 58, 59],
            title: "Case 2 - Convert to Case 3",
            description: "If uncle is black and node is a right child (parent is left), rotate parent left to convert this to Case 3 configuration.",
            variables: { "uncle.color": "BLACK", case: "Left-Right" }
          },
          {
            lines: [60, 61, 62],
            title: "Case 3 - Recolor and Rotate",
            description: "Recolor parent to black and grandparent to red, then perform right rotation on grandparent to restore balance.",
            variables: { case: "Left-Left", action: "recolor and rotate" }
          },
          {
            lines: [63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73],
            title: "Mirror Cases - Right Subtree",
            description: "Handle symmetric cases when parent is right child of grandparent. Same logic but with left and right swapped.",
            variables: { parent: "right child", cases: "mirror of left subtree" }
          },
          {
            lines: [74],
            title: "Ensure Root is Black",
            description: "Final step: ensure the root node is always black, which is a fundamental property of red-black trees.",
            variables: { "root.color": "BLACK" }
          }
        ]
      }
    ],
    keyInsights: [
      "Five color properties maintain approximate balance without strict height requirements",
      "Black height (number of black nodes on any path to leaf) is the same for all paths",
      "Red-Black trees perform fewer rotations than AVL trees, making insertions/deletions faster",
      "Maximum height is 2*log(n+1), ensuring O(log n) operations"
    ],
    whenToUse: [
      "When you need balanced performance between lookups and insertions/deletions",
      "In standard library implementations (C++ map/set, Java TreeMap)",
      "When you want good worst-case guarantees without strict balancing overhead"
    ]
  },
  {
    id: "TRE_003",
    name: "B-Tree Operations",
    category: "Trees",
    difficulty: "Advanced",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(n)",
    complexityScore: 0.9,
    description: "Self-balancing tree data structure optimized for systems that read and write large blocks of data. Commonly used in databases and file systems.",
    longDescription: "B-trees are self-balancing tree structures that maintain sorted data and allow searches, insertions, and deletions in logarithmic time. Unlike binary trees, B-tree nodes can have multiple children (from a few to thousands). Each node contains multiple keys stored in sorted order and has a maximum degree (order) that determines the maximum number of children. B-trees minimize disk I/O operations by storing multiple keys per node, making them ideal for database indexing and file systems. When a node becomes full, it splits into two nodes, and the middle key is promoted to the parent. This keeps the tree balanced and ensures all leaf nodes are at the same depth.",
    icon: "storage",
    tags: ["self-balancing", "database-indexing", "file-systems", "multi-way-tree"],
    leetcodeProblems: [
      "Design In-Memory File System",
      "LRU Cache",
      "Design Search Autocomplete System"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `class BTreeNode {
  keys: number[];
  children: BTreeNode[];
  isLeaf: boolean;
  n: number; // current number of keys

  constructor(isLeaf: boolean, t: number) {
    this.keys = new Array(2 * t - 1);
    this.children = new Array(2 * t);
    this.isLeaf = isLeaf;
    this.n = 0;
  }
}

class BTree {
  private root: BTreeNode | null = null;
  private readonly t: number; // minimum degree

  constructor(t: number) {
    this.t = t;
  }

  search(k: number, node: BTreeNode | null = this.root): BTreeNode | null {
    if (!node) return null;
    let i = 0;
    while (i < node.n && k > node.keys[i]) i++;
    if (i < node.n && k === node.keys[i]) return node;
    if (node.isLeaf) return null;
    return this.search(k, node.children[i]);
  }

  private splitChild(parent: BTreeNode, i: number): void {
    const t = this.t;
    const fullChild = parent.children[i];
    const newChild = new BTreeNode(fullChild.isLeaf, t);
    newChild.n = t - 1;

    for (let j = 0; j < t - 1; j++) {
      newChild.keys[j] = fullChild.keys[j + t];
    }

    if (!fullChild.isLeaf) {
      for (let j = 0; j < t; j++) {
        newChild.children[j] = fullChild.children[j + t];
      }
    }

    fullChild.n = t - 1;

    for (let j = parent.n; j >= i + 1; j--) {
      parent.children[j + 1] = parent.children[j];
    }
    parent.children[i + 1] = newChild;

    for (let j = parent.n - 1; j >= i; j--) {
      parent.keys[j + 1] = parent.keys[j];
    }
    parent.keys[i] = fullChild.keys[t - 1];
    parent.n++;
  }

  private insertNonFull(node: BTreeNode, k: number): void {
    let i = node.n - 1;

    if (node.isLeaf) {
      while (i >= 0 && k < node.keys[i]) {
        node.keys[i + 1] = node.keys[i];
        i--;
      }
      node.keys[i + 1] = k;
      node.n++;
    } else {
      while (i >= 0 && k < node.keys[i]) i--;
      i++;
      if (node.children[i].n === 2 * this.t - 1) {
        this.splitChild(node, i);
        if (k > node.keys[i]) i++;
      }
      this.insertNonFull(node.children[i], k);
    }
  }

  insert(k: number): void {
    if (!this.root) {
      this.root = new BTreeNode(true, this.t);
      this.root.keys[0] = k;
      this.root.n = 1;
    } else {
      if (this.root.n === 2 * this.t - 1) {
        const newRoot = new BTreeNode(false, this.t);
        newRoot.children[0] = this.root;
        this.splitChild(newRoot, 0);
        this.root = newRoot;
      }
      this.insertNonFull(this.root, k);
    }
  }
}

// --- Example ---
const btree = new BTree(3);
btree.insert(10);              // → root: BTreeNode { keys: [10], n: 1 }
btree.insert(20);              // → root: BTreeNode { keys: [10, 20], n: 2 }
const found = btree.search(10); // → BTreeNode { keys: [10, 20] }
`,
        steps: [
          {
            lines: [474, 475, 476, 477, 478],
            title: "Handle Empty Tree",
            description: "If tree is empty, create a new root node as a leaf, insert the key at position 0, and set the count to 1.",
            variables: { root: "null", k: "key to insert" }
          },
          {
            lines: [480],
            title: "Check Root Capacity",
            description: "If the root is full (has 2t-1 keys), we need to split it before insertion to maintain B-tree properties.",
            variables: { "root.n": "2*t - 1", status: "full" }
          },
          {
            lines: [481, 482, 483],
            title: "Create New Root and Split",
            description: "Create a new root node (non-leaf), make the old root its first child, and split the old root to increase tree height.",
            variables: { newRoot: "created", "oldRoot": "child[0]" }
          },
          {
            lines: [484],
            title: "Update Root Reference",
            description: "After splitting, update the tree's root reference to point to the newly created root node.",
            variables: { root: "newRoot" }
          },
          {
            lines: [486],
            title: "Insert Into Non-Full Node",
            description: "Now that we've ensured the root has space, recursively insert the key into the appropriate position in the tree.",
            variables: { root: "non-full", k: "key to insert" }
          }
        ]
      },
      {
        language: "python",
        code: `class BTreeNode:
    def __init__(self, is_leaf, t):
        self.keys = [None] * (2 * t - 1)
        self.children = [None] * (2 * t)
        self.is_leaf = is_leaf
        self.n = 0  # current number of keys

class BTree:
    def __init__(self, t):
        self.root = None
        self.t = t  # minimum degree

    def search(self, k, node=None):
        if node is None:
            node = self.root
        if node is None:
            return None

        i = 0
        while i < node.n and k > node.keys[i]:
            i += 1

        if i < node.n and k == node.keys[i]:
            return node

        if node.is_leaf:
            return None

        return self.search(k, node.children[i])

    def split_child(self, parent, i):
        t = self.t
        full_child = parent.children[i]
        new_child = BTreeNode(full_child.is_leaf, t)
        new_child.n = t - 1

        for j in range(t - 1):
            new_child.keys[j] = full_child.keys[j + t]

        if not full_child.is_leaf:
            for j in range(t):
                new_child.children[j] = full_child.children[j + t]

        full_child.n = t - 1

        for j in range(parent.n, i, -1):
            parent.children[j + 1] = parent.children[j]
        parent.children[i + 1] = new_child

        for j in range(parent.n - 1, i - 1, -1):
            parent.keys[j + 1] = parent.keys[j]
        parent.keys[i] = full_child.keys[t - 1]
        parent.n += 1

    def insert_non_full(self, node, k):
        i = node.n - 1

        if node.is_leaf:
            while i >= 0 and k < node.keys[i]:
                node.keys[i + 1] = node.keys[i]
                i -= 1
            node.keys[i + 1] = k
            node.n += 1
        else:
            while i >= 0 and k < node.keys[i]:
                i -= 1
            i += 1
            if node.children[i].n == 2 * self.t - 1:
                self.split_child(node, i)
                if k > node.keys[i]:
                    i += 1
            self.insert_non_full(node.children[i], k)

    def insert(self, k):
        if self.root is None:
            self.root = BTreeNode(True, self.t)
            self.root.keys[0] = k
            self.root.n = 1
        else:
            if self.root.n == 2 * self.t - 1:
                new_root = BTreeNode(False, self.t)
                new_root.children[0] = self.root
                self.split_child(new_root, 0)
                self.root = new_root
            self.insert_non_full(self.root, k)

# --- Example ---
btree = BTree(3)
btree.insert(10)              # -> root: BTreeNode(keys=[10], n=1)
btree.insert(20)              # -> root: BTreeNode(keys=[10, 20], n=2)
found = btree.search(10)      # -> BTreeNode(keys=[10, 20])
`,
        steps: [
          {
            lines: [73, 74, 75, 76],
            title: "Handle Empty Tree",
            description: "If tree is empty, create a new root node as a leaf, insert the key at position 0, and set the count to 1.",
            variables: { root: "None", k: "key to insert" }
          },
          {
            lines: [78],
            title: "Check Root Capacity",
            description: "If the root is full (has 2t-1 keys), we need to split it before insertion to maintain B-tree properties.",
            variables: { "root.n": "2*t - 1", status: "full" }
          },
          {
            lines: [79, 80, 81],
            title: "Create New Root and Split",
            description: "Create a new root node (non-leaf), make the old root its first child, and split the old root to increase tree height.",
            variables: { newRoot: "created", oldRoot: "child[0]" }
          },
          {
            lines: [82],
            title: "Update Root Reference",
            description: "After splitting, update the tree's root reference to point to the newly created root node.",
            variables: { root: "newRoot" }
          },
          {
            lines: [83],
            title: "Insert Into Non-Full Node",
            description: "Now that we've ensured the root has space, recursively insert the key into the appropriate position in the tree.",
            variables: { root: "non-full", k: "key to insert" }
          }
        ]
      }
    ],
    keyInsights: [
      "Nodes contain multiple keys and children, optimizing for disk I/O by reducing tree height",
      "All leaf nodes are at the same depth, ensuring balanced structure",
      "Minimum degree t determines node capacity: each node has between t-1 and 2t-1 keys",
      "Split operations propagate upward, potentially increasing tree height at the root"
    ],
    whenToUse: [
      "In database systems for indexing large datasets on disk",
      "In file systems to manage directory structures efficiently",
      "When minimizing disk I/O operations is critical for performance"
    ]
  },
  {
    id: "TRE_004",
    name: "Segment Tree",
    category: "Trees",
    difficulty: "Advanced",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(n)",
    complexityScore: 0.85,
    description: "Tree data structure for storing intervals or segments, allowing efficient range queries and updates. Each node represents an interval and stores aggregate information.",
    longDescription: "Segment trees are specialized data structures that allow answering range queries (sum, min, max, GCD, etc.) over an array while still allowing modifications to the array. The tree is built recursively by dividing the array into segments, with each node storing aggregate information about its segment. The root represents the entire array, and each leaf represents a single element. Query and update operations work by recursively traversing the tree, combining results from child nodes. Lazy propagation is an optimization technique that delays updates to child nodes until necessary, improving update performance for range updates from O(n) to O(log n).",
    icon: "stacked_bar_chart",
    tags: ["range-queries", "interval-tree", "lazy-propagation", "divide-and-conquer"],
    leetcodeProblems: [
      "Range Sum Query - Mutable",
      "Count of Range Sum",
      "My Calendar I"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `class SegmentTree {
  private tree: number[];
  private n: number;

  constructor(arr: number[]) {
    this.n = arr.length;
    this.tree = new Array(4 * this.n).fill(0);
    this.build(arr, 0, 0, this.n - 1);
  }

  private build(arr: number[], node: number, start: number, end: number): void {
    if (start === end) {
      this.tree[node] = arr[start];
      return;
    }

    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;

    this.build(arr, leftChild, start, mid);
    this.build(arr, rightChild, mid + 1, end);
    this.tree[node] = this.tree[leftChild] + this.tree[rightChild];
  }

  private queryHelper(node: number, start: number, end: number, l: number, r: number): number {
    if (r < start || l > end) return 0; // outside range
    if (l <= start && end <= r) return this.tree[node]; // completely inside range

    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;

    const leftSum = this.queryHelper(leftChild, start, mid, l, r);
    const rightSum = this.queryHelper(rightChild, mid + 1, end, l, r);
    return leftSum + rightSum;
  }

  query(l: number, r: number): number {
    return this.queryHelper(0, 0, this.n - 1, l, r);
  }

  private updateHelper(node: number, start: number, end: number, idx: number, val: number): void {
    if (start === end) {
      this.tree[node] = val;
      return;
    }

    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;

    if (idx <= mid) {
      this.updateHelper(leftChild, start, mid, idx, val);
    } else {
      this.updateHelper(rightChild, mid + 1, end, idx, val);
    }

    this.tree[node] = this.tree[leftChild] + this.tree[rightChild];
  }

  update(idx: number, val: number): void {
    this.updateHelper(0, 0, this.n - 1, idx, val);
  }
}

// --- Example ---
const arr = [1, 3, 5, 7, 9, 11];
const segTree = new SegmentTree(arr);
const sum1 = segTree.query(1, 3); // → 15 (sum from index 1 to 3)
segTree.update(1, 10);
const sum2 = segTree.query(1, 3); // → 22 (updated sum)
`,
        steps: [
          {
            lines: [622, 623, 624],
            title: "Base Case - Leaf Node",
            description: "If start equals end, we're at a leaf node representing a single array element. Store the array value directly in the tree node.",
            variables: { start: "end", "tree[node]": "arr[start]" }
          },
          {
            lines: [628, 629, 630],
            title: "Calculate Mid and Children",
            description: "For internal nodes, calculate the midpoint to divide the range, and compute indices for left and right children using 2*node+1 and 2*node+2.",
            variables: { mid: "(start + end) / 2", leftChild: "2*node + 1", rightChild: "2*node + 2" }
          },
          {
            lines: [632, 633],
            title: "Build Left and Right Subtrees",
            description: "Recursively build the left subtree for range [start, mid] and right subtree for range [mid+1, end].",
            variables: { leftRange: "[start, mid]", rightRange: "[mid+1, end]" }
          },
          {
            lines: [634],
            title: "Combine Child Results",
            description: "After building both subtrees, combine their results. For sum queries, add left and right sums. This can be adapted for min, max, or other operations.",
            variables: { "tree[node]": "leftSum + rightSum" }
          },
          {
            lines: [638],
            title: "Query - Outside Range",
            description: "If the query range [l, r] doesn't overlap with current segment [start, end], return 0 (identity element for sum).",
            variables: { overlap: "none", result: "0" }
          },
          {
            lines: [639],
            title: "Query - Completely Inside",
            description: "If current segment is completely within query range, return the precomputed value stored at this node without further recursion.",
            variables: { segment: "[start, end]", query: "[l, r]", inside: "true" }
          },
          {
            lines: [645, 646, 647],
            title: "Query - Partial Overlap",
            description: "For partial overlap, recursively query both children and combine results. This divides the query into smaller segments.",
            variables: { leftSum: "query left child", rightSum: "query right child", result: "leftSum + rightSum" }
          },
          {
            lines: [655, 656, 657],
            title: "Update - Leaf Node",
            description: "When updating at index idx, if we reach the leaf node (start == end), update the tree node with the new value.",
            variables: { idx: "target index", "tree[node]": "new value" }
          }
        ]
      },
      {
        language: "python",
        code: `class SegmentTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self.build(arr, 0, 0, self.n - 1)

    def build(self, arr, node, start, end):
        if start == end:
            self.tree[node] = arr[start]
            return

        mid = (start + end) // 2
        left_child = 2 * node + 1
        right_child = 2 * node + 2

        self.build(arr, left_child, start, mid)
        self.build(arr, right_child, mid + 1, end)
        self.tree[node] = self.tree[left_child] + self.tree[right_child]

    def query_helper(self, node, start, end, l, r):
        if r < start or l > end:
            return 0  # outside range
        if l <= start and end <= r:
            return self.tree[node]  # completely inside range

        mid = (start + end) // 2
        left_child = 2 * node + 1
        right_child = 2 * node + 2

        left_sum = self.query_helper(left_child, start, mid, l, r)
        right_sum = self.query_helper(right_child, mid + 1, end, l, r)
        return left_sum + right_sum

    def query(self, l, r):
        return self.query_helper(0, 0, self.n - 1, l, r)

    def update_helper(self, node, start, end, idx, val):
        if start == end:
            self.tree[node] = val
            return

        mid = (start + end) // 2
        left_child = 2 * node + 1
        right_child = 2 * node + 2

        if idx <= mid:
            self.update_helper(left_child, start, mid, idx, val)
        else:
            self.update_helper(right_child, mid + 1, end, idx, val)

        self.tree[node] = self.tree[left_child] + self.tree[right_child]

    def update(self, idx, val):
        self.update_helper(0, 0, self.n - 1, idx, val)

# --- Example ---
arr = [1, 3, 5, 7, 9, 11]
seg_tree = SegmentTree(arr)
sum1 = seg_tree.query(1, 3)  # -> 15 (sum from index 1 to 3)
seg_tree.update(1, 10)
sum2 = seg_tree.query(1, 3)  # -> 22 (updated sum)
`,
        steps: [
          {
            lines: [8, 9, 10],
            title: "Base Case - Leaf Node",
            description: "If start equals end, we're at a leaf node representing a single array element. Store the array value directly in the tree node.",
            variables: { start: "end", "tree[node]": "arr[start]" }
          },
          {
            lines: [12, 13, 14],
            title: "Calculate Mid and Children",
            description: "For internal nodes, calculate the midpoint to divide the range, and compute indices for left and right children using 2*node+1 and 2*node+2.",
            variables: { mid: "(start + end) // 2", left_child: "2*node + 1", right_child: "2*node + 2" }
          },
          {
            lines: [16, 17],
            title: "Build Left and Right Subtrees",
            description: "Recursively build the left subtree for range [start, mid] and right subtree for range [mid+1, end].",
            variables: { leftRange: "[start, mid]", rightRange: "[mid+1, end]" }
          },
          {
            lines: [18],
            title: "Combine Child Results",
            description: "After building both subtrees, combine their results. For sum queries, add left and right sums. This can be adapted for min, max, or other operations.",
            variables: { "tree[node]": "left_sum + right_sum" }
          },
          {
            lines: [21, 22],
            title: "Query - Outside Range",
            description: "If the query range [l, r] doesn't overlap with current segment [start, end], return 0 (identity element for sum).",
            variables: { overlap: "none", result: "0" }
          },
          {
            lines: [23, 24],
            title: "Query - Completely Inside",
            description: "If current segment is completely within query range, return the precomputed value stored at this node without further recursion.",
            variables: { segment: "[start, end]", query: "[l, r]", inside: "true" }
          },
          {
            lines: [29, 30, 31],
            title: "Query - Partial Overlap",
            description: "For partial overlap, recursively query both children and combine results. This divides the query into smaller segments.",
            variables: { left_sum: "query left child", right_sum: "query right child", result: "left_sum + right_sum" }
          },
          {
            lines: [37, 38, 39],
            title: "Update - Leaf Node",
            description: "When updating at index idx, if we reach the leaf node (start == end), update the tree node with the new value.",
            variables: { idx: "target index", "tree[node]": "new value" }
          }
        ]
      }
    ],
    keyInsights: [
      "Tree size is 4*n to accommodate all possible nodes in the complete binary tree",
      "Each node represents a segment and stores aggregate information (sum, min, max, etc.)",
      "Lazy propagation optimizes range updates by deferring child updates until needed",
      "Can be adapted for various associative operations: sum, min, max, GCD, XOR"
    ],
    whenToUse: [
      "When you need efficient range queries with point or range updates",
      "For problems involving interval modifications and queries",
      "When preprocessing time is acceptable for faster query performance"
    ]
  },
  {
    id: "TRE_005",
    name: "Binary Indexed Tree (Fenwick)",
    category: "Trees",
    difficulty: "Advanced",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(n)",
    complexityScore: 0.8,
    description: "Space-efficient data structure using bit manipulation to compute prefix sums and handle updates efficiently. Also known as Fenwick Tree.",
    longDescription: "Binary Indexed Tree (BIT) or Fenwick Tree is a data structure that efficiently supports prefix sum queries and single element updates in O(log n) time. Unlike segment trees, BIT uses less space (exactly n+1 elements) and has simpler implementation. It uses clever bit manipulation: each index is responsible for a range of elements determined by the least significant bit. The key insight is that each index stores the sum of a range whose size is determined by the position of the rightmost set bit. This structure allows both queries and updates to traverse only O(log n) nodes by manipulating bits.",
    icon: "analytics",
    tags: ["prefix-sums", "bit-manipulation", "fenwick-tree", "cumulative-frequency"],
    leetcodeProblems: [
      "Range Sum Query - Mutable",
      "Count of Smaller Numbers After Self",
      "Reverse Pairs"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `class FenwickTree {
  private tree: number[];
  private n: number;

  constructor(size: number) {
    this.n = size;
    this.tree = new Array(size + 1).fill(0);
  }

  // Update value at index by delta
  update(index: number, delta: number): void {
    index++; // BIT uses 1-based indexing
    while (index <= this.n) {
      this.tree[index] += delta;
      index += index & (-index); // Add least significant bit
    }
  }

  // Get prefix sum from 0 to index
  query(index: number): number {
    index++; // BIT uses 1-based indexing
    let sum = 0;
    while (index > 0) {
      sum += this.tree[index];
      index -= index & (-index); // Remove least significant bit
    }
    return sum;
  }

  // Get range sum from left to right
  rangeQuery(left: number, right: number): number {
    return this.query(right) - (left > 0 ? this.query(left - 1) : 0);
  }

  // Build from array
  static fromArray(arr: number[]): FenwickTree {
    const tree = new FenwickTree(arr.length);
    for (let i = 0; i < arr.length; i++) {
      tree.update(i, arr[i]);
    }
    return tree;
  }
}

// --- Example ---
const arr = [3, 2, -1, 6, 5, 4, -3, 3, 7, 2, 3];
const bit = FenwickTree.fromArray(arr);
const prefixSum = bit.query(5);        // → 19 (sum of first 6 elements)
const rangeSum1 = bit.rangeQuery(2, 7); // → 14 (sum from index 2 to 7)
bit.update(3, 5);                      // → add 5 to index 3
const rangeSum2 = bit.rangeQuery(2, 7); // → 19 (updated sum)
`,
        steps: [
          {
            lines: [792, 793],
            title: "Convert to 1-Based Indexing",
            description: "Fenwick Tree uses 1-based indexing internally for bit manipulation to work correctly. Increment the index before processing.",
            variables: { originalIndex: "0-based", index: "1-based" }
          },
          {
            lines: [794, 795, 796, 797],
            title: "Update Tree Nodes",
            description: "Traverse up the tree by repeatedly adding the least significant bit to the index. Update each responsible node with the delta value.",
            variables: { operation: "index += index & (-index)", delta: "value change" }
          },
          {
            lines: [796],
            title: "Bit Manipulation - LSB",
            description: "The expression 'index & (-index)' extracts the least significant bit, determining which nodes are responsible for this index.",
            variables: { LSB: "index & (-index)", responsible: "range size" }
          },
          {
            lines: [802],
            title: "Query - Convert Index",
            description: "For prefix sum query, convert the 0-based index to 1-based indexing used internally by the Fenwick Tree.",
            variables: { queryIndex: "0-based", index: "1-based" }
          },
          {
            lines: [803, 804, 805, 806, 807],
            title: "Accumulate Prefix Sum",
            description: "Traverse down the tree by repeatedly subtracting the least significant bit. Accumulate values from each node to compute the prefix sum.",
            variables: { operation: "index -= index & (-index)", sum: "accumulated" }
          },
          {
            lines: [813],
            title: "Range Query Calculation",
            description: "Compute range sum [left, right] as difference of prefix sums: query(right) - query(left-1). Handle edge case when left is 0.",
            variables: { rangeSum: "prefix[right] - prefix[left-1]" }
          },
          {
            lines: [817, 818, 819, 820, 821],
            title: "Build Tree from Array",
            description: "Static method to construct a Fenwick Tree from an array by iteratively updating each element. Creates tree and inserts all values.",
            variables: { method: "fromArray", operation: "update for each element" }
          }
        ]
      },
      {
        language: "python",
        code: `class FenwickTree:
    def __init__(self, size):
        self.n = size
        self.tree = [0] * (size + 1)

    def update(self, index, delta):
        """Update value at index by delta"""
        index += 1  # BIT uses 1-based indexing
        while index <= self.n:
            self.tree[index] += delta
            index += index & (-index)  # Add least significant bit

    def query(self, index):
        """Get prefix sum from 0 to index"""
        index += 1  # BIT uses 1-based indexing
        total = 0
        while index > 0:
            total += self.tree[index]
            index -= index & (-index)  # Remove least significant bit
        return total

    def range_query(self, left, right):
        """Get range sum from left to right"""
        return self.query(right) - (self.query(left - 1) if left > 0 else 0)

    @staticmethod
    def from_array(arr):
        """Build BIT from array"""
        tree = FenwickTree(len(arr))
        for i, val in enumerate(arr):
            tree.update(i, val)
        return tree

# --- Example ---
arr = [3, 2, -1, 6, 5, 4, -3, 3, 7, 2, 3]
bit = FenwickTree.from_array(arr)
prefix_sum = bit.query(5)         # -> 19 (sum of first 6 elements)
range_sum1 = bit.range_query(2, 7) # -> 14 (sum from index 2 to 7)
bit.update(3, 5)                  # -> add 5 to index 3
range_sum2 = bit.range_query(2, 7) # -> 19 (updated sum)
`,
        steps: [
          {
            lines: [8],
            title: "Convert to 1-Based Indexing",
            description: "Fenwick Tree uses 1-based indexing internally for bit manipulation to work correctly. Increment the index before processing.",
            variables: { originalIndex: "0-based", index: "1-based" }
          },
          {
            lines: [9, 10, 11],
            title: "Update Tree Nodes",
            description: "Traverse up the tree by repeatedly adding the least significant bit to the index. Update each responsible node with the delta value.",
            variables: { operation: "index += index & (-index)", delta: "value change" }
          },
          {
            lines: [11],
            title: "Bit Manipulation - LSB",
            description: "The expression 'index & (-index)' extracts the least significant bit, determining which nodes are responsible for this index.",
            variables: { LSB: "index & (-index)", responsible: "range size" }
          },
          {
            lines: [15],
            title: "Query - Convert Index",
            description: "For prefix sum query, convert the 0-based index to 1-based indexing used internally by the Fenwick Tree.",
            variables: { queryIndex: "0-based", index: "1-based" }
          },
          {
            lines: [16, 17, 18, 19],
            title: "Accumulate Prefix Sum",
            description: "Traverse down the tree by repeatedly subtracting the least significant bit. Accumulate values from each node to compute the prefix sum.",
            variables: { operation: "index -= index & (-index)", sum: "accumulated" }
          },
          {
            lines: [23],
            title: "Range Query Calculation",
            description: "Compute range sum [left, right] as difference of prefix sums: query(right) - query(left-1). Handle edge case when left is 0.",
            variables: { rangeSum: "prefix[right] - prefix[left-1]" }
          },
          {
            lines: [27, 28, 29, 30, 31],
            title: "Build Tree from Array",
            description: "Static method to construct a Fenwick Tree from an array by iteratively updating each element. Creates tree and inserts all values.",
            variables: { method: "from_array", operation: "update for each element" }
          }
        ]
      }
    ],
    keyInsights: [
      "Uses bit manipulation (index & -index) to find least significant bit for traversal",
      "Each index is responsible for a range determined by its rightmost set bit position",
      "More space-efficient than segment trees but supports fewer operation types",
      "1-based indexing simplifies bit manipulation logic (index 0 would have no LSB)"
    ],
    whenToUse: [
      "When you need prefix sum queries with point updates",
      "For cumulative frequency problems in competitive programming",
      "When space efficiency is important and segment tree is overkill"
    ]
  },
  {
    id: "TRE_006",
    name: "Trie Operations",
    category: "Trie",
    difficulty: "Medium",
    timeComplexity: "O(m)",
    spaceComplexity: "O(n*m)",
    complexityScore: 0.6,
    description: "Tree-like data structure for storing strings efficiently, enabling fast prefix-based searches. Each node represents a character and paths form words.",
    longDescription: "A Trie (pronounced 'try'), also called prefix tree or digital tree, is a tree data structure used for efficient storage and retrieval of strings. Each node represents a single character, and paths from root to leaf form complete words. Tries excel at prefix-based operations: checking if a word exists, finding all words with a given prefix, and autocomplete functionality. The time complexity for insertion, search, and deletion is O(m) where m is the length of the word, independent of the total number of words stored. Space efficiency can be improved using compressed tries (radix trees) which merge chains of single-child nodes.",
    icon: "schema",
    tags: ["prefix-tree", "string-storage", "autocomplete", "dictionary"],
    leetcodeProblems: [
      "Implement Trie (Prefix Tree)",
      "Word Search II",
      "Design Add and Search Words Data Structure"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isEndOfWord = true;
  }

  search(word: string): boolean {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) return false;
      node = node.children.get(char)!;
    }
    return node.isEndOfWord;
  }

  startsWith(prefix: string): boolean {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children.has(char)) return false;
      node = node.children.get(char)!;
    }
    return true;
  }

  findAllWithPrefix(prefix: string): string[] {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children.has(char)) return [];
      node = node.children.get(char)!;
    }

    const results: string[] = [];
    this.dfs(node, prefix, results);
    return results;
  }

  private dfs(node: TrieNode, current: string, results: string[]): void {
    if (node.isEndOfWord) results.push(current);
    for (const [char, child] of node.children) {
      this.dfs(child, current + char, results);
    }
  }

  delete(word: string): boolean {
    return this.deleteHelper(this.root, word, 0);
  }

  private deleteHelper(node: TrieNode, word: string, index: number): boolean {
    if (index === word.length) {
      if (!node.isEndOfWord) return false;
      node.isEndOfWord = false;
      return node.children.size === 0;
    }

    const char = word[index];
    const childNode = node.children.get(char);
    if (!childNode) return false;

    const shouldDeleteChild = this.deleteHelper(childNode, word, index + 1);
    if (shouldDeleteChild) {
      node.children.delete(char);
      return node.children.size === 0 && !node.isEndOfWord;
    }
    return false;
  }
}

// --- Example ---
const trie = new Trie();
trie.insert("apple");
const found1 = trie.search("apple");   // → true
const found2 = trie.search("app");     // → false
const hasPrefix = trie.startsWith("app"); // → true
`,
        steps: [
          {
            lines: [927, 928],
            title: "Start at Root",
            description: "Begin insertion at the root of the Trie. We'll traverse down character by character to find the insertion point.",
            variables: { node: "root", word: "to insert" }
          },
          {
            lines: [929, 930, 931, 932],
            title: "Create Missing Nodes",
            description: "For each character in the word, check if a child node exists. If not, create a new TrieNode for that character.",
            variables: { char: "current character", exists: "check children map" }
          },
          {
            lines: [933],
            title: "Move to Child Node",
            description: "Move to the child node corresponding to the current character. Continue traversing down the trie.",
            variables: { node: "children.get(char)" }
          },
          {
            lines: [935],
            title: "Mark End of Word",
            description: "After processing all characters, mark the final node as the end of a complete word by setting isEndOfWord to true.",
            variables: { isEndOfWord: "true", word: "inserted" }
          },
          {
            lines: [938, 939, 940, 941, 942, 943],
            title: "Search - Traverse Path",
            description: "Search for a word by traversing the trie character by character. If any character is missing, the word doesn't exist.",
            variables: { word: "to search", found: "checking path" }
          },
          {
            lines: [944],
            title: "Verify Complete Word",
            description: "After traversing all characters, check if the final node has isEndOfWord=true to confirm it's a complete word, not just a prefix.",
            variables: { isEndOfWord: "must be true", result: "word exists" }
          },
          {
            lines: [947, 948, 949, 950, 951, 952],
            title: "Check Prefix Exists",
            description: "The startsWith method checks if any word begins with the given prefix. Traverse the path without checking isEndOfWord.",
            variables: { prefix: "to check", exists: "path traversable" }
          },
          {
            lines: [980, 981, 982, 983],
            title: "Delete - Base Case",
            description: "When reaching the end of the word, verify it exists (isEndOfWord=true), unmark it, and return whether this node can be deleted (has no children).",
            variables: { index: "word.length", shouldDelete: "no children" }
          }
        ]
      },
      {
        language: "python",
        code: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True

    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end_of_word

    def starts_with(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True

    def find_all_with_prefix(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return []
            node = node.children[char]

        results = []
        self._dfs(node, prefix, results)
        return results

    def _dfs(self, node, current, results):
        if node.is_end_of_word:
            results.append(current)
        for char, child in node.children.items():
            self._dfs(child, current + char, results)

    def delete(self, word):
        def delete_helper(node, word, index):
            if index == len(word):
                if not node.is_end_of_word:
                    return False
                node.is_end_of_word = False
                return len(node.children) == 0

            char = word[index]
            if char not in node.children:
                return False

            child_node = node.children[char]
            should_delete_child = delete_helper(child_node, word, index + 1)

            if should_delete_child:
                del node.children[char]
                return len(node.children) == 0 and not node.is_end_of_word
            return False

        return delete_helper(self.root, word, 0)

# --- Example ---
trie = Trie()
trie.insert("apple")
found1 = trie.search("apple")      # -> True
found2 = trie.search("app")        # -> False
has_prefix = trie.starts_with("app") # -> True
`,
        steps: [
          {
            lines: [11, 12],
            title: "Start at Root",
            description: "Begin insertion at the root of the Trie. We'll traverse down character by character to find the insertion point.",
            variables: { node: "root", word: "to insert" }
          },
          {
            lines: [12, 13, 14, 15],
            title: "Create Missing Nodes",
            description: "For each character in the word, check if a child node exists. If not, create a new TrieNode for that character.",
            variables: { char: "current character", exists: "check children dict" }
          },
          {
            lines: [15],
            title: "Move to Child Node",
            description: "Move to the child node corresponding to the current character. Continue traversing down the trie.",
            variables: { node: "children[char]" }
          },
          {
            lines: [16],
            title: "Mark End of Word",
            description: "After processing all characters, mark the final node as the end of a complete word by setting is_end_of_word to True.",
            variables: { is_end_of_word: "True", word: "inserted" }
          },
          {
            lines: [19, 20, 21, 22, 23],
            title: "Search - Traverse Path",
            description: "Search for a word by traversing the trie character by character. If any character is missing, the word doesn't exist.",
            variables: { word: "to search", found: "checking path" }
          },
          {
            lines: [24],
            title: "Verify Complete Word",
            description: "After traversing all characters, check if the final node has is_end_of_word=True to confirm it's a complete word, not just a prefix.",
            variables: { is_end_of_word: "must be True", result: "word exists" }
          },
          {
            lines: [27, 28, 29, 30, 31, 32],
            title: "Check Prefix Exists",
            description: "The starts_with method checks if any word begins with the given prefix. Traverse the path without checking is_end_of_word.",
            variables: { prefix: "to check", exists: "path traversable" }
          },
          {
            lines: [52, 53, 54, 55, 56],
            title: "Delete - Base Case",
            description: "When reaching the end of the word, verify it exists (is_end_of_word=True), unmark it, and return whether this node can be deleted (has no children).",
            variables: { index: "len(word)", shouldDelete: "no children" }
          }
        ]
      }
    ],
    keyInsights: [
      "Each path from root to a node with isEndOfWord=true represents a complete word",
      "Common prefixes share the same path, making prefix operations extremely efficient",
      "Space complexity is O(ALPHABET_SIZE * N * M) where N is number of words and M is average length",
      "Can be optimized using arrays instead of maps for fixed alphabets (26 letters)"
    ],
    whenToUse: [
      "For autocomplete and search suggestions based on prefix matching",
      "When implementing spell checkers or word validators",
      "For IP routing tables and longest prefix matching problems"
    ]
  },
  {
    id: "TRE_007",
    name: "Lowest Common Ancestor",
    category: "Trees",
    difficulty: "Medium",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(n)",
    complexityScore: 0.65,
    description: "Finding the lowest common ancestor of two nodes in a tree. Multiple approaches exist including binary lifting, Tarjan's algorithm, and simple recursion.",
    longDescription: "The Lowest Common Ancestor (LCA) problem asks for the deepest node that is an ancestor of both given nodes in a tree. For binary trees, a simple recursive approach works in O(n) time. For general trees with multiple queries, preprocessing techniques like binary lifting reduce query time to O(log n) after O(n log n) preprocessing. Binary lifting preprocesses ancestor information at powers of 2, allowing efficient jumps upward in the tree. The Euler tour + Range Minimum Query approach reduces LCA to an RMQ problem. Understanding LCA is crucial for many tree algorithms and is frequently used in computational biology, network routing, and graph algorithms.",
    icon: "family_restroom",
    tags: ["tree-traversal", "binary-lifting", "recursion", "ancestor-queries"],
    leetcodeProblems: [
      "Lowest Common Ancestor of a Binary Tree",
      "Lowest Common Ancestor of a Binary Search Tree",
      "Lowest Common Ancestor of Deepest Leaves"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val: number) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

// Simple recursive approach for binary tree
function lowestCommonAncestor(
  root: TreeNode | null,
  p: TreeNode,
  q: TreeNode
): TreeNode | null {
  if (!root || root === p || root === q) return root;

  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);

  if (left && right) return root; // Found both nodes in different subtrees
  return left || right; // Return whichever is not null
}

// Binary lifting approach for multiple queries
class LCABinaryLifting {
  private parent: number[][];
  private depth: number[];
  private maxLog: number;

  constructor(private n: number, private adj: number[][]) {
    this.maxLog = Math.ceil(Math.log2(n)) + 1;
    this.parent = Array.from({ length: n }, () => Array(this.maxLog).fill(-1));
    this.depth = new Array(n).fill(0);
    this.preprocess(0, -1, 0);
  }

  private preprocess(node: number, par: number, d: number): void {
    this.parent[node][0] = par;
    this.depth[node] = d;

    for (let i = 1; i < this.maxLog; i++) {
      if (this.parent[node][i - 1] !== -1) {
        this.parent[node][i] = this.parent[this.parent[node][i - 1]][i - 1];
      }
    }

    for (const child of this.adj[node]) {
      if (child !== par) {
        this.preprocess(child, node, d + 1);
      }
    }
  }

  query(u: number, v: number): number {
    if (this.depth[u] < this.depth[v]) [u, v] = [v, u];

    // Bring u to the same level as v
    const diff = this.depth[u] - this.depth[v];
    for (let i = 0; i < this.maxLog; i++) {
      if ((diff >> i) & 1) {
        u = this.parent[u][i];
      }
    }

    if (u === v) return u;

    // Binary search for LCA
    for (let i = this.maxLog - 1; i >= 0; i--) {
      if (this.parent[u][i] !== this.parent[v][i]) {
        u = this.parent[u][i];
        v = this.parent[v][i];
      }
    }

    return this.parent[u][0];
  }
}

// --- Example ---
const root = new TreeNode(3);
root.left = new TreeNode(5);
root.right = new TreeNode(1);
const p = root.left;
const q = root.right;
const lca = lowestCommonAncestor(root, p, q); // → TreeNode { val: 3 }
`,
        steps: [
          {
            lines: [1118, 1119, 1120, 1121, 1122, 1123],
            title: "Base Cases - Null or Target Found",
            description: "For simple recursive LCA, if we reach null or find one of the target nodes (p or q), return immediately. This node is a potential ancestor.",
            variables: { root: "null or p or q", result: "return root" }
          },
          {
            lines: [1125, 1126],
            title: "Search Both Subtrees",
            description: "Recursively search for nodes p and q in both left and right subtrees. Each call returns either null or a node.",
            variables: { left: "search left", right: "search right" }
          },
          {
            lines: [1128],
            title: "Found LCA - Both Sides",
            description: "If both left and right return non-null values, it means p and q are in different subtrees. Current root is their lowest common ancestor.",
            variables: { left: "not null", right: "not null", LCA: "current root" }
          },
          {
            lines: [1129],
            title: "Return Non-Null Result",
            description: "If only one subtree returned a node, return that result up the recursion chain. Both nodes are in that subtree.",
            variables: { result: "left || right" }
          },
          {
            lines: [1145, 1146, 1147],
            title: "Binary Lifting - Preprocess Ancestors",
            description: "For each node, store its 2^i-th ancestor for i=0 to log(n). parent[node][0] is direct parent, parent[node][i] is 2^i steps up.",
            variables: { "parent[node][0]": "direct parent", "parent[node][i]": "2^i ancestor" }
          },
          {
            lines: [1163, 1164, 1165, 1166, 1167, 1168, 1169, 1170, 1171],
            title: "Level Nodes to Same Depth",
            description: "Bring the deeper node up to the same level as the shallower node using binary lifting. Jump by powers of 2 based on depth difference.",
            variables: { diff: "depth[u] - depth[v]", operation: "jump by 2^i" }
          },
          {
            lines: [1173],
            title: "Check if Same Node",
            description: "After leveling, if both nodes are the same, one is the ancestor of the other. Return it as the LCA.",
            variables: { u: "v", LCA: "u or v" }
          },
          {
            lines: [1176, 1177, 1178, 1179, 1180],
            title: "Binary Search for LCA",
            description: "Jump both nodes upward simultaneously by powers of 2, stopping just before they meet. Their parent is the LCA.",
            variables: { operation: "jump while parent[u][i] ≠ parent[v][i]", LCA: "parent[u][0]" }
          }
        ]
      },
      {
        language: "python",
        code: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

# Simple recursive approach for binary tree
def lowest_common_ancestor(root, p, q):
    if not root or root == p or root == q:
        return root

    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)

    if left and right:
        return root  # Found both nodes in different subtrees
    return left or right  # Return whichever is not None

# Binary lifting approach for multiple queries
class LCABinaryLifting:
    def __init__(self, n, adj):
        self.n = n
        self.adj = adj
        self.max_log = n.bit_length()
        self.parent = [[-1] * self.max_log for _ in range(n)]
        self.depth = [0] * n
        self.preprocess(0, -1, 0)

    def preprocess(self, node, par, d):
        self.parent[node][0] = par
        self.depth[node] = d

        for i in range(1, self.max_log):
            if self.parent[node][i - 1] != -1:
                self.parent[node][i] = self.parent[self.parent[node][i - 1]][i - 1]

        for child in self.adj[node]:
            if child != par:
                self.preprocess(child, node, d + 1)

    def query(self, u, v):
        if self.depth[u] < self.depth[v]:
            u, v = v, u

        # Bring u to the same level as v
        diff = self.depth[u] - self.depth[v]
        for i in range(self.max_log):
            if (diff >> i) & 1:
                u = self.parent[u][i]

        if u == v:
            return u

        # Binary search for LCA
        for i in range(self.max_log - 1, -1, -1):
            if self.parent[u][i] != self.parent[v][i]:
                u = self.parent[u][i]
                v = self.parent[v][i]

        return self.parent[u][0]

# --- Example ---
root = TreeNode(3)
root.left = TreeNode(5)
root.right = TreeNode(1)
p = root.left
q = root.right
lca = lowest_common_ancestor(root, p, q) # -> TreeNode(val=3)
`,
        steps: [
          {
            lines: [9, 10],
            title: "Base Cases - None or Target Found",
            description: "For simple recursive LCA, if we reach None or find one of the target nodes (p or q), return immediately. This node is a potential ancestor.",
            variables: { root: "None or p or q", result: "return root" }
          },
          {
            lines: [12, 13],
            title: "Search Both Subtrees",
            description: "Recursively search for nodes p and q in both left and right subtrees. Each call returns either None or a node.",
            variables: { left: "search left", right: "search right" }
          },
          {
            lines: [15, 16],
            title: "Found LCA - Both Sides",
            description: "If both left and right return non-None values, it means p and q are in different subtrees. Current root is their lowest common ancestor.",
            variables: { left: "not None", right: "not None", LCA: "current root" }
          },
          {
            lines: [17],
            title: "Return Non-None Result",
            description: "If only one subtree returned a node, return that result up the recursion chain. Both nodes are in that subtree.",
            variables: { result: "left or right" }
          },
          {
            lines: [29, 30, 31, 32, 33, 34],
            title: "Binary Lifting - Preprocess Ancestors",
            description: "For each node, store its 2^i-th ancestor for i=0 to log(n). parent[node][0] is direct parent, parent[node][i] is 2^i steps up.",
            variables: { "parent[node][0]": "direct parent", "parent[node][i]": "2^i ancestor" }
          },
          {
            lines: [44, 45, 46, 47, 48],
            title: "Level Nodes to Same Depth",
            description: "Bring the deeper node up to the same level as the shallower node using binary lifting. Jump by powers of 2 based on depth difference.",
            variables: { diff: "depth[u] - depth[v]", operation: "jump by 2^i" }
          },
          {
            lines: [50, 51],
            title: "Check if Same Node",
            description: "After leveling, if both nodes are the same, one is the ancestor of the other. Return it as the LCA.",
            variables: { u: "v", LCA: "u or v" }
          },
          {
            lines: [53, 54, 55, 56, 57, 58, 59],
            title: "Binary Search for LCA",
            description: "Jump both nodes upward simultaneously by powers of 2, stopping just before they meet. Their parent is the LCA.",
            variables: { operation: "jump while parent[u][i] != parent[v][i]", LCA: "parent[u][0]" }
          }
        ]
      }
    ],
    keyInsights: [
      "In a binary tree, if one node is in left subtree and another in right, current node is LCA",
      "Binary lifting preprocesses 2^k-th ancestors to answer queries in O(log n)",
      "For BST, LCA is the first node whose value is between p and q",
      "Euler tour + RMQ technique converts LCA to range minimum query problem"
    ],
    whenToUse: [
      "When finding common ancestors in tree structures or hierarchies",
      "For distance queries between nodes in a tree",
      "In computational biology for phylogenetic tree analysis"
    ]
  },
  {
    id: "TRE_008",
    name: "Tree Traversals (In/Pre/Post)",
    category: "Trees",
    difficulty: "Beginner",
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    complexityScore: 0.3,
    description: "Three fundamental ways to visit all nodes in a binary tree: inorder (left-root-right), preorder (root-left-right), and postorder (left-right-root).",
    longDescription: "Tree traversals are systematic ways to visit all nodes in a tree. Inorder traversal (left-root-right) visits nodes in sorted order for BSTs. Preorder traversal (root-left-right) processes the parent before children, useful for creating a copy of the tree or prefix expressions. Postorder traversal (left-right-post) processes children before parent, used in deletion operations and postfix expressions. Each traversal can be implemented recursively (using call stack) or iteratively (using explicit stack). The choice of traversal depends on the problem: inorder for sorted processing, preorder for tree serialization, and postorder for tree deletion or bottom-up computation.",
    icon: "swap_calls",
    tags: ["tree-traversal", "recursion", "depth-first-search", "binary-tree"],
    leetcodeProblems: [
      "Binary Tree Inorder Traversal",
      "Binary Tree Preorder Traversal",
      "Binary Tree Postorder Traversal"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val: number) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

// Inorder: Left -> Root -> Right
function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: TreeNode[] = [];
  let current = root;

  while (current || stack.length > 0) {
    while (current) {
      stack.push(current);
      current = current.left;
    }
    current = stack.pop()!;
    result.push(current.val);
    current = current.right;
  }
  return result;
}

// Preorder: Root -> Left -> Right
function preorderTraversal(root: TreeNode | null): number[] {
  if (!root) return [];
  const result: number[] = [];
  const stack: TreeNode[] = [root];

  while (stack.length > 0) {
    const node = stack.pop()!;
    result.push(node.val);
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  return result;
}

// Postorder: Left -> Right -> Root
function postorderTraversal(root: TreeNode | null): number[] {
  if (!root) return [];
  const result: number[] = [];
  const stack: TreeNode[] = [root];

  while (stack.length > 0) {
    const node = stack.pop()!;
    result.unshift(node.val); // Add to front
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }
  return result;
}

// Recursive implementations
function inorderRecursive(root: TreeNode | null, result: number[] = []): number[] {
  if (root) {
    inorderRecursive(root.left, result);
    result.push(root.val);
    inorderRecursive(root.right, result);
  }
  return result;
}

function preorderRecursive(root: TreeNode | null, result: number[] = []): number[] {
  if (root) {
    result.push(root.val);
    preorderRecursive(root.left, result);
    preorderRecursive(root.right, result);
  }
  return result;
}

function postorderRecursive(root: TreeNode | null, result: number[] = []): number[] {
  if (root) {
    postorderRecursive(root.left, result);
    postorderRecursive(root.right, result);
    result.push(root.val);
  }
  return result;
}

// --- Example ---
const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
const inorder = inorderTraversal(root);     // → [2, 1, 3]
const preorder = preorderTraversal(root);   // → [1, 2, 3]
const postorder = postorderTraversal(root); // → [2, 3, 1]
`,
        steps: [
          {
            lines: [1296, 1297, 1298],
            title: "Initialize Stack and Pointer",
            description: "For inorder traversal, initialize an empty result array, stack for backtracking, and current pointer starting at root.",
            variables: { result: "[]", stack: "[]", current: "root" }
          },
          {
            lines: [1300, 1301, 1302, 1303, 1304],
            title: "Traverse Left - Push to Stack",
            description: "Keep moving left and pushing nodes onto the stack until we reach null. This finds the leftmost (smallest in BST) node.",
            variables: { operation: "go left", stack: "nodes to revisit" }
          },
          {
            lines: [1305, 1306],
            title: "Process Node - Pop and Visit",
            description: "Pop a node from the stack and add its value to the result. This is the 'visit root' step in inorder (left-root-right).",
            variables: { current: "stack.pop()", operation: "visit node" }
          },
          {
            lines: [1307],
            title: "Move to Right Subtree",
            description: "After visiting the node, move to its right subtree. If it exists, the loop will traverse its left path next.",
            variables: { current: "current.right", next: "right subtree" }
          },
          {
            lines: [1314, 1315, 1316],
            title: "Preorder - Initialize with Root",
            description: "For preorder traversal, start by pushing root onto the stack. We'll process nodes in root-left-right order.",
            variables: { traversal: "preorder", order: "root-left-right" }
          },
          {
            lines: [1318, 1319, 1320, 1321, 1322],
            title: "Preorder - Process Root First",
            description: "Pop a node, immediately add its value (visit root first), then push right child before left so left is processed next.",
            variables: { visit: "root first", push: "right then left" }
          },
          {
            lines: [1329, 1330, 1331, 1332, 1333, 1334, 1335],
            title: "Postorder - Reverse Preorder",
            description: "For postorder, use modified preorder (root-right-left) and insert at front. This gives left-right-root order.",
            variables: { traversal: "postorder", trick: "reverse of root-right-left" }
          },
          {
            lines: [1343, 1344, 1345, 1346, 1347],
            title: "Recursive Inorder Pattern",
            description: "Recursive implementation follows the pattern: process left subtree, visit current node, process right subtree.",
            variables: { pattern: "left-root-right", implementation: "recursive" }
          }
        ]
      },
      {
        language: "python",
        code: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

# Inorder: Left -> Root -> Right
def inorder_traversal(root):
    result = []
    stack = []
    current = root

    while current or stack:
        while current:
            stack.append(current)
            current = current.left
        current = stack.pop()
        result.append(current.val)
        current = current.right

    return result

# Preorder: Root -> Left -> Right
def preorder_traversal(root):
    if not root:
        return []
    result = []
    stack = [root]

    while stack:
        node = stack.pop()
        result.append(node.val)
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)

    return result

# Postorder: Left -> Right -> Root
def postorder_traversal(root):
    if not root:
        return []
    result = []
    stack = [root]

    while stack:
        node = stack.pop()
        result.insert(0, node.val)  # Add to front
        if node.left:
            stack.append(node.left)
        if node.right:
            stack.append(node.right)

    return result

# Recursive implementations
def inorder_recursive(root, result=None):
    if result is None:
        result = []
    if root:
        inorder_recursive(root.left, result)
        result.append(root.val)
        inorder_recursive(root.right, result)
    return result

def preorder_recursive(root, result=None):
    if result is None:
        result = []
    if root:
        result.append(root.val)
        preorder_recursive(root.left, result)
        preorder_recursive(root.right, result)
    return result

def postorder_recursive(root, result=None):
    if result is None:
        result = []
    if root:
        postorder_recursive(root.left, result)
        postorder_recursive(root.right, result)
        result.append(root.val)
    return result

# --- Example ---
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
inorder = inorder_traversal(root)     # -> [2, 1, 3]
preorder = preorder_traversal(root)   # -> [1, 2, 3]
postorder = postorder_traversal(root) # -> [2, 3, 1]
`,
        steps: [
          {
            lines: [9, 10, 11],
            title: "Initialize Stack and Pointer",
            description: "For inorder traversal, initialize an empty result list, stack for backtracking, and current pointer starting at root.",
            variables: { result: "[]", stack: "[]", current: "root" }
          },
          {
            lines: [13, 14, 15, 16],
            title: "Traverse Left - Push to Stack",
            description: "Keep moving left and pushing nodes onto the stack until we reach None. This finds the leftmost (smallest in BST) node.",
            variables: { operation: "go left", stack: "nodes to revisit" }
          },
          {
            lines: [17, 18],
            title: "Process Node - Pop and Visit",
            description: "Pop a node from the stack and add its value to the result. This is the 'visit root' step in inorder (left-root-right).",
            variables: { current: "stack.pop()", operation: "visit node" }
          },
          {
            lines: [19],
            title: "Move to Right Subtree",
            description: "After visiting the node, move to its right subtree. If it exists, the loop will traverse its left path next.",
            variables: { current: "current.right", next: "right subtree" }
          },
          {
            lines: [25, 26, 27, 28],
            title: "Preorder - Initialize with Root",
            description: "For preorder traversal, start by pushing root onto the stack. We'll process nodes in root-left-right order.",
            variables: { traversal: "preorder", order: "root-left-right" }
          },
          {
            lines: [30, 31, 32, 33, 34, 35],
            title: "Preorder - Process Root First",
            description: "Pop a node, immediately add its value (visit root first), then push right child before left so left is processed next.",
            variables: { visit: "root first", push: "right then left" }
          },
          {
            lines: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52],
            title: "Postorder - Reverse Preorder",
            description: "For postorder, use modified preorder (root-right-left) and insert at front. This gives left-right-root order.",
            variables: { traversal: "postorder", trick: "reverse of root-right-left" }
          },
          {
            lines: [57, 58, 59, 60, 61, 62],
            title: "Recursive Inorder Pattern",
            description: "Recursive implementation follows the pattern: process left subtree, visit current node, process right subtree.",
            variables: { pattern: "left-root-right", implementation: "recursive" }
          }
        ]
      }
    ],
    keyInsights: [
      "Inorder traversal of a BST produces sorted sequence of values",
      "Preorder and inorder traversals together can uniquely reconstruct a binary tree",
      "Iterative implementations use explicit stack to simulate recursion",
      "Space complexity is O(h) where h is tree height, O(log n) for balanced, O(n) for skewed"
    ],
    whenToUse: [
      "Inorder for processing BST nodes in sorted order",
      "Preorder for tree serialization or creating a copy of the tree",
      "Postorder for tree deletion or expression evaluation (postfix)"
    ]
  },
  {
    id: "TRE_009",
    name: "Morris Traversal",
    category: "Trees",
    difficulty: "Advanced",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    complexityScore: 0.8,
    description: "Tree traversal technique that achieves O(1) space complexity by using threaded binary trees. Temporarily modifies tree structure during traversal.",
    longDescription: "Morris Traversal is an ingenious algorithm that performs inorder or preorder tree traversal without using recursion or an explicit stack, achieving O(1) space complexity. It works by temporarily creating threads (links) from nodes to their inorder successors, effectively converting the tree into a threaded binary tree during traversal. For each node, it finds the rightmost node in its left subtree and creates a temporary link back to the current node. After processing, these threads are removed to restore the original tree structure. While it has the same O(n) time complexity as standard traversals, the constant factor is higher due to the overhead of creating and removing threads.",
    icon: "moving",
    tags: ["tree-traversal", "space-optimization", "threaded-tree", "constant-space"],
    leetcodeProblems: [
      "Binary Tree Inorder Traversal",
      "Recover Binary Search Tree",
      "Binary Tree Preorder Traversal"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val: number) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

// Morris Inorder Traversal
function morrisInorder(root: TreeNode | null): number[] {
  const result: number[] = [];
  let current = root;

  while (current) {
    if (!current.left) {
      // No left subtree, visit current and go right
      result.push(current.val);
      current = current.right;
    } else {
      // Find inorder predecessor (rightmost in left subtree)
      let predecessor = current.left;
      while (predecessor.right && predecessor.right !== current) {
        predecessor = predecessor.right;
      }

      if (!predecessor.right) {
        // Create thread
        predecessor.right = current;
        current = current.left;
      } else {
        // Thread exists, remove it and visit current
        predecessor.right = null;
        result.push(current.val);
        current = current.right;
      }
    }
  }

  return result;
}

// Morris Preorder Traversal
function morrisPreorder(root: TreeNode | null): number[] {
  const result: number[] = [];
  let current = root;

  while (current) {
    if (!current.left) {
      result.push(current.val);
      current = current.right;
    } else {
      let predecessor = current.left;
      while (predecessor.right && predecessor.right !== current) {
        predecessor = predecessor.right;
      }

      if (!predecessor.right) {
        // Visit before creating thread (preorder)
        result.push(current.val);
        predecessor.right = current;
        current = current.left;
      } else {
        predecessor.right = null;
        current = current.right;
      }
    }
  }

  return result;
}

// --- Example ---
const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);
const inorder = morrisInorder(root);   // → [4, 2, 5, 1, 3]
const preorder = morrisPreorder(root); // → [1, 2, 4, 5, 3]
`,
        steps: [
          {
            lines: [1505, 1506, 1507, 1508, 1509],
            title: "No Left Child - Visit and Go Right",
            description: "If current node has no left subtree, visit it immediately (add to result) and move to the right child. This handles leaf nodes and right-only branches.",
            variables: { "current.left": "null", operation: "visit and go right" }
          },
          {
            lines: [1511, 1512, 1513, 1514, 1515],
            title: "Find Inorder Predecessor",
            description: "Find the rightmost node in the left subtree. This node is the inorder predecessor and will be used to create a thread back to current.",
            variables: { predecessor: "rightmost in left subtree", purpose: "threading" }
          },
          {
            lines: [1517, 1518, 1519, 1520],
            title: "Create Thread to Current",
            description: "If predecessor's right is null, create a temporary thread (link) from predecessor to current, then move to left child. This allows us to return later.",
            variables: { "predecessor.right": "current", thread: "created" }
          },
          {
            lines: [1521, 1522, 1523, 1524, 1525],
            title: "Thread Exists - Remove and Visit",
            description: "If thread already exists, we've returned from left subtree. Remove the thread (restore tree), visit current node, and go right.",
            variables: { thread: "exists", operation: "remove, visit, go right" }
          },
          {
            lines: [1538, 1539, 1540, 1541],
            title: "Morris Preorder - No Left",
            description: "In preorder Morris, when there's no left child, visit the node immediately and move right. Same as inorder for this case.",
            variables: { order: "preorder", operation: "visit then right" }
          },
          {
            lines: [1548, 1549, 1550, 1551, 1552],
            title: "Preorder - Visit Before Thread",
            description: "Key difference for preorder: visit the node BEFORE creating the thread and going left, not after removing it. This gives root-left-right order.",
            variables: { visit: "before creating thread", order: "root-left-right" }
          },
          {
            lines: [1553, 1554, 1555],
            title: "Thread Exists - Just Remove",
            description: "When thread exists in preorder, just remove it and go right. Don't visit (already visited when creating thread).",
            variables: { thread: "remove", visited: "already done" }
          },
          {
            lines: [1564, 1565, 1566, 1567, 1568],
            title: "Example Tree Construction",
            description: "Create a sample binary tree for demonstration. Tree structure: 1 as root, 2 as left child with children 4 and 5, 3 as right child.",
            variables: { root: "1", left: "2,4,5", right: "3" }
          }
        ]
      },
      {
        language: "python",
        code: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

# Morris Inorder Traversal
def morris_inorder(root):
    result = []
    current = root

    while current:
        if not current.left:
            # No left subtree, visit current and go right
            result.append(current.val)
            current = current.right
        else:
            # Find inorder predecessor (rightmost in left subtree)
            predecessor = current.left
            while predecessor.right and predecessor.right != current:
                predecessor = predecessor.right

            if not predecessor.right:
                # Create thread
                predecessor.right = current
                current = current.left
            else:
                # Thread exists, remove it and visit current
                predecessor.right = None
                result.append(current.val)
                current = current.right

    return result

# Morris Preorder Traversal
def morris_preorder(root):
    result = []
    current = root

    while current:
        if not current.left:
            result.append(current.val)
            current = current.right
        else:
            predecessor = current.left
            while predecessor.right and predecessor.right != current:
                predecessor = predecessor.right

            if not predecessor.right:
                # Visit before creating thread (preorder)
                result.append(current.val)
                predecessor.right = current
                current = current.left
            else:
                predecessor.right = None
                current = current.right

    return result

# --- Example ---
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)
inorder = morris_inorder(root)   # -> [4, 2, 5, 1, 3]
preorder = morris_preorder(root) # -> [1, 2, 4, 5, 3]
`,
        steps: [
          {
            lines: [13, 14, 15, 16],
            title: "No Left Child - Visit and Go Right",
            description: "If current node has no left subtree, visit it immediately (add to result) and move to the right child. This handles leaf nodes and right-only branches.",
            variables: { "current.left": "None", operation: "visit and go right" }
          },
          {
            lines: [18, 19, 20, 21],
            title: "Find Inorder Predecessor",
            description: "Find the rightmost node in the left subtree. This node is the inorder predecessor and will be used to create a thread back to current.",
            variables: { predecessor: "rightmost in left subtree", purpose: "threading" }
          },
          {
            lines: [23, 24, 25, 26],
            title: "Create Thread to Current",
            description: "If predecessor's right is None, create a temporary thread (link) from predecessor to current, then move to left child. This allows us to return later.",
            variables: { "predecessor.right": "current", thread: "created" }
          },
          {
            lines: [27, 28, 29, 30, 31],
            title: "Thread Exists - Remove and Visit",
            description: "If thread already exists, we've returned from left subtree. Remove the thread (restore tree), visit current node, and go right.",
            variables: { thread: "exists", operation: "remove, visit, go right" }
          },
          {
            lines: [41, 42, 43],
            title: "Morris Preorder - No Left",
            description: "In preorder Morris, when there's no left child, visit the node immediately and move right. Same as inorder for this case.",
            variables: { order: "preorder", operation: "visit then right" }
          },
          {
            lines: [49, 50, 51, 52, 53],
            title: "Preorder - Visit Before Thread",
            description: "Key difference for preorder: visit the node BEFORE creating the thread and going left, not after removing it. This gives root-left-right order.",
            variables: { visit: "before creating thread", order: "root-left-right" }
          },
          {
            lines: [54, 55, 56],
            title: "Thread Exists - Just Remove",
            description: "When thread exists in preorder, just remove it and go right. Don't visit (already visited when creating thread).",
            variables: { thread: "remove", visited: "already done" }
          },
          {
            lines: [61, 62, 63, 64, 65],
            title: "Example Tree Construction",
            description: "Create a sample binary tree for demonstration. Tree structure: 1 as root, 2 as left child with children 4 and 5, 3 as right child.",
            variables: { root: "1", left: "2,4,5", right: "3" }
          }
        ]
      }
    ],
    keyInsights: [
      "Achieves O(1) space by creating temporary threads instead of using stack or recursion",
      "Threads connect nodes to their inorder successors during traversal",
      "Each edge is traversed at most twice, maintaining O(n) time complexity",
      "Restores original tree structure by removing threads after use"
    ],
    whenToUse: [
      "When space complexity must be minimized (embedded systems, memory constraints)",
      "For in-place tree traversal without modifying the tree permanently",
      "When interviewer asks for constant space tree traversal solution"
    ]
  }
];
