/**
 * Script to add step-by-step walkthrough data to Python code examples.
 *
 * Strategy: For each algorithm, analyze its Python code and create educational
 * steps that match the existing TypeScript step structure but with correct
 * Python line numbers.
 *
 * Run with: npx tsx scripts/add-python-steps.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CodeStep {
  lines: number[];
  title: string;
  description: string;
  variables?: Record<string, string>;
}

/**
 * Analyze Python code and generate educational steps.
 * Groups lines into logical blocks (function def, conditionals, loops, returns, etc.)
 */
function generatePythonSteps(code: string, algorithmName: string): CodeStep[] {
  const lines = code.split('\n');
  const steps: CodeStep[] = [];

  // Parse logical blocks from the Python code
  const blocks: { startLine: number; endLine: number; type: string; content: string }[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    const indent = line.length - line.trimStart().length;

    // Skip empty lines
    if (trimmed === '') {
      i++;
      continue;
    }

    // Skip comments
    if (trimmed.startsWith('#')) {
      i++;
      continue;
    }

    // Function/class definition
    if (trimmed.startsWith('def ') || trimmed.startsWith('class ')) {
      const blockStart = i;
      // Find the end of the signature (might span multiple lines)
      while (i < lines.length && !lines[i].includes(':')) {
        i++;
      }
      // Include the colon line
      const sigEnd = i;

      // Find the body - lines with greater indentation
      i++;
      const bodyIndent = indent + 4;
      const bodyStart = i;
      while (i < lines.length) {
        const nextLine = lines[i];
        const nextTrimmed = nextLine.trim();
        if (nextTrimmed === '' || nextTrimmed.startsWith('#')) {
          i++;
          continue;
        }
        const nextIndent = nextLine.length - nextLine.trimStart().length;
        if (nextIndent < bodyIndent) break;
        i++;
      }

      blocks.push({
        startLine: blockStart + 1,
        endLine: sigEnd + 1,
        type: trimmed.startsWith('class ') ? 'class' : 'function',
        content: trimmed,
      });
      continue;
    }

    // Assignment / expression
    if (trimmed.includes('=') && !trimmed.startsWith('if ') && !trimmed.startsWith('elif ') && !trimmed.startsWith('while ') && !trimmed.startsWith('for ')) {
      blocks.push({
        startLine: i + 1,
        endLine: i + 1,
        type: 'assignment',
        content: trimmed,
      });
      i++;
      continue;
    }

    // Control flow
    if (trimmed.startsWith('if ') || trimmed.startsWith('elif ') || trimmed.startsWith('else:') || trimmed.startsWith('while ') || trimmed.startsWith('for ')) {
      const blockStart = i;
      i++;
      // Include the body
      while (i < lines.length) {
        const nextLine = lines[i];
        const nextTrimmed = nextLine.trim();
        if (nextTrimmed === '') {
          i++;
          continue;
        }
        const nextIndent = nextLine.length - nextLine.trimStart().length;
        if (nextIndent <= indent && !nextTrimmed.startsWith('elif ') && !nextTrimmed.startsWith('else:')) break;
        if (nextIndent <= indent && (nextTrimmed.startsWith('elif ') || nextTrimmed.startsWith('else:'))) {
          // Include elif/else as part of the block
          i++;
          continue;
        }
        i++;
      }

      blocks.push({
        startLine: blockStart + 1,
        endLine: i,
        type: 'control',
        content: trimmed,
      });
      continue;
    }

    // Return
    if (trimmed.startsWith('return ') || trimmed === 'return') {
      blocks.push({
        startLine: i + 1,
        endLine: i + 1,
        type: 'return',
        content: trimmed,
      });
      i++;
      continue;
    }

    // Other statements
    blocks.push({
      startLine: i + 1,
      endLine: i + 1,
      type: 'statement',
      content: trimmed,
    });
    i++;
  }

  // Now create steps from blocks - group small blocks together
  // Target 4-7 steps
  const totalLines = lines.length;

  // Simple approach: divide the code into logical chunks
  // Find function definitions first
  const funcDefs = blocks.filter(b => b.type === 'function' || b.type === 'class');

  if (funcDefs.length === 0) {
    // No functions - just step through the code in sections
    return createStepsFromLineRanges(lines, algorithmName);
  }

  return createStepsFromLineRanges(lines, algorithmName);
}

