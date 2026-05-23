import { useEffect, useMemo, useState } from 'react';
import { loadAlgorithmDetail } from '../data/algorithmDetails';
import type { Algorithm, AlgorithmFilters, AlgorithmSummary, Category } from '../types/algorithm';

interface UseAlgorithmsResult {
  data: AlgorithmSummary[];
  total: number;
  totalPages: number;
}

interface CategoriesResult {
  categories: Category[];
  counts: Record<string, number>;
}

type AlgorithmSummariesModule = typeof import('../data/algorithmSummaries');

let algorithmSummariesModulePromise: Promise<AlgorithmSummariesModule> | null = null;
let algorithmSummariesModuleCache: AlgorithmSummariesModule | null = null;

function loadAlgorithmSummariesModule() {
  if (algorithmSummariesModuleCache) {
    return Promise.resolve(algorithmSummariesModuleCache);
  }

  if (!algorithmSummariesModulePromise) {
    algorithmSummariesModulePromise = import('../data/algorithmSummaries').then((module) => {
      algorithmSummariesModuleCache = module;
      return module;
    });
  }

  return algorithmSummariesModulePromise;
}

function useAlgorithmSummariesModule() {
  const [module, setModule] = useState<AlgorithmSummariesModule | null>(algorithmSummariesModuleCache);

  useEffect(() => {
    let cancelled = false;

    loadAlgorithmSummariesModule().then((loadedModule) => {
      if (!cancelled) {
        setModule(loadedModule);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    module,
    isLoading: module === null,
  };
}

/**
 * Hook to fetch and filter algorithms with pagination
 */
export function useAlgorithms(filters: AlgorithmFilters, page: number, pageSize: number) {
  const { module, isLoading } = useAlgorithmSummariesModule();

  const data = useMemo<UseAlgorithmsResult | undefined>(() => {
    if (!module) {
      return undefined;
    }

    const searchLower = filters.search ? filters.search.toLowerCase() : null;
    const hasCategories = filters.categories.length > 0;
    const hasDifficulties = filters.difficulties.length > 0;

    const filtered = module.algorithmSummaries.filter((algo) => {
      if (hasCategories && !filters.categories.includes(algo.category)) return false;
      if (hasDifficulties && !filters.difficulties.includes(algo.difficulty)) return false;
      if (searchLower) {
        if (algo.name.toLowerCase().includes(searchLower)) return true;
        if (algo.description.toLowerCase().includes(searchLower)) return true;
        if (algo.tags.some((tag) => tag.toLowerCase().includes(searchLower))) return true;
        return false;
      }
      return true;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
      data: filtered.slice(startIndex, endIndex),
      total,
      totalPages,
    };
  }, [filters, module, page, pageSize]);

  return { data, isLoading };
}

/**
 * Hook to fetch a single algorithm by ID
 */
export function useAlgorithm(id: string) {
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [data, setData] = useState<Algorithm | undefined>();

  useEffect(() => {
    let cancelled = false;

    if (!id) {
      return () => {
        cancelled = true;
      };
    }

    loadAlgorithmDetail(id).then((algorithm) => {
      if (!cancelled) {
        setLoadedId(id);
        setData(algorithm);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return {
    data: loadedId === id ? data : undefined,
    isLoading: Boolean(id) && loadedId !== id,
  };
}

/**
 * Hook to fetch all categories with their counts
 */
export function useCategories() {
  const { module, isLoading } = useAlgorithmSummariesModule();

  const data = useMemo<CategoriesResult | undefined>(() => {
    if (!module) {
      return undefined;
    }

    return {
      categories: module.getAllCategories(),
      counts: module.getCategoryCounts(),
    };
  }, [module]);

  return { data, isLoading };
}

/**
 * Hook to search algorithms by query
 */
export function useAlgorithmSearch(query: string) {
  const { module, isLoading } = useAlgorithmSummariesModule();

  const data = useMemo<AlgorithmSummary[]>(() => {
    if (!module || query.length < 2) {
      return [];
    }

    const searchLower = query.toLowerCase();
    const result: AlgorithmSummary[] = [];
    for (const algo of module.algorithmSummaries) {
      if (
        algo.name.toLowerCase().includes(searchLower) ||
        algo.description.toLowerCase().includes(searchLower) ||
        algo.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        algo.category.toLowerCase().includes(searchLower)
      ) {
        result.push(algo);
        if (result.length >= 10) break;
      }
    }
    return result;
  }, [module, query]);

  return {
    data,
    isLoading: isLoading && query.length >= 2,
  };
}
