import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { TopicLayout } from '../../components/Layout/TopicLayout';
import { VisualizationPanel } from '../../components/Visualization/VisualizationComponents';
import SortingPlayground from '../../components/Visualization/SortingPlayground';
import { mergeSort } from '../../components/Visualization/sortingAlgorithms';

export default function MergeSort() {
  const { isAuthenticated } = useAuth();
  const { recordActivity, saveProgress } = useProgress();
  return (
    <TopicLayout
      theory={
        <>
          <div className="topic-info-header">
            <h1>Merge Sort</h1>
            <p className="topic-tagline">Divide and conquer: recursively split the array into halves, sort them, and merge.</p>
          </div>

          <div className="op-info active">
            <h3>
              Algorithm
              <span className="complexity-badge">O(n log n)</span>
            </h3>
            <p>Splits the array in half repeatedly until single elements remain, then merges sorted subarrays back together. Guaranteed O(n log n) time in all cases, but requires O(n) auxiliary space.</p>
          </div>

          <div className="complexity-summary">
            <h4>Time Complexity</h4>
            <div className="complexity-grid">
              <div className="complexity-item"><span className="label">Best</span><span className="value">O(n log n)</span></div>
              <div className="complexity-item"><span className="label">Average</span><span className="value">O(n log n)</span></div>
              <div className="complexity-item"><span className="label">Worst</span><span className="value">O(n log n)</span></div>
              <div className="complexity-item"><span className="label">Space</span><span className="value">O(n)</span></div>
            </div>
          </div>
        </>
      }
      visualization={
        <VisualizationPanel title="Merge Sort Visualizer">
          <SortingPlayground
            algorithm={mergeSort}
            algorithmName="Merge Sort"
            pseudocode={`function mergeSort(arr, left, right):
  if left < right:
    mid = floor((left + right) / 2)
    mergeSort(arr, left, mid)
    mergeSort(arr, mid + 1, right)
    merge(arr, left, mid, right)

function merge(arr, left, mid, right):
  // copy to temp arrays L and R
  // merge elements in sorted order back into arr`}
            onComplete={() => {
              if (isAuthenticated) recordActivity('Sorting', 'Visualization', 'MergeSort', 'Complete', 0);
              saveProgress('Sorting', 'Merge Sort', {
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
