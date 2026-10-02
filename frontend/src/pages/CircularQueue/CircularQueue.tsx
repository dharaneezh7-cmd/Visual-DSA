import { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { TopicLayout } from '../../components/Layout/TopicLayout';
import { ControlPanel, AnimationArea, StatusMessage } from '../../components/Visualization/VisualizationComponents';
import Button from '../../components/Common/Button';
import './circularqueue.css';

interface Slot {
  value: number | null;
  state: 'default' | 'highlight' | 'enqueuing' | 'dequeuing' | 'front' | 'rear' | 'empty';
}

const opDescriptions: Record<string, { title: string; desc: string; complexity: string; steps: string[]; pseudocode?: string }> = {
  enqueue: {
    title: 'Enqueue',
    desc: 'Inserts at REAR. When REAR reaches the end, it wraps to index 0 — the circular advantage.',
    complexity: 'O(1)',
    steps: ['Check if the queue is full', 'Insert at REAR index', 'Move REAR: (REAR + 1) % SIZE'],
    pseudocode: `function enqueue(value):
  if (rear + 1) % capacity == front:
    raise OverflowError("Circular Queue is full")
  
  if front == -1:
    front = 0
  
  rear = (rear + 1) % capacity
  queue[rear] = value
  count = count + 1`,
  },
  dequeue: {
    title: 'Dequeue',
    desc: 'Removes from FRONT. FRONT also moves forward with wrap-around, reusing empty slots.',
    complexity: 'O(1)',
    steps: ['Check if the queue is empty', 'Remove from FRONT index', 'Move FRONT: (FRONT + 1) % SIZE'],
    pseudocode: `function dequeue():
  if isEmpty():
    raise UnderflowError("Circular Queue is empty")
  
  item = queue[front]
  queue[front] = null
  
  if front == rear:
    front = -1
    rear = -1
  else:
    front = (front + 1) % capacity
  
  count = count - 1
  return item`,
  },
};

export default function CircularQueue() {
  const { isAuthenticated } = useAuth();
  const { recordActivity, saveProgress } = useProgress();
  const [operation, setOperation] = useState<'enqueue' | 'dequeue' | null>(null);
  const completedOpsRef = useRef<Set<string>>(new Set());
  const [capacity, setCapacity] = useState(8);
  const [slots, setSlots] = useState<Slot[]>(() => Array.from({ length: 8 }, () => ({ value: null, state: 'empty' as const })));
  const [front, setFront] = useState(0);
  const [rear, setRear] = useState(0);
  const [size, setSize] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<{ type: 'info' | 'success' | 'error'; message: string }>({ type: 'info', message: 'Enqueue and dequeue. Watch the wrap-around when pointers reach the end.' });
  const [steps, setSteps] = useState<{ step: number; description: string; highlight?: string }[]>([]);
  const [animating, setAnimating] = useState(false);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const changeCapacity = (n: number) => {
    if (size > 0 || animating) return;
    setCapacity(n);
    setFront(0);
    setRear(0);
    setSlots(Array.from({ length: n }, () => ({ value: null, state: 'empty' as const })));
  };

  const enqueue = async (value: number) => {
    if (size === capacity) {
      setStatus({ type: 'error', message: 'Queue overflow! The circular queue is full.' });
      setSteps([{ step: 1, description: 'Check if the queue is full.' }, { step: 2, description: 'Report Queue Overflow.' }]);
      return;
    }
    setSteps([{ step: 1, description: 'Check if the queue is full.' }, { step: 2, description: 'Slot is free. Insert at REAR index.' }]);
    setSlots(prev => {
      const next = [...prev];
      next[rear] = { value, state: 'enqueuing' };
      return next;
    });
    setStatus({ type: 'info', message: `Inserting ${value} at index ${rear}...` });
    await sleep(600);
    setSlots(prev => {
      const next = [...prev];
      next[rear] = { value, state: 'rear' };
      return next;
    });
    setSteps([{ step: 1, description: `Inserted ${value} at index ${rear}.` }, { step: 2, description: 'Move REAR forward with wrap-around.' }]);
    await sleep(400);
    const newRear = (rear + 1) % capacity;
    const newSize = size + 1;
    setRear(newRear);
    setSize(newSize);
    setSlots(prev => prev.map((s, i) => ({ value: s.value, state: s.value === null ? 'empty' : i === front && newSize > 0 ? 'front' : 'default' })));
    setSteps([{ step: 1, description: `REAR moved from ${rear} to ${newRear} (last index wraps to 0).` }, { step: 2, description: `Size is now ${newSize}.` }]);
    setStatus({ type: 'success', message: `Enqueued ${value}. New rear index: ${newRear}.` });
    if (isAuthenticated) await recordActivity('CircularQueue', 'Operation', `Enqueue(${value})`, 'Success', 0);
  };

  const dequeue = async () => {
    if (size === 0) {
      setStatus({ type: 'error', message: 'Queue underflow! The circular queue is empty.' });
      setSteps([{ step: 1, description: 'Check if the queue is empty.' }, { step: 2, description: 'Report Queue Underflow.' }]);
      return;
    }
    setSteps([{ step: 1, description: 'Check if the queue is empty.' }, { step: 2, description: 'Remove the element at FRONT index.' }]);
    const removed = slots[front].value;
    setSlots(prev => prev.map((s, i) => ({ ...s, state: i === front ? 'dequeuing' : s.value === null ? 'empty' : 'default' })));
    setStatus({ type: 'info', message: `Removing ${removed} from index ${front}...` });
    await sleep(600);
    setSlots(prev => {
      const next = [...prev];
      next[front] = { value: null, state: 'empty' };
      return next;
    });
    setSteps([{ step: 1, description: `Removed ${removed} from index ${front}.` }, { step: 2, description: 'Move FRONT forward with wrap-around.' }]);
    await sleep(400);
    const newFront = (front + 1) % capacity;
    const newSize = size - 1;
    setFront(newFront);
    setSize(newSize);
    setSlots(prev => prev.map((s, i) => ({ value: s.value, state: s.value === null ? 'empty' : i === newFront && newSize > 0 ? 'front' : 'default' })));
    setSteps([{ step: 1, description: `FRONT moved from ${front} to ${newFront}.` }, { step: 2, description: `Size is now ${newSize}.` }]);
    setStatus({ type: 'success', message: `Dequeued ${removed}. New front index: ${newFront}.` });
    if (isAuthenticated) await recordActivity('CircularQueue', 'Operation', `Dequeue(${removed})`, 'Success', 0);
  };

  const handleClear = () => {
    if (animating) return;
    setSlots(Array.from({ length: capacity }, () => ({ value: null, state: 'empty' as const })));
    setFront(0);
    setRear(0);
    setSize(0);
    setSteps([]);
    setStatus({ type: 'info', message: 'Queue cleared.' });
    if (isAuthenticated) recordActivity('CircularQueue', 'Operation', 'Clear', 'Success', 0);
  };

  const handleOperation = async (op: 'enqueue' | 'dequeue') => {
    if (animating) return;
    setAnimating(true);
    setOperation(op);
    setSteps([]);
    if (op === 'enqueue') {
      const value = parseInt(input.trim(), 10);
      if (isNaN(value)) {
        setStatus({ type: 'error', message: 'Please enter a valid value.' });
        setAnimating(false);
        return;
      }
      await enqueue(value);
    } else {
      await dequeue();
    }
    if (op) {
      completedOpsRef.current.add(op);
      const totalOps = 2;
      const count = completedOpsRef.current.size;
      const pct = Math.round((count / totalOps) * 100);
      saveProgress('CircularQueue', 'CircularQueue Operations', {
        completed: count >= 2,
        completionPercentage: pct,
        timeSpent: 60,
        operationsPerformed: count,
      });
    }
    setAnimating(false);
  };

  const currentOp = operation ? opDescriptions[operation] : null;

  return (
    <TopicLayout
      theory={
        <>
          <div className="topic-info-header">
            <h1>Circular Queue</h1>
            <p className="topic-tagline">Reuses empty space at the front. Pointers wrap around — no wasted slots.</p>
          </div>

          <div className="op-selector-group">
            {(['enqueue', 'dequeue'] as const).map(op => (
              <button
                key={op}
                className={`op-select-btn ${operation === op ? 'active' : ''}`}
                onClick={() => { setOperation(op); setStatus({ type: 'info', message: `Select ${op} and press the button to execute.` }); }}
                disabled={animating}
              >
                {op.charAt(0).toUpperCase() + op.slice(1)}
              </button>
            ))}
          </div>

          {currentOp ? (
            <div className="op-info active">
              <h3>
                {currentOp.title}
                <span className="complexity-badge">{currentOp.complexity}</span>
              </h3>
              <p>{currentOp.desc}</p>
              <ul className="op-steps">
                {currentOp.steps.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          ) : (
            <div className="op-info">
              <h3>How it works</h3>
              <p>Slots are arranged in a circle. Front and Rear move clockwise, wrapping from the last index back to 0.</p>
            </div>
          )}

          <div className="complexity-summary">
            <h4>Time Complexity</h4>
            <div className="complexity-grid">
              <div className="complexity-item"><span className="label">Enqueue</span><span className="value">O(1)</span></div>
              <div className="complexity-item"><span className="label">Dequeue</span><span className="value">O(1)</span></div>
              <div className="complexity-item"><span className="label">Front</span><span className="value">O(1)</span></div>
              <div className="complexity-item"><span className="label">Space</span><span className="value">O(n)</span></div>
            </div>
          </div>
        </>
      }
      visualization={
        <>
          <ControlPanel>
            <label>Size</label>
            <select value={capacity} onChange={e => changeCapacity(parseInt(e.target.value, 10))} disabled={animating || size > 0}>
              {[6, 8, 10, 12].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <input
              type="number"
              placeholder="Enter value"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleOperation('enqueue'); }}
              disabled={animating}
            />
            <Button variant="primary" onClick={() => handleOperation('enqueue')} disabled={animating}>Enqueue</Button>
            <Button variant="danger" onClick={() => handleOperation('dequeue')} disabled={animating}>Dequeue</Button>
            <Button variant="secondary" onClick={handleClear} disabled={animating}>Clear</Button>
          </ControlPanel>

          <AnimationArea>
            <div className="cq-visual">
              <div className="cq-ring">
                {slots.map((slot, idx) => {
                  const angle = (360 / slots.length) * idx - 90;
                  return (
                    <div
                      key={idx}
                      className={`cq-slot cq-${slot.state} ${idx === front && size > 0 ? 'is-front' : ''} ${idx === (rear - 1 + slots.length) % slots.length && size > 0 ? 'is-rear' : ''}`}
                      style={{ transform: `rotate(${angle}deg) translate(160px) rotate(${-angle}deg)` }}
                    >
                      <span className="cq-index">{idx}</span>
                      <span className="cq-value">{slot.value !== null ? slot.value : ''}</span>
                      {idx === front && size > 0 && <span className="cq-arrow f">F</span>}
                      {idx === (rear - 1 + slots.length) % slots.length && size > 0 && <span className="cq-arrow r">R</span>}
                    </div>
                  );
                })}
              </div>
              <div className="cq-stats">
                <span className={size === capacity ? 'cq-full' : ''}>Front idx: {front}</span>
                <span>Rear idx: {rear}</span>
                <span>Size: {size}/{capacity}</span>
                <span>{size === 0 ? 'Empty' : size === capacity ? 'Full' : 'Ready'}</span>
              </div>
            </div>
          </AnimationArea>

          <StatusMessage type={status.type} message={status.message} />

          {currentOp?.pseudocode && (
            <div className="op-pseudocode">
              <div className="op-pseudocode-header">
                <span className="op-pseudocode-title">
                  <span>📄</span> Pseudocode &mdash; {currentOp.title}
                </span>
              </div>
              <pre>
                <code>{currentOp.pseudocode}</code>
              </pre>
            </div>
          )}

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
