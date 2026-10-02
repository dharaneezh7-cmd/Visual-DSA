import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { TopicLayout } from '../../components/Layout/TopicLayout';
import { VisualizationPanel } from '../../components/Visualization/VisualizationComponents';
import SortingPlayground from '../../components/Visualization/SortingPlayground';
import { insertionSort } from '../../components/Visualization/sortingAlgorithms';

export default function InsertionSort() {
  const { isAuthenticated } = useAuth();
  const { recordActivity, saveProgress } = useProgress();
  return (
    <TopicLayout
      theory={
        <>
          <div className="topic-info-header">
            <h1>Insertion Sort</h1>
            <p className="topic-tagline">Builds the sorted array one item at a time by inserting each element into its proper place.</p>
          </div>

          <div className="op-info active">
            <h3>
              Algorithm
              <span className="complexity-badge">O(n²)</span>
            </h3>
            <p>Picks elements one by one and inserts them into their correct sorted position by shifting larger elements to the right. Fast on small or nearly sorted arrays (O(n) best case).</p>
          </div>

          <div className="complexity-summary">
            <h4>Time Complexity</h4>
            <div className="complexity-grid">
              <div className="complexity-item"><span className="label">Best (sorted)</span><span className="value">O(n)</span></div>
              <div className="complexity-item"><span className="label">Average</span><span className="value">O(n²)</span></div>
              <div className="complexity-item"><span className="label">Worst</span><span className="value">O(n²)</span></div>
              <div className="complexity-item"><span className="label">Space</span><span className="value">O(1)</span></div>
            </div>
          </div>
        </>
      }
      visualization={
        <VisualizationPanel title="Insertion Sort Visualizer">
          <SortingPlayground
            algorithm={insertionSort}
            algorithmName="Insertion Sort"
            pseudocode={`function insertionSort(arr):
  n = length(arr)
  for i from 1 to n - 1:
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key:
      arr[j + 1] = arr[j]
      j = j - 1
    arr[j + 1] = key`}
            onComplete={() => {
              if (isAuthenticated) recordActivity('Sorting', 'Visualization', 'InsertionSort', 'Complete', 0);
              saveProgress('Sorting', 'Insertion Sort', {
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
