import { useRouteError, Link } from 'react-router-dom';
import './RouteError.css';

export default function RouteError() {
  const error = useRouteError() as { statusText?: string; message?: string; status?: number };

  return (
    <div className="route-error">
      <div className="route-error-icon">!</div>
      <h1>Something went wrong.</h1>
      <p>Unable to load this page.</p>
      {error?.statusText && import.meta.env.DEV && <code>{error.statusText}</code>}
      {error?.message && import.meta.env.DEV && <code>{error.message}</code>}
      <Link to="/" className="route-error-btn">Try Again</Link>
    </div>
  );
}