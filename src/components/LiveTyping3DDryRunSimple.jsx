import { useState, useEffect } from 'react';
import { Activity, Play, Pause, RotateCcw, Zap, Eye, Maximize2, Box, Layers, GitBranch } from 'lucide-react';
import '../styles/live-typing-3d.css';

/**
 * CSS 3D Array Visualization (No Three.js required)
 */
const Array3DSimple = ({ data, highlightIndex }) => {
  return (
    <div className="flex items-center justify-center h-full perspective-1000">
      <div className="flex gap-4 transform-3d" style={{ transform: 'rotateX(15deg) rotateY(-15deg)' }}>
        {data.map((value, index) => (
          <div
            key={index}
            className={`relative transition-all duration-500 ${
              highlightIndex === index ? 'scale-125 z-10' : 'scale-100'
            }`}
            style={{
              transform: `translateZ(${highlightIndex === index ? '50px' : '0px'})`,
              animation: highlightIndex === index ? 'float 2s ease-in-out infinite' : 'none'
            }}
          >
            {/* 3D Box */}
            <div className="relative w-20 h-20 transform-style-3d">
              {/* Front face */}
              <div
                className={`absolute inset-0 flex items-center justify-center text-2xl font-bold rounded-xl border-2 ${
                  highlightIndex === index
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-300 shadow-2xl shadow-purple-500/50'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500 border-blue-300'
                }`}
                style={{ transform: 'translateZ(40px)' }}
              >
                <span className="text-white">{value}</span>
              </div>
              
              {/* Back face */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl border-2 border-slate-600"
                style={{ transform: 'translateZ(-40px) rotateY(180deg)' }}
              />
              
              {/* Top face */}
              <div
                className={`absolute inset-0 ${
                  highlightIndex === index ? 'bg-purple-400' : 'bg-blue-400'
                } rounded-xl opacity-80`}
                style={{ transform: 'rotateX(90deg) translateZ(40px)' }}
              />
              
              {/* Bottom face */}
              <div
                className="absolute inset-0 bg-slate-600 rounded-xl opacity-60"
                style={{ transform: 'rotateX(-90deg) translateZ(40px)' }}
              />
              
              {/* Left face */}
              <div
                className={`absolute inset-0 ${
                  highlightIndex === index ? 'bg-purple-600' : 'bg-blue-600'
                } rounded-xl opacity-70`}
                style={{ transform: 'rotateY(-90deg) translateZ(40px)' }}
              />
              
              {/* Right face */}
              <div
                className={`absolute inset-0 ${
                  highlightIndex === index ? 'bg-pink-600' : 'bg-cyan-600'
                } rounded-xl opacity-70`}
                style={{ transform: 'rotateY(90deg) translateZ(40px)' }}
              />
            </div>
            
            {/* Index label */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-400 font-mono">
              [{index}]
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * CSS 3D Stack Visualization
 */
const Stack3DSimple = ({ items }) => {
  return (
    <div className="flex items-center justify-center h-full perspective-1000">
      <div className="relative transform-3d" style={{ transform: 'rotateX(20deg) rotateY(-20deg)' }}>
        {/* Base platform */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg"
             style={{ transform: 'translateZ(-10px)' }} />
        
        {items.map((value, index) => (
          <div
            key={index}
            className="relative mb-2 transition-all duration-500"
            style={{
              animation: index === items.length - 1 ? 'float 2s ease-in-out infinite' : 'none',
              transform: `translateY(${-index * 70}px)`
            }}
          >
            <div className="relative w-28 h-16 transform-style-3d">
              {/* Front face */}
              <div
                className={`absolute inset-0 flex items-center justify-center text-xl font-bold rounded-lg border-2 ${
                  index === items.length - 1
                    ? 'bg-gradient-to-br from-red-500 to-orange-500 border-red-300 shadow-2xl shadow-red-500/50'
                    : 'bg-gradient-to-br from-purple-500 to-indigo-500 border-purple-300'
                }`}
                style={{ transform: 'translateZ(30px)' }}
              >
                <span className="text-white">{value}</span>
              </div>
              
              {/* Top face */}
              <div
                className={`absolute inset-0 ${
                  index === items.length - 1 ? 'bg-red-400' : 'bg-purple-400'
                } rounded-lg opacity-80`}
                style={{ transform: 'rotateX(90deg) translateZ(30px)' }}
              />
              
              {/* Side faces */}
              <div
                className={`absolute inset-0 ${
                  index === items.length - 1 ? 'bg-orange-600' : 'bg-indigo-600'
                } rounded-lg opacity-70`}
                style={{ transform: 'rotateY(-90deg) translateZ(56px)' }}
              />
              <div
                className={`absolute inset-0 ${
                  index === items.length - 1 ? 'bg-orange-600' : 'bg-indigo-600'
                } rounded-lg opacity-70`}
                style={{ transform: 'rotateY(90deg) translateZ(56px)' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * CSS 3D Tree Visualization
 */
const Tree3DSimple = ({ highlightIndex }) => {
  return (
    <div className="flex items-center justify-center h-full perspective-1000">
      <div className="relative transform-3d" style={{ transform: 'rotateX(10deg)' }}>
        {/* Root node */}
        <div className="flex justify-center mb-16">
          <div className={`relative w-16 h-16 rounded-full ${
            highlightIndex === 0 ? 'animate-pulse-glow' : ''
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-2xl"
                 style={{ transform: 'translateZ(30px)' }}>
              10
            </div>
          </div>
        </div>
        
        {/* Connecting lines */}
        <svg className="absolute top-16 left-1/2 transform -translate-x-1/2 w-64 h-32 pointer-events-none">
          <line x1="128" y1="0" x2="64" y2="80" stroke="#6366f1" strokeWidth="3" />
          <line x1="128" y1="0" x2="192" y2="80" stroke="#6366f1" strokeWidth="3" />
        </svg>
        
        {/* Child nodes */}
        <div className="flex justify-center gap-32">
          <div className={`relative w-14 h-14 rounded-full ${
            highlightIndex === 1 ? 'animate-pulse-glow' : ''
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl"
                 style={{ transform: 'translateZ(25px)' }}>
              5
            </div>
          </div>
          
          <div className={`relative w-14 h-14 rounded-full ${
            highlightIndex === 2 ? 'animate-pulse-glow' : ''
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl"
                 style={{ transform: 'translateZ(25px)' }}>
              15
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * CSS 3D Graph Visualization
 */
const Graph3DSimple = ({ highlightNode }) => {
  const nodes = [
    { id: 'A', x: 50, y: 20 },
    { id: 'B', x: 20, y: 50 },
    { id: 'C', x: 80, y: 50 },
    { id: 'D', x: 50, y: 80 }
  ];
  
  return (
    <div className="flex items-center justify-center h-full perspective-1000">
      <div className="relative w-full h-full transform-3d" style={{ transform: 'rotateX(15deg) rotateY(-10deg)' }}>
        {/* Edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line x1="50%" y1="20%" x2="20%" y2="50%" stroke="#64748b" strokeWidth="2" />
          <line x1="50%" y1="20%" x2="80%" y2="50%" stroke="#64748b" strokeWidth="2" />
          <line x1="20%" y1="50%" x2="50%" y2="80%" stroke="#64748b" strokeWidth="2" />
          <line x1="80%" y1="50%" x2="50%" y2="80%" stroke="#64748b" strokeWidth="2" />
        </svg>
        
        {/* Nodes */}
        {nodes.map((node, index) => (
          <div
            key={node.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div className={`relative w-12 h-12 rounded-full ${
              highlightNode === index ? 'animate-pulse-glow scale-125' : 'scale-100'
            } transition-all duration-300`}>
              <div className={`absolute inset-0 rounded-full flex items-center justify-center text-white font-bold shadow-xl ${
                highlightNode === index
                  ? 'bg-gradient-to-br from-pink-500 to-rose-500'
                  : 'bg-gradient-to-br from-cyan-500 to-blue-500'
              }`} style={{ transform: 'translateZ(20px)' }}>
                {node.id}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Main Live Typing 3D Dry Run Component (CSS-based, no Three.js required)
 */
const LiveTyping3DDryRunSimple = ({ code, language, isVisible, onClose }) => {
  const [visualizationType, setVisualizationType] = useState('array');
  const [data, setData] = useState({ array: [1, 2, 3, 4, 5] });
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [executionSteps, setExecutionSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  // Parse code in real-time as user types
  useEffect(() => {
    if (code) {
      const parsed = parseCodeTo3DData(code, language);
      setVisualizationType(parsed.type);
      setData(parsed.data);
      setExecutionSteps(parsed.steps);
      setCurrentStep(0);
      setHighlightIndex(-1);
    }
  }, [code, language]);

  // Auto-play execution steps
  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < executionSteps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          if (next >= executionSteps.length - 1) {
            setIsPlaying(false);
          }
          return next;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, executionSteps.length]);

  // Update visualization based on current step
  useEffect(() => {
    if (executionSteps[currentStep]) {
      const step = executionSteps[currentStep];
      setData(step.data);
      setHighlightIndex(step.highlightIndex);
    }
  }, [currentStep, executionSteps]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  
  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setHighlightIndex(-1);
  };

  const handleNext = () => {
    if (currentStep < executionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`live-3d-container ${isFullscreen ? 'fullscreen' : 'minimized'} bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20 flex flex-col`}>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">3D Live Dry Run</h3>
            <p className="text-xs text-gray-400">Real-time algorithm visualization</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Visualization Type Selector */}
          <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
            <button
              onClick={() => setVisualizationType('array')}
              className={`p-2 rounded transition-all ${visualizationType === 'array' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
              title="Array"
            >
              <Box className="w-4 h-4" />
            </button>
            <button
              onClick={() => setVisualizationType('stack')}
              className={`p-2 rounded transition-all ${visualizationType === 'stack' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
              title="Stack"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setVisualizationType('tree')}
              className={`p-2 rounded transition-all ${visualizationType === 'tree' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
              title="Tree"
            >
              <GitBranch className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-lg transition-all ${autoRotate ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700 text-gray-400'}`}
            title="Auto Rotate"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4 text-gray-300" />
          </button>
          
          <button
            onClick={onClose}
            className="p-2 bg-slate-700 hover:bg-red-500 rounded-lg transition-all"
          >
            <span className="text-gray-300 hover:text-white">✕</span>
          </button>
        </div>
      </div>

      {/* 3D Visualization Area */}
      <div className="flex-1 relative bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
        <div className={`w-full h-full ${autoRotate ? 'animate-slow-rotate' : ''}`}>
          {visualizationType === 'array' && (
            <Array3DSimple data={data.array || [1, 2, 3, 4, 5]} highlightIndex={highlightIndex} />
          )}
          
          {visualizationType === 'stack' && (
            <Stack3DSimple items={data.stack || [10, 20, 30]} />
          )}
          
          {visualizationType === 'tree' && (
            <Tree3DSimple highlightIndex={highlightIndex} />
          )}
          
          {visualizationType === 'graph' && (
            <Graph3DSimple highlightNode={highlightIndex} />
          )}
        </div>
        
        {/* Info Overlay */}
        <div className="info-overlay absolute top-4 left-4 px-4 py-2 rounded-xl">
          <div className="text-xs text-gray-400">
            Type: <span className="text-purple-400 font-semibold capitalize">{visualizationType}</span>
          </div>
          <div className="text-xs text-gray-400">
            Step: <span className="text-cyan-400 font-semibold">{currentStep + 1}/{executionSteps.length || 1}</span>
          </div>
        </div>
        
        {/* Live Indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-500/20 backdrop-blur px-3 py-1 rounded-full border border-green-500/30">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-green-400 font-semibold">LIVE</span>
        </div>
      </div>

      {/* Controls */}
      <div className="control-panel p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="control-button p-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 rounded-lg transition-all"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4 text-white" />
            </button>
            
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="control-button p-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous"
            >
              <span className="text-white">◀</span>
            </button>
            
            <button
              onClick={handlePlayPause}
              className="control-button p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg transition-all shadow-lg"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </button>
            
            <button
              onClick={handleNext}
              disabled={currentStep >= executionSteps.length - 1}
              className="control-button p-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next"
            >
              <span className="text-white">▶</span>
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex-1 mx-4">
            <div className="progress-bar h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${(currentStep / (executionSteps.length - 1 || 1)) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1 rounded-lg">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-yellow-400 font-semibold">Auto-Detect</span>
          </div>
        </div>
        
        {/* Current Step Description */}
        {executionSteps[currentStep] && (
          <div className="text-xs text-gray-300 bg-slate-800/50 rounded-lg p-3 border border-purple-500/20">
            <div className="flex items-start gap-2">
              <span className="text-purple-400">▶</span>
              <span>{executionSteps[currentStep].description}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Parse code to extract 3D visualization data
 */
function parseCodeTo3DData(code, language) {
  const lines = code.toLowerCase();
  
  // Detect array operations
  if (lines.includes('array') || lines.includes('[') || lines.includes('nums')) {
    const arrayMatch = code.match(/\[([^\]]+)\]/);
    const arrayData = arrayMatch 
      ? arrayMatch[1].split(',').map(n => n.trim()).filter(n => n && !isNaN(n))
      : [1, 2, 3, 4, 5];
    
    return {
      type: 'array',
      data: { array: arrayData.slice(0, 8) }, // Limit to 8 elements for display
      steps: generateArraySteps(arrayData.slice(0, 8))
    };
  }
  
  // Detect stack operations
  if (lines.includes('stack') || lines.includes('push') || lines.includes('pop')) {
    return {
      type: 'stack',
      data: { stack: [10, 20, 30] },
      steps: generateStackSteps()
    };
  }
  
  // Detect tree operations
  if (lines.includes('tree') || lines.includes('node') || lines.includes('left') || lines.includes('right')) {
    return {
      type: 'tree',
      data: { tree: true },
      steps: generateTreeSteps()
    };
  }
  
  // Detect graph operations
  if (lines.includes('graph') || lines.includes('edge') || lines.includes('vertex') || lines.includes('adjacency')) {
    return {
      type: 'graph',
      data: { graph: true },
      steps: generateGraphSteps()
    };
  }
  
  // Default to array
  return {
    type: 'array',
    data: { array: [1, 2, 3, 4, 5] },
    steps: generateArraySteps([1, 2, 3, 4, 5])
  };
}

function generateArraySteps(arr) {
  const steps = [
    { data: { array: arr }, highlightIndex: -1, description: 'Array initialized with values' }
  ];
  
  arr.forEach((val, idx) => {
    steps.push({
      data: { array: arr },
      highlightIndex: idx,
      description: `Accessing array[${idx}] = ${val}`
    });
  });
  
  steps.push({
    data: { array: arr },
    highlightIndex: -1,
    description: 'Array traversal complete'
  });
  
  return steps;
}

function generateStackSteps() {
  return [
    { data: { stack: [] }, highlightIndex: -1, description: 'Stack initialized (empty)' },
    { data: { stack: [10] }, highlightIndex: 0, description: 'Push 10 onto stack' },
    { data: { stack: [10, 20] }, highlightIndex: 1, description: 'Push 20 onto stack' },
    { data: { stack: [10, 20, 30] }, highlightIndex: 2, description: 'Push 30 onto stack' },
    { data: { stack: [10, 20] }, highlightIndex: 1, description: 'Pop 30 from stack (top element removed)' },
    { data: { stack: [10] }, highlightIndex: 0, description: 'Pop 20 from stack' }
  ];
}

function generateTreeSteps() {
  return [
    { data: { tree: true }, highlightIndex: 0, description: 'Visit root node: 10' },
    { data: { tree: true }, highlightIndex: 1, description: 'Traverse to left child: 5' },
    { data: { tree: true }, highlightIndex: 0, description: 'Back to root: 10' },
    { data: { tree: true }, highlightIndex: 2, description: 'Traverse to right child: 15' },
    { data: { tree: true }, highlightIndex: 0, description: 'Tree traversal complete' }
  ];
}

function generateGraphSteps() {
  return [
    { data: { graph: true }, highlightIndex: 0, description: 'Start at node A' },
    { data: { graph: true }, highlightIndex: 1, description: 'Visit neighbor B' },
    { data: { graph: true }, highlightIndex: 3, description: 'Visit neighbor D' },
    { data: { graph: true }, highlightIndex: 2, description: 'Visit neighbor C' },
    { data: { graph: true }, highlightIndex: 0, description: 'Graph traversal complete' }
  ];
}

export default LiveTyping3DDryRunSimple;
