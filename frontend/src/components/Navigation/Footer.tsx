import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-brand">
            <span className="footer-logo">V</span>
            Visual DSA
          </h3>
          <p className="footer-desc">Interactive platform to learn Data Structures and Algorithms through visualization.</p>
        </div>
        <div className="footer-section">
          <h4>Topics</h4>
          <Link to="/basics">DSA Basics</Link>
          <Link to="/array">Arrays</Link>
          <Link to="/linkedlist">Linked Lists</Link>
          <Link to="/stack">Stack</Link>
          <Link to="/queue">Queue</Link>
        </div>
        <div className="footer-section">
          <h4>Algorithms</h4>
          <Link to="/searching/linear">Linear Search</Link>
          <Link to="/searching/binary">Binary Search</Link>
          <Link to="/sorting/bubble">Bubble Sort</Link>
          <Link to="/sorting/selection">Selection Sort</Link>
          <Link to="/sorting/merge">Merge Sort</Link>
        </div>
        <div className="footer-section">
          <h4>Account</h4>
          <Link to="/practice">Practice</Link>
          <Link to="/progress">My Progress</Link>
          <Link to="/certificate">Get Certificate</Link>
          <Link to="/auth/login">Login</Link>
          <Link to="/auth/register">Sign Up</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Visual DSA. Built for learning.</p>
      </div>
    </footer>
  );
}
