import { Link } from 'react-router-dom';
import './sorting.css';

const sorts = [
  { path: '/sorting/bubble', title: 'Bubble Sort', desc: 'Adjacent comparison and swap. Large elements bubble to the end.', icon: '🫧', time: 'O(n²)' },
  { path: '/sorting/selection', title: 'Selection Sort', desc: 'Pick the minimum each pass and swap it to the front.', icon: '🎯', time: 'O(n²)' },
  { path: '/sorting/insertion', title: 'Insertion Sort', desc: 'Insert each element into its correct place in the sorted part.', icon: '🃏', time: 'O(n²)' },
  { path: '/sorting/merge', title: 'Merge Sort', desc: 'Divide the array, sort halves, then merge them.', icon: '➗', time: 'O(n log n)' },
  { path: '/sorting/quick', title: 'Quick Sort', desc: 'Pick a pivot and partition the array around it.', icon: '⚡', time: 'O(n log n)' },
];

export default function Sorting() {
  return (
    <div className="sorting-page">
      <div className="sorting-hero">
        <h1>Sorting Algorithms</h1>
        <p>
          Sorting arranges elements in order. Every algorithm below is explained alongside a live,
          animated visualizer where you can start, pause, and control the speed.
        </p>
      </div>
      <div className="sorting-cards">
        {sorts.map(s => (
          <Link key={s.path} to={s.path} className="sorting-card">
            <span className="sorting-card-icon">{s.icon}</span>
            <h2>{s.title}</h2>
            <p>{s.desc}</p>
            <div className="sorting-card-meta">
              <span>Time: <strong>{s.time}</strong></span>
              <span>Open &rarr;</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}