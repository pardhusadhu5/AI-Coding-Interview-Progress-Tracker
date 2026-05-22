import React from 'react';
import { useApp } from '../context/AppContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, fallbackTab, setTab }) {
  const { user, authLoading } = useApp();

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-950 text-white">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
          <div className="absolute h-14 w-14 rounded-full border border-indigo-500/20 border-t-indigo-500/50 animate-pulse"></div>
        </div>
        <p className="mt-4 text-xs font-semibold text-indigo-400/80 tracking-widest uppercase animate-pulse">
          Syncing Profile...
        </p>
      </div>
    );
  }

  if (!user) {
    // If the user isn't logged in, redirect them to the login tab
    // We will control tabs/routing directly in App.jsx. If not logged in, render the Login page.
    // In our single page state app, we can change the current tab to login or let App.jsx render it.
    // We will handle routing elegantly in App.jsx.
    return null;
  }

  return children;
}
