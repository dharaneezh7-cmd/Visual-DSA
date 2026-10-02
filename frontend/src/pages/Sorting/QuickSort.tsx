import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { TopicLayout } from '../../components/Layout/TopicLayout';
import { VisualizationPanel } from '../../components/Visualization/VisualizationComponents';
import SortingPlayground from '../../components/Visualization/SortingPlayground';
import { quickSort } from '../../components/Visualization/sortingAlgorithms';

export default function QuickSort() {
  const { isAuthenticated } = useAuth();
  const { recordActivity, saveProgress } = useProgress();
  return (
    <TopicLayout
      theory={
        <>
          <div className="topic-info-header">
            <h1>Quick Sort</h1>
            <p className="topic-tagline">Partition exchange: select a pivot, partition around it, and recurse on both sides.</p>
          </div>

          <div className="op-info active">
            <h3>
              Algorithm
              <span className="complexity-badge">O(n log n)</span>
            </h3>
            <p>Picks a pivot element and partitions the array so smaller elements go left and larger go right, then sorts partitions recursively. Cache-friendly in-place sorting that performs exceptionally fast in practice.</p>
          </div>

          <div className="complexity-summary">
            <h4>Time Complexity</h4>
            <div className="complexity-grid">
              <div className="complexity-item"><span className="label">Best</span><span className="value">O(n log n)</span></div>
              <div className="complexity-item"><span className="label">Average</span><span className="value">O(n log n)</span></div>
              <div className="complexity-item"><span className="label">Worst</span><span className="value">O(n²)</span></div>
              <div className="complexity-item"><span className="label">Space</span><span className="value">O(log n)</span></div>
            </div>
          </div>
        </>
      }
      visualization={
        <VisualizationPanel title="Quick Sort Visualizer">
          <SortingPlayground
            algorithm={quickSort}
            algorithmName="Quick Sort"
            pseudocode={`function quickSort(arr, low, high):
  if low < high:
    pivotIndex = partition(arr, low, high)
    quickSort(arr, low, pivotIndex - 1)
    quickSort(arr, pivotIndex + 1, high)

function partition(arr, low, high):
  pivot = arr[high]
  i = low - 1
  for j from low to high - 1:
    if arr[j] < pivot:
      i = i + 1
      swap(arr[i], arr[j])
  swap(arr[i + 1], arr[high])
  return i + 1`}
            onComplete={() => {
              if (isAuthenticated) recordActivity('Sorting', 'Visualization', 'QuickSort', 'Complete', 0);
              saveProgress('Sorting', 'Quick Sort', {
                completed: true,
                completionPercentage: 100,
                timeSpent: 60,
                operationsPerformed: 1,
              });
            }}
          />
        </VisualizationPanel>
      }
    />
  );
}
