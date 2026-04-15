import type { AlgorithmSummary } from '../../types/algorithm';
import { AlgorithmCard } from './AlgorithmCard';

export function AlgorithmGrid({ algorithms }: { algorithms: AlgorithmSummary[] }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {algorithms.map((algorithm) => (
        <AlgorithmCard key={algorithm.id} algorithm={algorithm} />
      ))}
    </div>
  );
}
