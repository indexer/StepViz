import type { AlgorithmSummary } from '../../types/algorithm';
import { AlgorithmListItem } from './AlgorithmListItem';

export function AlgorithmList({ algorithms }: { algorithms: AlgorithmSummary[] }) {
  return (
    <div className="space-y-4">
      {algorithms.map((algorithm) => (
        <AlgorithmListItem key={algorithm.id} algorithm={algorithm} />
      ))}
    </div>
  );
}
