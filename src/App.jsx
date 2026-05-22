import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import Progress from './pages/Progress';
import { motion, AnimatePresence } from 'framer-motion';

function AppContent() {
  const { user } = useApp();
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Page switcher
  const renderTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard key="dashboard" setCurrentTab={setCurrentTab} />;
      case 'interview':
        return <Interview key="interview" />;
      case 'progress':
        return <Progress key="progress" />;
      default:
        return <Dashboard key="dashboard" setCurrentTab={setCurrentTab} />;
    }
  };

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#020617] text-gray-200">
      {/* Dynamic Navigation Bar */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Pages Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto pb-12">
        <ProtectedRoute>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </ProtectedRoute>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
