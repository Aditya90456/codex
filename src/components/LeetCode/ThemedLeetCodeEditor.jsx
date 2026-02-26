import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useTheme } from '../../contexts/ThemeContext';
import useResponsiveTheme from '../../hooks/useResponsiveTheme';
import Editor from '@monaco-editor/react';
import { 
  Play, Send, Settings, Maximize2, Minimize2, 
  Code2, Terminal, Zap, Copy, Download, Share2,
  ChevronRight, ChevronDown, Clock, Timer, Pause, RotateCcw
} from 'lucide-react';
import { dsaProblems } from '../../data/dsaProblems';
import ThemeSelector from '../UI/ThemeSelector';
import LeetCodeHeader from './LeetCodeHeader';
import ProblemDescription from '../ProblemDescription';
import ResponsiveButton from '../UI/ResponsiveButton';
import MindControlThinkingPanel from '../MindControl/MindControlThinkingPanel';
import AutoDetectionPanel from './AutoDetectionPanel';
import WelcomeOverlay from './WelcomeOverlay';
import { codeAutoDetector } from '../../services/codeAutoDetection';
import { useWelcomeState, useAutoStart } from '../../hooks/useAutoOpen';
import '../../styles/mind-control-thinking.css';
import '../../styles/auto-detection-panel.css';
import '../../styles/welcome-overlay.css';

