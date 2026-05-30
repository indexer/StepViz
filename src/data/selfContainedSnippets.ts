import type { Algorithm } from "../types/algorithm";

/**
 * A few library snippets (linked-list and trie problems) reference helper types
 * — `ListNode`, `TrieNode` — that LeetCode provides implicitly but that aren't
 * defined in the snippet, so the code can't actually run. This overlay prepends
 * a concise, idiomatic definition of the needed helper to the TS/Python
 * examples, making them self-contained: they now execute on the real runtimes
 * (so the step-value generator can ground them, and they work if pasted into
 * the playground) while staying faithful to the original algorithm.
 *
 * Prepending shifts line numbers, so every authored `step.lines` is offset by
 * the number of preamble lines — keeping the highlight aligned. Titles,
 * descriptions, and the algorithm body are untouched. Kotlin examples are left
 * alone (no in-browser Kotlin runtime; they keep authored values).
 */

const TS_LISTNODE = `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

`;

const PY_LISTNODE = `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

`;

const TS_TRIENODE = `class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

`;

const PY_TRIENODE = `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

`;

/** algorithmId → language → preamble to prepend. */
const PREAMBLES: Record<string, Partial<Record<string, string>>> = {
  LIN_002: { typescript: TS_LISTNODE, python: PY_LISTNODE },
  LIN_003: { typescript: TS_LISTNODE, python: PY_LISTNODE },
  HEA_002: { typescript: TS_LISTNODE, python: PY_LISTNODE },
  TRI_002: { typescript: TS_TRIENODE, python: PY_TRIENODE },
};

const lineCount = (s: string) => (s.match(/\n/g) ?? []).length;

export function withSelfContainedSnippets(items: Algorithm[]): Algorithm[] {
  return items.map((algorithm) => {
    const byLang = PREAMBLES[algorithm.id];
    if (!byLang) return algorithm;
    return {
      ...algorithm,
      codeExamples: algorithm.codeExamples.map((ex) => {
        const preamble = byLang[ex.language];
        if (!preamble) return ex;
        const offset = lineCount(preamble);
        return {
          ...ex,
          code: preamble + ex.code,
          steps: ex.steps?.map((step) => ({
            ...step,
            lines: step.lines.map((l) => l + offset),
          })),
        };
      }),
    };
  });
}
