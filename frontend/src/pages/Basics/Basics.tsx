import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../../hooks/useProgress';
import './basics.css';

export default function Basics() {
  const { progress, saveProgress, recordActivity } = useProgress();
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Record reading activity
    recordActivity('Basics', 'Reading', 'Study Basics', 'Viewed', 120);
    // Mark progress if not already completed
    const existing = progress.find(p => p.topic === 'Basics');
    if (existing?.completed) {
      setCompleted(true);
    } else {
      saveProgress('Basics', 'DSA Fundamentals', {
        completed: true,
        completionPercentage: 100,
        timeSpent: 120,
        operationsPerformed: 1,
      });
      setCompleted(true);
    }
  }, []);

  const handleMarkComplete = () => {
    saveProgress('Basics', 'DSA Fundamentals', {
      completed: true,
      completionPercentage: 100,
      timeSpent: 180,
      operationsPerformed: 2,
    });
    setCompleted(true);
  };

  return (
    <div className="basics-page">
      <div className="basics-wrapper">
        <div className="basics-header-badge-row">
          <span className="basics-topic-badge">Foundation Module</span>
          {completed && <span className="basics-completed-pill">✓ Completed</span>}
        </div>
        <h1 className="basics-title">DSA Basics</h1>
        <p className="basics-intro">
          Data Structures and Algorithms (DSA) are the foundation of computer science. They decide
          how data is stored, how it is accessed, and how efficiently problems are solved.
        </p>

        <section className="basics-section">
          <h2>What is a Data Structure?</h2>
          <p>
            A <strong>data structure</strong> is a way of organizing and storing data so that it can
            be used efficiently. Different structures are good for different tasks.
          </p>
          <div className="basics-example">
            <p>Think of it like organizing items:</p>
            <ul>
              <li><strong>Stack of plates</strong> — push and pop from the top (Stack)</li>
              <li><strong>Queue at a ticket counter</strong> — first person served first (Queue)</li>
              <li><strong>Train with carriages</strong> — each carriage linked to the next (Linked List)</li>
            </ul>
          </div>
        </section>

        <section className="basics-section">
          <h2>What is an Algorithm?</h2>
          <p>
            An <strong>algorithm</strong> is a step-by-step set of instructions to solve a problem.
            For example, to sort a list, to search for an element, or to find the shortest path.
          </p>
          <div className="basics-example">
            <p>Example — algorithm to find the largest number in a list:</p>
            <ol>
              <li>Start with the first number as the largest.</li>
              <li>Compare each next number with the largest.</li>
              <li>If it is bigger, update the largest.</li>
              <li>When the list ends, the largest is the answer.</li>
            </ol>
          </div>
        </section>

        <section className="basics-section">
          <h2>Types of Data Structures</h2>
          <div className="ds-types">
            <div className="ds-type">
              <h3>Linear</h3>
              <p>Elements arranged in a sequence. Each element has a previous and next.</p>
              <ul>
                <li>Array</li>
                <li>Stack</li>
                <li>Queue</li>
                <li>Linked List</li>
              </ul>
            </div>
            <div className="ds-type">
              <h3>Non-Linear</h3>
              <p>Elements not in a sequence. A single element can connect to multiple others.</p>
              <ul>
                <li>Trees (Hierarchical)</li>
                <li>Graphs (Networked)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="basics-section">
          <h2>Asymptotic Notations (Time Complexity)</h2>
          <p>
            We measure algorithm efficiency using Big-O notation. It describes how running time or
            memory grows as the input size <em>n</em> increases.
          </p>
          <div className="complexity-table-wrapper">
            <table className="basics-table">
              <thead>
                <tr>
                  <th>Notation</th>
                  <th>Name</th>
                  <th>Example Operation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>O(1)</code></td>
                  <td>Constant</td>
                  <td>Array index access, Stack push/pop</td>
                </tr>
                <tr>
                  <td><code>O(log n)</code></td>
                  <td>Logarithmic</td>
                  <td>Binary search in sorted array</td>
                </tr>
                <tr>
                  <td><code>O(n)</code></td>
                  <td>Linear</td>
                  <td>Traversing an array, linear search</td>
                </tr>
                <tr>
                  <td><code>O(n log n)</code></td>
                  <td>Linearithmic</td>
                  <td>Merge sort, Quick sort (average)</td>
                </tr>
                <tr>
                  <td><code>O(n²)</code></td>
                  <td>Quadratic</td>
                  <td>Bubble sort, nested loops</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="basics-section">
          <h2>Recursion</h2>
          <p>
            A technique where a function calls itself to solve smaller instances of the same problem.
            Every recursive algorithm must have two essential parts: a base case to stop, plus a recursive step that moves toward the base case.
          </p>
          <div className="code-block">
            <pre>{`function factorial(n) {
  if (n <= 1) return 1;        // base case
  return n * factorial(n - 1); // recursive step
}`}</pre>
          </div>
          <div className="basics-example">
            <p>factorial(4) = 4 × factorial(3) = 4 × 3 × 2 × 1 = <strong>24</strong></p>
          </div>
        </section>

        <section className="basics-section">
          <h2>Why Learn DSA?</h2>
          <ul>
            <li>It is the backbone of coding interviews at top companies.</li>
            <li>It makes you write efficient code, not just working code.</li>
            <li>Every real application — search engines, maps, databases — uses DSA.</li>
            <li>It trains you to think logically and break problems into steps.</li>
          </ul>
        </section>

        <section className="basics-section">
          <h2>Learning Roadmap</h2>
          <div className="roadmap">
            <div className="roadmap-item"><span>01</span>DSA Basics</div>
            <div className="roadmap-arrow">&darr;</div>
            <div className="roadmap-item"><span>02</span>Arrays</div>
            <div className="roadmap-arrow">&darr;</div>
            <div className="roadmap-item"><span>03</span>Stack &amp; Queue</div>
            <div className="roadmap-arrow">&darr;</div>
            <div className="roadmap-item"><span>04</span>Linked List</div>
            <div className="roadmap-arrow">&darr;</div>
            <div className="roadmap-item"><span>05</span>Searching</div>
            <div className="roadmap-arrow">&darr;</div>
            <div className="roadmap-item"><span>06</span>Sorting</div>
            <div className="roadmap-arrow">&darr;</div>
            <div className="roadmap-item"><span>07</span>Practice</div>
          </div>
        </section>

        <div className="basics-completion-card">
          <div className="basics-completion-info">
            <h3>Ready for the next step?</h3>
            <p>You have mastered the foundational concepts of Data Structures &amp; Algorithms.</p>
          </div>
          <div className="basics-completion-actions">
            {!completed ? (
              <button className="basics-btn-complete" onClick={handleMarkComplete}>
                ✓ Mark as Completed
              </button>
            ) : (
              <span className="basics-done-check">✓ Basics Completed!</span>
            )}
            <Link to="/array" className="basics-btn-next">
              Start Arrays &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}