const ThemedLeetCodeEditor = () => {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const { theme, currentTheme } = useTheme();
  const { 
    isMobile, 
    isTablet, 
    adaptiveStyles, 
    getResponsiveClasses,
    getThemeClasses 
  } = useResponsiveTheme();

  // Problem state
  const [selectedProblem, setSelectedProblem] = useState(dsaProblems[0]);
  const [code, setCode] = useState(dsaProblems[0]?.starterCode || '');
  const [language, setLanguage] = useState('javascript');
  
  // UI state
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);
  const [consoleTab, setConsoleTab] = useState('testcase');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [customInput, setCustomInput] = useState('');
  
  // Layout state
  const [isLeftPanelMinimized, setIsLeftPanelMinimized] = useState(false);
  const [isConsoleMinimized, setIsConsoleMinimized] = useState(false);
  const [showProblemList, setShowProblemList] = useState(false);
  
  // Timer state
  const [timerDuration, setTimerDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // Auto-detection state
  const [autoAnalysis, setAutoAnalysis] = useState(null);
  const [emotionData, setEmotionData] = useState(null);
  const [typingHistory, setTypingHistory] = useState([]);
  
  // Welcome state
  const { showWelcome, dismissWelcome } = useWelcomeState();
  
  const editorRef = useRef(null);
  const timerRef = useRef(null);

  // Auto-start initial analysis
  useAutoStart(() => {
    if (code) {
      const analysis = codeAutoDetector.analyze(code, [], null);
      setAutoAnalysis(analysis);
    }
  }, 2000, [code]);

  // Timer logic
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    const percentage = (timeLeft / (timerDuration * 60)) * 100;
    if (percentage > 50) return 'text-green-400';
    if (percentage > 25) return 'text-yellow-400';
    return 'text-red-400';
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value) => {
    setCode(value || '');
    
    // Track typing for auto-detection
    setTypingHistory(prev => {
      const newHistory = [...prev, {
        timestamp: Date.now(),
        key: 'typing',
        length: (value || '').length
      }];
      return newHistory.slice(-100); // Keep last 100
    });
    
    // Auto-analyze code every 10 changes
    if (typingHistory.length % 10 === 0) {
      const analysis = codeAutoDetector.analyze(value || '', typingHistory, emotionData);
      setAutoAnalysis(analysis);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setConsoleTab('result');
    setConsoleOutput([{ type: 'info', message: '⏳ Running code...' }]);

    try {
      const testCase = selectedProblem.examples[0];
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      
      const response = await fetch(`${backendUrl}/api/leetcode/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          testCases: [{ input: testCase.input, expected: testCase.output }],
          problemId: selectedProblem.id
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const result = data.results[0];
        setTestResults(result);
        setConsoleOutput([
          { type: 'success', message: '✓ Code executed successfully' },
          { type: 'info', message: `Input: ${testCase.input}` },
          { type: result.passed ? 'success' : 'error', message: `Output: ${JSON.stringify(result.output)}` },
          { type: 'success', message: `Expected: ${testCase.output}` },
          { type: result.passed ? 'success' : 'error', message: result.passed ? '✓ Test passed' : '✗ Test failed' }
        ]);
      }
    } catch (error) {
      setConsoleOutput([
        { type: 'error', message: '❌ Execution error' },
        { type: 'error', message: error.message }
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
    setIsSubmitting(true);
    await runCode();
    setIsSubmitting(false);
  };

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' }
  ];

  return (
    <div 
      className={`h-screen flex flex-col overflow-hidden ${getThemeClasses('background')}`}
      style={{ background: `linear-gradient(135deg, ${theme.background})` }}
    >
      {/* Header */}
      <LeetCodeHeader 
        selectedProblem={selectedProblem}
        onProblemSelect={setSelectedProblem}
        showProblemList={showProblemList}
        setShowProblemList={setShowProblemList}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description */}
        {!isLeftPanelMinimized && (
          <div 
            className={getResponsiveClasses(
              'flex flex-col border-r',
              'w-full',
              'w-1/2',
              'w-2/5'
            )}
            style={{ 
              borderColor: theme.border.replace('border-', ''),
              background: `linear-gradient(135deg, ${theme.card})`
            }}
          >
            <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: theme.border.replace('border-', '') }}>
              <h3 className={`font-semibold ${theme.text}`}>Description</h3>
              <button
                onClick={() => setIsLeftPanelMinimized(true)}
                className={`p-1.5 rounded hover:bg-white/10 ${theme.text}`}
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <ProblemDescription problem={selectedProblem} />
              
              {/* Auto-Detection Panel */}
              <AutoDetectionPanel 
                analysis={autoAnalysis}
                emotionData={emotionData}
              />
              
              {/* Mind Control Thinking Panel */}
              <MindControlThinkingPanel 
                problemId={selectedProblem?.id}
                onThoughtsSave={(thoughts) => {
                  console.log('Thoughts saved:', thoughts);
                }}
                onEmotionChange={(emotion) => {
                  setEmotionData(emotion);
                  // Re-analyze with new emotion data
                  if (code) {
                    const analysis = codeAutoDetector.analyze(code, typingHistory, emotion);
                    setAutoAnalysis(analysis);
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Minimized Left Panel Button */}
        {isLeftPanelMinimized && (
          <button
            onClick={() => setIsLeftPanelMinimized(false)}
            className={`w-8 flex items-center justify-center border-r hover:bg-white/10 ${theme.text}`}
            style={{ borderColor: theme.border.replace('border-', '') }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Right Panel - Code Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor Toolbar */}
          <div 
            className="flex items-center justify-between p-2 border-b"
            style={{ 
              borderColor: theme.border.replace('border-', ''),
              background: `linear-gradient(135deg, ${theme.card})`
            }}
          >
            <div className="flex items-center gap-2">
              <Code2 className={`w-4 h-4 ${theme.text}`} />
              <span className={`text-sm font-medium ${theme.text}`}>Code Editor</span>
              
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`ml-2 px-3 py-1.5 rounded-lg text-sm border ${theme.border} ${theme.text}`}
                style={{ background: `linear-gradient(135deg, ${theme.card})` }}
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              {/* Timer */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/20">
                <Clock className={`w-4 h-4 ${getTimerColor()}`} />
                <span className={`text-sm font-mono ${getTimerColor()}`}>
                  {formatTime(timeLeft)}
                </span>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`p-1 rounded hover:bg-white/10 ${theme.text}`}
                >
                  {isTimerRunning ? <Pause className="w-3 h-3" /> : <Timer className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => setTimeLeft(timerDuration * 60)}
                  className={`p-1 rounded hover:bg-white/10 ${theme.text}`}
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              {/* Font Size */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setFontSize(Math.max(10, fontSize - 2))}
                  className={`px-2 py-1 rounded hover:bg-white/10 ${theme.text}`}
                >
                  A-
                </button>
                <span className={`text-xs ${theme.textSecondary}`}>{fontSize}px</span>
                <button
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  className={`px-2 py-1 rounded hover:bg-white/10 ${theme.text}`}
                >
                  A+
                </button>
              </div>

              {/* Theme Selector */}
              <ThemeSelector variant="compact" showLabel={false} />

              {/* Settings */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded hover:bg-white/10 ${theme.text}`}
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              theme={theme.editorTheme || 'vs-dark'}
              options={{
                fontSize,
                minimap: { enabled: !isMobile },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                lineNumbers: 'on',
                glyphMargin: true,
                folding: true,
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 3,
                renderLineHighlight: 'all',
                scrollbar: {
                  vertical: 'auto',
                  horizontal: 'auto',
                  useShadows: false,
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10
                }
              }}
            />
          </div>

          {/* Action Buttons */}
          <div 
            className="flex items-center justify-between p-3 border-t"
            style={{ 
              borderColor: theme.border.replace('border-', ''),
              background: `linear-gradient(135deg, ${theme.card})`
            }}
          >
            <div className="flex items-center gap-2">
              <ResponsiveButton
                onClick={runCode}
                disabled={isRunning}
                variant="secondary"
                icon={Play}
                className="gap-2"
              >
                {isRunning ? 'Running...' : 'Run'}
              </ResponsiveButton>

              <ResponsiveButton
                onClick={submitCode}
                disabled={isSubmitting}
                variant="primary"
                icon={Send}
                className="gap-2"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </ResponsiveButton>
            </div>

            <div className="flex items-center gap-2">
              <button className={`p-2 rounded hover:bg-white/10 ${theme.text}`}>
                <Copy className="w-4 h-4" />
              </button>
              <button className={`p-2 rounded hover:bg-white/10 ${theme.text}`}>
                <Download className="w-4 h-4" />
              </button>
              <button className={`p-2 rounded hover:bg-white/10 ${theme.text}`}>
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Console Panel */}
          {!isConsoleMinimized && (
            <div 
              className="h-48 border-t flex flex-col"
              style={{ 
                borderColor: theme.border.replace('border-', ''),
                background: `linear-gradient(135deg, ${theme.card})`
              }}
            >
              <div className="flex items-center justify-between p-2 border-b" style={{ borderColor: theme.border.replace('border-', '') }}>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setConsoleTab('testcase')}
                    className={`px-3 py-1.5 text-sm font-medium rounded ${
                      consoleTab === 'testcase' 
                        ? getThemeClasses('primary') + ' text-white'
                        : theme.textSecondary + ' hover:' + theme.text
                    }`}
                  >
                    Testcase
                  </button>
                  <button
                    onClick={() => setConsoleTab('result')}
                    className={`px-3 py-1.5 text-sm font-medium rounded ${
                      consoleTab === 'result'
                        ? getThemeClasses('primary') + ' text-white'
                        : theme.textSecondary + ' hover:' + theme.text
                    }`}
                  >
                    Result
                  </button>
                </div>
                
                <button
                  onClick={() => setIsConsoleMinimized(true)}
                  className={`p-1.5 rounded hover:bg-white/10 ${theme.text}`}
                >
                  <ChevronDown className="w-4 h-4" /> 
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                {consoleTab === 'testcase' && (
                  <div>
                    <label className={`text-sm ${theme.textSecondary} mb-2 block`}>
                      Custom Input
                    </label>
                    <textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Enter test input..."
                      className={`w-full h-24 p-2 rounded border ${theme.border} ${theme.text} font-mono text-sm`}
                      style={{ background: 'rgba(0,0,0,0.2)' }}
                    />
                  </div>
                )}

                {consoleTab === 'result' && (
                  <div className="space-y-1 font-mono text-sm">
                    {consoleOutput.map((output, idx) => (
                      <div
                        key={idx}
                        className={
                          output.type === 'success' ? 'text-green-400' :
                          output.type === 'error' ? 'text-red-400' :
                          theme.textSecondary
                        }
                      >
                        {output.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Minimized Console Button */}
          {isConsoleMinimized && (
            <button
              onClick={() => setIsConsoleMinimized(false)}
              className={`w-full py-2 border-t hover:bg-white/10 ${theme.text} flex items-center justify-center gap-2`}
              style={{ borderColor: theme.border.replace('border-', '') }}
            >
              <Terminal className="w-4 h-4" />
              <span className="text-sm">Show Console</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemedLeetCodeEditor;