function createStepsFromLineRanges(lines: string[], algorithmName: string): CodeStep[] {
  const steps: CodeStep[] = [];
  const totalLines = lines.length;

  if (totalLines === 0) return steps;

  // Find logical sections
  const sections: { start: number; end: number; label: string; description: string }[] = [];

  let currentStart = 0;
  let inFunction = false;
  let funcName = '';

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    // New top-level function or class
    if ((trimmed.startsWith('def ') || trimmed.startsWith('class ')) &&
        (lines[i].length - lines[i].trimStart().length === 0)) {
      if (currentStart < i && sections.length > 0) {
        // Extend previous section to here
        sections[sections.length - 1].end = i;
      }

      // Start new section for this function
      const match = trimmed.match(/^(def|class)\s+(\w+)/);
      funcName = match ? match[2] : 'block';
      currentStart = i;

      // Find end of this function
      let j = i + 1;
      while (j < lines.length) {
        const nextLine = lines[j];
        const nextTrimmed = nextLine.trim();
        if (nextTrimmed === '' || nextTrimmed.startsWith('#')) {
          j++;
          continue;
        }
        const nextIndent = nextLine.length - nextLine.trimStart().length;
        if (nextIndent === 0 && nextTrimmed !== '') break;
        j++;
      }

      sections.push({
        start: i + 1,
        end: j,
        label: funcName,
        description: `${match?.[1] === 'class' ? 'Class' : 'Function'} ${funcName}`,
      });

      i = j - 1;
      currentStart = j;
    }
  }

  // If no sections found, create generic sections
  if (sections.length === 0) {
    const chunkSize = Math.max(3, Math.ceil(totalLines / 5));
    for (let i = 0; i < totalLines; i += chunkSize) {
      sections.push({
        start: i + 1,
        end: Math.min(i + chunkSize, totalLines),
        label: `section_${sections.length}`,
        description: `Code block ${sections.length + 1}`,
      });
    }
  }

  // Now create steps - subdivide large sections
  for (const section of sections) {
    const sectionLines = lines.slice(section.start - 1, section.end);
    const sectionLength = section.end - section.start + 1;

    if (sectionLength <= 6) {
      // Small section - make it one step
      steps.push(createStepFromLines(lines, section.start, section.end, algorithmName));
    } else {
      // Break into sub-steps
      const subSteps = breakIntoSubSteps(lines, section.start, section.end, algorithmName);
      steps.push(...subSteps);
    }
  }

  // Limit to 4-7 steps
  if (steps.length > 7) {
    return mergeSteps(steps, 6);
  }
  if (steps.length < 4 && totalLines > 8) {
    return splitSteps(steps, lines, algorithmName);
  }

  return steps;
}

function breakIntoSubSteps(allLines: string[], start: number, end: number, algorithmName: string): CodeStep[] {
  const steps: CodeStep[] = [];
  const lines = allLines.slice(start - 1, end);

  // Find logical breaks within the function
  let subStart = start;
  let lastBreak = start;

  for (let i = 0; i < lines.length; i++) {
    const lineNum = start + i;
    const trimmed = lines[i].trim();
    const indent = lines[i].length - lines[i].trimStart().length;

    // Break at: inner function defs, for/while loops, if statements, return statements
    const isBreakPoint = (
      (indent === 4 && (trimmed.startsWith('for ') || trimmed.startsWith('while ') || trimmed.startsWith('if '))) ||
      (indent === 4 && trimmed.startsWith('return ')) ||
      (trimmed.startsWith('def ') && indent > 0)
    );

    if (isBreakPoint && lineNum > lastBreak + 1) {
      // Create step for previous block
      if (lastBreak < lineNum) {
        steps.push(createStepFromLines(allLines, lastBreak, lineNum - 1, algorithmName));
      }
      lastBreak = lineNum;
    }
  }

  // Final block
  if (lastBreak <= end) {
    steps.push(createStepFromLines(allLines, lastBreak, end, algorithmName));
  }

  return steps;
}

function createStepFromLines(allLines: string[], start: number, end: number, algorithmName: string): CodeStep {
  const lineNums: number[] = [];
  const codeLines: string[] = [];

  for (let i = start; i <= end && i <= allLines.length; i++) {
    const trimmed = allLines[i - 1]?.trim();
    if (trimmed && trimmed !== '') {
      lineNums.push(i);
      codeLines.push(trimmed);
    }
  }

  // If no non-empty lines, include all
  if (lineNums.length === 0) {
    lineNums.push(start);
  }

  // Generate title and description based on content
  const firstLine = allLines[start - 1]?.trim() || '';
  let title = 'Code Block';
  let description = 'This section of the algorithm processes the data.';

  if (firstLine.startsWith('def ')) {
    const match = firstLine.match(/def\s+(\w+)\s*\(([^)]*)\)/);
    if (match) {
      title = `Define ${match[1]}`;
      const params = match[2] ? match[2].split(',').map(p => p.trim().split(':')[0].split('=')[0].trim()).filter(Boolean) : [];
      description = `Define the ${match[1]} function${params.length > 0 ? ` which takes ${params.join(', ')} as parameters` : ''}. This sets up the function signature and documents its interface.`;
    }
  } else if (firstLine.startsWith('class ')) {
    const match = firstLine.match(/class\s+(\w+)/);
    title = `Define ${match?.[1] || 'Class'}`;
    description = `Define the ${match?.[1] || ''} class with its constructor and initial properties.`;
  } else if (firstLine.startsWith('if ') || firstLine.startsWith('elif ')) {
    title = 'Conditional Check';
    const condition = firstLine.replace(/^(if|elif)\s+/, '').replace(/:$/, '');
    description = `Check the condition: ${condition}. This determines the path of execution based on the current state.`;
  } else if (firstLine.startsWith('for ')) {
    title = 'Iteration Loop';
    const match = firstLine.match(/for\s+(\w+)\s+in\s+(.+?):/);
    if (match) {
      description = `Iterate through ${match[2]} using variable '${match[1]}'. Each iteration processes one element.`;
    }
  } else if (firstLine.startsWith('while ')) {
    title = 'While Loop';
    const condition = firstLine.replace(/^while\s+/, '').replace(/:$/, '');
    description = `Continue looping while the condition ${condition} holds true.`;
  } else if (firstLine.startsWith('return ')) {
    title = 'Return Result';
    const returnVal = firstLine.replace(/^return\s+/, '');
    description = `Return the computed result: ${returnVal}. This is the final output of the function.`;
  } else if (firstLine.includes('=') && !firstLine.startsWith('==')) {
    const varName = firstLine.split('=')[0].trim();
    title = `Initialize ${varName}`;
    description = `Set up the variable '${varName}' which will be used in the algorithm's computation.`;
  }

  return { lines: lineNums.slice(0, 8), title, description };
}

