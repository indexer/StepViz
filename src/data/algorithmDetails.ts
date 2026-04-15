import type { Algorithm } from '../types/algorithm';
import { withGeneratedKotlinExamples } from './kotlinExamples';

type AlgorithmArrayModule = {
  [key: string]: Algorithm[] | undefined;
};

const detailModuleLoaders: Record<string, () => Promise<AlgorithmArrayModule>> = {
  SRT: () => import('./algorithms-sorting'),
  SEA: () => import('./algorithms-searching'),
  GRA: () => import('./algorithms-graphs'),
  TRE: () => import('./algorithms-trees'),
  DP: () => import('./algorithms-dp'),
  GRE: () => import('./algorithms-techniques'),
  BAC: () => import('./algorithms-techniques'),
  TWO: () => import('./algorithms-techniques'),
  SLI: () => import('./algorithms-techniques'),
  LIN: () => import('./algorithms-structures'),
  STK: () => import('./algorithms-structures'),
  HEA: () => import('./algorithms-structures'),
  HAS: () => import('./algorithms-structures'),
  BIT: () => import('./algorithms-structures'),
  MAT: () => import('./algorithms-misc'),
  STR: () => import('./algorithms-misc'),
  UNI: () => import('./algorithms-misc'),
  TRI: () => import('./algorithms-misc'),
  DAC: () => import('./algorithms-misc'),
};

const detailArrayExportNamesByPrefix: Record<string, string> = {
  SRT: 'sortingAlgorithms',
  SEA: 'searchingAlgorithms',
  GRA: 'graphAlgorithms',
  TRE: 'treeAlgorithms',
  DP: 'dpAlgorithms',
  GRE: 'techniqueAlgorithms',
  BAC: 'techniqueAlgorithms',
  TWO: 'techniqueAlgorithms',
  SLI: 'techniqueAlgorithms',
  LIN: 'structureAlgorithms',
  STK: 'structureAlgorithms',
  HEA: 'structureAlgorithms',
  HAS: 'structureAlgorithms',
  BIT: 'structureAlgorithms',
  MAT: 'miscAlgorithms',
  STR: 'miscAlgorithms',
  UNI: 'miscAlgorithms',
  TRI: 'miscAlgorithms',
  DAC: 'miscAlgorithms',
};

const detailCache = new Map<string, Promise<Algorithm | undefined>>();
const detailModuleCache = new Map<string, Promise<AlgorithmArrayModule>>();

function getIdPrefix(id: string) {
  return id.split('_')[0] ?? '';
}

function loadDetailModule(prefix: string) {
  const cached = detailModuleCache.get(prefix);
  if (cached) {
    return cached;
  }

  const loadModule = detailModuleLoaders[prefix];
  if (!loadModule) {
    return Promise.resolve(undefined);
  }

  const promise = loadModule();
  detailModuleCache.set(prefix, promise);
  return promise;
}

export function preloadAlgorithmDetail(id: string) {
  const prefix = getIdPrefix(id);
  if (!prefix) {
    return;
  }

  void loadDetailModule(prefix);
}

export function loadAlgorithmDetail(id: string): Promise<Algorithm | undefined> {
  if (!id) {
    return Promise.resolve(undefined);
  }

  const cached = detailCache.get(id);
  if (cached) {
    return cached;
  }

  const prefix = getIdPrefix(id);
  const exportName = detailArrayExportNamesByPrefix[prefix];

  if (!exportName) {
    return Promise.resolve(undefined);
  }

  const promise = loadDetailModule(prefix).then((module) => {
    if (!module) {
      return undefined;
    }

    const algorithms = module[exportName];
    if (!algorithms) {
      return undefined;
    }

    const algorithm = algorithms.find((entry) => entry.id === id);
    if (!algorithm) {
      return undefined;
    }

    return withGeneratedKotlinExamples([algorithm])[0];
  });

  detailCache.set(id, promise);
  return promise;
}
