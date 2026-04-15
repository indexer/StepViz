import { loadAlgorithmDetail, preloadAlgorithmDetail } from './algorithmDetails';

describe('algorithm detail loading', () => {
  it('loads a single algorithm detail with generated kotlin examples', async () => {
    const algorithm = await loadAlgorithmDetail('SRT_001');

    expect(algorithm).toBeDefined();
    expect(algorithm?.id).toBe('SRT_001');
    expect(algorithm?.longDescription).toContain('Quick Sort');
    expect(algorithm?.codeExamples.map((example) => example.language)).toEqual([
      'typescript',
      'kotlin',
      'python',
    ]);
  });

  it('preloads category data without changing behavior and returns undefined for unknown ids', async () => {
    expect(() => preloadAlgorithmDetail('SRT_002')).not.toThrow();
    await expect(loadAlgorithmDetail('UNKNOWN_001')).resolves.toBeUndefined();
  });
});
