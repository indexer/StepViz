import { renderHook, waitFor } from '@testing-library/react';
import { useAlgorithms, useAlgorithmSearch, useCategories } from './useAlgorithms';
import type { AlgorithmFilters } from '../types/algorithm';

describe('useAlgorithms', () => {
  const emptyFilters: AlgorithmFilters = {
    categories: [],
    difficulties: [],
    search: '',
  };

  it('filters and paginates algorithm summaries', async () => {
    const { result, rerender } = renderHook(
      ({ filters, page, pageSize }) => useAlgorithms(filters, page, pageSize),
      {
        initialProps: {
          filters: emptyFilters,
          page: 1,
          pageSize: 5,
        },
      },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.data).toHaveLength(5);
    expect(result.current.data?.totalPages).toBeGreaterThan(1);

    const pageOneIds = result.current.data?.data.map((algorithm) => algorithm.id);

    rerender({
      filters: emptyFilters,
      page: 2,
      pageSize: 5,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const pageTwoIds = result.current.data?.data.map((algorithm) => algorithm.id);

    expect(pageTwoIds).toHaveLength(5);
    expect(pageTwoIds).not.toEqual(pageOneIds);
  });

  it('applies category, difficulty, and text filters together', async () => {
    const filters: AlgorithmFilters = {
      categories: ['Sorting'],
      difficulties: ['Medium'],
      search: 'quick',
    };

    const { result } = renderHook(() => useAlgorithms(filters, 1, 20));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.total).toBe(1);
    expect(result.current.data?.data[0]).toMatchObject({
      id: 'SRT_001',
      name: 'Quick Sort',
      category: 'Sorting',
      difficulty: 'Medium',
    });
  });
});

describe('summary data hooks', () => {
  it('returns category metadata', async () => {
    const { result } = renderHook(() => useCategories());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.categories).toContain('Sorting');
    expect(result.current.data?.counts.Sorting).toBeGreaterThan(0);
  });

  it('searches summaries and caps the result set', async () => {
    const { result } = renderHook(() => useAlgorithmSearch('tree'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data.length).toBeGreaterThan(0);
    expect(result.current.data.length).toBeLessThanOrEqual(10);
  });
});
