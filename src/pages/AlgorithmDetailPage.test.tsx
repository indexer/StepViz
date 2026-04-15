import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { Algorithm } from '../types/algorithm';

const { mockUseAlgorithm } = vi.hoisted(() => ({
  mockUseAlgorithm: vi.fn(),
}));

vi.mock('../hooks/useAlgorithms', () => ({
  useAlgorithm: mockUseAlgorithm,
}));

vi.mock('../components/algorithm/StepByStepVisualizer', () => ({
  StepByStepVisualizer: ({
    algorithmName,
    codeExample,
  }: {
    algorithmName: string;
    codeExample: { language: string };
  }) => <div data-testid="visualizer">{`${algorithmName}:${codeExample.language}`}</div>,
}));

vi.mock('../components/algorithm/CodeHighlighter', () => ({
  CodeHighlighter: ({
    language,
    code,
  }: {
    language: string;
    code: string;
  }) => <div data-testid="code-highlighter">{`${language}:${code}`}</div>,
}));

import { AlgorithmDetailPage } from './AlgorithmDetailPage';

const algorithmFixture: Algorithm = {
  id: 'SRT_001',
  name: 'Quick Sort',
  category: 'Sorting',
  difficulty: 'Medium',
  timeComplexity: 'O(n log n)',
  spaceComplexity: 'O(log n)',
  description: 'Sorts an array using partitioning.',
  longDescription: 'Quick Sort is a divide-and-conquer sorting algorithm.',
  icon: 'reorder',
  complexityScore: 0.65,
  tags: ['sorting', 'divide-and-conquer'],
  leetcodeProblems: ['Sort an Array'],
  codeExamples: [
    {
      language: 'typescript',
      code: 'function quickSortTs() {}',
    },
    {
      language: 'python',
      code: 'def quick_sort_py(): pass',
      steps: [
        {
          lines: [1],
          title: 'Start',
          description: 'Begin the walkthrough.',
        },
      ],
    },
    {
      language: 'kotlin',
      code: 'fun quickSortKt() {}',
    },
  ],
  keyInsights: ['Partition around a pivot.'],
  whenToUse: ['When average-case performance matters.'],
};

function renderPage(initialEntry = '/algorithm/SRT_001') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/algorithm/:id" element={<AlgorithmDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('AlgorithmDetailPage', () => {
  beforeEach(() => {
    mockUseAlgorithm.mockReturnValue({
      data: algorithmFixture,
      isLoading: false,
    });
  });

  afterEach(() => {
    mockUseAlgorithm.mockReset();
  });

  it('switches implementation tabs', async () => {
    renderPage();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Kotlin' }));

    await waitFor(() =>
      expect(screen.getByTestId('code-highlighter')).toHaveTextContent('kotlin:fun quickSortKt() {}'),
    );
  });

  it('opens the visualizer and falls back to the first stepped language', async () => {
    renderPage();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /step through/i }));

    await waitFor(() =>
      expect(screen.getByTestId('visualizer')).toHaveTextContent('Quick Sort:python'),
    );
  });

  it('auto-opens the visualizer from the query string', async () => {
    renderPage('/algorithm/SRT_001?visualize=true');

    await waitFor(() =>
      expect(screen.getByTestId('visualizer')).toHaveTextContent('Quick Sort:python'),
    );
  });
});
