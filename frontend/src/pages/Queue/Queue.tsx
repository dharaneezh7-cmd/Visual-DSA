import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { TopicLayout } from '../../components/Layout/TopicLayout';
import { ControlPanel, AnimationArea, StatusMessage } from '../../components/Visualization/VisualizationComponents';
import Button from '../../components/Common/Button';
import './queue.css';

type Operation = 'enqueue' | 'dequeue' | 'front' | 'rear' | null;

interface QueueItem {
  value: number;
  state: 'default' | 'highlight' | 'enqueuing' | 'dequeuing' | 'front' | 'rear';
}

const opDescriptions: Record<string, { title: string; desc: string; complexity: string; steps: string[]; pseudocode?: string }> = {
  enqueue: {
    title: 'Enqueue',
    desc: 'Adds an element at the REAR of the queue. New elements wait at the end of the line.',
    complexity: 'O(1)',
    steps: ['Check if the queue is full', 'Insert element at REAR', 'Update REAR pointer'],
    pseudocode: `function enqueue(queue, value):
  if isFull(queue):
    raise OverflowError("Queue is full")
  
  rear = rear + 1
  queue[rear] = value
  size = size + 1`,
  },
  dequeue: {
    title: 'Dequeue',
    desc: 'Removes the element at FRONT. The longest-waiting element is served first (FIFO).',
    complexity: 'O(1)',
    steps: ['Check if the queue is empty', 'Remove element at FRONT', 'Update FRONT pointer'],
    pseudocode: `function dequeue(queue):
  if isEmpty(queue):
    raise UnderflowError("Queue is empty")
  
  item = queue[front]
  front = front + 1
  size = size - 1
  return item`,
  },
  front: {
    title: 'Front',
    desc: 'Returns the value at FRONT without removing it. This is the next element to be served.',
    complexity: 'O(1)',
    steps: ['Check if the queue is empty', 'Return value at FRONT'],
    pseudocode: `function front(queue):
  if isEmpty(queue):
    raise UnderflowError("Queue is empty")
  
  return queue[front]`,
  },
  rear: {
    title: 'Rear',
    desc: 'Returns the value at REAR without removing it. This is the most recently added element.',
    complexity: 'O(1)',
    steps: ['Check if the queue is empty', 'Return value at REAR'],
    pseudocode: `function rear(queue):
  if isEmpty(queue):
    raise UnderflowError("Queue is empty")
  
  return queue[rear]`,
  },
};

