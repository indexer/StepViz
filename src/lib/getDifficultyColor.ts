import type { Difficulty } from '../types/algorithm';

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Beginner: 'text-primary-container',
  Medium: 'text-tertiary',
  Advanced: 'text-error',
};

export function getDifficultyColor(difficulty: string): string {
  return (DIFFICULTY_COLORS as Record<string, string>)[difficulty] ?? 'text-on-surface-variant';
}

const DIFFICULTY_BG_COLORS: Record<Difficulty, string> = {
  Beginner: 'bg-tertiary/20 text-tertiary border-tertiary/30',
  Medium: 'bg-primary/20 text-primary border-primary/30',
  Advanced: 'bg-error/20 text-error border-error/30',
};

export function getDifficultyBgColor(difficulty: string): string {
  return (DIFFICULTY_BG_COLORS as Record<string, string>)[difficulty] ?? 'bg-surface-high text-on-surface border-outline-variant';
}
