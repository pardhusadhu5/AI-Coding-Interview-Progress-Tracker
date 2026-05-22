import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  Flame, 
  CheckCircle2, 
  Award, 
  Zap, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';

export default function Dashboard({ setCurrentTab }) {
  const { user, streak, solvedCount, problemsList } = useApp();

  // 1. Calculate Average Score
  const averageScore = problemsList.length > 0
    ? Math.round(problemsList.reduce((acc, curr) => acc + curr.score, 0) / problemsList.length)
    : 85;

  // 2. Prepare Data for Weekly Activity Chart
  const weeklyData = [
    { name: 'Mon', hours: 1.5, solved: 1 },
    { name: 'Tue', hours: 2.2, solved: 2 },
    { name: 'Wed', hours: 1.8, solved: 1 },
    { name: 'Thu', hours: 3.5, solved: 3 },
    { name: 'Fri', hours: 2.9, solved: 2 },
    { name: 'Sat', hours: 4.2, solved: 4 },
    { name: 'Sun', hours: 2.5, solved: 1 },
  ];

  // 3. Prepare Topic Stats for Bar Chart
  const topicCounts = problemsList.reduce((acc, curr) => {
    acc[curr.topic] = (acc[curr.topic] || 0) + 1;
    return acc;
  }, { algorithms: 2, react: 1, system_design: 1 }); // Seed initial values to look rich

  const topicData = [
    { name: 'Algorithms', count: topicCounts.algorithms, color: '#6366f1' },
    { name: 'React UI', count: topicCounts.react, color: '#a855f7' },
    { name: 'Sys Design', count: topicCounts.system_design, color: '#06b6d4' }
  ];

  // 4. Calculate Readiness Index
  const readinessIndex = Math.min(Math.round((solvedCount / 20) * 100), 100);

  const stats = [
    { 
      label: 'Coding Streak', 
      value: `${streak} Days`, 
      sub: 'Top 5% of prepared users', 
      icon: Flame, 
      color: 'text-orange-400 border-orange-500/20 bg-orange-500/5', 
      glow: 'glow-orange' 
    },
    { 
      label: 'Total Solved', 
      value: `${solvedCount} Tasks`, 
      sub: 'Aim for 20 for recruitment', 
      icon: CheckCircle2, 
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', 
      glow: 'glow-emerald' 
    },
    { 
      label: 'Average Score', 
      value: `${averageScore}%`, 
      sub: 'Based on AI review scores', 
      icon: Award, 
      color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5', 
      glow: 'glow-indigo' 
    },
    { 
      label: 'Recruitment Index', 
      value: `${readinessIndex}%`, 
      sub: 'Target: 80% preparedness', 
      icon: Zap, 
      color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5', 
      glow: 'glow-cyan' 
    },
  ];

  // Colors for difficulty badges
  const difficultyColors = {
    easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    hard: 'text-red-400 bg-red-500/10 border-red-500/25'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-7xl px-6 py-8 space-y-8"
    >
      {/* Welcome Banner */}
      <motion.div 
        variants={cardVariants}
        className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl glass-panel relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="text-left space-y-1 z-10">
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user?.displayName || 'Developer'}! 👋
          </h1>
          <p className="text-gray-400 text-sm">
            Here is your daily preparation report. Keep up the streak to stay ahead in mock boards.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3 z-10">
          <button
            onClick={() => setCurrentTab('interview')}
            className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold text-white shadow-md shadow-indigo-950/50 hover:shadow-indigo-500/10 transition-all active:scale-[0.98]"
          >
            <span>Start AI Interview</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* Stats Cards Row */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="glass-panel glass-panel-hover rounded-2xl p-5 border text-left flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-xl border ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-extrabold text-white leading-none">
                  {stat.value}
                </span>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  {stat.sub}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Line/Area Chart */}
        <motion.div 
          variants={cardVariants}
          className="lg:col-span-2 glass-panel rounded-2xl p-6 border text-left flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-white">Coding Activity Hours</h3>
              <p className="text-xs text-gray-400">Weekly coding hours log across active prep workspaces</p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+18% coding hours</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  stroke="#4b5563" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#4b5563" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ 
                    background: '#0c1020', 
                    borderColor: '#1f2937', 
                    borderRadius: '12px', 
                    color: '#fff',
                    fontSize: '12px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#6366f1" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorHours)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Topic Breakdown Bar Chart */}
        <motion.div 
          variants={cardVariants}
          className="glass-panel rounded-2xl p-6 border text-left flex flex-col justify-between"
        >
          <div className="mb-4">
            <h3 className="text-base font-bold text-white">Topics Breakdown</h3>
            <p className="text-xs text-gray-400">Total coding tasks solved per technical category</p>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} margin={{ top: 5, right: 10, left: -30, bottom: 5 }}>
                <XAxis 
                  dataKey="name" 
                  stroke="#4b5563" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#4b5563" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  allowDecimals={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ 
                    background: '#0c1020', 
                    borderColor: '#1f2937', 
                    borderRadius: '12px', 
                    color: '#fff',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {topicData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* History and Recommendations Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Solved Problems Feed */}
        <motion.div 
          variants={cardVariants}
          className="lg:col-span-2 glass-panel rounded-2xl p-6 border text-left space-y-4"
        >
          <div>
            <h3 className="text-base font-bold text-white">Recent Activity & Scores</h3>
            <p className="text-xs text-gray-400">Your solved coding reviews synced via local cloud databases</p>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {problemsList.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-xs">
                No problems solved yet. Try your first AI Mock Interview.
              </div>
            ) : (
              problemsList.map((item, idx) => (
                <div 
                  key={item.id || idx}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-gray-950 border border-gray-900 hover:border-gray-800/80 transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-gray-200">{item.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{item.topic.replace('_', ' ')}</span>
                      <span className="text-[10px] text-gray-600 font-medium">•</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wide ${difficultyColors[item.difficulty]}`}>
                        {item.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-indigo-400">{item.score}%</span>
                      <p className="text-[9px] text-gray-500 font-medium">{item.date}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recommended Actions */}
        <motion.div 
          variants={cardVariants}
          className="glass-panel rounded-2xl p-6 border text-left flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-white">Next Preparation Steps</h3>
              <p className="text-xs text-gray-400">Custom checklist curated by CodePilot recommendation core</p>
            </div>

            <div className="space-y-3.5 mt-2">
              <div 
                onClick={() => setCurrentTab('interview')}
                className="group flex gap-3 p-3 rounded-xl bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/10 hover:border-indigo-500/20 cursor-pointer transition-all"
              >
                <div className="h-8.5 w-8.5 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                  <Zap className="h-4 w-4" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-xs font-bold text-indigo-300 group-hover:text-indigo-200 transition-colors">Solve a Medium React Hook</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Prepare custom hooks callbacks for state lifecycle reviews.</p>
                </div>
              </div>

              <div 
                onClick={() => setCurrentTab('progress')}
                className="group flex gap-3 p-3 rounded-xl bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/10 hover:border-purple-500/20 cursor-pointer transition-all"
              >
                <div className="h-8.5 w-8.5 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  <Award className="h-4 w-4" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-xs font-bold text-purple-300 group-hover:text-purple-200 transition-colors">Configure System Design Nodes</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Design a distributed rate limiter roadmap to finish milestone 3.</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 rounded-xl bg-gray-950/60 border border-gray-900 text-xs">
                <div className="h-8.5 w-8.5 rounded-lg bg-gray-900 flex items-center justify-center text-gray-400">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-xs font-bold text-gray-400">Daily Recruiter Prep Quiz</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">Unlocks when daily coding streak reaches 7 consecutive days.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800/80 mt-4 text-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Beta Recruiter Link Active
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