export default function Queue() {
  const { isAuthenticated } = useAuth();
  const { recordActivity, saveProgress } = useProgress();
  const [operation, setOperation] = useState<Operation>(null);
  const completedOpsRef = useRef<Set<string>>(new Set());
  const [elements, setElements] = useState<QueueItem[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<{ type: 'info' | 'success' | 'error'; message: string }>({ type: 'info', message: 'Perform operations on the queue. Elements are removed from the front.' });
  const [steps, setSteps] = useState<{ step: number; description: string; highlight?: string }[]>([]);
  const [animating, setAnimating] = useState(false);
  const [capacity, setCapacity] = useState(7);
  const timerRef = useRef<number[]>([]);

  useEffect(() => () => timerRef.current.forEach(clearTimeout), []);
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const setAllStates = (arr: QueueItem[], state: QueueItem['state']) => arr.map(i => ({ ...i, state }));

  const enqueue = async (value: number) => {
    if (elements.length >= capacity) {
      setStatus({ type: 'error', message: 'Queue is full! Cannot enqueue.' });
      setSteps([{ step: 1, description: 'Check whether the queue is full.' }, { step: 2, description: 'Report Queue Full. Element not inserted.' }]);
      return;
    }
    setSteps([{ step: 1, description: 'Check whether the queue is full.' }, { step: 2, description: 'Queue is not full. Proceed to insert at REAR.' }]);
    await sleep(300);
    setElements(prev => [...setAllStates(prev, 'default'), { value, state: 'enqueuing' }]);
    setSteps([{ step: 1, description: `Insert ${value} at the rear of the queue.` }, { step: 2, description: 'Update REAR.' }]);
    await sleep(600);
    setElements(prev => {
      const next = setAllStates(prev, 'default');
      next[next.length - 1].state = 'highlight';
      return next;
    });
    await sleep(400);
    setElements(prev => setAllStates(prev, 'default'));
    setSteps([{ step: 1, description: `Enqueued ${value}.` }, { step: 2, description: 'Rear now points to this element.' }]);
    setStatus({ type: 'success', message: `Enqueued ${value}.` });
    if (isAuthenticated) await recordActivity('Queue', 'Operation', `Enqueue(${value})`, 'Success', 0);
  };

  const dequeue = async () => {
    if (elements.length === 0) {
      setStatus({ type: 'error', message: 'Queue is empty! Nothing to dequeue.' });
      setSteps([{ step: 1, description: 'Check whether the queue is empty.' }, { step: 2, description: 'Report Queue Empty.' }]);
      return;
    }
    setSteps([{ step: 1, description: 'Check whether the queue is empty.' }, { step: 2, description: 'Queue is not empty. Proceed to remove from FRONT.' }]);
    setElements(prev => {
      const next = setAllStates(prev, 'default');
      next[0].state = 'dequeuing';
      return next;
    });
    setStatus({ type: 'info', message: 'Dequeuing the front element...' });
    await sleep(600);
    const front = elements[0].value;
    setElements(prev => prev.slice(1));
    setSteps([{ step: 1, description: `Remove ${front} from the front.` }, { step: 2, description: 'Update FRONT to the next element.' }]);
    await sleep(400);
    setSteps([{ step: 1, description: `Dequeued ${front}.` }]);
    setStatus({ type: 'success', message: `Dequeued ${front}.` });
    if (isAuthenticated) await recordActivity('Queue', 'Operation', `Dequeue(${front})`, 'Success', 0);
  };

  const peek = async (which: 'front' | 'rear') => {
    if (elements.length === 0) {
      setStatus({ type: 'error', message: 'Queue is empty. Nothing to view.' });
      setSteps([{ step: 1, description: 'Queue is empty, so there is nothing to view.' }]);
      return;
    }
    const value = which === 'front' ? elements[0].value : elements[elements.length - 1].value;
    setElements(prev => {
      const next = setAllStates(prev, 'default');
      const idx = which === 'front' ? 0 : next.length - 1;
      next[idx].state = which;
      return next;
    });
    await sleep(600);
    setElements(prev => setAllStates(prev, 'default'));
    setStatus({ type: 'success', message: `${which === 'front' ? 'Front' : 'Rear'} of queue is ${value}.` });
    setSteps([{ step: 1, description: `${which === 'front' ? 'Front' : 'Rear'} element is ${value}.` }, { step: 2, description: 'Queue is unchanged.' }]);
    if (isAuthenticated) await recordActivity('Queue', 'Operation', `${which === 'front' ? 'Front' : 'Rear'}(${value})`, 'Success', 0);
  };

  const handleOperation = async (op: Operation) => {
    if (animating) return;
    setAnimating(true);
    setOperation(op);
    setSteps([]);
    const trimmed = input.trim();
    if (op === 'enqueue') {
      const value = parseInt(trimmed, 10);
      if (isNaN(value)) {
        setStatus({ type: 'error', message: 'Please enter a valid value.' });
        setAnimating(false);
        return;
      }
      await enqueue(value);
    } else if (op === 'dequeue') {
      await dequeue();
    } else if (op === 'front' || op === 'rear') {
      await peek(op);
    }
    if (op) {
      completedOpsRef.current.add(op);
      const totalOps = 3;
      const count = completedOpsRef.current.size;
      const pct = Math.round((count / totalOps) * 100);
      saveProgress('Queue', 'Queue Operations', {
        completed: count >= 2,
        completionPercentage: pct,
        timeSpent: 60,
        operationsPerformed: count,
      });
    }
    setAnimating(false);
  };

  const handleClear = () => {
    if (animating) return;
    setElements([]);
    setStatus({ type: 'info', message: 'Queue cleared.' });
    setSteps([]);
    if (isAuthenticated) recordActivity('Queue', 'Operation', 'Clear', 'Success', 0);
  };

  const currentOp = operation ? opDescriptions[operation] : null;

  return (
    <TopicLayout
      theory={
        <>
          <div className="topic-info-header">
            <h1>Queue</h1>
            <p className="topic-tagline">FIFO — First In, First Out. Like a ticket counter: first in line is served first.</p>
          </div>

          <div className="op-selector-group">
            {(['enqueue', 'dequeue', 'front', 'rear'] as const).map(op => (
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
              <p>Select an operation above to see its explanation, then use the controls on the right to visualize it step by step.</p>
            </div>
          )}

          <div className="complexity-summary">
            <h4>Time Complexity</h4>
            <div className="complexity-grid">
              <div className="complexity-item"><span className="label">Enqueue</span><span className="value">O(1)</span></div>
              <div className="complexity-item"><span className="label">Dequeue</span><span className="value">O(1)</span></div>
              <div className="complexity-item"><span className="label">Front</span><span className="value">O(1)</span></div>
              <div className="complexity-item"><span className="label">Rear</span><span className="value">O(1)</span></div>
            </div>
          </div>
        </>
      }
      visualization={
        <>
          <ControlPanel>
            <label>Capacity</label>
            <select value={capacity} onChange={e => setCapacity(parseInt(e.target.value, 10))} disabled={animating || elements.length > 0}>
              {[5, 6, 7, 8, 10].map(n => <option key={n} value={n}>{n}</option>)}
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
            <Button variant="success" onClick={() => handleOperation('front')} disabled={animating}>Front</Button>
            <Button variant="outline" onClick={() => handleOperation('rear')} disabled={animating}>Rear</Button>
            <Button variant="secondary" onClick={handleClear} disabled={animating}>Clear</Button>
          </ControlPanel>

          <AnimationArea>
            <div className="queue-visual">
              <div className="queue-labels">
                <span className="queue-label">FRONT {elements.length > 0 && <strong>&darr;</strong>}</span>
                <span className="queue-label">REAR {elements.length > 0 && <strong>&darr;</strong>}</span>
              </div>
              <div className="queue-cells">
                {Array.from({ length: capacity }).map((_, idx) => {
                  const item = elements[idx];
                  return (
                    <div key={idx} className={`queue-cell ${idx === 0 ? 'is-front' : idx === elements.length - 1 ? 'is-rear' : ''} ${item ? `cell-${item.state}` : 'cell-empty'}`}>
                      {item ? item.value : <span className="queue-cell-placeholder">&nbsp;</span>}
                    </div>
                  );
                })}
                {elements.length === 0 && <div className="queue-empty-msg">Empty Queue</div>}
              </div>
              <div className="queue-meta">
                <span>Size: {elements.length}/{capacity}</span>
                <span>{elements.length === 0 ? 'Empty' : elements.length === capacity ? 'Full' : `Space left: ${capacity - elements.length}`}</span>
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
