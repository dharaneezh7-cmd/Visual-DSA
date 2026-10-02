import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { TopicLayout } from '../../components/Layout/TopicLayout';
import { ControlPanel, AnimationArea, StatusMessage } from '../../components/Visualization/VisualizationComponents';
import Button from '../../components/Common/Button';
import './stack.css';

type Operation = 'push' | 'pop' | 'peek' | null;

interface StackItem {
  value: number;
  state: 'default' | 'highlight' | 'pushing' | 'popping' | 'peeking';
}

const opDescriptions: Record<string, { title: string; desc: string; complexity: string; steps: string[]; pseudocode: string }> = {
  push: {
    title: 'Push',
    desc: 'Adds a new element at the TOP of the stack. Always O(1) — no shifting needed.',
    complexity: 'O(1)',
    steps: ['Check if the stack is full', 'Insert element at TOP', 'Update TOP pointer'],
    pseudocode: `function push(stack, value):
    if top >= MAX_SIZE - 1:
        return "Stack Overflow"
    top = top + 1
    stack[top] = value`,
  },
  pop: {
    title: 'Pop',
    desc: 'Removes the element at TOP and returns it. The element below becomes the new TOP.',
    complexity: 'O(1)',
    steps: ['Check if the stack is empty', 'Remove element at TOP', 'Decrement TOP pointer'],
    pseudocode: `function pop(stack):
    if top == -1:
        return "Stack Underflow"
    popped = stack[top]
    top = top - 1
    return popped`,
  },
  peek: {
    title: 'Peek',
    desc: 'Returns the value at TOP without removing it. Stack remains unchanged.',
    complexity: 'O(1)',
    steps: ['Check if the stack is empty', 'Return value at TOP'],
    pseudocode: `function peek(stack):
    if top == -1:
        return "Stack is Empty"
    return stack[top]`,
  },
};

