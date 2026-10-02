import { Link } from 'react-router-dom';
import './searching.css';

export default function Searching() {
  return (
    <div className="searching-page">
      <div className="searching-hero">
        <h1>Searching Algorithms</h1>
        <p>
          Searching means finding a particular value in a collection. Learn how linear and binary
          search work step by step with live visualizations.
        </p>
      </div>
      <div className="searching-cards">
        <Link to="/searching/linear" className="searching-card">
          <span className="searching-card-icon">🔎</span>
          <h2>Linear Search</h2>
          <p>Checks every element one by one until the target is found. Works on any array.</p>
          <div className="searching-card-meta">
            <span>Time: O(n)</span>
            <span>No sorting needed</span>
          </div>
        </Link>
        <Link to="/searching/binary" className="searching-card">
          <span className="searching-card-icon">⚡</span>
          <h2>Binary Search</h2>
          <p>Halves the search space each step. Requires a sorted array.</p>
          <div className="searching-card-meta">
            <span>Time: O(log n)</span>
            <span>Needs sorted array</span>
          </div>
        </Link>
      </div>
    </div>
  );
}