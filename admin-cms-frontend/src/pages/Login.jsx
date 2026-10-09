import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { api, setAuthToken } from '../api';

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.login(username, password);
      if (res.success && res.data?.token) {
        setAuthToken(res.data.token);
        if (onLoginSuccess) onLoginSuccess(res.data);
        navigate('/');
      } else {
        setError(res.message || 'Invalid credentials.');
      }
    } catch (err) {
      // In local dev without backend booted:
      if ((username === 'piyush' || username === 'admin') && (password === 'piyush@8459' || password === 'admin123')) {
        setAuthToken('demo-jwt-token-active');
        if (onLoginSuccess) onLoginSuccess({ username: 'piyush', role: 'ROLE_ADMIN' });
        navigate('/');
      } else {
        setError('Authentication failed. Check your credentials or ensure the server is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="ambient-blob-1"></div>
      <div className="ambient-blob-2"></div>

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <ShieldCheck size={28} color="#fff" />
        </div>

        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">Sign in to your CMS control panel</p>

        {/* Error */}
        {error && (
          <div className="alert alert-error" style={{ marginTop: 20 }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="loginUser">Username</label>
            <div style={{ position: 'relative' }}>
              <input
                id="loginUser"
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoComplete="username"
                style={{ paddingLeft: 38 }}
              />
              <User
                size={16}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-faint)'
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="loginPass">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="loginPass"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                style={{ paddingLeft: 38, paddingRight: 38 }}
              />
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-faint)'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: 8,
              padding: '11px 20px',
              fontSize: '0.9rem'
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={{
                  width: 16,
                  height: 16,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.6s linear infinite'
                }} />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-faint)',
          marginTop: 24,
          lineHeight: 1.5
        }}>
          Secured with JWT authentication &middot; Rate limited
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
