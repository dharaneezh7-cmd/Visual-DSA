import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import Button from '../../components/Common/Button';
import './auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.forgotPassword({ email });
      sessionStorage.setItem('resetEmail', email);
      sessionStorage.removeItem('otpVerified');
      void res;
      navigate('/auth/verify-otp');
    } catch (err) {
      setError(String((err as Error).message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Forgot Password</h1>
        <p className="auth-subtitle">
          Enter your registered email. We will send you an OTP.
        </p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-field">
            <span>Email</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </label>
          {error && <div className="auth-error">{error}</div>}
          <Button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </form>
        <p className="auth-switch">
          <Link to="/auth/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
