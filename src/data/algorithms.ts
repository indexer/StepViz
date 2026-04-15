import type { Algorithm, Category } from "../types/algorithm";
import { sortingAlgorithms } from "./algorithms-sorting";
import { searchingAlgorithms } from "./algorithms-searching";
import { graphAlgorithms } from "./algorithms-graphs";
import { treeAlgorithms } from "./algorithms-trees";
import { dpAlgorithms } from "./algorithms-dp";
import { techniqueAlgorithms } from "./algorithms-techniques";
import { structureAlgorithms } from "./algorithms-structures";
import { miscAlgorithms } from "./algorithms-misc";
import { withGeneratedKotlinExamples } from "./kotlinExamples";

const baseAlgorithms: Algorithm[] = [
  ...sortingAlgorithms,
  ...searchingAlgorithms,
  ...graphAlgorithms,
  ...treeAlgorithms,
  ...dpAlgorithms,
  ...techniqueAlgorithms,
  ...structureAlgorithms,
  ...miscAlgorithms,
];

export const algorithms: Algorithm[] = withGeneratedKotlinExamples(baseAlgorithms);

export function getAlgorithmById(id: string): Algorithm | undefined {
  return algorithms.find((a) => a.id === id);
}

export function getAlgorithmsByCategory(category: Category): Algorithm[] {
  return algorithms.filter((a) => a.category === category);
}

export function getAllCategories(): Category[] {
  const cats = new Set(algorithms.map((a) => a.category));
  return Array.from(cats) as Category[];
}

export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const algo of algorithms) {
    counts[algo.category] = (counts[algo.category] || 0) + 1;
  }
  return counts;
}
