import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react';

const ArrayVisualizer = ({ array, highlights = [], pointers = [], operations = [] }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  useEffect(() => {
    if (isPlaying && currentStep < operations.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (currentStep >= operations.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, operations.length, speed]);

  const getColor = (index) => {
    if (highlights.includes(index)) return 'bg-yellow-500';
    if (pointers.some(p => p.index === index)) return 'bg-blue-500';
    return 'bg-purple-600';
  };

  const getPointerLabel = (index) => {
    const pointer = pointers.find(p => p.index === index);
    return pointer ? pointer.label : null;
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Array Visualization</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            disabled={currentStep === 0}
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(operations.length - 1, currentStep + 1))}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            disabled={currentStep >= operations.length - 1}
          >
            <SkipForward className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setCurrentStep(0);
              setIsPlaying(false);
            }}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Array Display */}
      <div className="flex items-end justify-center gap-2 mb-8 min-h-[200px]">
        {array.map((value, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            {/* Pointer Label */}
            {getPointerLabel(index) && (
              <div className="text-xs font-bold text-blue-400 animate-bounce">
                {getPointerLabel(index)}
              </div>
            )}
            
            {/* Array Element */}
            <div
              className={`
                ${getColor(index)}
                text-white font-bold rounded-lg
                flex items-center justify-center
                transition-all duration-300
                transform hover:scale-110
                shadow-lg
              `}
              style={{
                width: '60px',
                height: `${Math.max(40, value * 10)}px`,
                minHeight: '40px'
              }}
            >
              {value}
            </div>
            
            {/* Index Label */}
            <div className="text-xs text-gray-400">[{index}]</div>
          </div>
        ))}
      </div>

      {/* Operation Description */}
      {operations[currentStep] && (
        <div className="bg-slate-900/50 rounded-lg p-4 border border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              Step {currentStep + 1} of {operations.length}
            </span>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="bg-slate-700 text-white text-sm rounded px-2 py-1"
            >
              <option value={2000}>0.5x</option>
              <option value={1000}>1x</option>
              <option value={500}>2x</option>
              <option value={250}>4x</option>
            </select>
          </div>
          <p className="text-white font-medium">{operations[currentStep].description}</p>
          {operations[currentStep].code && (
            <pre className="mt-2 text-sm text-gray-300 bg-slate-800 p-2 rounded">
              {operations[currentStep].code}
            </pre>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mt-4 bg-slate-700 rounded-full h-2 overflow-hidden">
        <div
          className="bg-purple-600 h-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / operations.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ArrayVisualizer;
