import type { Algorithm, CodeExample } from '../types/algorithm';

const KOTLIN_NOTE = [
  '// Kotlin adaptation generated from the TypeScript example in this catalog.',
  '// Review collection mutability and edge-case handling before production use.',
].join('\n');

export function withGeneratedKotlinExamples(items: Algorithm[]): Algorithm[] {
  return items.map((algorithm) => {
    if (algorithm.codeExamples.some((example) => example.language === 'kotlin')) {
      return algorithm;
    }

    const typescriptExample = algorithm.codeExamples.find(
      (example) => example.language === 'typescript',
    );

    if (!typescriptExample) {
      return algorithm;
    }

    const kotlinCode = `${KOTLIN_NOTE}\n\n${convertTypeScriptToKotlin(typescriptExample.code)}`;
    // The Kotlin note adds lines at the top, so shift step line numbers accordingly
    const noteLineOffset = KOTLIN_NOTE.split('\n').length + 1; // +1 for the blank line separator
    const kotlinSteps = typescriptExample.steps?.map((step) => ({
      ...step,
      lines: step.lines.map((l) => l + noteLineOffset),
    }));
    const kotlinExample: CodeExample = {
      language: 'kotlin',
      code: kotlinCode,
      ...(kotlinSteps ? { steps: kotlinSteps } : {}),
    };

    const pythonIndex = algorithm.codeExamples.findIndex(
      (example) => example.language === 'python',
    );

    const codeExamples = [...algorithm.codeExamples];
    if (pythonIndex >= 0) {
      codeExamples.splice(pythonIndex, 0, kotlinExample);
    } else {
      codeExamples.push(kotlinExample);
    }

    return {
      ...algorithm,
      codeExamples,
    };
  });
}

function convertTypeScriptToKotlin(code: string): string {
  let converted = code.replace(/\r\n/g, '\n').trim();

  converted = convertInterfaces(converted);
  converted = convertFunctionDeclarations(converted);
  converted = convertMethodDeclarations(converted);
  converted = convertArrowFunctions(converted);

  converted = converted
    .split('\n')
    .map((line) => convertLine(line))
    .join('\n');

  return converted.trim();
}

function convertInterfaces(code: string): string {
  return code.replace(/interface\s+(\w+)\s*\{([\s\S]*?)\n\}/g, (_, name: string, body: string) => {
    const rawLines = body
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const properties = rawLines.map((line) => {
      const match = line.match(/^(\w+)\??:\s*([^;]+);?$/);
      if (!match) {
        return `  ${line}`;
      }

      const [, propName, propType] = match;
      return `  val ${propName}: ${convertType(propType)}`;
    });

    return `data class ${name}(\n${properties.join(',\n')}\n)`;
  });
}

