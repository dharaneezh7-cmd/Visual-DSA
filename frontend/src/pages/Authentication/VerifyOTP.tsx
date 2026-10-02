import { useState, useRef, useCallback, useEffect, type KeyboardEvent, type ClipboardEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import Button from '../../components/Common/Button';
import './auth.css';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

export default function VerifyOTP() {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const email = sessionStorage.getItem('resetEmail') || '';

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (!email) {
      navigate('/auth/forgot-password', { replace: true });
    }
  }, [email, navigate]);

  const focusInput = (index: number) => {
    if (index >= 0 && index < OTP_LENGTH) {
      inputRefs.current[index]?.focus();
      inputRefs.current[index]?.select();
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setError('');
    if (digit && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = [...digits];
      if (digits[index]) {
        next[index] = '';
        setDigits(next);
      } else if (index > 0) {
        next[index - 1] = '';
        setDigits(next);
        focusInput(index - 1);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setDigits(next);
    focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  const otp = digits.join('');

  const handleSubmit = useCallback(async () => {
    if (otp.length !== OTP_LENGTH) return;
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.verifyOTP({ email, otp });
      if (res.resetToken) {
        sessionStorage.setItem('resetToken', res.resetToken);
      }
      sessionStorage.setItem('otpVerified', 'true');
      navigate('/auth/reset-password');
    } catch (err) {
      setError(String((err as Error).message));
    } finally {
      setLoading(false);
    }
  }, [email, otp, navigate]);

  useEffect(() => {
    if (otp.length === OTP_LENGTH && !loading) {
      handleSubmit();
    }
  }, [otp, loading, handleSubmit]);

  const handleResend = async () => {
    if (cooldown > 0) return;
    setResendLoading(true);
    setError('');
    try {
      await authAPI.forgotPassword({ email });
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setError(String((err as Error).message));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Verify OTP</h1>
        <p className="auth-subtitle">
          Enter the 6-digit OTP sent to <strong>{email || 'your email'}</strong>.
        </p>
        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} className="auth-form">
          <div className="otp-inputs" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="otp-digit"
                value={d}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                onFocus={e => e.target.select()}
                autoComplete="one-time-code"
              />
            ))}
          </div>
          {error && <div className="auth-error">{error}</div>}
          <Button type="submit" className="auth-submit" disabled={loading || otp.length !== OTP_LENGTH}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </form>
        <div className="auth-links">
          {cooldown > 0 ? (
            <span className="otp-cooldown">Resend OTP in {cooldown}s</span>
          ) : (
            <button type="button" className="otp-resend-btn" onClick={handleResend} disabled={resendLoading}>
              {resendLoading ? 'Sending...' : 'Resend OTP'}
            </button>
          )}
        </div>
        <p className="auth-switch">
          <Link to="/auth/forgot-password">Back</Link>
        </p>
      </div>
    </div>
  );
}
