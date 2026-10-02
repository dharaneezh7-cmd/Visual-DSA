import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { TopicLayout } from '../../components/Layout/TopicLayout';
import { ControlPanel, AnimationArea, StatusMessage } from '../../components/Visualization/VisualizationComponents';
import Button from '../../components/Common/Button';
import './searching.css';

interface BSCell {
  value: number;
  state: 'default' | 'active' | 'comparing' | 'found' | 'inactive' | 'low' | 'high' | 'mid';
}

export default function BinarySearch() {
  const { isAuthenticated } = useAuth();
  const { recordActivity, saveProgress } = useProgress();
  const [cells, setCells] = useState<BSCell[]>([
    { value: 10, state: 'default' }, { value: 20, state: 'default' }, { value: 30, state: 'default' },
    { value: 40, state: 'default' }, { value: 50, state: 'default' }, { value: 60, state: 'default' },
    { value: 70, state: 'default' }, { value: 80, state: 'default' },
  ]);
  const [arrayInput, setArrayInput] = useState('10,20,30,40,50,60,70,80');
  const [targetInput, setTargetInput] = useState('');
  const [status, setStatus] = useState<{ type: 'info' | 'success' | 'error'; message: string }>({ type: 'info', message: 'Enter a target. The array must be sorted.' });
  const [steps, setSteps] = useState<{ step: number; description: string; highlight?: string }[]>([]);
  const [animating, setAnimating] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [bounds, setBounds] = useState<{ low: number; high: number; mid: number } | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const applyArray = () => {
    const values = arrayInput.split(',').map(s => s.trim()).filter(s => s.length > 0).map(Number);
    if (values.length === 0 || values.some(isNaN)) {
      setStatus({ type: 'error', message: 'Please enter comma-separated numbers.' });
      return false;
    }
    for (let i = 1; i < values.length; i++) {
      if (values[i - 1] > values[i]) {
        setStatus({ type: 'error', message: 'Array must be sorted in ascending order.' });
        return false;
      }
    }
    setCells(values.map(v => ({ value: v, state: 'default' as const })));
    setFoundIndex(null);
    setBounds(null);
    return true;
  };

  const search = async () => {
    const target = parseInt(targetInput, 10);
    if (isNaN(target)) {
      setStatus({ type: 'error', message: 'Please enter a valid target value.' });
      return;
    }
    setAnimating(true);
    setSteps([]);
    setComparisons(0);
    setFoundIndex(null);

    let low = 0;
    let high = cells.length - 1;
    let count = 0;

    setCells(prev => prev.map(c => ({ ...c, state: 'default' })));

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      count++;
      setComparisons(count);
      setBounds({ low, high, mid });
      setCells(prev => prev.map((c, idx) => ({
        ...c,
        state: idx === mid ? 'mid' : idx === low ? 'low' : idx === high ? 'high' : 'default',
      })));
      setSteps(prev => [...prev, {
        step: count,
        description: `low=${low}, high=${high}, mid=${mid} → array[${mid}]=${cells[mid].value}.`,
        highlight: cells[mid].value === target ? 'Match!' : cells[mid].value < target ? 'Search right half' : 'Search left half',
      }]);
      await sleep(700);

      if (cells[mid].value === target) {
        setCells(prev => prev.map((c, idx) => ({ ...c, state: idx === mid ? 'found' : 'inactive' })));
        setFoundIndex(mid);
        setStatus({ type: 'success', message: `Found ${target} at index ${mid} in ${count} comparison(s).` });
        if (isAuthenticated) await recordActivity('Searching', 'Operation', `BinarySearch(${target})`, 'Found', 0);
        saveProgress('Searching', 'Binary Search', {
          completed: true,
          completionPercentage: 100,
          timeSpent: 60,
          operationsPerformed: 1,
        });
        setAnimating(false);
        return;
      } else if (cells[mid].value < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
      setCells(prev => prev.map((c, idx) => ({ ...c, state: idx < low || idx > high ? 'inactive' : 'default' })));
    }

    setFoundIndex(-1);
    setBounds(null);
    setCells(prev => prev.map(c => ({ ...c, state: 'inactive' })));
    setStatus({ type: 'error', message: `${target} not found after ${count} comparison(s).` });
    if (isAuthenticated) await recordActivity('Searching', 'Operation', `BinarySearch(${target})`, 'Not found', 0);
    saveProgress('Searching', 'Binary Search', {
      completed: true,
      completionPercentage: 100,
      timeSpent: 60,
      operationsPerformed: 1,
    });
    setAnimating(false);
  };

  return (
    <TopicLayout
      theory={
        <>
          <div className="topic-info-header">
            <h1>Binary Search</h1>
            <p className="topic-tagline">Requires a SORTED array. Each step halves the search space by comparing the middle element.</p>
          </div>

          <div className="op-info active">
            <h3>
              Search
              <span className="complexity-badge">O(log n)</span>
            </h3>
            <p>Compare the target with the middle element, then discard half the array each time until found (or the space empties).</p>
            <ul className="op-steps">
              <li>Set low = 0 and high = n-1</li>
              <li>Compute mid = (low + high) / 2</li>
              <li>If array[mid] == target, return mid</li>
              <li>If array[mid] &lt; target, search right: low = mid + 1</li>
              <li>If array[mid] &gt; target, search left: high = mid - 1</li>
              <li>Repeat until low &gt; high (not found)</li>
            </ul>
          </div>

          <div className="complexity-summary">
            <h4>Time Complexity</h4>
            <div className="complexity-grid">
              <div className="complexity-item"><span className="label">Best</span><span className="value">O(1)</span></div>
              <div className="complexity-item"><span className="label">Avg / Worst</span><span className="value">O(log n)</span></div>
              <div className="complexity-item"><span className="label">Space</span><span className="value">O(1)</span></div>
            </div>
          </div>
        </>
      }
      visualization={
        <>
          <ControlPanel>
            <input className="search-array-input" placeholder="Sorted array (e.g. 10,20,30)" value={arrayInput} onChange={e => setArrayInput(e.target.value)} disabled={animating} />
            <Button variant="outline" onClick={() => { if (applyArray()) setStatus({ type: 'info', message: 'Array set. Enter a target to search.' }); }} disabled={animating}>Set Array</Button>
            <input type="number" placeholder="Target" value={targetInput} onChange={e => setTargetInput(e.target.value)} disabled={animating} onKeyDown={e => { if (e.key === 'Enter') search(); }} />
            <Button variant="primary" onClick={() => search()} disabled={animating}>Search</Button>
          </ControlPanel>

          <AnimationArea>
            <div className="search-visual">
              <div className="search-cells">
                {cells.map((c, i) => (
                  <div key={i} className={`search-cell state-${c.state} ${foundIndex === i ? 'is-found' : ''}`}>
                    <span className="search-index">{i}</span>
                    <span className="search-value">{c.value}</span>
                  </div>
                ))}
              </div>
              {bounds && (
                <div className="bs-bounds">
                  <span className="bs-bound low">LOW → index {bounds.low} (value {cells[bounds.low]?.value})</span>
                  <span className="bs-bound mid">MID → index {bounds.mid} (value {cells[bounds.mid]?.value})</span>
                  <span className="bs-bound high">HIGH → index {bounds.high} (value {cells[bounds.high]?.value})</span>
                </div>
              )}
              <div className="search-stats">
                <span>Comparisons: <strong>{comparisons}</strong></span>
                <span>Search space: <strong>{bounds ? bounds.high - bounds.low + 1 : '-'} elements</strong></span>
              </div>
            </div>
          </AnimationArea>

          <StatusMessage type={status.type} message={status.message} />

          <div className="op-pseudocode">
            <div className="op-pseudocode-header">
              <span className="op-pseudocode-title">
                <span>📄</span> Pseudocode &mdash; Binary Search
              </span>
            </div>
            <pre>
              <code>{`function binarySearch(arr, target):
  low = 0
  high = length(arr) - 1

  while low <= high:
    mid = floor((low + high) / 2)
    if arr[mid] == target:
      return mid // Found at mid
    else if arr[mid] < target:
      low = mid + 1 // Search right half
    else:
      high = mid - 1 // Search left half

  return -1 // Not found`}</code>
            </pre>
          </div>

          {steps.length > 0 && (
            <div className="steps-inline">
              <ol className="steps-inline-list">
                {steps.map(s => (
                  <li key={s.step} className="steps-inline-item">
                    <span className="steps-inline-num">{s.step}</span>
                    <span className="steps-inline-desc">{s.description}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </>
      }
    />
  );
}