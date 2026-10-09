import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    await login(email, password);
    navigate('/');
    
  } catch (err) { // <-- Yahan 'err' rakhein (pehle 'error' tha)
    setError(
      typeof err === 'string'
        ? err
        : err.response?.data?.message || err.message || 'Login failed. Please try again.'
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div 
      className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 text-white"
      style={{
        background: `
          radial-gradient(circle at 100% 0%, #020617 0%, #0f172a 30%, transparent 65%),
          radial-gradient(circle at 85% 85%, #f43f5e 0%, #ec4899 25%, #8b5cf6 50%, transparent 80%),
          radial-gradient(circle at 0% 0%, #ffffff 0%, #f1f5f9 35%, #e2e8f0 100%)
        `
      }}
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glassmorphic Form Card */}
      <div className="relative z-10 max-w-md w-full bg-slate-950/70 backdrop-blur-2xl rounded-3xl p-8 lg:p-10 border border-white/10 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold uppercase tracking-widest mb-3">
            Welcome Back
          </span>
          <h2 className="text-4xl font-black uppercase font-['Bebas_Neue'] tracking-wider text-white">
            Member Login
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to access your profile & street gear
          </p>
        </div>

        {/* Dynamic Error Alert Box */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium rounded-xl flex items-start justify-between gap-3 shadow-lg shadow-rose-900/20 backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 animate-pulse" />
              <span>{error}</span>
            </div>
            <button 
              type="button"
              onClick={() => setError('')}
              className="text-slate-400 hover:text-white transition-colors text-sm font-bold leading-none"
            >
              ✕
            </button>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[linear-gradient(135deg,#FFFFFF,#3B82F6,#1E3A8A,#F472B6)] hover:opacity-90 text-slate-950 font-black py-3.5 px-4 rounded-xl shadow-lg shadow-pink-500/10 transition duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center uppercase text-sm tracking-wider"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-slate-950" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Authenticating...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-8 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-pink-400 hover:text-pink-300 underline underline-offset-4 ml-1">
            Register Here
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;