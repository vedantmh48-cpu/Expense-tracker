import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus, ShieldCheck, TrendingUp, Wallet } from 'lucide-react';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!isLogin) {
      if (!name) {
        setError('Please enter your name.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
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
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#4F46E5]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#3B82F6]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#4F46E5]/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#4F46E5] flex items-center justify-center text-[#FFFFFF] text-2xl font-extrabold shadow-lg">
              ₹
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-[#0F172A]">₹upeeFlow</span>
              <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] border border-[#4F46E5]/20 font-bold align-middle">
                INDIA
              </span>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight mb-4">
            Track Every Rupee.<br />
            <span className="bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] bg-clip-text text-transparent">
              Grow Every Day.
            </span>
          </h1>

          <p className="text-[#64748B] text-sm leading-relaxed mb-8 max-w-md">
            Smart personal expense & cash flow analytics built for India. Track UPI payments,
            SIP investments, house rent, and daily expenses with intelligent insights.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/70 border border-[#E2E8F0]/50 backdrop-blur-sm">
              <div className="p-2.5 rounded-xl bg-[#10B981]/15 text-[#10B981]">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">Smart Budget Tracking</h4>
                <p className="text-xs text-[#64748B]">Set monthly limits and get real-time alerts</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/70 border border-[#E2E8F0]/50 backdrop-blur-sm">
              <div className="p-2.5 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">Powerful Analytics</h4>
                <p className="text-xs text-[#64748B]">Visualize spending patterns with interactive charts</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/70 border border-[#E2E8F0]/50 backdrop-blur-sm">
              <div className="p-2.5 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">100% Private</h4>
                <p className="text-xs text-[#64748B]">Your data stays in your browser, always</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0]/50 shadow-xl p-6 sm:p-8 w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center text-[#FFFFFF] text-lg font-extrabold">
              ₹
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[#0F172A]">₹upeeFlow</span>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]/40 mb-6">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-1.5 ${isLogin
                ? 'bg-[#4F46E5] text-white shadow-sm'
                : 'text-[#0F172A] hover:bg-[#E2E8F0]/30'
                }`}
            >
              <LogIn className="w-4 h-4" /> Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-1.5 ${!isLogin
                ? 'bg-[#4F46E5] text-white shadow-sm'
                : 'text-[#0F172A] hover:bg-[#E2E8F0]/30'
                }`}
            >
              <UserPlus className="w-4 h-4" /> Register
            </button>
          </div>

          <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mb-1">
            {isLogin ? 'Welcome Back!' : 'Create Your Account'}
          </h2>
          <p className="text-sm text-[#64748B] mb-6">
            {isLogin
              ? 'Login to access your expense tracker'
              : 'Join ₹upeeFlow and start tracking your finances'}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="form-label">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#64748B] absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input pl-10 text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#64748B] absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input pl-10 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={isLogin ? 'Enter your password' : 'Minimum 6 characters'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pl-10 pr-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#64748B] hover:text-[#4F46E5]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="form-label">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input pl-10 pr-10 text-sm"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3 text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="spinner" />
              ) : isLogin ? (
                <>
                  <LogIn className="w-4 h-4 text-[#FFFFFF]" />
                  <span>Login to Dashboard</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 text-[#FFFFFF]" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#E2E8F0]/40 text-center">
            <p className="text-xs text-[#64748B]">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-[#4F46E5] font-bold hover:underline"
              >
                {isLogin ? 'Register here' : 'Login here'}
              </button>
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-[#64748B]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Your data is stored locally in your browser</span>
          </div>
        </div>
      </div>
    </div>
  );
};