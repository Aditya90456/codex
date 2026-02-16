import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Zap,
  Brain,
  ArrowRight,
  ArrowDown,
  CheckCircle,
  Lightbulb,
  X
} from 'lucide-react';

const AICodeExplainer = ({ code, problemTitle, language = 'javascript', onClose }) => {
  const [isExplaining, setIsExplaining] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const intervalRef = useRef(null);

  const startExplanation = async () => {
    setIsExplaining(true);
    setExplanation(null);
    
    try {
      // Use backend URL from environment or default to localhost
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      
      // Check if backend URL is configured in production
      if (import.meta.env.PROD && !import.meta.env.VITE_BACKEND_URL) {
        throw new Error('Backend not configured. Please set VITE_BACKEND_URL environment variable.');
      }
      
      const response = await fetch(`${backendUrl}/api/ai/explain-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          problemTitle: problemTitle,
          language: language
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get explanation from AI');
      }

      const data = await response.json();
      setExplanation(data.explanation);
      setCurrentStep(0);
    } catch (error) {
      console.error('Error getting AI explanation:', error);
      // Show helpful error message to user
      setExplanation({
        algorithm: "Setup Required",
        timeComplexity: "N/A",
        spaceComplexity: "N/A",
        steps: [
          {
            id: 1,
            title: "AI Explainer Not Available",
            description: error.message || "Failed to connect to AI service",
            explanation: import.meta.env.PROD 
              ? "The AI Code Explainer requires a backend server. Please deploy the backend to Render or another service and set the VITE_BACKEND_URL environment variable in Vercel."
              : "Please make sure the backend server is running on port 3001. Run 'npm start' in the backend folder."
          }
        ],
        keyInsights: import.meta.env.PROD ? [
          "Deploy backend to Render.com (free tier available)",
          "Set VITE_BACKEND_URL in Vercel environment variables",
          "See AI_EXPLAINER_VERCEL_FIX.md for detailed instructions"
        ] : [
          "Check that backend server is running on port 3001",
          "Verify GEMINI_API_KEY is set in backend/.env",
          "Ensure you have internet connection for Gemini API"
        ]
      });
      setCurrentStep(0);
    }
  };

  const playAnimation = () => {
    if (!explanation) return;
    
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= explanation.steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, animationSpeed);
  };

  const pauseAnimation = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const nextStep = () => {
    if (currentStep < explanation.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const ArrayVisualization = ({ data, pointers = [], highlight = [], calculation, success }) => (
    <div className="flex flex-col items-center space-y-4 p-6 bg-slate-800 rounded-lg">
      <div className="flex space-x-2">
        {data.map((value, index) => (
          <div
            key={index}
            className={`
              w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold text-lg
              transition-all duration-500 transform
              ${highlight.includes(index) 
                ? success 
                  ? 'bg-green-500 border-green-400 text-white scale-110 shadow-lg' 
                  : 'bg-blue-500 border-blue-400 text-white scale-110 shadow-lg'
                : 'bg-slate-700 border-slate-600 text-gray-300'
              }
            `}
          >
            {value}
          </div>
        ))}
      </div>
      
      {/* Pointers */}
      <div className="flex space-x-2 relative w-full justify-center">
        {data.map((_, index) => {
          const pointer = pointers.find(p => p.index === index);
          return (
            <div key={index} className="w-12 h-8 flex flex-col items-center justify-end">
              {pointer && (
                <div className="flex flex-col items-center animate-bounce">
                  <ArrowDown 
                    className={`w-4 h-4 ${
                      pointer.color === 'blue' ? 'text-blue-400' :
                      pointer.color === 'red' ? 'text-red-400' :
                      'text-green-400'
                    }`} 
                  />
                  <span className={`text-xs font-semibold ${
                    pointer.color === 'blue' ? 'text-blue-400' :
                    pointer.color === 'red' ? 'text-red-400' :
                    'text-green-400'
                  }`}>
                    {pointer.label}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Calculation */}
      {calculation && (
        <div className={`
          px-4 py-2 rounded-lg font-mono text-lg font-bold
          ${success 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          }
        `}>
          {calculation}
        </div>
      )}
    </div>
  );

  const LinkedListVisualization = ({ nodes, pointers = [], reversed = [], success }) => (
    <div className="flex flex-col items-center space-y-6 p-6 bg-slate-800 rounded-lg">
      {/* Nodes */}
      <div className="flex items-center space-x-4">
        {nodes.map((value, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`
                w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold text-lg
                transition-all duration-500 transform
                ${reversed.includes(index)
                  ? success
                    ? 'bg-green-500 border-green-400 text-white'
                    : 'bg-purple-500 border-purple-400 text-white'
                  : 'bg-slate-700 border-slate-600 text-gray-300'
                }
              `}
            >
              {value}
            </div>
            {index < nodes.length - 1 && (
              <ArrowRight 
                className={`w-6 h-6 mx-2 transition-all duration-500 ${
                  reversed.includes(index) && reversed.includes(index + 1)
                    ? 'text-green-400 rotate-180'
                    : 'text-gray-400'
                }`} 
              />
            )}
          </div>
        ))}
      </div>

      {/* Pointers */}
      <div className="flex items-center space-x-4 w-full justify-center">
        {nodes.map((_, index) => {
          const pointer = pointers.find(p => p.position === index);
          return (
            <div key={index} className="flex items-center">
              <div className="w-12 h-8 flex flex-col items-center justify-start">
                {pointer && (
                  <div className="flex flex-col items-center animate-pulse">
                    <span className={`text-xs font-semibold mb-1 ${
                      pointer.color === 'blue' ? 'text-blue-400' :
                      pointer.color === 'red' ? 'text-red-400' :
                      'text-green-400'
                    }`}>
                      {pointer.label}
                    </span>
                    <ArrowDown 
                      className={`w-4 h-4 ${
                        pointer.color === 'blue' ? 'text-blue-400' :
                        pointer.color === 'red' ? 'text-red-400' :
                        'text-green-400'
                      }`} 
                    />
                  </div>
                )}
              </div>
              {index < nodes.length - 1 && <div className="w-10"></div>}
            </div>
          );
        })}
        
        {/* Special pointer for "before" position */}
        {pointers.find(p => p.position === "before") && (
          <div className="absolute left-0 flex flex-col items-center animate-pulse">
            <span className="text-xs font-semibold mb-1 text-red-400">prev</span>
            <ArrowDown className="w-4 h-4 text-red-400" />
          </div>
        )}
      </div>
    </div>
  );

  const ConceptVisualization = ({ title, items }) => (
    <div className="p-6 bg-slate-800 rounded-lg">
      <h4 className="text-lg font-semibold text-white mb-4 text-center">{title}</h4>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg transform transition-all duration-300 hover:scale-105"
          >
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {index + 1}
            </div>
            <span className="text-gray-300">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVisualization = (visualization) => {
    if (!visualization) return null;

    switch (visualization.type) {
      case 'array':
        return <ArrayVisualization {...visualization} />;
      case 'linkedlist':
        return <LinkedListVisualization {...visualization} />;
      case 'concept':
        return <ConceptVisualization {...visualization} />;
      default:
        return null;
    }
  };

  if (!isExplaining) {
    return (
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose?.()}
      >
        <div className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-2xl border border-purple-500/30 max-w-2xl w-full p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Brain className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">AI Code Explainer</h3>
                <p className="text-sm text-gray-400">Powered by Gemini AI</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="text-center mb-8">
            <p className="text-gray-300 text-lg mb-2">
              Get step-by-step animated explanations of your algorithm
            </p>
            <p className="text-gray-500 text-sm">
              Visualize data structures, understand complexity, and master the logic
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-sm text-gray-300">Step-by-step</div>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">📊</div>
              <div className="text-sm text-gray-300">Visual Animations</div>
            </div>
            <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-sm text-gray-300">Complexity Analysis</div>
            </div>
          </div>

          <button
            onClick={startExplanation}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 rounded-xl font-bold text-lg text-white transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/30"
          >
            <Zap className="w-6 h-6" />
            Explain My Code
          </button>
        </div>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose?.()}
      >
        <div className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-2xl border border-purple-500/30 max-w-md w-full p-8 shadow-2xl">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 animate-spin">
                <div className="h-full w-full border-4 border-purple-500/30 border-t-purple-500 rounded-full"></div>
              </div>
              <div className="absolute inset-2 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}>
                <div className="h-full w-full border-4 border-pink-500/30 border-t-pink-500 rounded-full"></div>
              </div>
              <Brain className="absolute inset-0 m-auto w-8 h-8 text-purple-400 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI is analyzing your code...</h3>
            <p className="text-gray-400 text-sm">This may take a few seconds</p>
          </div>
        </div>
      </div>
    );
  }

  const currentStepData = explanation.steps[currentStep];

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-white/10 max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{explanation.algorithm}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-white/90">
                  <span className="flex items-center gap-1">
                    ⏱️ Time: <span className="font-semibold">{explanation.timeComplexity}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    💾 Space: <span className="font-semibold">{explanation.spaceComplexity}</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetAnimation}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm"
                title="Reset"
              >
                <RotateCcw className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={isPlaying ? pauseAnimation : playAnimation}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/90 font-semibold">Step {currentStep + 1} of {explanation.steps.length}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/80">Speed:</span>
                <select
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                  className="bg-white/20 text-white text-xs px-3 py-1 rounded-lg border border-white/20 focus:outline-none focus:border-white/40"
                >
                  <option value={2000} className="bg-slate-800">Slow</option>
                  <option value={1000} className="bg-slate-800">Normal</option>
                  <option value={500} className="bg-slate-800">Fast</option>
                </select>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300 shadow-lg"
                style={{ width: `${((currentStep + 1) / explanation.steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Current Step */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                {currentStep + 1}
              </div>
              <h4 className="text-xl font-bold text-white">{currentStepData.title}</h4>
            </div>
            
            <p className="text-gray-300 text-lg mb-6">{currentStepData.description}</p>

            {/* Visualization */}
            {currentStepData.visualization && (
              <div className="mb-6">
                {renderVisualization(currentStepData.visualization)}
              </div>
            )}

            {/* Explanation */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-5 rounded-xl border border-blue-500/30">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-yellow-400 mb-2">Explanation</h5>
                  <p className="text-gray-300 leading-relaxed">{currentStepData.explanation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-5 rounded-xl border border-green-500/30">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Key Insights
            </h4>
            <ul className="space-y-3">
              {explanation.keyInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ArrowRight className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="leading-relaxed">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="bg-slate-800/50 border-t border-white/10 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg transition-all font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex space-x-2">
              {explanation.steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentStep
                      ? 'bg-purple-500 scale-125 shadow-lg shadow-purple-500/50'
                      : index < currentStep
                      ? 'bg-green-500'
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                  title={`Step ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextStep}
              disabled={currentStep === explanation.steps.length - 1}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-800 disabled:to-slate-800 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg transition-all font-semibold shadow-lg"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICodeExplainer;