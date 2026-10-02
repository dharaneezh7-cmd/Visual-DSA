import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import Button from '../../components/Common/Button';
import './auth.css';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const navigate = useNavigate();
  const email = sessionStorage.getItem('resetEmail') || '';

  useEffect(() => {
    if (!email || sessionStorage.getItem('otpVerified') !== 'true') {
      navigate('/auth/forgot-password', { replace: true });
    }
  }, [email, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Email not found. Please start the process again.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const resetToken = sessionStorage.getItem('resetToken') || undefined;
      await authAPI.resetPassword({ email, newPassword: password, resetToken });
      sessionStorage.removeItem('resetEmail');
      sessionStorage.removeItem('otpVerified');
      sessionStorage.removeItem('resetToken');
      setResetDone(true);
    } catch (err) {
      setError(String((err as Error).message));
    } finally {
      setLoading(false);
    }
  };

  if (resetDone) {
    return (
      <div className="auth-page">
        <div className="auth-card auth-success-card">
          <div className="auth-success-icon">&#10003;</div>
          <h1>Password Reset Successful</h1>
          <p className="auth-subtitle">Your password has been changed successfully.</p>
          <Link to="/auth/login">
            <Button className="auth-submit">Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Reset Password</h1>
        <p className="auth-subtitle">Create a new password for <strong>{email || 'your account'}</strong>.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-field">
            <span>New Password</span>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
          </label>
          <label className="auth-field">
            <span>Confirm New Password</span>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </label>
          <p className="auth-hint">At least 8 characters</p>
          {error && <div className="auth-error">{error}</div>}
          <Button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
        <p className="auth-switch">
          <Link to="/auth/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
