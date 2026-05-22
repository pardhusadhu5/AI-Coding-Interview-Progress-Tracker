import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { geminiService } from '../services/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Sparkles, 
  Terminal, 
  Code, 
  Award, 
  ListChecks, 
  CheckCircle,
  FileCode,
  ArrowRight,
  TrendingUp,
  Cpu,
  RefreshCw,
  Eye
} from 'lucide-react';

export default function Interview() {
  const { recordSolvedProblem } = useApp();
  
  // Selection States
  const [topic, setTopic] = useState('algorithms');
  const [difficulty, setDifficulty] = useState('easy');
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // Workspace States
  const [code, setCode] = useState('');
  const [submittingSolution, setSubmittingSolution] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [codeTab, setCodeTab] = useState('mine'); // 'mine' | 'refactored'

  // Topic Options
  const topics = [
    { id: 'algorithms', label: 'Algorithms & Structures' },
    { id: 'react', label: 'React UI Components' },
    { id: 'system_design', label: 'System Architecture' },
  ];

  // Difficulty Options
  const difficulties = [
    { id: 'easy', label: 'Easy', color: 'text-emerald-400' },
    { id: 'medium', label: 'Medium', color: 'text-amber-400' },
    { id: 'hard', label: 'Hard', color: 'text-red-400' },
  ];

  const handleGenerateQuestion = async () => {
    setLoadingQuestion(true);
    setAnalysisResult(null);
    setCodeTab('mine');
    try {
      const question = await geminiService.fetchQuestion(topic, difficulty);
      setCurrentQuestion(question);
      setCode(question.starterCode || '');
    } catch (e) {
      console.error(e);
      alert('Error fetching question.');
    } finally {
      setLoadingQuestion(false);
    }
  };

  const handleSubmitSolution = async () => {
    if (!currentQuestion) return;
    setSubmittingSolution(true);
    setAnalysisResult(null);
    try {
      const result = await geminiService.analyzeCode(
        currentQuestion.title,
        currentQuestion.problemDescription,
        code,
        topic
      );
      setAnalysisResult(result);
      
      // Save result to AppContext history
      await recordSolvedProblem(
        currentQuestion.id,
        currentQuestion.title,
        topic,
        difficulty,
        result.score
      );
    } catch (e) {
      console.error(e);
      alert('AI assessment failed. Make sure your Gemini API key is valid or toggle to Simulation mode.');
    } finally {
      setSubmittingSolution(false);
    }
  };

  // Helper for generating line numbers in editor
  const getLineNumbers = () => {
    const lines = code.split('\n');
    return lines.map((_, i) => (
      <div key={i} className="text-gray-600 text-xs font-mono pr-2 text-right select-none">
        {i + 1}
      </div>
    ));
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
      {/* Configuration Header Card */}
      {!currentQuestion && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-2xl p-8 border text-left max-w-2xl mx-auto space-y-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              Configure AI Code Challenge
            </h2>
            <p className="text-xs text-gray-400">
              Select your domain parameters. The Google Gemini model will initialize a mock coding prompt.
            </p>
          </div>

          <div className="space-y-4">
            {/* Choose Topic */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Topic</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {topics.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTopic(t.id)}
                    className={`px-4 py-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      topic === t.id 
                        ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400 shadow-md' 
                        : 'bg-gray-950 border-gray-900 text-gray-400 hover:text-white hover:border-gray-800'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Difficulty */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Difficulty</label>
              <div className="grid grid-cols-3 gap-3">
                {difficulties.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDifficulty(d.id)}
                    className={`px-4 py-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      difficulty === d.id 
                        ? 'bg-purple-500/10 border-purple-500/50 text-purple-400 shadow-md' 
                        : 'bg-gray-950 border-gray-900 text-gray-400 hover:text-white hover:border-gray-800'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateQuestion}
              disabled={loadingQuestion}
              className="w-full flex items-center justify-center gap-2 py-3 mt-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:opacity-95 shadow-md shadow-indigo-950/60 transition-opacity disabled:opacity-50 active:scale-[0.99]"
            >
              {loadingQuestion ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  <span>Synthesizing challenge...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white" />
                  <span>Generate Code Challenge</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Coding Workspace (Split pane) */}
      {currentQuestion && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column: Problem Details */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel rounded-2xl p-6 border text-left space-y-4"
            >
              {/* Back & Title */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <button
                  onClick={() => setCurrentQuestion(null)}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
                >
                  ← Select Category
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider bg-gray-950 px-2 py-0.5 border border-gray-900 rounded">
                    {topic.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider bg-purple-500/10 px-2 py-0.5 border border-purple-500/20 rounded">
                    {difficulty}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white leading-tight">
                  {currentQuestion.title}
                </h2>
                <div className="bg-gray-950/60 border border-gray-900 rounded-xl p-4 overflow-y-auto max-h-[30vh]">
                  <p className="text-sm text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">
                    {currentQuestion.problemDescription}
                  </p>
                </div>
              </div>

              {currentQuestion.constraints && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Constraints</h4>
                  <pre className="bg-gray-950/45 p-3 rounded-lg border border-gray-900/60 text-xs text-gray-400 font-mono overflow-x-auto leading-relaxed">
                    {currentQuestion.constraints}
                  </pre>
                </div>
              )}

              {currentQuestion.expectedComplexity && (
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Goal Targets</h4>
                  <div className="flex items-center gap-2 text-xs text-indigo-300 font-semibold bg-indigo-500/5 border border-indigo-500/10 p-2.5 rounded-lg">
                    <Cpu className="h-4 w-4" />
                    <span>{currentQuestion.expectedComplexity}</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* AI Review Results Panel */}
            <AnimatePresence>
              {analysisResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="glass-panel rounded-2xl p-6 border border-indigo-500/20 text-left space-y-5"
                >
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-indigo-400 animate-bounce" />
                      <h3 className="text-base font-bold text-white">AI Evaluation Score</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-extrabold text-indigo-400">
                        {analysisResult.score}/100
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                        analysisResult.rating === 'Excellent' 
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/35' 
                          : analysisResult.rating === 'Good' 
                          ? 'text-amber-400 bg-amber-500/10 border-amber-500/35' 
                          : 'text-red-400 bg-red-500/10 border-red-500/35'
                      }`}>
                        {analysisResult.rating}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed text-gray-300">
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-400">Correctness & Edge Cases</h4>
                      <p className="bg-gray-950/40 border border-gray-900 p-2.5 rounded-lg">
                        {analysisResult.correctness}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-400">Asymptotic Complexity</h4>
                      <p className="bg-gray-950/40 border border-gray-900 p-2.5 rounded-lg font-mono text-indigo-300">
                        {analysisResult.complexity}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-bold text-gray-400">Refactoring Recommendations</h4>
                      <ul className="space-y-1.5 bg-gray-950/40 border border-gray-900 p-3 rounded-lg">
                        {analysisResult.improvements.map((imp, index) => (
                          <li key={index} className="flex gap-2 items-start text-gray-400">
                            <span className="text-indigo-400 mt-0.5 font-bold">✓</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCodeTab('refactored');
                      // Scroll to right column code tab or focus
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/15 hover:border-indigo-500/30 transition-all active:scale-[0.99]"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Optimized Code Blueprint</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Code Editor */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel rounded-2xl border text-left flex flex-col h-[70vh] shadow-2xl relative overflow-hidden"
          >
            {/* Editor Tab Headers */}
            <div className="flex items-center justify-between border-b border-gray-800 bg-gray-950 px-4 py-2">
              <div className="flex gap-1.5">
                <button
                  onClick={() => setCodeTab('mine')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    codeTab === 'mine' 
                      ? 'bg-gray-800/80 text-white border border-gray-700/60' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5" />
                  <span>solution.js</span>
                </button>
                {analysisResult && (
                  <button
                    onClick={() => setCodeTab('refactored')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      codeTab === 'refactored' 
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' 
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    <span>optimised.js</span>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  Sandbox Editor
                </span>
              </div>
            </div>

            {/* Code Textarea Area */}
            <div className="flex-1 flex overflow-hidden bg-[#030712] relative">
              {/* Line Numbers gutter */}
              <div className="bg-[#030712] border-r border-gray-900/65 py-4 pl-3 pr-2 flex flex-col items-end select-none">
                {codeTab === 'mine' ? getLineNumbers() : (
                  analysisResult?.refactoredCode.split('\n').map((_, i) => (
                    <div key={i} className="text-indigo-900/80 text-xs font-mono pr-2 text-right">
                      {i + 1}
                    </div>
                  ))
                )}
              </div>

              {/* Text Input */}
              {codeTab === 'mine' ? (
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={submittingSolution}
                  className="flex-1 p-4 bg-transparent text-gray-200 font-mono text-xs overflow-y-auto leading-relaxed resize-none h-full outline-none"
                  spellCheck="false"
                />
              ) : (
                <pre className="flex-1 p-4 bg-indigo-950/5 text-indigo-300 font-mono text-xs overflow-y-auto leading-relaxed h-full select-text">
                  <code>{analysisResult?.refactoredCode || '// No optimizations loaded yet.'}</code>
                </pre>
              )}
            </div>

            {/* Action Bar Footer */}
            <div className="border-t border-gray-800 bg-[#080b18] px-5 py-4 flex items-center justify-between">
              <button
                onClick={handleGenerateQuestion}
                disabled={submittingSolution}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white border border-transparent hover:bg-gray-850 hover:border-gray-800 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                Reset Challenge
              </button>

              <button
                onClick={handleSubmitSolution}
                disabled={submittingSolution || codeTab !== 'mine'}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 shadow-md shadow-indigo-950/50 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {submittingSolution ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin text-white" />
                    <span>AI Reviewing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                    <span>Run AI Analysis</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
