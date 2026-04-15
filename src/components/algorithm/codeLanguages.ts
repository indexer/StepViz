export const LANGUAGE_MAP: Record<string, string> = {
  typescript: 'typescript',
  python: 'python',
  java: 'java',
  kotlin: 'kotlin',
  cpp: 'cpp',
  c: 'c',
};

const LANGUAGE_LABELS: Record<string, string> = {
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  kotlin: 'Kotlin',
  cpp: 'C++',
  c: 'C',
};

export function getLanguageLabel(lang: string): string {
  return LANGUAGE_LABELS[lang] ?? lang;
}