function convertFunctionDeclarations(code: string): string {
  return code.replace(
    /function\s+(\w+)\s*\(([\s\S]*?)\)\s*:\s*([^{\n]+)\s*\{/g,
    (_, name: string, params: string, returnType: string) =>
      `fun ${name}(${convertParameters(params)}): ${convertType(returnType)} {`,
  );
}

function convertMethodDeclarations(code: string): string {
  return code.replace(
    /^(\s*)(?!if\b|for\b|while\b|switch\b|catch\b|return\b|constructor\b)([A-Za-z_]\w*)\s*\(([^)]*)\)\s*:\s*([^{\n]+)\s*\{/gm,
    (_, indent: string, name: string, params: string, returnType: string) =>
      `${indent}fun ${name}(${convertParameters(params)}): ${convertType(returnType)} {`,
  );
}

function convertArrowFunctions(code: string): string {
  let converted = code.replace(
    /\b(?:const|let)\s+(\w+)\s*=\s*\(([\s\S]*?)\)\s*:\s*([^{=\n]+)\s*=>\s*\{/g,
    (_, name: string, params: string, returnType: string) =>
      `fun ${name}(${convertParameters(params)}): ${convertType(returnType)} {`,
  );

  converted = converted.replace(
    /\b(?:const|let)\s+(\w+)\s*=\s*\(([\s\S]*?)\)\s*=>\s*\{/g,
    (_, name: string, params: string) => `fun ${name}(${convertParameters(params)}) {`,
  );

  return converted;
}

function convertLine(line: string): string {
  let converted = line;

  converted = convertTypedEmptyListDeclaration(converted);
  converted = convertTypedAssignmentDeclaration(converted);
  converted = convertClassPropertyDeclaration(converted);
  converted = convertForLoop(converted);
  converted = convertCommonExpressions(converted);

  return converted;
}

function convertTypedEmptyListDeclaration(line: string): string {
  const match = line.match(/^(\s*)(const|let)\s+(\w+)\s*:\s*([^=]+)\s*=\s*\[\];?\s*$/);
  if (!match) {
    return line;
  }

  const [, indent, keyword, name, rawType] = match;
  const elementType = getArrayElementType(rawType.trim());
  const kotlinKeyword = keyword === 'const' ? 'val' : 'var';

  if (!elementType) {
    return `${indent}${kotlinKeyword} ${name} = mutableListOf()`;
  }

  return `${indent}${kotlinKeyword} ${name} = mutableListOf<${convertType(elementType)}>()`;
}

function convertTypedAssignmentDeclaration(line: string): string {
  const match = line.match(/^(\s*)(const|let)\s+(\w+)\s*:\s*([^=]+?)\s*=\s*(.+);?\s*$/);
  if (!match) {
    return line;
  }

  const [, indent, keyword, name, , value] = match;
  const kotlinKeyword = keyword === 'const' ? 'val' : 'var';
  return `${indent}${kotlinKeyword} ${name} = ${value}`;
}

function convertClassPropertyDeclaration(line: string): string {
  let match = line.match(/^(\s*)(\w+)\??:\s*([^=;]+)\s*=\s*(.+);?\s*$/);
  if (match) {
    const [, indent, name, rawType, rawValue] = match;
    return `${indent}var ${name}: ${convertType(rawType)} = ${convertExpression(rawValue)}`;
  }

  match = line.match(/^(\s*)(\w+)\??:\s*([^;]+);?\s*$/);
  if (!match) {
    return line;
  }

  const [, indent, name, rawType] = match;
  const { type, value } = defaultValueForType(convertType(rawType));
  return `${indent}var ${name}: ${type} = ${value}`;
}

function convertForLoop(line: string): string {
  let match = line.match(/^(\s*)for\s*\(const\s+\[([^\]]+)\]\s+of\s+(.+)\)\s*\{\s*$/);
  if (match) {
    const [, indent, names, source] = match;
    return `${indent}for ((${names.trim()}) in ${convertExpression(source)}) {`;
  }

  match = line.match(/^(\s*)for\s*\(const\s+(\w+)\s+of\s+(.+)\)\s*\{\s*$/);
  if (match) {
    const [, indent, name, source] = match;
    return `${indent}for (${name} in ${convertExpression(source)}) {`;
  }

  match = line.match(/^(\s*)for\s*\(let\s+(\w+)\s*=\s*(.+);\s*\2\s*<\s*(.+);\s*\2\+\+\)\s*\{\s*$/);
  if (match) {
    const [, indent, name, start, end] = match;
    return `${indent}for (${name} in ${convertExpression(start)} until ${convertExpression(end)}) {`;
  }

  match = line.match(/^(\s*)for\s*\(let\s+(\w+)\s*=\s*(.+);\s*\2\s*<=\s*(.+);\s*\2\+\+\)\s*\{\s*$/);
  if (match) {
    const [, indent, name, start, end] = match;
    return `${indent}for (${name} in ${convertExpression(start)}..${convertExpression(end)}) {`;
  }

  match = line.match(/^(\s*)for\s*\(let\s+(\w+)\s*=\s*(.+);\s*\2\s*>=\s*(.+);\s*\2--\)\s*\{\s*$/);
  if (match) {
    const [, indent, name, start, end] = match;
    return `${indent}for (${name} in ${convertExpression(start)} downTo ${convertExpression(end)}) {`;
  }

  return line;
}

function convertCommonExpressions(line: string): string {
  let converted = line;

  converted = converted.replace(/\bconst\b/g, 'val');
  converted = converted.replace(/\blet\b/g, 'var');
  converted = converted.replace(/\bnew Set<([^>]+)>\(\)/g, (_, inner: string) => `mutableSetOf<${convertType(inner)}>()`);
  converted = converted.replace(/\bnew Set\(([^)]+)\)/g, (_, source: string) => `${convertExpression(source)}.toMutableSet()`);
  converted = converted.replace(/\bnew Map<([^>]+)>\(\)/g, (_, inner: string) => {
    const [keyType, valueType] = splitTopLevelCsv(inner);
    return `mutableMapOf<${convertType(keyType ?? 'Any')}, ${convertType(valueType ?? 'Any')}>()`;
  });
  converted = converted.replace(/\bnew Map\(\)/g, 'mutableMapOf()');
  converted = converted.replace(/new Array\(([^)]+)\)\.fill\(([^)]+)\)\.map\(\(\)\s*=>\s*Array\(([^)]+)\)\.fill\(([^)]+)\)\)/g, (_, sizeA: string, _fillA: string, sizeB: string, fillB: string) => `MutableList(${convertExpression(sizeA)}) { MutableList(${convertExpression(sizeB)}) { ${convertExpression(fillB)} } }`);
  converted = converted.replace(/Array\(([^)]+)\)\.fill\(([^)]+)\)\.map\(\((?:_,\s*)?(\w+)\)\s*=>\s*\2\)/g, (_, size: string) => `MutableList(${convertExpression(size)}) { it }`);
  converted = converted.replace(/(?:new\s+)?Array\(([^)]+)\)\.fill\(([^)]+)\)/g, (_, size: string, fill: string) => `MutableList(${convertExpression(size)}) { ${convertExpression(fill)} }`);
  converted = converted.replace(/Math\.floor\(\(([^)]+)\)\s*\/\s*2\)/g, '($1) / 2');
  converted = converted.replace(/Math\.floor\(([^)]+)\)/g, '$1.toInt()');
  converted = converted.replace(/Math\.max\(/g, 'maxOf(');
  converted = converted.replace(/Math\.min\(/g, 'minOf(');
  converted = converted.replace(/-Infinity/g, 'Int.MIN_VALUE');
  converted = converted.replace(/\bInfinity\b/g, 'Int.MAX_VALUE');
  converted = converted.replace(/===/g, '==');
  converted = converted.replace(/!==/g, '!=');
  converted = converted.replace(/\.length\b/g, '.size');
  converted = converted.replace(/\.push\(/g, '.add(');
  converted = converted.replace(/(\w+)\.pop\(\)/g, '$1.removeAt($1.lastIndex)');
  converted = converted.replace(/(\w+)\.shift\(\)/g, '$1.removeAt(0)');
  converted = converted.replace(/\[\s*\.\.\.([^,\]]+),\s*\.\.\.([^,\]]+),\s*\.\.\.([^\]]+)\]/g, '$1 + $2 + $3');
  converted = converted.replace(/\[\s*\.\.\.([^,\]]+),\s*\.\.\.([^\]]+)\]/g, '$1 + $2');
  converted = converted.replace(/\[\.\.\.([^\]]+)\]/g, '$1.toList()');
  converted = converted.replace(
    /\[([^,\]]+),\s*([^,\]]+)\]\s*=\s*\[([^,\]]+),\s*([^,\]]+)\]/g,
    'run { val temp = $1; $1 = $3; $2 = $4; }',
  );
  converted = converted.replace(/(\S+)!([.[);,])/g, '$1$2');
  converted = converted.replace(/;+\s*$/g, '');

  return convertExpression(converted);
}

