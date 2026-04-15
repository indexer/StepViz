export type Difficulty = "Beginner" | "Medium" | "Advanced";

export type Category =
  | "Sorting"
  | "Searching"
  | "Graphs"
  | "Trees"
  | "Dynamic Programming"
  | "Greedy"
  | "Backtracking"
  | "Linked Lists"
  | "Stacks & Queues"
  | "Hashing"
  | "Heaps"
  | "Sliding Window"
  | "Two Pointers"
  | "Bit Manipulation"
  | "Math"
  | "String"
  | "Union Find"
  | "Trie"
  | "Divide & Conquer";

export interface CodeStep {
  /** 1-indexed line numbers to highlight for this step */
  lines: number[];
  /** Short title for the step */
  title: string;
  /** Detailed explanation of what happens at this step */
  description: string;
  /** Optional: show variable state at this point */
  variables?: Record<string, string>;
}

export interface CodeExample {
  language: "typescript" | "python" | "java" | "cpp" | "kotlin";
  code: string;
  steps?: CodeStep[];
}

export interface Algorithm {
  id: string;
  name: string;
  category: Category;
  difficulty: Difficulty;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  longDescription: string;
  icon: string;
  /** 0-1 representing relative complexity for progress bar */
  complexityScore: number;
  tags: string[];
  leetcodeProblems: string[];
  codeExamples: CodeExample[];
  keyInsights: string[];
  whenToUse: string[];
}

export interface AlgorithmSummary {
  id: string;
  name: string;
  category: Category;
  difficulty: Difficulty;
  timeComplexity: string;
  description: string;
  icon: string;
  complexityScore: number;
  tags: string[];
}

export interface AlgorithmFilters {
  categories: Category[];
  difficulties: Difficulty[];
  search: string;
}

export type ViewMode = "grid" | "list";

export type SortOption = "name" | "difficulty" | "category";
