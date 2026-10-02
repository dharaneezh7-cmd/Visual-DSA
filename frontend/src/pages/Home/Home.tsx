import { Link } from 'react-router-dom';
import './home.css';

const topics = [
  { path: '/basics', title: 'DSA Basics', desc: 'Core concepts, complexity, recursion', icon: '📘' },
  { path: '/array', title: 'Arrays', desc: 'Indexing, insertion, deletion, search', icon: '📊' },
  { path: '/linkedlist', title: 'Linked Lists', desc: 'Nodes, pointers, insertion, deletion', icon: '🔗' },
  { path: '/stack', title: 'Stack', desc: 'LIFO, push, pop, peek', icon: '📚' },
  { path: '/queue', title: 'Queue', desc: 'FIFO, enqueue, dequeue', icon: '🛒' },
  { path: '/searching', title: 'Searching', desc: 'Linear and binary search', icon: '🔍' },
  { path: '/sorting', title: 'Sorting', desc: 'Bubble, selection, insertion, merge, quick', icon: '🔀' },
];

const features = [
  { icon: '📖', title: 'Learn', desc: 'Clear theory with examples and step-by-step explanations for every operation.' },
  { icon: '👆', title: 'Visualize', desc: 'Watch every operation animate in real time. See how data structures change inside.' },
  { icon: '✏️', title: 'Practice', desc: 'Test yourself with interactive questions and get instant feedback.' },
  { icon: '📈', title: 'Track Progress', desc: 'See your learning analytics, strong and weak topics, and next steps.' },
  { icon: '🎓', title: 'Get Certified', desc: 'Earn, customize, and download your verified Visual DSA Certificate of Completion.' },
];

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Master Data Structures &amp; Algorithms</h1>
          <p className="hero-subtitle">
            Learn concepts, visualize operations, practice interactively, and track your learning progress.
          </p>
          <div className="hero-actions">
            <Link to="/basics" className="hero-btn hero-btn-primary">Start Learning</Link>
            <Link to="/array" className="hero-btn hero-btn-outline">Explore Topics</Link>
          </div>
        </div>
      </section>

      <section className="features">
        {features.map(f => (
          <div key={f.title} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="topics-section">
        <h2 className="section-title">Explore Topics</h2>
        <div className="topics-grid">
          {topics.map(t => (
            <Link key={t.path} to={t.path} className="topic-card">
              <div className="topic-icon">{t.icon}</div>
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
              <span className="topic-arrow">Start Learning &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="learning-flow">
        <h2 className="section-title">How It Works</h2>
        <div className="flow-steps">
          <div className="flow-step">
            <span className="flow-num">1</span>
            <p>Read the theory alongside the live visualization.</p>
          </div>
          <div className="flow-step">
            <span className="flow-num">2</span>
            <p>Perform operations yourself and watch them animate.</p>
          </div>
          <div className="flow-step">
            <span className="flow-num">3</span>
            <p>Follow step-by-step explanations for each operation.</p>
          </div>
          <div className="flow-step">
            <span className="flow-num">4</span>
            <p>Practice, then review your progress and recommendations.</p>
          </div>
        </div>
      </section>
    </div>
  );
}