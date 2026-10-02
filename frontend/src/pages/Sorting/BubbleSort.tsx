import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { TopicLayout } from '../../components/Layout/TopicLayout';
import { VisualizationPanel } from '../../components/Visualization/VisualizationComponents';
import SortingPlayground from '../../components/Visualization/SortingPlayground';
import { bubbleSort } from '../../components/Visualization/sortingAlgorithms';

export default function BubbleSort() {
  const { isAuthenticated } = useAuth();
  const { recordActivity, saveProgress } = useProgress();
  return (
    <TopicLayout
      theory={
        <>
          <div className="topic-info-header">
            <h1>Bubble Sort</h1>
            <p className="topic-tagline">Adjacent elements are compared and swapped, so the largest value bubbles to the end each pass.</p>
          </div>

          <div className="op-info active">
            <h3>
              Algorithm
              <span className="complexity-badge">O(n²)</span>
            </h3>
            <p>Repeatedly steps through the array, compares adjacent elements, and swaps them if out of order. After each pass the largest unsorted element settles at the end. Stop when a pass has no swaps.</p>
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
        <VisualizationPanel title="Bubble Sort Visualizer">
          <SortingPlayground
            algorithm={bubbleSort}
            algorithmName="Bubble Sort"
            pseudocode={`function bubbleSort(arr):
  n = length(arr)
  for i from 0 to n - 1:
    swapped = false
    for j from 0 to n - i - 2:
      if arr[j] > arr[j + 1]:
        swap(arr[j], arr[j + 1])
        swapped = true
    if not swapped:
      break`}
            onComplete={() => {
              if (isAuthenticated) recordActivity('Sorting', 'Visualization', 'BubbleSort', 'Complete', 0);
              saveProgress('Sorting', 'Bubble Sort', {
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
