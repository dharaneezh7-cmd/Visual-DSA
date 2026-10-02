import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { TopicLayout } from '../../components/Layout/TopicLayout';
import { VisualizationPanel } from '../../components/Visualization/VisualizationComponents';
import SortingPlayground from '../../components/Visualization/SortingPlayground';
import { selectionSort } from '../../components/Visualization/sortingAlgorithms';

export default function SelectionSort() {
  const { isAuthenticated } = useAuth();
  const { recordActivity, saveProgress } = useProgress();
  return (
    <TopicLayout
      theory={
        <>
          <div className="topic-info-header">
            <h1>Selection Sort</h1>
            <p className="topic-tagline">Finds the minimum element from the unsorted region and places it at the beginning.</p>
          </div>

          <div className="op-info active">
            <h3>
              Algorithm
              <span className="complexity-badge">O(n²)</span>
            </h3>
            <p>Divides the array into sorted and unsorted parts. Repeatedly finds the smallest element in the unsorted portion and swaps it with the first unsorted element. Makes fewer swaps than bubble sort.</p>
          </div>

          <div className="complexity-summary">
            <h4>Time Complexity</h4>
            <div className="complexity-grid">
              <div className="complexity-item"><span className="label">Best</span><span className="value">O(n²)</span></div>
              <div className="complexity-item"><span className="label">Average</span><span className="value">O(n²)</span></div>
              <div className="complexity-item"><span className="label">Worst</span><span className="value">O(n²)</span></div>
              <div className="complexity-item"><span className="label">Space</span><span className="value">O(1)</span></div>
            </div>
          </div>
        </>
      }
      visualization={
        <VisualizationPanel title="Selection Sort Visualizer">
          <SortingPlayground
            algorithm={selectionSort}
            algorithmName="Selection Sort"
            pseudocode={`function selectionSort(arr):
  n = length(arr)
  for i from 0 to n - 2:
    minIdx = i
    for j from i + 1 to n - 1:
      if arr[j] < arr[minIdx]:
        minIdx = j
    if minIdx != i:
      swap(arr[i], arr[minIdx])`}
            onComplete={() => {
              if (isAuthenticated) recordActivity('Sorting', 'Visualization', 'SelectionSort', 'Complete', 0);
              saveProgress('Sorting', 'Selection Sort', {
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
