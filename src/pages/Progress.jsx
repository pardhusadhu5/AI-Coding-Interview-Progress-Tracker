import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Sparkles, 
  CheckSquare, 
  Square, 
  TrendingUp, 
  MapPin, 
  Circle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export default function Progress() {
  const { roadmap, roadmapGoal, generateRoadmap, toggleTaskCompletion } = useApp();
  const [goalInput, setGoalInput] = useState(roadmapGoal || 'Full Stack Web Engineer');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!goalInput.trim()) return;
    setGenerating(true);
    try {
      await generateRoadmap(goalInput);
    } finally {
      setGenerating(false);
    }
  };

  // Calculate overall task completion percentage
  const getCompletionStats = () => {
    if (!roadmap || roadmap.length === 0) return { total: 0, completed: 0, percent: 0 };
    let total = 0;
    let completed = 0;
    roadmap.forEach(m => {
      m.tasks.forEach(t => {
        total++;
        if (t.completed) completed++;
      });
    });
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent };
  };

  const { total, completed, percent } = getCompletionStats();

  // Helper for checking if all tasks in a milestone are completed
  const isMilestoneCompleted = (milestone) => {
    return milestone.tasks.length > 0 && milestone.tasks.every(t => t.completed);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 space-y-8">
      {/* Roadmap Goal Selector Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-2xl p-6 border text-left flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex-1 space-y-1.5 z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-400" />
            AI Career Roadmap Blueprint
          </h2>
          <p className="text-xs text-gray-400">
            Define your aspiration goal. The AI will formulate step-by-step topics & validation checkpoints.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="flex gap-2 w-full md:w-auto z-10">
          <input
            type="text"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            placeholder="e.g. Full Stack Architect"
            disabled={generating}
            className="px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-sm text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none w-full md:w-64"
          />
          <button
            type="submit"
            disabled={generating || !goalInput.trim()}
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 shadow-md shadow-indigo-950/50 transition-all active:scale-[0.98] whitespace-nowrap disabled:opacity-50"
          >
            {generating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-white" />
                <span>Formulating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-white" />
                <span>Generate Roadmap</span>
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Empty State */}
      {(!roadmap || roadmap.length === 0) && !generating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel rounded-2xl py-16 px-6 border text-center max-w-xl mx-auto space-y-4"
        >
          <div className="mx-auto h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <Target className="h-6 w-6 animate-pulse" />
          </div>
          <div className="space-y-1.5 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-white">No Roadmap Instantiated</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Enter your target career goal above (e.g., "Full Stack Web Developer") and initialize a tailored study schedule.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={handleGenerate}
              className="px-5 py-2 text-xs font-bold text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/15 hover:border-indigo-500/30 rounded-xl transition-all"
            >
              Initialize Demo Full Stack Roadmap
            </button>
          </div>
        </motion.div>
      )}

      {/* Progress & Timeline Board */}
      {roadmap && roadmap.length > 0 && (
        <div className="space-y-6">
          {/* Progress Tracker Info Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl p-5 border text-left flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Active Curriculum Goal</span>
                <h3 className="text-sm font-bold text-white leading-tight">{roadmapGoal}</h3>
              </div>
            </div>

            {/* Global Progress Bar */}
            <div className="w-full sm:w-60 flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-gray-950 border border-gray-900 overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-indigo-400">{percent}%</span>
                <p className="text-[9px] text-gray-500 font-bold whitespace-nowrap">{completed}/{total} Topics Completed</p>
              </div>
            </div>
          </motion.div>

          {/* Vertical Node Timeline */}
          <div className="relative pl-6 md:pl-8 text-left py-4 space-y-8">
            {/* Center Timeline Line */}
            <div className="absolute left-[34px] md:left-[42px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-indigo-500/60 via-purple-500/40 to-gray-900 pointer-events-none"></div>

            {/* Roadmap Milestones */}
            {roadmap.map((milestone, mIdx) => {
              const completedMilestone = isMilestoneCompleted(milestone);
              return (
                <motion.div 
                  key={milestone.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: mIdx * 0.1 }}
                  className="relative flex gap-6 md:gap-8 items-start"
                >
                  {/* Timeline Dot Node */}
                  <div className="relative mt-2 z-10 flex items-center justify-center">
                    {completedMilestone ? (
                      <div className="h-9 w-9 md:h-11 md:w-11 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-950/50">
                        <CheckCircle2 className="h-4.5 w-4.5 md:h-5.5 md:w-5.5 text-emerald-400 fill-emerald-500/10" />
                      </div>
                    ) : (
                      <div className="h-9 w-9 md:h-11 md:w-11 rounded-full bg-gray-950 border-2 border-gray-800 flex items-center justify-center shadow-lg">
                        <span className="text-xs font-extrabold text-gray-400">{mIdx + 1}</span>
                      </div>
                    )}
                  </div>

                  {/* Milestone Card */}
                  <div className={`flex-1 glass-panel rounded-2xl p-5 border transition-all ${
                    completedMilestone 
                      ? 'border-emerald-500/20 shadow-lg shadow-emerald-950/10 bg-emerald-950/5' 
                      : 'border-gray-800/80'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-gray-900 pb-3.5 mb-4">
                      <div>
                        <h4 className={`text-base font-bold transition-colors ${
                          completedMilestone ? 'text-emerald-400' : 'text-white'
                        }`}>
                          {milestone.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">{milestone.description}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase self-start sm:self-center ${
                        completedMilestone 
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25' 
                          : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/25'
                      }`}>
                        {completedMilestone ? 'Completed' : 'In Progress'}
                      </span>
                    </div>

                    {/* Task Sub list */}
                    <div className="space-y-2">
                      {milestone.tasks.map((task) => (
                        <div 
                          key={task.id}
                          onClick={() => toggleTaskCompletion(milestone.id, task.id, !task.completed)}
                          className="flex items-center justify-between p-3 rounded-xl bg-gray-950/80 border border-gray-900/60 hover:border-gray-800 cursor-pointer select-none transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {task.completed ? (
                              <CheckSquare className="h-4.5 w-4.5 text-indigo-400 fill-indigo-500/5" />
                            ) : (
                              <Square className="h-4.5 w-4.5 text-gray-600 hover:text-gray-400" />
                            )}
                            <span className={`text-xs font-medium transition-all ${
                              task.completed ? 'text-gray-500 line-through' : 'text-gray-300'
                            }`}>
                              {task.title}
                            </span>
                          </div>
                          
                          <span className={`text-[9px] font-bold uppercase tracking-wider ${
                            task.completed ? 'text-indigo-500/60' : 'text-gray-600'
                          }`}>
                            {task.completed ? 'Validated' : 'Verify'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
