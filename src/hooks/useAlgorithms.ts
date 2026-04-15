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

    let filtered = module.algorithmSummaries;

    if (filters.categories.length > 0) {
      filtered = filtered.filter((algo) => filters.categories.includes(algo.category));
    }

    if (filters.difficulties.length > 0) {
      filtered = filtered.filter((algo) => filters.difficulties.includes(algo.difficulty));
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((algo) => {
        const nameMatch = algo.name.toLowerCase().includes(searchLower);
        const descriptionMatch = algo.description.toLowerCase().includes(searchLower);
        const tagsMatch = algo.tags.some((tag) => tag.toLowerCase().includes(searchLower));
        return nameMatch || descriptionMatch || tagsMatch;
      });
    }

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
    return module.algorithmSummaries.filter((algo) => {
      const nameMatch = algo.name.toLowerCase().includes(searchLower);
      const descriptionMatch = algo.description.toLowerCase().includes(searchLower);
      const tagsMatch = algo.tags.some((tag) => tag.toLowerCase().includes(searchLower));
      const categoryMatch = algo.category.toLowerCase().includes(searchLower);
      return nameMatch || descriptionMatch || tagsMatch || categoryMatch;
    }).slice(0, 10);
  }, [module, query]);

  return {
    data,
    isLoading: isLoading && query.length >= 2,
  };
}
