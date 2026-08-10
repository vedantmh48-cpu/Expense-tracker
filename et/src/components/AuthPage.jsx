import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus, ShieldCheck, TrendingUp, Wallet, Check, X, AlertCircle } from 'lucide-react';

export const AuthPage = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Password validation conditions
  const passwordConditions = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const passedCount = Object.values(passwordConditions).filter(Boolean).length;

  const getPasswordStrength = () => {
    if (passedCount === 0) return { label: 'Weak', color: 'var(--accent-danger)', width: '0%' };
    if (passedCount <= 2) return { label: 'Weak', color: 'var(--accent-danger)', width: '25%' };
    if (passedCount <= 3) return { label: 'Fair', color: 'var(--accent-warning)', width: '50%' };
    if (passedCount <= 4) return { label: 'Good', color: 'var(--accent-primary)', width: '75%' };
    return { label: 'Strong', color: 'var(--accent-success)', width: '100%' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!isLogin) {
      if (!name) {
        setError('Please enter your name.');
        return;
      }
      if (name.trim().length < 2) {
        setError('Name must be at least 2 characters.');
        return;
      }
      // Password conditions
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      if (!passwordConditions.uppercase) {
        setError('Password must contain at least one uppercase letter.');
        return;
      }
      if (!passwordConditions.lowercase) {
        setError('Password must contain at least one lowercase letter.');
        return;
      }
      if (!passwordConditions.number) {
        setError('Password must contain at least one number.');
        return;
      }
      if (!passwordConditions.special) {
        setError('Password must contain at least one special character (!@#$%^&* etc).');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    setTimeout(() => {
      const result = isLogin
        ? login(email, password)
        : register(name, email, password);

      if (!result.success) {
        setError(result.error);
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="auth-page">
      {/* Animated Background */}
      <div className="auth-bg-blobs">
        <div className="auth-bg-orbs orb-1" />
        <div className="auth-bg-orbs orb-2" />
        <div className="auth-bg-orbs orb-3" />
        <div className="auth-bg-grid" />
      </div>

      <div className="auth-container">
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <span className="auth-logo-name">RupeeFlow</span>
              <span className="auth-logo-badge">INDIA</span>
            </div>
          </div>

          <h1 className="auth-title">
            Track Every Rupee.<br />
            <span className="auth-title-gradient">Grow Every Day.</span>
          </h1>

          <p className="auth-subtitle">
            Smart personal expense & cash flow analytics built for India. Track UPI payments,
            SIP investments, house rent, and daily expenses with intelligent insights.
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon success">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h4>Smart Budget Tracking</h4>
                <p>Set monthly limits and get real-time alerts</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon primary">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4>Powerful Analytics</h4>
                <p>Visualize spending patterns with interactive charts</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4>100% Private</h4>
                <p>Your data stays in your browser, always</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="auth-form-card">
          {/* Mobile Logo */}
          <div className="auth-mobile-logo">
            <div className="auth-logo-icon">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="auth-logo-name">RupeeFlow</span>
          </div>

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`auth-tab ${isLogin ? 'active' : ''}`}
            >
              <LogIn className="w-4 h-4" /> Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
            >
              <UserPlus className="w-4 h-4" /> Register
            </button>
          </div>

          <h2 className="auth-form-title">
            {isLogin ? 'Welcome Back!' : 'Create Your Account'}
          </h2>
          <p className="auth-form-subtitle">
            {isLogin
              ? 'Login to access your expense tracker'
              : 'Join RupeeFlow and start tracking your finances'}
          </p>

          {error && (
            <div className="alert-message error">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-with-icon">
                  <User className="w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail className="w-4 h-4" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock className="w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={isLogin ? 'Enter your password' : 'Create a strong password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {!isLogin && password && (
                <div className="password-strength-container">
                  <div className="password-strength-bar">
                    <div
                      className="password-strength-fill"
                      style={{ width: strength.width, backgroundColor: strength.color }}
                    />
                  </div>
                  <div className="password-strength-label" style={{ color: strength.color }}>
                    {strength.label} Password
                  </div>
                  <div className="password-conditions">
                    <div className={`password-condition ${passwordConditions.length ? 'met' : ''}`}>
                      {passwordConditions.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>8+ characters</span>
                    </div>
                    <div className={`password-condition ${passwordConditions.uppercase ? 'met' : ''}`}>
                      {passwordConditions.uppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>Uppercase (A-Z)</span>
                    </div>
                    <div className={`password-condition ${passwordConditions.lowercase ? 'met' : ''}`}>
                      {passwordConditions.lowercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>Lowercase (a-z)</span>
                    </div>
                    <div className={`password-condition ${passwordConditions.number ? 'met' : ''}`}>
                      {passwordConditions.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>Number (0-9)</span>
                    </div>
                    <div className={`password-condition ${passwordConditions.special ? 'met' : ''}`}>
                      {passwordConditions.special ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>Special character</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-with-icon">
                  <Lock className="w-4 h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input"
                  />
                  {confirmPassword && (
                    <span className={`password-match-indicator ${password === confirmPassword ? 'match' : 'no-match'}`}>
                      {password === confirmPassword ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </span>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary auth-submit"
            >
              {loading ? (
                <span className="spinner" />
              ) : isLogin ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Login to Dashboard</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-switch">
            <p>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="auth-switch-btn"
              >
                {isLogin ? 'Register here' : 'Login here'}
              </button>
            </p>
          </div>

          <div className="auth-privacy">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Your data is stored locally in your browser</span>
          </div>
        </div>
      </div>
    </div>
  );
};