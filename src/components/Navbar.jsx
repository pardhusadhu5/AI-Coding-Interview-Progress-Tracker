import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Code2, 
  LayoutDashboard, 
  Terminal, 
  Target, 
  Settings, 
  LogOut, 
  Flame, 
  X, 
  Database, 
  Key,
  Menu
} from 'lucide-react';

export default function Navbar({ currentTab, setCurrentTab }) {
  const { user, streak, solvedCount, logout, firebaseConfig, geminiKey, updateKeys } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Settings form states
  const [geminiInput, setGeminiInput] = useState(geminiKey || '');
  const [fbApiKey, setFbApiKey] = useState(firebaseConfig?.apiKey || '');
  const [fbAuthDomain, setFbAuthDomain] = useState(firebaseConfig?.authDomain || '');
  const [fbProjectId, setFbProjectId] = useState(firebaseConfig?.projectId || '');
  const [fbStorageBucket, setFbStorageBucket] = useState(firebaseConfig?.storageBucket || '');
  const [fbMessagingSenderId, setFbMessagingSenderId] = useState(firebaseConfig?.messagingSenderId || '');
  const [fbAppId, setFbAppId] = useState(firebaseConfig?.appId || '');

  if (!user) return null;

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const config = fbApiKey && fbAuthDomain && fbProjectId ? {
      apiKey: fbApiKey,
      authDomain: fbAuthDomain,
      projectId: fbProjectId,
      storageBucket: fbStorageBucket,
      messagingSenderId: fbMessagingSenderId,
      appId: fbAppId
    } : null;

    updateKeys(config, geminiInput);
    setIsSettingsOpen(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'interview', label: 'AI Mock Interview', icon: Terminal },
    { id: 'progress', label: 'Career Roadmap', icon: Target },
  ];

  return (
    <>
      <nav className="glass-panel sticky top-0 z-40 w-full px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600/30 border border-indigo-500/50 rounded-xl p-2 glow-indigo">
              <Code2 className="h-6 w-6 text-indigo-400" />
            </div>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-xl font-bold tracking-wider text-transparent">
              CodePilot AI
            </span>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 font-semibold' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/40 border border-transparent'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* User Stats & Profile Controls */}
          <div className="hidden md:flex items-center gap-4">
            {/* Streak Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 font-semibold text-sm">
              <Flame className="h-4.5 w-4.5 fill-orange-400 animate-pulse" />
              <span>{streak} Day Streak</span>
            </div>

            {/* Solved Count */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-sm">
              <span>{solvedCount} Solved</span>
            </div>

            <div className="h-6 w-[1px] bg-gray-800"></div>

            {/* Settings Trigger */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
              title="API & Firebase Settings"
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <img 
                src={user.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=guest'} 
                alt="Profile" 
                className="h-8.5 w-8.5 rounded-full border border-gray-700 bg-gray-900"
              />
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-gray-200 leading-tight">
                  {user.displayName || 'Developer'}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  {firebaseConfig && geminiKey ? 'Real Mode' : 'Demo Mode'}
                </span>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-900/30 transition-all"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Mobile Streak Icon */}
            <div className="flex items-center gap-1 text-orange-400 font-bold text-sm">
              <Flame className="h-5 w-5 fill-orange-400" />
              <span>{streak}d</span>
            </div>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-800/60 flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
            <div className="h-[1px] bg-gray-800/60 my-2"></div>
            <div className="flex items-center justify-between px-4 py-2">
              <button
                onClick={() => {
                  setIsSettingsOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 text-sm font-semibold text-gray-400 hover:text-white"
              >
                <Settings className="h-5 w-5" />
                API Credentials
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-3 text-sm font-semibold text-red-400 hover:text-red-300"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Settings Modal (Glassmorphism design) */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="glass-panel w-full max-w-xl rounded-2xl p-6 shadow-2xl animate-border-glow border overflow-y-auto max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">API Credentials & Setup</h3>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="mt-4 space-y-5 text-left">
              {/* Info Box */}
              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs leading-relaxed">
                <strong>Simulated Mode is ACTIVE by default!</strong> You do not need keys to run or test the core AI workflows, mock statistics, and timeline views. If you wish to enable genuine database persistence or direct live AI code analysis, input your keys below.
              </div>

              {/* Gemini Section */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-300">
                  <Key className="h-3.5 w-3.5 text-indigo-400" />
                  Google Gemini API Key
                </label>
                <input 
                  type="password"
                  value={geminiInput}
                  onChange={(e) => setGeminiInput(e.target.value)}
                  placeholder="AI Studio API key (starts with AIzaSy...)"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-gray-200 transition-colors"
                />
                <span className="text-[10px] text-gray-500">
                  Obtain a free key from Google AI Studio. Leave empty to use simulated lead developer presets.
                </span>
              </div>

              <div className="h-[1px] bg-gray-800/80 my-2"></div>

              {/* Firebase Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-300">
                  <Database className="h-3.5 w-3.5 text-purple-400" />
                  Firebase Web Configuration (Auth & Firestore)
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">API Key</label>
                    <input 
                      type="password"
                      value={fbApiKey}
                      onChange={(e) => setFbApiKey(e.target.value)}
                      placeholder="Firebase apiKey"
                      className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-xs text-gray-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Auth Domain</label>
                    <input 
                      type="text"
                      value={fbAuthDomain}
                      onChange={(e) => setFbAuthDomain(e.target.value)}
                      placeholder="app-name.firebaseapp.com"
                      className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-xs text-gray-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Project ID</label>
                    <input 
                      type="text"
                      value={fbProjectId}
                      onChange={(e) => setFbProjectId(e.target.value)}
                      placeholder="firebase-project-id"
                      className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-xs text-gray-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Storage Bucket</label>
                    <input 
                      type="text"
                      value={fbStorageBucket}
                      onChange={(e) => setFbStorageBucket(e.target.value)}
                      placeholder="bucket.appspot.com"
                      className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-xs text-gray-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Messaging Sender ID</label>
                    <input 
                      type="text"
                      value={fbMessagingSenderId}
                      onChange={(e) => setFbMessagingSenderId(e.target.value)}
                      placeholder="Sender digits ID"
                      className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-xs text-gray-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">App ID</label>
                    <input 
                      type="text"
                      value={fbAppId}
                      onChange={(e) => setFbAppId(e.target.value)}
                      placeholder="1:123456:web:12ab"
                      className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-xs text-gray-200"
                    />
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 block">
                  Ensure Google Login provider and Cloud Firestore are active in your Firebase dashboard console. If not input, users will remain on local simulated storage.
                </span>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-950/50"
                >
                  Save and Reload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
