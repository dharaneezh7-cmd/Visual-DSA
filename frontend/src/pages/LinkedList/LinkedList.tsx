import { useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { TopicLayout } from '../../components/Layout/TopicLayout';
import { ControlPanel, AnimationArea, StatusMessage } from '../../components/Visualization/VisualizationComponents';
import Button from '../../components/Common/Button';
import './linkedlist.css';

type Operation = 'insertBegin' | 'insertEnd' | 'insertPos' | 'deleteBegin' | 'deleteEnd' | 'deletePos' | 'search' | 'traverse' | null;

interface LNode {
  id: number;
  value: number;
  state: 'default' | 'highlight' | 'inserting' | 'deleting' | 'found' | 'traversing' | 'new';
  nextId: number | null;
}

const opDescriptions: Record<string, { title: string; desc: string; complexity: string; steps: string[]; pseudocode?: string }> = {
  insertBegin: {
    title: 'Insert at Beginning',
    desc: 'New node goes BEFORE the head. Point its NEXT at the old head, then make it the new HEAD.',
    complexity: 'O(1)',
    steps: ['Create the new node', "Point new node's NEXT at current HEAD", 'Set HEAD to the new node'],
    pseudocode: `function insertAtBeginning(head, value):
  newNode = Node(value)
  newNode.next = head
  head = newNode
  return head`,
  },
  insertEnd: {
    title: 'Insert at End',
    desc: 'New node attaches after the LAST node. We traverse to the tail, then link it.',
    complexity: 'O(n)',
    steps: ['Create the new node', 'Traverse to the last node', "Point last node's NEXT at the new node", "Set new node's NEXT to NULL"],
    pseudocode: `function insertAtEnd(head, value):
  newNode = Node(value)
  if head == null:
    return newNode
  
  curr = head
  while curr.next != null:
    curr = curr.next
  
  curr.next = newNode
  return head`,
  },
  insertPos: {
    title: 'Insert at Position',
    desc: 'New node is inserted at a position. Find the node before it, then rewire the NEXT pointers.',
    complexity: 'O(n)',
    steps: ['Create the new node', 'Traverse to the node before the position', "Point the new node's NEXT at the node at that position", "Point the previous node's NEXT at the new node"],
    pseudocode: `function insertAtPosition(head, value, pos):
  if pos == 0:
    return insertAtBeginning(head, value)
  
  newNode = Node(value)
  curr = head
  for i from 0 to pos - 2:
    if curr == null:
      raise Error("Position out of bounds")
    curr = curr.next
  
  newNode.next = curr.next
  curr.next = newNode
  return head`,
  },
  deleteBegin: {
    title: 'Delete at Beginning',
    desc: 'Remove the HEAD node and move HEAD to the next node. Constant time.',
    complexity: 'O(1)',
    steps: ['Check the list is not empty', 'Store the current HEAD', 'Move HEAD to HEAD.NEXT', 'Remove the old head'],
    pseudocode: `function deleteAtBeginning(head):
  if head == null:
    raise UnderflowError("List is empty")
  
  head = head.next
  return head`,
  },
  deleteEnd: {
    title: 'Delete at End',
    desc: "Remove the last node. The second-to-last node's NEXT becomes NULL. Requires traversal.",
    complexity: 'O(n)',
    steps: ['Check the list is not empty', 'Traverse to the second-to-last node', "Set its NEXT to NULL", 'Remove the last node'],
    pseudocode: `function deleteAtEnd(head):
  if head == null:
    raise UnderflowError("List is empty")
  if head.next == null:
    return null
  
  curr = head
  while curr.next.next != null:
    curr = curr.next
  
  curr.next = null
  return head`,
  },
  deletePos: {
    title: 'Delete at Position',
    desc: 'Remove the node at a position. The node before it skips the removed node.',
    complexity: 'O(n)',
    steps: ['Check the list is not empty', 'Traverse to the node before the target', 'Update its NEXT to skip the target node', 'Remove the target node'],
    pseudocode: `function deleteAtPosition(head, pos):
  if head == null:
    raise UnderflowError("List is empty")
  if pos == 0:
    return head.next
  
  curr = head
  for i from 0 to pos - 2:
    if curr == null or curr.next == null:
      raise Error("Position out of bounds")
    curr = curr.next
  
  curr.next = curr.next.next
  return head`,
  },
  search: {
    title: 'Search',
    desc: 'Walks the list node by node comparing each value with the target. First match returns its position.',
    complexity: 'O(n)',
    steps: ['Start at HEAD', 'Compare current node value with target', 'If equal, found. Else move to NEXT', 'If NEXT is NULL, not present'],
    pseudocode: `function search(head, target):
  curr = head
  index = 0
  while curr != null:
    if curr.value == target:
      return index // Found
    curr = curr.next
    index = index + 1
  
  return -1 // Not found`,
  },
  traverse: {
    title: 'Traverse',
    desc: 'Starts at HEAD and follows each next pointer until NULL, visiting every node.',
    complexity: 'O(n)',
    steps: ['Start at HEAD', 'Visit the current node', 'Move to NEXT', 'Stop when NEXT is NULL'],
    pseudocode: `function traverse(head):
  curr = head
  while curr != null:
    process(curr.value)
    curr = curr.next`,
  },
};

export default function LinkedList() {
  const { isAuthenticated } = useAuth();
  const { recordActivity, saveProgress } = useProgress();
  const [operation, setOperation] = useState<Operation>(null);
  const completedOpsRef = useRef<Set<string>>(new Set());
  const [nodes, setNodes] = useState<LNode[]>([]);
  const [headId, setHeadId] = useState<number | null>(null);
  const [valueInput, setValueInput] = useState('');
  const [posInput, setPosInput] = useState('');
  const [status, setStatus] = useState<{ type: 'info' | 'success' | 'error'; message: string }>({ type: 'info', message: 'Create nodes by inserting. Watch how the next pointers connect.' });
  const [steps, setSteps] = useState<{ step: number; description: string; highlight?: string }[]>([]);
  const [animating, setAnimating] = useState(false);
  const nextIdRef = useRef(1);
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const orderedNodes = () => {
    const order: LNode[] = [];
    let cur = headId;
    while (cur !== null) {
      const node = nodes.find(n => n.id === cur);
      if (!node) break;
      order.push(node);
      cur = node.nextId;
      if (order.length > nodes.length) break;
    }
    return order;
  };

  const setStates = (order: LNode[], mapper: (n: LNode, idx: number) => LNode) => {
    const idToState = new Map<number, LNode['state']>();
    order.forEach((n, i) => idToState.set(n.id, mapper(n, i).state));
    setNodes(prev => prev.map(n => ({ ...n, state: idToState.get(n.id) ?? 'default' })));
  };

  const insertBeginning = async (value: number) => {
    const newNode: LNode = { id: nextIdRef.current++, value, state: 'inserting', nextId: null };
    setNodes(prev => [...prev, { ...newNode, state: 'new' }]);
    setSteps([{ step: 1, description: `Create new node with value ${value}.` }]);
    await sleep(400);
    if (headId !== null) {
      setNodes(prev => prev.map(n => n.id === newNode.id ? { ...n, state: 'highlight' } : n));
      setSteps([{ step: 1, description: 'Create the new node.' }, { step: 2, description: "Set new node's NEXT to current HEAD." }]);
      await sleep(400);
    }
    setHeadId(newNode.id);
    setNodes(prev => prev.map(n => n.id === newNode.id ? { ...newNode, nextId: headId, state: 'default' } : { ...n, state: 'default' }));
    setStatus({ type: 'success', message: `Inserted ${value} at the beginning. New HEAD.` });
    setSteps([{ step: 1, description: `Inserted ${value} at the beginning.` }, { step: 2, description: 'HEAD now points to the new node.' }]);
    if (isAuthenticated) await recordActivity('LinkedList', 'Operation', `InsertBegin(${value})`, 'Success', 0);
  };

  const insertEnd = async (value: number) => {
    const newNode: LNode = { id: nextIdRef.current++, value, state: 'inserting', nextId: null };
    const order = orderedNodes();
    if (order.length === 0) {
      setNodes(prev => [...prev, newNode]);
      setHeadId(newNode.id);
      setStatus({ type: 'success', message: `Inserted ${value}. This is the only node.` });
      if (isAuthenticated) await recordActivity('LinkedList', 'Operation', `InsertEnd(${value})`, 'Success', 0);
      return;
    }
    setNodes(prev => [...prev, newNode]);
    setSteps([{ step: 1, description: `Create new node with value ${value}.` }, { step: 2, description: 'Traverse to the last node...' }]);
    for (let i = 0; i < order.length; i++) {
      setStates(orderedNodes(), (n, idx) => ({ ...n, state: idx === i ? 'traversing' : n.state === 'traversing' ? 'default' : n.state } as LNode));
      await sleep(350);
    }
    const lastId = order[order.length - 1].id;
    setNodes(prev => prev.map(n => n.id === lastId ? { ...n, nextId: newNode.id, state: 'highlight' } : n.id === newNode.id ? { ...newNode, state: 'new' } : { ...n, state: 'default' }));
    await sleep(400);
    setNodes(prev => prev.map(n => ({ ...n, state: 'default' })));
    setStatus({ type: 'success', message: `Inserted ${value} at the end.` });
    setSteps([{ step: 1, description: `Last node's NEXT now points to the new node ${value}.` }]);
    if (isAuthenticated) await recordActivity('LinkedList', 'Operation', `InsertEnd(${value})`, 'Success', 0);
  };

  const insertPosition = async (value: number, pos: number) => {
    const order = orderedNodes();
    if (pos < 0 || pos > order.length) {
      setStatus({ type: 'error', message: `Invalid position. Enter a position between 0 and ${order.length}.` });
      return;
    }
    if (pos === 0) { await insertBeginning(value); return; }
    if (pos === order.length) { await insertEnd(value); return; }
    const newNode: LNode = { id: nextIdRef.current++, value, state: 'inserting', nextId: null };
    setNodes(prev => [...prev, newNode]);
    setSteps([{ step: 1, description: `Create new node with value ${value}.` }, { step: 2, description: 'Traverse to the node before the position...' }]);
    for (let i = 0; i <= pos - 1; i++) {
      setStates(orderedNodes(), (n, idx) => ({ ...n, state: idx === i ? 'traversing' : 'default' } as LNode));
      await sleep(350);
    }
    const prevNode = order[pos - 1];
    const nextNode = order[pos];
    setNodes(prev => prev.map(n => {
      if (n.id === prevNode.id) return { ...n, nextId: newNode.id, state: 'highlight' };
      if (n.id === newNode.id) return { ...newNode, nextId: nextNode ? nextNode.id : null, state: 'new' };
      if (n.id === nextNode?.id) return { ...n, state: 'highlight' };
      return { ...n, state: 'default' };
    }));
    await sleep(500);
    setNodes(prev => prev.map(n => ({ ...n, state: 'default' })));
    setStatus({ type: 'success', message: `Inserted ${value} at position ${pos}.` });
    setSteps([{ step: 1, description: `Previous node's NEXT now points to ${value}.` }, { step: 2, description: `${value}'s NEXT points to the following node.` }]);
    if (isAuthenticated) await recordActivity('LinkedList', 'Operation', `InsertPos(${value}@${pos})`, 'Success', 0);
  };

  const deleteBeginning = async () => {
    const order = orderedNodes();
    if (order.length === 0) {
      setStatus({ type: 'error', message: 'List is empty. Nothing to delete.' });
      return;
    }
    const removed = order[0];
    setStates(order, (n, idx) => ({ ...n, state: idx === 0 ? 'deleting' : 'default' } as LNode));
    setSteps([{ step: 1, description: `Removing HEAD node ${removed.value}...` }]);
    await sleep(400);
    setHeadId(removed.nextId);
    setNodes(prev => prev.filter(n => n.id !== removed.id));
    setStatus({ type: 'success', message: `Deleted ${removed.value} from the beginning.` });
    setSteps([{ step: 1, description: `HEAD moved to the next node.` }]);
    if (isAuthenticated) await recordActivity('LinkedList', 'Operation', `DeleteBegin(${removed.value})`, 'Success', 0);
  };

  const deleteEnd = async () => {
    const order = orderedNodes();
    if (order.length === 0) {
      setStatus({ type: 'error', message: 'List is empty. Nothing to delete.' });
      return;
    }
    if (order.length === 1) {
      const removed = order[0];
      setStates(order, () => ({ ...removed, state: 'deleting' } as LNode));
      await sleep(400);
      setHeadId(null);
      setNodes([]);
      setStatus({ type: 'success', message: `Deleted ${removed.value}. List is now empty.` });
      if (isAuthenticated) await recordActivity('LinkedList', 'Operation', `DeleteEnd(${removed.value})`, 'Success', 0);
      return;
    }
    const removed = order[order.length - 1];
    const newLast = order[order.length - 2];
    setSteps([{ step: 1, description: 'Traverse to the second-to-last node...' }]);
    for (let i = 0; i < order.length - 1; i++) {
      setStates(orderedNodes(), (n, idx) => ({ ...n, state: idx === i ? 'traversing' : 'default' } as LNode));
      await sleep(300);
    }
    setStates(orderedNodes(), (n) => ({ ...n, state: n.id === removed.id ? 'deleting' : n.id === newLast.id ? 'highlight' : 'default' } as LNode));
    await sleep(500);
    setNodes(prev => prev.map(n => n.id === newLast.id ? { ...n, nextId: null } : n.id === removed.id ? n : n));
    setNodes(prev => prev.filter(n => n.id !== removed.id));
    setStatus({ type: 'success', message: `Deleted ${removed.value} from the end.` });
    setSteps([{ step: 1, description: `New last node's NEXT set to NULL.` }]);
    if (isAuthenticated) await recordActivity('LinkedList', 'Operation', `DeleteEnd(${removed.value})`, 'Success', 0);
  };

  const deletePosition = async (pos: number) => {
    const order = orderedNodes();
    if (order.length === 0) {
      setStatus({ type: 'error', message: 'List is empty. Nothing to delete.' });
      return;
    }
    if (pos < 0 || pos >= order.length) {
      setStatus({ type: 'error', message: `Invalid position. Enter a position between 0 and ${order.length - 1}.` });
      return;
    }
    if (pos === 0) { await deleteBeginning(); return; }
    if (pos === order.length - 1) { await deleteEnd(); return; }
    const prevNode = order[pos - 1];
    const removed = order[pos];
    const nextNode = order[pos + 1];
    setSteps([{ step: 1, description: 'Traverse to the node before the target...' }]);
    for (let i = 0; i <= pos - 1; i++) {
      setStates(orderedNodes(), (n, idx) => ({ ...n, state: idx === i ? 'traversing' : 'default' } as LNode));
      await sleep(300);
    }
    setStates(orderedNodes(), (n) => ({ ...n, state: n.id === prevNode.id ? 'highlight' : n.id === removed.id ? 'deleting' : 'default' } as LNode));
    await sleep(500);
    setNodes(prev => prev.map(n => n.id === prevNode.id ? { ...n, nextId: nextNode ? nextNode.id : null } : n));
    await sleep(200);
    setNodes(prev => prev.filter(n => n.id !== removed.id));
    setStatus({ type: 'success', message: `Deleted ${removed.value} from position ${pos}.` });
    setSteps([{ step: 1, description: `Previous node's NEXT skipped ${removed.value}.` }]);
    if (isAuthenticated) await recordActivity('LinkedList', 'Operation', `DeletePos(${removed.value}@${pos})`, 'Success', 0);
  };

  const search = async () => {
    const target = parseInt(valueInput, 10);
    if (isNaN(target)) {
      setStatus({ type: 'error', message: 'Please enter a valid value to search.' });
      return;
    }
    const order = orderedNodes();
    if (order.length === 0) {
      setStatus({ type: 'error', message: 'List is empty. Insert nodes first.' });
      return;
    }
    let foundIdx = -1;
    for (let i = 0; i < order.length; i++) {
      setStates(order, (n, idx) => ({ ...n, state: idx === i ? 'traversing' : 'default' } as LNode));
      setSteps([{ step: i + 1, description: `Comparing node ${i + 1}: ${order[i].value} vs target ${target}.`, highlight: order[i].value === target ? 'Match!' : 'Mismatch' }]);
      await sleep(400);
      if (order[i].value === target) {
        foundIdx = i;
        break;
      }
    }
    if (foundIdx >= 0) {
      setStates(order, (n, idx) => ({ ...n, state: idx === foundIdx ? 'found' : 'default' } as LNode));
      setStatus({ type: 'success', message: `Found ${target} at position ${foundIdx}.` });
      setSteps(prev => [...prev, { step: prev.length + 1, description: `Target found at position ${foundIdx}.` }]);
      if (isAuthenticated) await recordActivity('LinkedList', 'Operation', `Search(${target})`, 'Found', 0);
    } else {
      setStatus({ type: 'error', message: `${target} not found in the list.` });
      setSteps(prev => [...prev, { step: prev.length + 1, description: 'Reached NULL. Target is not present.' }]);
      if (isAuthenticated) await recordActivity('LinkedList', 'Operation', `Search(${target})`, 'Not found', 0);
    }
  };

  const traverse = async () => {
    const order = orderedNodes();
    if (order.length === 0) {
      setStatus({ type: 'error', message: 'List is empty. Insert nodes first.' });
      return;
    }
    for (let i = 0; i < order.length; i++) {
      setStates(order, (n, idx) => ({ ...n, state: idx === i ? 'traversing' : 'default' } as LNode));
      setSteps([{ step: i + 1, description: `Visiting node ${i + 1}: ${order[i].value}.` }]);
      await sleep(400);
    }
    setStates(order, () => ({ ...order[0], state: 'default' } as LNode));
    setStatus({ type: 'success', message: `Traversed ${order.length} node(s).` });
    setSteps([{ step: 1, description: `Visited all ${order.length} node(s) following the next pointers.` }]);
    if (isAuthenticated) await recordActivity('LinkedList', 'Operation', 'Traverse', 'Success', 0);
  };

  const clear = () => {
    if (animating) return;
    setNodes([]);
    setHeadId(null);
    setSteps([]);
    setStatus({ type: 'info', message: 'List cleared.' });
    if (isAuthenticated) recordActivity('LinkedList', 'Operation', 'Clear', 'Success', 0);
  };

  const handleOperation = async (op: Operation) => {
    if (animating) return;
    setAnimating(true);
    setOperation(op);
    setSteps([]);
    const value = parseInt(valueInput, 10);
    const pos = parseInt(posInput || '0', 10);
    switch (op) {
      case 'insertBegin':
        if (isNaN(value)) { setStatus({ type: 'error', message: 'Please enter a valid value.' }); break; }
        await insertBeginning(value);
        break;
      case 'insertEnd':
        if (isNaN(value)) { setStatus({ type: 'error', message: 'Please enter a valid value.' }); break; }
        await insertEnd(value);
        break;
      case 'insertPos':
        if (isNaN(value)) { setStatus({ type: 'error', message: 'Please enter a valid value.' }); break; }
        await insertPosition(value, pos);
        break;
      case 'deleteBegin': await deleteBeginning(); break;
      case 'deleteEnd': await deleteEnd(); break;
      case 'deletePos': await deletePosition(pos); break;
      case 'search': await search(); break;
      case 'traverse': await traverse(); break;
      default: break;
    }
    if (op) {
      completedOpsRef.current.add(op);
      const totalOps = 8;
      const count = completedOpsRef.current.size;
      const pct = Math.round((count / totalOps) * 100);
      saveProgress('LinkedList', 'LinkedList Operations', {
        completed: count >= 4,
        completionPercentage: pct,
        timeSpent: 60,
        operationsPerformed: count,
      });
    }
    setAnimating(false);
  };

  const currentOp = operation ? opDescriptions[operation] : null;
  const order = orderedNodes();

  return (
    <TopicLayout
      theory={
        <>
          <div className="topic-info-header">
            <h1>Linked List</h1>
            <p className="topic-tagline">Nodes connected by NEXT pointers. HEAD points to the first node, the last points to NULL.</p>
          </div>

          <div className="op-selector-group">
            {(['insertBegin', 'insertEnd', 'insertPos', 'deleteBegin', 'deleteEnd', 'deletePos', 'search', 'traverse'] as const).map(op => (
              <button
                key={op}
                className={`op-select-btn ${operation === op ? 'active' : ''}`}
                onClick={() => { setOperation(op); setStatus({ type: 'info', message: `Select operation. Watch the pointers update on the right.` }); }}
                disabled={animating}
              >
                {opDescriptions[op].title}
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
              <div className="complexity-item"><span className="label">Insert Begin</span><span className="value">O(1)</span></div>
              <div className="complexity-item"><span className="label">Insert End/Pos</span><span className="value">O(n)</span></div>
              <div className="complexity-item"><span className="label">Delete Begin</span><span className="value">O(1)</span></div>
              <div className="complexity-item"><span className="label">Search/Traverse</span><span className="value">O(n)</span></div>
            </div>
          </div>
        </>
      }
      visualization={
        <>
          <ControlPanel>
            <input type="number" placeholder="Value" value={valueInput} onChange={e => setValueInput(e.target.value)} disabled={animating} />
            {(operation === 'insertPos' || operation === 'deletePos') && (
              <input type="number" placeholder="Position" value={posInput} onChange={e => setPosInput(e.target.value)} disabled={animating} />
            )}
            {operation && operation.includes('insert') && (
              <Button variant="primary" onClick={() => handleOperation(operation)} disabled={animating}>
                {operation === 'insertPos' ? 'Insert at Position' : 'Insert'}
              </Button>
            )}
            {operation && operation.includes('delete') && (
              <Button variant="danger" onClick={() => handleOperation(operation)} disabled={animating}>Delete</Button>
            )}
            {operation === 'search' && <Button variant="success" onClick={() => handleOperation('search')} disabled={animating}>Search</Button>}
            {operation === 'traverse' && <Button variant="success" onClick={() => handleOperation('traverse')} disabled={animating}>Traverse</Button>}
            <Button variant="secondary" onClick={clear} disabled={animating}>Clear</Button>
          </ControlPanel>

          <AnimationArea>
            <div className="ll-visual">
              {order.length === 0 ? (
                <div className="ll-empty">
                  <span className="ll-head-label">HEAD</span>
                  <span className="ll-null">NULL (empty list)</span>
                </div>
              ) : (
                <>
                  <span className="ll-head-label">HEAD</span>
                  <div className="ll-nodes">
                    {order.map((n, idx) => (
                      <div key={n.id} className="ll-group">
                        <div className={`ll-node node-${n.state}`}>
                          <div className="ll-data">{n.value}</div>
                          <div className="ll-next">{n.nextId !== null ? 'NEXT' : 'NULL'}</div>
                        </div>
                        {idx < order.length - 1 ? (
                          <span className="ll-arrow">&rarr;</span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </>
              )}
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
