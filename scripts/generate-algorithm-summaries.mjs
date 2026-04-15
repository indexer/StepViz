import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const dataDir = path.join(repoRoot, 'src', 'data');
const outputPath = path.join(dataDir, 'algorithmSummaries.ts');
const sourceFiles = [
  'algorithms-sorting.ts',
  'algorithms-searching.ts',
  'algorithms-graphs.ts',
  'algorithms-trees.ts',
  'algorithms-dp.ts',
  'algorithms-techniques.ts',
  'algorithms-structures.ts',
  'algorithms-misc.ts',
];

function extractAlgorithmHeaders(fileContent) {
  const matches = fileContent.matchAll(/^\s*{\s*\n\s*id:\s*["'][^"']+["'],[\s\S]*?^\s*codeExamples:\s*\[/gm);
  return Array.from(matches, (match) => match[0]);
}

function extractLiteral(header, fieldName) {
  const match = header.match(
    new RegExp(`${fieldName}:\\s*("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*')`, 'm'),
  );

  if (!match) {
    throw new Error(`Missing string literal for ${fieldName}`);
  }

  return Function(`return (${match[1]});`)();
}

function extractNumber(header, fieldName) {
  const match = header.match(new RegExp(`${fieldName}:\\s*([0-9]+(?:\\.[0-9]+)?)`, 'm'));
  if (!match) {
    throw new Error(`Missing numeric literal for ${fieldName}`);
  }

  return Number(match[1]);
}

function extractTags(header) {
  const match = header.match(/tags:\s*(\[[\s\S]*?\])\s*,\s*leetcodeProblems:/m);
  if (!match) {
    throw new Error('Missing tags array');
  }

  return Function(`return (${match[1]});`)();
}

function toSummary(header) {
  return {
    id: extractLiteral(header, 'id'),
    name: extractLiteral(header, 'name'),
    category: extractLiteral(header, 'category'),
    difficulty: extractLiteral(header, 'difficulty'),
    timeComplexity: extractLiteral(header, 'timeComplexity'),
    description: extractLiteral(header, 'description'),
    icon: extractLiteral(header, 'icon'),
    complexityScore: extractNumber(header, 'complexityScore'),
    tags: extractTags(header),
  };
}

function generateModuleSource(summaries) {
  return `import type { AlgorithmSummary, Category } from '../types/algorithm';

export const algorithmSummaries: AlgorithmSummary[] = ${JSON.stringify(summaries, null, 2)} as AlgorithmSummary[];

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
`;
}

const summaries = sourceFiles
  .flatMap((fileName) => {
    const fileContent = fs.readFileSync(path.join(dataDir, fileName), 'utf8');
    return extractAlgorithmHeaders(fileContent).map(toSummary);
  })
  .sort((left, right) => left.id.localeCompare(right.id));

fs.writeFileSync(outputPath, generateModuleSource(summaries));