function convertExpression(value: string): string {
  return value
    .replace(/\bnumber\b/g, 'Int')
    .replace(/\bstring\b/g, 'String')
    .replace(/\bboolean\b/g, 'Boolean');
}

function convertParameters(params: string): string {
  return splitTopLevelCsv(params)
    .map((param) => convertParameter(param))
    .filter(Boolean)
    .join(', ');
}

function convertParameter(param: string): string {
  const trimmed = param.trim();
  if (!trimmed) {
    return '';
  }

  let match = trimmed.match(/^(\w+)\??\s*:\s*([^=]+?)(?:\s*=\s*(.+))?$/);
  if (match) {
    const [, name, rawType, rawDefault] = match;
    const defaultValue = rawDefault ? ` = ${convertExpression(rawDefault.trim())}` : '';
    return `${name}: ${convertType(rawType)}${defaultValue}`;
  }

  match = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
  if (match) {
    const [, name, rawDefault] = match;
    const defaultValue = convertExpression(rawDefault.trim());
    return `${name}: ${inferTypeFromDefault(defaultValue)} = ${defaultValue}`;
  }

  return trimmed;
}

function convertType(rawType: string): string {
  let type = rawType.trim().replace(/;$/, '');

  if (type.includes('|')) {
    const parts = type.split('|').map((part) => part.trim()).filter(Boolean);
    const nonNullable = parts.filter((part) => part !== 'null' && part !== 'undefined');
    if (nonNullable.length === 1 && nonNullable.length !== parts.length) {
      return `${convertType(nonNullable[0])}?`;
    }
  }

  if (type.startsWith('Map<') && type.endsWith('>')) {
    const inner = type.slice(4, -1);
    const [keyType, valueType] = splitTopLevelCsv(inner);
    return `MutableMap<${convertType(keyType ?? 'Any')}, ${convertType(valueType ?? 'Any')}>`;
  }

  if (type.startsWith('Set<') && type.endsWith('>')) {
    const inner = type.slice(4, -1);
    return `MutableSet<${convertType(inner)}>`;
  }

  if (type.startsWith('Array<') && type.endsWith('>')) {
    const inner = type.slice(6, -1);
    return `MutableList<${convertType(inner)}>`;
  }

  while (type.endsWith('[]')) {
    type = `MutableList<${convertType(type.slice(0, -2))}>`;
  }

  return type
    .replace(/\bnumber\b/g, 'Int')
    .replace(/\bstring\b/g, 'String')
    .replace(/\bboolean\b/g, 'Boolean')
    .replace(/\bvoid\b/g, 'Unit');
}

