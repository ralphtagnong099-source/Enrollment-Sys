import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './login.css';

const CapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c3 2 9 2 12 0v-5" />
  </svg>
);
const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3.5" /><path d="M2 20c0-4 3-6 7-6s7 2 7 6" />
    <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2.5.7 4 2.5 4 6" />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email || !password) return setError('Please enter your email address and password.');

    const { error } =
      mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (error) return setError(error.message);
    navigate('/enroll');
  }

  return (
    <div className="lg-page">
      <div className="lg-blob-top" />
      <div className="lg-blob-bottom" />

      <div className="lg-card">
        <div className="lg-logo"><CapIcon /></div>
        <p className="lg-eyebrow">BSIT ENROLLMENT SYSTEM</p>
        <h1 className="lg-title">
          {mode === 'login' ? 'Enrollment Portal Login' : 'Create Student Account'}
        </h1>
        <p className="lg-sub">
          {mode === 'login' ? 'Sign in to manage your student enrollment' : 'Register to start your enrollment'}
        </p>

        <form onSubmit={handleSubmit}>
          <label className="lg-label">Email Address</label>
          <input className="lg-input" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} />

          <label className="lg-label">Password</label>
          <input className="lg-input" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} />

          {mode === 'login' && (
            <div className="lg-row">
              <label><input type="checkbox" /> Remember me</label>
              <button type="button" className="lg-link">Forgot password?</button>
            </div>
          )}

          {error && <div className="lg-error">{error}</div>}

          <button type="submit" className="lg-btn lg-btn-primary">
            <UsersIcon />
            <span>{mode === 'login' ? 'Login to Enrollment Portal' : 'Create Account'}</span>
          </button>
        </form>

        <hr className="lg-divider" />

        <button type="button" className="lg-btn lg-btn-secondary"
          onClick={() => { setError(''); setMode(mode === 'login' ? 'register' : 'login'); }}>
          <CapIcon />
          <span>{mode === 'login' ? 'Register as New Student' : 'Back to Login'}</span>
        </button>
      </div>
    </div>
  );
}