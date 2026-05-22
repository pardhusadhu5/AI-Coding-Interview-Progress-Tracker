import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, databaseService, getFirebaseConfig, saveFirebaseConfig } from '../services/firebase';
import { getGeminiApiKey, saveGeminiApiKey, geminiService } from '../services/gemini';

const AppContext = createContext();

const STORAGE_PREFIX = 'codepilot_';

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [streak, setStreak] = useState(5);
  const [solvedCount, setSolvedCount] = useState(12);
  const [problemsList, setProblemsList] = useState([]);
  const [roadmap, setRoadmap] = useState([]);
  const [roadmapGoal, setRoadmapGoal] = useState('Full Stack Web Engineer');
  const [firebaseConfig, setFirebaseConfig] = useState(null);
  const [geminiKey, setGeminiKey] = useState('');
  
  // Load configuration and statistics
  useEffect(() => {
    // Auth Listener
    const unsubscribe = authService.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      
      if (currentUser) {
        // Load stats from database or fallback to localStorage
        const data = await databaseService.getUserData(currentUser.uid);
        if (data) {
          if (data.streak !== undefined) setStreak(data.streak);
          if (data.solvedCount !== undefined) setSolvedCount(data.solvedCount);
          if (data.problemsList !== undefined) setProblemsList(data.problemsList);
          if (data.roadmap !== undefined) setRoadmap(data.roadmap);
          if (data.roadmapGoal !== undefined) setRoadmapGoal(data.roadmapGoal);
        } else {
          // Initialize user profile in mock/db
          const defaultStats = {
            streak: 5,
            solvedCount: 12,
            problemsList: [
              { id: '1', title: 'Reverse a String', topic: 'algorithms', difficulty: 'easy', date: '2026-05-20', score: 95 },
              { id: '2', title: 'FizzBuzz', topic: 'algorithms', difficulty: 'easy', date: '2026-05-21', score: 100 },
              { id: '3', title: 'Toggle Light/Dark', topic: 'react', difficulty: 'easy', date: '2026-05-22', score: 85 }
            ],
            roadmap: [],
            roadmapGoal: 'Full Stack Web Engineer'
          };
          setStreak(defaultStats.streak);
          setSolvedCount(defaultStats.solvedCount);
          setProblemsList(defaultStats.problemsList);
          setRoadmap(defaultStats.roadmap);
          setRoadmapGoal(defaultStats.roadmapGoal);
          
          await databaseService.setUserData(currentUser.uid, defaultStats);
        }
      }
    });

    // Local settings
    setFirebaseConfig(getFirebaseConfig());
    setGeminiKey(getGeminiApiKey());

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      await authService.signInWithEmail(email, password);
    } finally {
      setAuthLoading(false);
    }
  };

  const signup = async (email, password) => {
    setAuthLoading(true);
    try {
      await authService.signUpWithEmail(email, password);
    } finally {
      setAuthLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setAuthLoading(true);
    try {
      await authService.signInWithGoogle();
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateKeys = (fbConfig, geminiApiKey) => {
    saveFirebaseConfig(fbConfig);
    saveGeminiApiKey(geminiApiKey);
    setFirebaseConfig(fbConfig);
    setGeminiKey(geminiApiKey);
    // Advise reload to apply configuration changes
    alert('Credentials updated! The app will reload to apply the new configuration.');
    window.location.reload();
  };

  const recordSolvedProblem = async (problemId, title, topic, difficulty, score) => {
    if (!user) return;
    
    const newProblem = {
      id: problemId || Date.now().toString(),
      title,
      topic,
      difficulty,
      score,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedList = [newProblem, ...problemsList];
    const newSolvedCount = solvedCount + 1;
    
    // Check streak: increment if they solved another problem today or yesterday
    // For simplicity, let's increment the streak by 1
    const newStreak = streak + 1;

    setProblemsList(updatedList);
    setSolvedCount(newSolvedCount);
    setStreak(newStreak);

    // Save
    await databaseService.setUserData(user.uid, {
      problemsList: updatedList,
      solvedCount: newSolvedCount,
      streak: newStreak
    });
  };

  const generateRoadmap = async (goal) => {
    if (!user) return;
    setRoadmapGoal(goal);
    try {
      const data = await geminiService.generateRoadmap(goal);
      setRoadmap(data);
      await databaseService.setUserData(user.uid, {
        roadmap: data,
        roadmapGoal: goal
      });
    } catch (e) {
      console.error(e);
      alert('Error generating roadmap. Please check your Gemini API key or configuration.');
    }
  };

  const toggleTaskCompletion = async (milestoneId, taskId, completed) => {
    if (!user || !roadmap) return;
    
    const updatedRoadmap = roadmap.map(milestone => {
      if (milestone.id === milestoneId) {
        return {
          ...milestone,
          tasks: milestone.tasks.map(task => {
            if (task.id === taskId) {
              return { ...task, completed };
            }
            return task;
          })
        };
      }
      return milestone;
    });

    setRoadmap(updatedRoadmap);
    await databaseService.setUserData(user.uid, {
      roadmap: updatedRoadmap
    });
  };

  const value = {
    user,
    authLoading,
    streak,
    solvedCount,
    problemsList,
    roadmap,
    roadmapGoal,
    firebaseConfig,
    geminiKey,
    login,
    signup,
    loginWithGoogle,
    logout,
    updateKeys,
    recordSolvedProblem,
    generateRoadmap,
    toggleTaskCompletion
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