function mergeSteps(steps: CodeStep[], targetCount: number): CodeStep[] {
  while (steps.length > targetCount && steps.length > 1) {
    // Find the smallest step and merge it with its neighbor
    let minSize = Infinity;
    let minIdx = 0;
    for (let i = 0; i < steps.length; i++) {
      if (steps[i].lines.length < minSize) {
        minSize = steps[i].lines.length;
        minIdx = i;
      }
    }

    // Merge with the next step (or previous if it's the last)
    const mergeWith = minIdx < steps.length - 1 ? minIdx + 1 : minIdx - 1;
    const [a, b] = minIdx < mergeWith ? [minIdx, mergeWith] : [mergeWith, minIdx];

    const merged: CodeStep = {
      lines: [...steps[a].lines, ...steps[b].lines].sort((x, y) => x - y).slice(0, 10),
      title: steps[a].title,
      description: steps[a].description + ' ' + steps[b].description,
    };

    steps.splice(a, 2, merged);
  }
  return steps;
}

function splitSteps(steps: CodeStep[], allLines: string[], algorithmName: string): CodeStep[] {
  // If we have too few steps, try to split the largest one
  const result = [...steps];
  while (result.length < 4) {
    let maxSize = 0;
    let maxIdx = 0;
    for (let i = 0; i < result.length; i++) {
      if (result[i].lines.length > maxSize) {
        maxSize = result[i].lines.length;
        maxIdx = i;
      }
    }

    if (maxSize <= 2) break;

    const step = result[maxIdx];
    const mid = Math.floor(step.lines.length / 2);
    const firstHalf: CodeStep = {
      lines: step.lines.slice(0, mid),
      title: step.title,
      description: step.description,
    };
    const secondHalf: CodeStep = {
      lines: step.lines.slice(mid),
      title: 'Continue Processing',
      description: 'Continue with the next part of this operation.',
    };

    result.splice(maxIdx, 1, firstHalf, secondHalf);
  }
  return result;
}

// ─── Main processing ───

const dataDir = path.join(__dirname, '..', 'src', 'data');
const files = [
  'algorithms-sorting.ts',
  'algorithms-searching.ts',
  'algorithms-graphs.ts',
  'algorithms-trees.ts',
  'algorithms-dp.ts',
  'algorithms-techniques.ts',
  'algorithms-structures.ts',
  'algorithms-misc.ts',
];

for (const fileName of files) {
  const filePath = path.join(dataDir, fileName);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Find all Python code examples that don't have steps
  // Pattern: language: "python",\n        code: `...`\n      }
  // We need to add steps after the code property

  const pythonBlockRegex = /(\{\s*\n\s*language:\s*['"]python['"],\s*\n\s*code:\s*`)([\s\S]*?)(`\s*\n\s*\})/g;

  let match;
  let modified = content;
  const replacements: { original: string; replacement: string }[] = [];

  while ((match = pythonBlockRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const prefix = match[1];
    const code = match[2];
    const suffix = match[3];

    // Check if this already has steps
    // Look ahead from the match position to see if there's already a 'steps:' property
    const afterMatch = content.substring(match.index + fullMatch.length, match.index + fullMatch.length + 50);
    if (fullMatch.includes('steps:') || afterMatch.trim().startsWith('steps:')) {
      continue;
    }

    // Generate steps for this Python code
    const steps = generatePythonSteps(code, 'algorithm');

    if (steps.length >= 3) {
      const stepsStr = JSON.stringify(steps, null, 10)
        .replace(/^/gm, '        ')
        .trim();

      // Replace the closing } with steps + closing }
      const newSuffix = suffix.replace('}', `,\n        steps: ${stepsStr}\n      }`);
      replacements.push({
        original: fullMatch,
        replacement: prefix + code + newSuffix,
      });
    }
  }

  // Apply replacements
  for (const { original, replacement } of replacements) {
    modified = modified.replace(original, replacement);
  }

  if (replacements.length > 0) {
    fs.writeFileSync(filePath, modified, 'utf-8');
    console.log(`${fileName}: Added steps to ${replacements.length} Python examples`);
  } else {
    console.log(`${fileName}: No Python examples needed steps`);
  }
}

console.log('Done!');