function defaultValueForType(type: string): { type: string; value: string } {
  if (type.endsWith('?')) {
    return { type, value: 'null' };
  }

  if (type === 'Int') {
    return { type, value: '0' };
  }

  if (type === 'String') {
    return { type, value: '""' };
  }

  if (type === 'Boolean') {
    return { type, value: 'false' };
  }

  if (type.startsWith('MutableList<')) {
    return { type, value: 'mutableListOf()' };
  }

  if (type.startsWith('MutableMap<')) {
    return { type, value: 'mutableMapOf()' };
  }

  if (type.startsWith('MutableSet<')) {
    return { type, value: 'mutableSetOf()' };
  }

  return { type: `${type}?`, value: 'null' };
}

function getArrayElementType(type: string): string | null {
  return type.endsWith('[]') ? type.slice(0, -2).trim() : null;
}

function inferTypeFromDefault(value: string): string {
  if (/^(true|false)$/.test(value)) {
    return 'Boolean';
  }

  if (/^['"`]/.test(value)) {
    return 'String';
  }

  return 'Int';
}

function splitTopLevelCsv(input: string): string[] {
  const parts: string[] = [];
  let current = '';
  let angleDepth = 0;
  let parenDepth = 0;
  let bracketDepth = 0;
  let braceDepth = 0;

  for (const char of input) {
    if (char === '<') angleDepth += 1;
    if (char === '>') angleDepth = Math.max(0, angleDepth - 1);
    if (char === '(') parenDepth += 1;
    if (char === ')') parenDepth = Math.max(0, parenDepth - 1);
    if (char === '[') bracketDepth += 1;
    if (char === ']') bracketDepth = Math.max(0, bracketDepth - 1);
    if (char === '{') braceDepth += 1;
    if (char === '}') braceDepth = Math.max(0, braceDepth - 1);

    if (
      char === ',' &&
      angleDepth === 0 &&
      parenDepth === 0 &&
      bracketDepth === 0 &&
      braceDepth === 0
    ) {
      parts.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  if (current.trim()) {
    parts.push(current.trim());
  }

  return parts;
}