export default function Stack() {
  const { isAuthenticated } = useAuth();
  const { recordActivity, saveProgress } = useProgress();
  const [operation, setOperation] = useState<Operation>(null);
  const completedOpsRef = useRef<Set<string>>(new Set());
  const [elements, setElements] = useState<StackItem[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<{ type: 'info' | 'success' | 'error'; message: string }>({ type: 'info', message: 'Set the stack size and perform operations. The stack grows upward.' });
  const [steps, setSteps] = useState<{ step: number; description: string; highlight?: string }[]>([]);
  const [animating, setAnimating] = useState(false);
  const [maxSize, setMaxSize] = useState(7);
  const timerRef = useRef<number[]>([]);

  useEffect(() => () => timerRef.current.forEach(clearTimeout), []);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const setAllStates = (arr: StackItem[], state: StackItem['state']) => arr.map(i => ({ ...i, state }));

  const pushAnimation = async (value: number) => {
    if (elements.length >= maxSize) {
      setStatus({ type: 'error', message: 'Stack overflow! The stack is already full.' });
      setSteps([
        { step: 1, description: 'Check whether the stack is full.' },
        { step: 2, description: 'TOP == MAXSIZE, so the stack is full.' },
        { step: 3, description: 'Report Stack Overflow. Element not inserted.' },
      ]);
      return;
    }
    setSteps([
      { step: 1, description: 'Check whether the stack is full.' },
      { step: 2, description: 'Stack is not full, proceed to insert.' },
      { step: 3, description: `Create element ${value}.` },
    ]);
    await sleep(300);
    setElements(prev => [...setAllStates(prev, 'default'), { value, state: 'pushing' }]);
    setSteps([
      { step: 1, description: 'Create the new element.' },
      { step: 2, description: `Insert ${value} at TOP of the stack.` },
    ]);
    await sleep(600);
    setElements(prev => {
      const next = setAllStates(prev, 'default');
      next[next.length - 1].state = 'highlight';
      return next;
    });
    setSteps([
      { step: 1, description: `Insert ${value} at TOP.` },
      { step: 2, description: 'Update TOP to point to the new element.' },
    ]);
    await sleep(500);
    setElements(prev => setAllStates(prev, 'default'));
    setSteps([
      { step: 1, description: `Push ${value} complete.` },
      { step: 2, description: 'TOP now points to the newest element.' },
    ]);
    setStatus({ type: 'success', message: `Pushed ${value} onto the stack.` });
    if (isAuthenticated) await recordActivity('Stack', 'Operation', `Push(${value})`, 'Success', 0);
  };

  const popAnimation = async () => {
    if (elements.length === 0) {
      setStatus({ type: 'error', message: 'Stack underflow! The stack is empty.' });
      setSteps([
        { step: 1, description: 'Check whether the stack is empty.' },
        { step: 2, description: 'TOP == -1, so the stack is empty.' },
        { step: 3, description: 'Report Stack Underflow. Nothing to remove.' },
      ]);
      return;
    }
    setSteps([
      { step: 1, description: 'Check whether the stack is empty.' },
      { step: 2, description: 'Stack is not empty, proceed to remove.' },
      { step: 3, description: 'Take the element at TOP.' },
    ]);
    setElements(prev => {
      const next = setAllStates(prev, 'default');
      next[next.length - 1].state = 'popping';
      return next;
    });
    setStatus({ type: 'info', message: 'Popping the top element...' });
    await sleep(600);
    const popped = elements[elements.length - 1]?.value;
    setElements(prev => prev.slice(0, -1));
    setSteps([
      { step: 1, description: 'Remove the element at TOP.' },
      { step: 2, description: 'Decrement TOP to point to the element below.' },
    ]);
    await sleep(400);
    setSteps([
      { step: 1, description: `Pop ${popped} complete.` },
      { step: 2, description: 'TOP now points to the element below.' },
    ]);
    setStatus({ type: 'success', message: `Popped ${popped} from the stack.` });
    if (isAuthenticated) await recordActivity('Stack', 'Operation', `Pop(${popped})`, 'Success', 0);
  };

  const peekOperation = async () => {
    if (elements.length === 0) {
      setStatus({ type: 'error', message: 'The stack is empty. Nothing to peek.' });
      setSteps([
        { step: 1, description: 'Check whether the stack is empty.' },
        { step: 2, description: 'Stack is empty, so there is nothing to peek.' },
      ]);
      return;
    }
    setSteps([
      { step: 1, description: 'Check whether the stack is empty.' },
      { step: 2, description: 'Return the value at TOP.' },
    ]);
    setElements(prev => {
      const next = setAllStates(prev, 'default');
      next[next.length - 1].state = 'peeking';
      return next;
    });
    const top = elements[elements.length - 1]?.value;
    await sleep(600);
    setElements(prev => setAllStates(prev, 'default'));
    setStatus({ type: 'success', message: `Top of stack is ${top}.` });
    setSteps([
      { step: 1, description: `Peek returned ${top}.` },
      { step: 2, description: 'The stack is unchanged.' },
    ]);
    if (isAuthenticated) await recordActivity('Stack', 'Operation', `Peek(${top})`, 'Success', 0);
  };

  const handleOperation = async (op: Operation) => {
    if (animating) return;
    setAnimating(true);
    setOperation(op);
    setSteps([]);
    const trimmed = input.trim();
    if (op === 'push') {
      const value = parseInt(trimmed, 10);
      if (isNaN(value)) {
        setStatus({ type: 'error', message: 'Please enter a valid value.' });
        setSteps([{ step: 1, description: 'Input value is not a valid number.' }]);
        setAnimating(false);
        return;
      }
      await pushAnimation(value);
    } else if (op === 'pop') {
      await popAnimation();
    } else if (op === 'peek') {
      await peekOperation();
    }
    if (op) {
      completedOpsRef.current.add(op);
      const totalOps = 3;
      const count = completedOpsRef.current.size;
      const pct = Math.round((count / totalOps) * 100);
      saveProgress('Stack', 'Stack Operations', {
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
    setSteps([]);
    setStatus({ type: 'info', message: 'Stack cleared.' });
    if (isAuthenticated) recordActivity('Stack', 'Operation', 'Clear', 'Success', 0);
  };

  const currentOp = operation ? opDescriptions[operation] : null;

  return (
    <TopicLayout
      theory={
        <>
          <div className="topic-info-header">
            <h1>Stack</h1>
            <p className="topic-tagline">LIFO — Last In, First Out. Like a stack of plates: add to top, remove from top.</p>
          </div>

          <div className="op-selector-group">
            {(['push', 'pop', 'peek'] as const).map(op => (
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
              <div className="complexity-item"><span className="label">Push</span><span className="value">O(1)</span></div>
              <div className="complexity-item"><span className="label">Pop</span><span className="value">O(1)</span></div>
              <div className="complexity-item"><span className="label">Peek</span><span className="value">O(1)</span></div>
              <div className="complexity-item"><span className="label">Search</span><span className="value">O(n)</span></div>
            </div>
          </div>
        </>
      }
      visualization={
        <>
          <ControlPanel>
            <label>Max Size</label>
            <select value={maxSize} onChange={e => setMaxSize(parseInt(e.target.value, 10))} disabled={animating || elements.length > 0}>
              {[5, 6, 7, 8, 10].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <input
              type="number"
              placeholder="Enter value"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleOperation('push'); }}
              disabled={animating}
            />
            <Button variant="primary" onClick={() => handleOperation('push')} disabled={animating}>Push</Button>
            <Button variant="danger" onClick={() => handleOperation('pop')} disabled={animating}>Pop</Button>
            <Button variant="success" onClick={() => handleOperation('peek')} disabled={animating}>Peek</Button>
            <Button variant="secondary" onClick={handleClear} disabled={animating}>Clear</Button>
          </ControlPanel>

          <AnimationArea>
            <div className="stack-visual">
              <div className={`stack-labels ${elements.length === 0 ? 'empty' : ''}`}>
                <span className="stack-label top">TOP</span>
                <span className="stack-label size">Size: {elements.length}/{maxSize}</span>
              </div>
              <div className={`stack-container ${elements.length === 0 ? 'empty' : ''}`}>
                {[...elements].reverse().map((item, idx) => (
                  <div
                    key={`${elements.length - idx}-${item.value}`}
                    className={`stack-cell cell-${item.state} ${idx === 0 ? 'is-top' : ''}`}
                  >
                    {item.value}
                  </div>
                ))}
                {elements.length === 0 && (
                  <div className="stack-empty-msg">Empty Stack</div>
                )}
              </div>
              <div className="stack-base"></div>
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
