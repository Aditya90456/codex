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
  Lightbulb
} from 'lucide-react';

const AICodeExplainer = ({ code, problemTitle, language = 'javascript' }) => {
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
      // Use original backend (default port 3001, can be changed via VITE_BACKEND_URL)
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
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
      // Show error message to user
      setExplanation({
        algorithm: "Error",
        timeComplexity: "N/A",
        spaceComplexity: "N/A",
        steps: [
          {
            id: 1,
            title: "Unable to Generate Explanation",
            description: error.message || "Failed to connect to AI service",
            explanation: "Please make sure the backend server is running and Gemini API key is configured in backend/.env"
          }
        ],
        keyInsights: [
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
      <div className="p-6 bg-slate-900 rounded-lg border border-slate-700">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-purple-400 mr-2" />
            <h3 className="text-xl font-bold text-white">AI Code Explainer</h3>
          </div>
          <p className="text-gray-400 mb-6">
            Get step-by-step animated explanations of your algorithm
          </p>
          <button
            onClick={startExplanation}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 mx-auto"
          >
            <Zap className="w-5 h-5" />
            Explain My Code
          </button>
        </div>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className="p-6 bg-slate-900 rounded-lg border border-slate-700">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">AI is analyzing your code...</p>
        </div>
      </div>
    );
  }

  const currentStepData = explanation.steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-4 rounded-lg border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-400" />
              {explanation.algorithm}
            </h3>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="text-green-400">Time: {explanation.timeComplexity}</span>
              <span className="text-blue-400">Space: {explanation.spaceComplexity}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetAnimation}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={isPlaying ? pauseAnimation : playAnimation}
              className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Step {currentStep + 1} of {explanation.steps.length}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Speed:</span>
            <select
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              className="bg-slate-700 text-white text-xs px-2 py-1 rounded"
            >
              <option value={2000}>Slow</option>
              <option value={1000}>Normal</option>
              <option value={500}>Fast</option>
            </select>
          </div>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / explanation.steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current Step */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {currentStep + 1}
          </div>
          <h4 className="text-lg font-semibold text-white">{currentStepData.title}</h4>
        </div>
        
        <p className="text-gray-300 mb-6">{currentStepData.description}</p>

        {/* Visualization */}
        {currentStepData.visualization && (
          <div className="mb-6">
            {renderVisualization(currentStepData.visualization)}
          </div>
        )}

        {/* Explanation */}
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-300">{currentStepData.explanation}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-gray-500 rounded-lg transition-colors"
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
                  ? 'bg-purple-500 scale-125'
                  : index < currentStep
                  ? 'bg-green-500'
                  : 'bg-slate-600'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextStep}
          disabled={currentStep === explanation.steps.length - 1}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-gray-500 rounded-lg transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 p-4 rounded-lg border border-green-500/30">
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          Key Insights
        </h4>
        <ul className="space-y-2">
          {explanation.keyInsights.map((insight, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-300">
              <ArrowRight className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              {insight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AICodeExplainer;