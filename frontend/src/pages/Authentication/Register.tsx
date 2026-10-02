import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/Common/Button';
import './auth.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register(username, email, password, confirmPassword);
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
        <h1>Create Account</h1>
        <p className="auth-subtitle">Start learning DSA with interactive visualizations.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-field">
            <span>Username</span>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required minLength={3} />
          </label>
          <label className="auth-field">
            <span>Email</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </label>
          <label className="auth-field">
            <span>Password</span>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
          </label>
          <label className="auth-field">
            <span>Confirm Password</span>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </label>
          {error && <div className="auth-error">{error}</div>}
          <Button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/auth/login">Login</Link>
        </p>
      </div>
    </div>
  );
}