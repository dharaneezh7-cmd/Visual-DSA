import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="notfound-code">404</div>
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="notfound-btn">Back to Home</Link>
    </div>
  );
}