import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Code2, ArrowRight, Globe, ArrowUpRight } from 'lucide-react';

export default function Login() {
  const { login, signup, loginWithGoogle } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
    } catch (e) {
      console.error(e);
      setError(e.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoMode = async () => {
    setError('');
    setLoading(true);
    try {
      await login('guest.developer@codepilot.ai', 'demo12345');
    } catch (e) {
      console.error(e);
      setError('Failed to launch demo session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-[#020617] px-4 overflow-hidden">
      {/* Background Decorative Glow Spheres */}
      <div className="absolute top-1/4 -left-32 h-[450px] w-[450px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 h-[450px] w-[450px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-2xl p-3 glow-indigo mb-3">
            <Code2 className="h-8 w-8 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
            CodePilot AI
          </h2>
          <p className="text-gray-400 text-xs mt-1.5 font-medium uppercase tracking-widest">
            SaaS Coding Interview Simulator
          </p>
        </div>

        {/* Main Glass Panel Card */}
        <div className="glass-panel rounded-2xl border border-gray-800/80 p-8 shadow-2xl relative">
          <div className="flex border-b border-gray-800/80 mb-6">
            <button
              onClick={() => { setIsRegister(false); setError(''); }}
              className={`flex-1 pb-3 text-sm font-bold transition-all relative ${
                !isRegister ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Sign In
              {!isRegister && (
                <motion.div layoutId="authTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
              )}
            </button>
            <button
              onClick={() => { setIsRegister(true); setError(''); }}
              className={`flex-1 pb-3 text-sm font-bold transition-all relative ${
                isRegister ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Sign Up
              {isRegister && (
                <motion.div layoutId="authTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800/80 text-sm text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800/80 text-sm text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:opacity-95 shadow-md shadow-indigo-950/60 transition-opacity active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <span>Loading...</span>
              ) : (
                <>
                  <span>{isRegister ? 'Register Account' : 'Access Dashboard'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800/60"></div>
            </div>
            <span className="relative px-3 bg-[#0c1024] text-[10px] uppercase font-bold tracking-wider text-gray-500">
              OR CONTINUE WITH
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {/* Google Login */}
            <button
              onClick={loginWithGoogle}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-850 hover:border-gray-700 bg-gray-950 hover:bg-gray-900/60 text-xs font-semibold text-gray-300 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <Globe className="h-4 w-4 text-indigo-400" />
              <span>Google SSO</span>
            </button>

            {/* Sandbox Mode */}
            <button
              onClick={handleDemoMode}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-dashed border-indigo-500/30 hover:border-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 text-xs font-semibold text-indigo-400 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <span>Sandbox Mode</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Footer Notes */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Made for developers and technical recruiters.
        </p>
      </motion.div>
    </div>
  );
}
