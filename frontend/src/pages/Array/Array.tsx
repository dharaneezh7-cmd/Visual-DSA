import { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { TopicLayout } from '../../components/Layout/TopicLayout';
import { ControlPanel, AnimationArea, StatusMessage } from '../../components/Visualization/VisualizationComponents';
import Button from '../../components/Common/Button';
import './array.css';

type Operation = 'create' | 'traverse' | 'insert' | 'delete' | 'update' | 'search' | null;

interface ArrItem {
  value: number;
  state: 'default' | 'highlight' | 'inserting' | 'deleting' | 'found' | 'traversing';
}

const opDescriptions: Record<string, { title: string; desc: string; complexity: string; steps: string[]; pseudocode: string }> = {
  create: {
    title: 'Create',
    desc: 'Initializes an array with a fixed set of values at contiguous memory locations.',
    complexity: 'O(n)',
    steps: ['Decide the number of elements', 'Allocate contiguous memory', 'Place values at indexes 0 to n-1'],
    pseudocode: `function createArray(elements):
    arr = allocateMemory(elements.length)
    for i from 0 to elements.length - 1:
        arr[i] = elements[i]
    return arr`,
  },
  traverse: {
    title: 'Traverse',
    desc: 'Visits each element one by one from index 0 to the last. Used for reading or processing all elements.',
    complexity: 'O(n)',
    steps: ['Start at index 0', 'Visit the current element', 'Move to the next index', 'Stop after the last element'],
    pseudocode: `function traverse(arr):
    n = length(arr)
    index = 0

    while index < n:
        currentValue = arr[index]
        process(currentValue)
        index = index + 1

    print("Traversal complete.")`,
  },
  insert: {
    title: 'Insert',
    desc: 'Places a new element at a chosen index. All elements from that index onward shift right to make room.',
    complexity: 'O(n)',
    steps: ['Check that the array is not full', 'Shift elements from target index right by one', 'Place the new value', 'Increase the array size'],
    pseudocode: `function insert(arr, index, value):
    if isFull(arr) or index < 0 or index > arr.length:
        return error
    for i from arr.length - 1 down to index:
        arr[i + 1] = arr[i]   // shift right
    arr[index] = value
    arr.length = arr.length + 1`,
  },
  delete: {
    title: 'Delete',
    desc: 'Removes the element at a chosen index. All following elements shift left to close the gap.',
    complexity: 'O(n)',
    steps: ['Check that the array is not empty', 'Remove the element at the target index', 'Shift all following elements left', 'Decrease the array size'],
    pseudocode: `function delete(arr, index):
    if isEmpty(arr) or index < 0 or index >= arr.length:
        return error
    removed = arr[index]
    for i from index to arr.length - 2:
        arr[i] = arr[i + 1]   // shift left
    arr.length = arr.length - 1
    return removed`,
  },
  update: {
    title: 'Update',
    desc: 'Replaces the value at a chosen index with a new value. Direct random access — no shifting needed.',
    complexity: 'O(1)',
    steps: ['Go to the target index directly', 'Replace the old value with the new one'],
    pseudocode: `function update(arr, index, newValue):
    if index < 0 or index >= arr.length:
        return error
    arr[index] = newValue   // direct constant-time access`,
  },
  search: {
    title: 'Search',
    desc: 'Checks each element one by one until the target is found or the end is reached (linear search).',
    complexity: 'O(n)',
    steps: ['Start at index 0', 'Compare the current element with target', 'If equal, return index', 'Otherwise move to next index', 'If end reached, not present'],
    pseudocode: `function linearSearch(arr, target):
    for i from 0 to arr.length - 1:
        if arr[i] == target:
            return i    // target found at index i
    return -1           // not found in array`,
  },
};

export default function Array() {
  const { isAuthenticated } = useAuth();
  const { recordActivity, saveProgress } = useProgress();
  const [operation, setOperation] = useState<Operation>(null);
  const completedOpsRef = useRef<Set<string>>(new Set());
  const [elements, setElements] = useState<ArrItem[]>([
    { value: 10, state: 'default' }, { value: 20, state: 'default' }, { value: 30, state: 'default' }, { value: 40, state: 'default' }, { value: 50, state: 'default' },
  ]);
  const [valueInput, setValueInput] = useState('');
  const [indexInput, setIndexInput] = useState('');
  const [valsState, setValsState] = useState('10,20,30,40,50');
  const [status, setStatus] = useState<{ type: 'info' | 'success' | 'error'; message: string }>({ type: 'info', message: 'Select an operation to start learning.' });
  const [steps, setSteps] = useState<{ step: number; description: string; highlight?: string }[]>([]);
  const [animating, setAnimating] = useState(false);
  const [resultIndex, setResultIndex] = useState<number | null>(null);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const setAll = (state: ArrItem['state']) => setElements(prev => prev.map(e => ({ ...e, state })));

  const create = async () => {
    const values = valsState.split(',').map(s => s.trim()).filter(s => s.length > 0).map(Number);
    if (values.length === 0 || values.some(isNaN)) {
      setStatus({ type: 'error', message: 'Please enter comma-separated numbers.' });
      return;
    }
    setElements(values.map(v => ({ value: v, state: 'default' })));
    setResultIndex(null);
    setStatus({ type: 'success', message: `Created array with ${values.length} elements.` });
    setSteps([{ step: 1, description: `Placed ${values.length} values into the array.` }]);
    if (isAuthenticated) await recordActivity('Array', 'Operation', 'Create', 'Success', 0);
  };

  const traverse = async () => {
    if (elements.length === 0) {
      setStatus({ type: 'error', message: 'Array is empty. Create an array first.' });
      return;
    }
    setAll('default');
    setSteps([{ step: 1, description: 'Traversing all elements from index 0...' }]);
    for (let i = 0; i < elements.length; i++) {
      setElements(prev => {
        const next: ArrItem[] = prev.map((e, idx) => ({ ...e, state: idx === i ? 'traversing' : e.state === 'traversing' ? 'default' : e.state }));
        return next;
      });
      await sleep(400);
    }
    setAll('default');
    setStatus({ type: 'success', message: `Traversed ${elements.length} elements.` });
    setSteps([{ step: 1, description: `Visited all ${elements.length} elements in order.` }]);
    if (isAuthenticated) await recordActivity('Array', 'Operation', 'Traverse', 'Success', 0);
  };

  const insert = async () => {
    const value = parseInt(valueInput, 10);
    const index = parseInt(indexInput, 10);
    if (isNaN(value)) {
      setStatus({ type: 'error', message: 'Please enter a valid value.' });
      return;
    }
    if (isNaN(index) || index < 0 || index > elements.length) {
      setStatus({ type: 'error', message: `Invalid position. Enter an index between 0 and ${elements.length}.` });
      return;
    }
    setSteps([
      { step: 1, description: 'Check that there is space to insert.' },
      { step: 2, description: `Shifting elements from index ${index} to the right...` },
    ]);
    await sleep(400);
    setElements(prev => [...prev.slice(0, index), { value, state: 'inserting' as const }, ...prev.slice(index).map(e => ({ ...e, state: 'default' as const })) ]);
    setResultIndex(index);
    await sleep(500);
    setElements(prev => prev.map(e => ({ ...e, state: 'default' })));
    setStatus({ type: 'success', message: `Inserted ${value} at index ${index}.` });
    setSteps([{ step: 1, description: `Inserted ${value} at index ${index}.` }, { step: 2, description: 'Elements after the index shifted right by one.' }]);
    if (isAuthenticated) await recordActivity('Array', 'Operation', `Insert(${value}@${index})`, 'Success', 0);
  };

  const del = async () => {
    const index = parseInt(indexInput, 10);
    if (isNaN(index) || index < 0 || index >= elements.length) {
      setStatus({ type: 'error', message: `Invalid position. Enter an index between 0 and ${elements.length - 1}.` });
      return;
    }
    const removed = elements[index].value;
    setSteps([
      { step: 1, description: `Removing ${removed} at index ${index}...` },
      { step: 2, description: 'Shifting elements left by one to close the gap.' },
    ]);
    setElements(prev => prev.map((e, i) => ({ ...e, state: i === index ? 'deleting' : 'default' })));
    await sleep(400);
    setElements(prev => prev.filter((_, i) => i !== index));
    setResultIndex(index);
    await sleep(200);
    setStatus({ type: 'success', message: `Deleted ${removed} from index ${index}.` });
    setSteps([{ step: 1, description: `Deleted ${removed}. Elements shifted left.` }]);
    if (isAuthenticated) await recordActivity('Array', 'Operation', `Delete(${removed}@${index})`, 'Success', 0);
  };

  const update = async () => {
    const value = parseInt(valueInput, 10);
    const index = parseInt(indexInput, 10);
    if (isNaN(value)) {
      setStatus({ type: 'error', message: 'Please enter a valid value.' });
      return;
    }
    if (isNaN(index) || index < 0 || index >= elements.length) {
      setStatus({ type: 'error', message: `Invalid position. Enter an index between 0 and ${elements.length - 1}.` });
      return;
    }
    const oldValue = elements[index].value;
    setElements(prev => prev.map((e, i) => ({ ...e, state: i === index ? 'highlight' : 'default' })));
    setSteps([{ step: 1, description: `Updating index ${index} from ${oldValue} to ${value}.` }]);
    await sleep(400);
    setElements(prev => prev.map((e, i) => i === index ? { value, state: 'highlight' } : { ...e, state: 'default' }));
    await sleep(400);
    setElements(prev => prev.map((e) => ({ ...e, state: 'default' })));
    setStatus({ type: 'success', message: `Updated index ${index} to ${value}.` });
    setSteps([{ step: 1, description: `Index ${index} now contains ${value}.` }]);
    if (isAuthenticated) await recordActivity('Array', 'Operation', `Update(${value}@${index})`, 'Success', 0);
  };

  const search = async () => {
    const target = parseInt(valueInput, 10);
    if (isNaN(target)) {
      setStatus({ type: 'error', message: 'Please enter a valid value to search.' });
      return;
    }
    setAll('default');
    setSteps([]);
    let comparisons = 0;
    for (let i = 0; i < elements.length; i++) {
      comparisons++;
      setElements(prev => prev.map((e, idx) => ({ ...e, state: idx === i ? 'traversing' : 'default' })));
      setSteps([{ step: comparisons, description: `Comparing index ${i}: ${elements[i].value} vs target ${target}.`, highlight: elements[i].value === target ? 'Match!' : elements[i].value > target ? 'Greater' : 'Smaller' }]);
      await sleep(400);
      if (elements[i].value === target) {
        setElements(prev => prev.map((e, idx) => ({ ...e, state: idx === i ? 'found' : 'default' })));
        setResultIndex(i);
        setStatus({ type: 'success', message: `Found ${target} at index ${i} after ${comparisons} comparison(s).` });
        setSteps(prev => [...prev, { step: comparisons + 1, description: `Target found at index ${i}.` }]);
        if (isAuthenticated) await recordActivity('Array', 'Operation', `Search(${target})`, 'Found', 0);
        return;
      }
    }
    setResultIndex(-1);
    setStatus({ type: 'error', message: `${target} not found after ${comparisons} comparison(s).` });
    setSteps(prev => [...prev, { step: comparisons + 1, description: `Element ${target} is not present in the array.` }]);
    if (isAuthenticated) await recordActivity('Array', 'Operation', `Search(${target})`, 'Not found', 0);
  };

  const clear = () => {
    if (animating) return;
    setElements([]);
    setResultIndex(null);
    setSteps([]);
    setStatus({ type: 'info', message: 'Array cleared. Create a new one.' });
    if (isAuthenticated) recordActivity('Array', 'Operation', 'Clear', 'Success', 0);
  };

  const handleOperation = async (op: Operation) => {
    if (animating) return;
    setAnimating(true);
    setOperation(op);
    setSteps([]);
    setResultIndex(null);
    if (op) {
      await ({
        create, traverse, insert, delete: del, update, search,
      }[op] as () => Promise<void>)();

      completedOpsRef.current.add(op);
      const totalOps = 6;
      const count = completedOpsRef.current.size;
      const pct = Math.round((count / totalOps) * 100);
      saveProgress('Array', 'Array Operations', {
        completed: count >= 4,
        completionPercentage: pct,
        timeSpent: 60,
        operationsPerformed: count,
      });
    }
    setAnimating(false);
  };

  const getOperationLabel = (op: Operation) => {
    const labels: Record<string, string> = { create: 'Create', traverse: 'Traverse', insert: 'Insert', delete: 'Delete', update: 'Update', search: 'Search' };
    return op ? labels[op] : '';
  };

  const currentOp = operation ? opDescriptions[operation] : null;

  return (
    <TopicLayout
      theory={
        <>
          <div className="topic-info-header">
            <h1>Array</h1>
            <p className="topic-tagline">Contiguous memory storage with direct index access. Random access in O(1).</p>
          </div>

          <div className="op-selector-group">
            {(['create', 'traverse', 'insert', 'delete', 'update', 'search'] as const).map(op => (
              <button
                key={op}
                className={`op-select-btn ${operation === op ? 'active' : ''}`}
                onClick={() => { setOperation(op); setStatus({ type: 'info', message: `Select ${op} and use the controls to visualize.` }); }}
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
              <div className="complexity-item"><span className="label">Access</span><span className="value">O(1)</span></div>
              <div className="complexity-item"><span className="label">Search</span><span className="value">O(n)</span></div>
              <div className="complexity-item"><span className="label">Insert</span><span className="value">O(n)</span></div>
              <div className="complexity-item"><span className="label">Delete</span><span className="value">O(n)</span></div>
            </div>
          </div>
          
        </>
      }
      visualization={
        <>
          <ControlPanel>
            {operation === 'create' ? (
              <>
                <input
                  className="array-val-input"
                  placeholder="e.g. 10,20,30,40"
                  value={valsState}
                  onChange={e => setValsState(e.target.value)}
                  disabled={animating}
                />
                <Button variant="primary" onClick={() => handleOperation('create')} disabled={animating}>Create</Button>
              </>
            ) : (
              <>
                <input type="number" placeholder={operation === 'search' ? 'Search value' : 'Value'} value={valueInput} onChange={e => setValueInput(e.target.value)} disabled={animating} />
                {(operation === 'insert' || operation === 'delete' || operation === 'update') && (
                  <input type="number" placeholder="Index" value={indexInput} onChange={e => setIndexInput(e.target.value)} disabled={animating} />
                )}
                <Button variant="primary" onClick={() => handleOperation(operation)} disabled={animating}>
                  {operation === 'delete' ? 'Delete' : getOperationLabel(operation)}
                </Button>
                <Button variant="secondary" onClick={clear} disabled={animating}>Clear</Button>
              </>
            )}
          </ControlPanel>

          <AnimationArea>
            <div className="array-visual">
              <div className="array-indices">
                {elements.map((_, i) => (
                  <div key={i} className="array-index">{i}</div>
                ))}
                {elements.length === 0 && <div className="array-index">-</div>}
              </div>
              <div className="array-cells">
                {elements.map((e, i) => (
                  <div key={i} className={`array-cell cell-${e.state}`}>{e.value}</div>
                ))}
                {elements.length === 0 && <div className="array-empty">Empty — select Create</div>}
              </div>
              <div className="array-addresses">
                {elements.map((_, i) => (
                  <div key={i} className="array-address">idx {i}</div>
                ))}
              </div>
            </div>
          </AnimationArea>

          {resultIndex !== null && resultIndex >= 0 && operation === 'search' && (
            <StatusMessage type="success" message={`Target is at index ${resultIndex}.`} />
          )}

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
      photo={
        <>
        
        </>
      }      
    />
  );
}
