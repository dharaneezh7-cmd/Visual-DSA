import { useRef, useState } from 'react';
import type { SortAlgorithm, SortBar, SortStats } from './sortingAlgorithms';
import { generateRandomArray } from './sortingAlgorithms';
import { ControlPanel, AnimationArea, StatusMessage } from './VisualizationComponents';
import Button from '../Common/Button';
import './SortingPlayground.css';

interface SortingPlaygroundProps {
  algorithm: SortAlgorithm;
  algorithmName: string;
  defaultArray?: string;
  onComplete?: () => void;
  pseudocode?: string;
}

const initialStats: SortStats = { comparisons: 0, swaps: 0, passes: 0 };

export default function SortingPlayground({ algorithm, algorithmName, defaultArray = '64,34,25,12,22,11,90', onComplete, pseudocode }: SortingPlaygroundProps) {
  const [arrayInput, setArrayInput] = useState(defaultArray);
  const [bars, setBars] = useState<SortBar[]>(() => defaultArray.split(',').map(v => ({ value: parseInt(v, 10), state: 'default' })));
  const [stats, setStats] = useState<SortStats>(initialStats);
  const [status, setStatus] = useState<{ type: 'info' | 'success' | 'error'; message: string }>({ type: 'info', message: `Press Start to run ${algorithmName}.` });
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(5);

  const pausedRef = useRef(false);
  const tokenRef = useRef(0);
  const genRef = useRef<AsyncGenerator<import('./sortingAlgorithms').SortFrame> | null>(null);

  const speedMs = () => Math.max(40, 900 - speed * 85);

  const parseValues = (input: string): number[] | null => {
    const values = input.split(',').map(s => s.trim()).filter(s => s.length > 0).map(Number);
    if (values.length === 0 || values.some(isNaN)) return null;
    return values;
  };

  const setArrayFromInput = (input: string) => {
    const values = parseValues(input);
    if (!values) {
      setStatus({ type: 'error', message: 'Please enter comma-separated numbers.' });
      return false;
    }
    setBars(values.map(v => ({ value: v, state: 'default' })));
    setStats(initialStats);
    setStatus({ type: 'info', message: 'Array set. Press Start.' });
    return true;
  };

  const wait = async (token: number) => {
    while (pausedRef.current) {
      await new Promise(r => setTimeout(r, 60));
      if (tokenRef.current !== token) throw new Error('stopped');
    }
    await new Promise(r => setTimeout(r, speedMs()));
    if (tokenRef.current !== token) throw new Error('stopped');
  };

  const start = async () => {
    if (running) return;
    const values = parseValues(arrayInput);
    if (!values) {
      setStatus({ type: 'error', message: 'Please enter comma-separated numbers.' });
      return;
    }
    setBars(values.map(v => ({ value: v, state: 'default' as const })));
    setStats(initialStats);
    const token = ++tokenRef.current;
    pausedRef.current = false;
    setPaused(false);
    setRunning(true);
    const gen = algorithm(values);
    genRef.current = gen;
    setStatus({ type: 'info', message: `${algorithmName} started...` });

    try {
      for await (const frame of gen) {
        if (tokenRef.current !== token) throw new Error('stopped');
        setBars(frame.states);
        setStats(frame.stats);
        setStatus({ type: 'info', message: frame.note });
        await wait(token);
      }
      setStatus({ type: 'success', message: 'Sorting complete!' });
      onComplete?.();
    } catch {
      if (tokenRef.current === token) setStatus({ type: 'info', message: 'Sorting stopped.' });
    } finally {
      if (tokenRef.current === token) setRunning(false);
    }
  };

  const pause = () => {
    if (!running || paused) return;
    pausedRef.current = true;
    setPaused(true);
    setStatus({ type: 'info', message: 'Paused.' });
  };

  const resume = () => {
    if (!paused) return;
    pausedRef.current = false;
    setPaused(false);
    setStatus({ type: 'info', message: 'Resuming...' });
  };

  const reset = () => {
    tokenRef.current++;
    pausedRef.current = false;
    genRef.current = null;
    setRunning(false);
    setPaused(false);
    const values = parseValues(arrayInput);
    setBars((values ?? []).map(v => ({ value: v, state: 'default' })));
    setStats(initialStats);
    setStatus({ type: 'info', message: 'Reset. Press Start to run again.' });
  };

  const random = () => {
    if (running) return;
    const values = generateRandomArray(8);
    const input = values.join(',');
    setArrayInput(input);
    setArrayFromInput(input);
  };

  const maxValue = Math.max(...bars.map(b => b.value), 1);

  return (
    <>
      <ControlPanel>
        <input className="sort-array-input" value={arrayInput} onChange={e => setArrayInput(e.target.value)} placeholder="e.g. 64,34,25,12,22,11,90" disabled={running} />
        <Button variant="outline" onClick={() => setArrayFromInput(arrayInput)} disabled={running}>Set Array</Button>
        <Button variant="secondary" onClick={random} disabled={running}>Random</Button>
      </ControlPanel>

      <ControlPanel>
        {!running ? (
          <Button variant="primary" onClick={() => start()} disabled={paused}>Start</Button>
        ) : !paused ? (
          <Button variant="warning" onClick={pause}>Pause</Button>
        ) : (
          <Button variant="success" onClick={resume}>Resume</Button>
        )}
        <Button variant="secondary" onClick={reset}>Reset</Button>
        <label className="sort-speed-label">
          Speed
          <input
            type="range"
            min={1}
            max={10}
            value={speed}
            onChange={e => setSpeed(parseInt(e.target.value, 10))}
            disabled={running}
          />
          <span>{speedMs() <= 100 ? 'Fast' : speedMs() >= 600 ? 'Slow' : 'Medium'}</span>
        </label>
      </ControlPanel>

      <AnimationArea>
        <div className="sort-visual">
          <div className="sort-bars">
            {bars.map((b, i) => (
              <div
                key={i}
                className={`sort-bar bar-${b.state}`}
                style={{ height: `${(b.value / maxValue) * 100}%` }}
                title={`${b.value}`}
              >
                <span className="sort-bar-value">{b.value}</span>
              </div>
            ))}
          </div>
          <div className="sort-stats">
            <span className="sort-stat">Comparisons: <strong>{stats.comparisons}</strong></span>
            <span className="sort-stat">{algorithmName === 'Insertion Sort' || algorithmName === 'Merge Sort' ? 'Shifts/Writes' : 'Swaps'}: <strong>{stats.swaps}</strong></span>
            <span className="sort-stat">Passes: <strong>{stats.passes}</strong></span>
            <span className="sort-stat">Sorted: <strong>{bars.filter(b => b.state === 'sorted').length}</strong></span>
          </div>
        </div>
      </AnimationArea>

      <StatusMessage type={status.type} message={status.message} />

      {pseudocode && (
        <div className="op-pseudocode" style={{ marginTop: '1rem' }}>
          <div className="op-pseudocode-header">
            <span className="op-pseudocode-title">
              <span>📄</span> Pseudocode &mdash; {algorithmName}
            </span>
          </div>
          <pre>
            <code>{pseudocode}</code>
          </pre>
        </div>
      )}
    </>
  );
}