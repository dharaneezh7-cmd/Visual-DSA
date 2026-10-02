import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/Common/Button';
import './auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(String((err as Error).message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Log in to continue your learning journey.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-field">
            <span>Email or Username</span>
            <input type="text" value={email} onChange={e => setEmail(e.target.value)} required />
          </label>
          <label className="auth-field">
            <span>Password</span>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </label>
          {error && <div className="auth-error">{error}</div>}
          <Button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <div className="auth-links">
          <Link to="/auth/forgot-password">Forgot password?</Link>
        </div>
        <p className="auth-switch">
          New here? <Link to="/auth/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}