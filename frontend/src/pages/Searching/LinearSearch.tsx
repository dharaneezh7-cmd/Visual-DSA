import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { TopicLayout } from '../../components/Layout/TopicLayout';
import { ControlPanel, AnimationArea, StatusMessage } from '../../components/Visualization/VisualizationComponents';
import Button from '../../components/Common/Button';
import './searching.css';

interface SearchCell {
  value: number;
  state: 'default' | 'comparing' | 'found' | 'missed';
}

export default function LinearSearch() {
  const { isAuthenticated } = useAuth();
  const { recordActivity, saveProgress } = useProgress();
  const [cells, setCells] = useState<SearchCell[]>([
    { value: 50, state: 'default' }, { value: 30, state: 'default' }, { value: 80, state: 'default' },
    { value: 20, state: 'default' }, { value: 70, state: 'default' }, { value: 40, state: 'default' },
  ]);
  const [arrayInput, setArrayInput] = useState('50,30,80,20,70,40');
  const [targetInput, setTargetInput] = useState('');
  const [status, setStatus] = useState<{ type: 'info' | 'success' | 'error'; message: string }>({ type: 'info', message: 'Enter a target value and press Search.' });
  const [steps, setSteps] = useState<{ step: number; description: string; highlight?: string }[]>([]);
  const [animating, setAnimating] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const applyArray = () => {
    const values = arrayInput.split(',').map(s => s.trim()).filter(s => s.length > 0).map(Number);
    if (values.length === 0 || values.some(isNaN)) {
      setStatus({ type: 'error', message: 'Please enter comma-separated numbers.' });
      return false;
    }
    setCells(values.map(v => ({ value: v, state: 'default' as const })));
    setFoundIndex(null);
    return true;
  };

  const search = async () => {
    const target = parseInt(targetInput, 10);
    if (isNaN(target)) {
      setStatus({ type: 'error', message: 'Please enter a valid target value.' });
      return;
    }
    if (cells.length === 0) {
      setStatus({ type: 'error', message: 'Array is empty.' });
      return;
    }
    setAnimating(true);
    setSteps([]);
    setComparisons(0);
    let count = 0;
    for (let i = 0; i < cells.length; i++) {
      count++;
      setComparisons(count);
      setCells(prev => prev.map((c, idx) => ({ ...c, state: idx === i ? 'comparing' : 'default' })));
      setSteps(prev => [...prev, { step: count, description: `Comparing index ${i}: ${cells[i].value} with target ${target}.`, highlight: cells[i].value === target ? 'Match!' : 'No match' }]);
      await sleep(500);
      if (cells[i].value === target) {
        setCells(prev => prev.map((c, idx) => ({ ...c, state: idx === i ? 'found' : 'default' })));
        setFoundIndex(i);
        setComparisons(count);
        setStatus({ type: 'success', message: `Found ${target} at index ${i} in ${count} comparison(s).` });
        if (isAuthenticated) await recordActivity('Searching', 'Operation', `LinearSearch(${target})`, 'Found', 0);
        saveProgress('Searching', 'Linear Search', {
          completed: true,
          completionPercentage: 50,
          timeSpent: 45,
          operationsPerformed: 1,
        });
        setAnimating(false);
        return;
      }
    }
    setCells(prev => prev.map(c => ({ ...c, state: 'default' })));
    setFoundIndex(-1);
    setStatus({ type: 'error', message: `${target} not found after ${count} comparison(s).` });
    if (isAuthenticated) await recordActivity('Searching', 'Operation', `LinearSearch(${target})`, 'Not found', 0);
    saveProgress('Searching', 'Linear Search', {
      completed: true,
      completionPercentage: 50,
      timeSpent: 45,
      operationsPerformed: 1,
    });
    setAnimating(false);
  };

  return (
    <TopicLayout
      theory={
        <>
          <div className="topic-info-header">
            <h1>Linear Search</h1>
            <p className="topic-tagline">Checks each element one by one from index 0. Does not require a sorted array.</p>
          </div>

          <div className="op-info active">
            <h3>
              Search
              <span className="complexity-badge">O(n)</span>
            </h3>
            <p>Visit each element in order and compare it to the target. Stop when found or the array ends.</p>
            <ul className="op-steps">
              <li>Start at index 0</li>
              <li>Compare the current element with the target</li>
              <li>If it matches, return the index</li>
              <li>Otherwise move to the next index</li>
              <li>If the end is reached, the target is not present</li>
            </ul>
          </div>

          <div className="complexity-summary">
            <h4>Time Complexity</h4>
            <div className="complexity-grid">
              <div className="complexity-item"><span className="label">Best</span><span className="value">O(1)</span></div>
              <div className="complexity-item"><span className="label">Avg / Worst</span><span className="value">O(n)</span></div>
              <div className="complexity-item"><span className="label">Space</span><span className="value">O(1)</span></div>
            </div>
          </div>
        </>
      }
      visualization={
        <>
          <ControlPanel>
            <input className="search-array-input" placeholder="Array (e.g. 50,30,80)" value={arrayInput} onChange={e => setArrayInput(e.target.value)} disabled={animating} />
            <Button variant="outline" onClick={() => { if (applyArray()) setStatus({ type: 'info', message: 'Array updated. Enter a target and search.' }); }} disabled={animating}>Set Array</Button>
            <input type="number" placeholder="Target" value={targetInput} onChange={e => setTargetInput(e.target.value)} disabled={animating} onKeyDown={e => { if (e.key === 'Enter') search(); }} />
            <Button variant="primary" onClick={() => search()} disabled={animating}>Search</Button>
          </ControlPanel>

          <AnimationArea>
            <div className="search-visual">
              <div className="search-cells">
                {cells.length > 0 ? cells.map((c, i) => (
                  <div key={i} className={`search-cell state-${c.state} ${foundIndex === i ? 'is-found' : ''}`}>
                    <span className="search-index">{i}</span>
                    <span className="search-value">{c.value}</span>
                  </div>
                )) : <div className="search-empty">Array is empty.</div>}
              </div>
              <div className="search-stats">
                <span>Comparisons: <strong>{comparisons}</strong></span>
                <span>Current index: <strong>{steps.length > 0 ? steps[steps.length - 1].step - 1 : '-'}</strong></span>
              </div>
            </div>
          </AnimationArea>

          <StatusMessage type={status.type} message={status.message} />

          <div className="op-pseudocode">
            <div className="op-pseudocode-header">
              <span className="op-pseudocode-title">
                <span>📄</span> Pseudocode &mdash; Linear Search
              </span>
            </div>
            <pre>
              <code>{`function linearSearch(arr, target):
  for i from 0 to length(arr) - 1:
    if arr[i] == target:
      return i // Found at index i
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
