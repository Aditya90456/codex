import { useState, useEffect, useRef, memo, useMemo } from 'react';
import { Activity, Play, Pause, RotateCcw, Zap, Eye, Maximize2, X } from 'lucide-react';

/**
 * 3D Live Typing Dry Run using CSS 3D Transforms
 * Optimized for fast loading with tutorial loop
 */
const LiveTyping3DDryRunCSS = ({ code, language, isVisible, onClose }) => {
  const [visualizationType, setVisualizationType] = useState('array');
  const [data, setData] = useState({ array: [] });
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [executionSteps, setExecutionSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotationY, setRotationY] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  const sceneRef = useRef(null);

  // Tutorial examples that loop
  const tutorialExamples = [
    {
      text: 'vector<int> nums = {2, 7, 11, 15}',
      type: 'array',
      data: { array: [2, 7, 11, 15] },
      description: 'Type: vector<int> nums'
    },
    {
      text: 'int p = 9',
      type: 'variables',
      data: { variables: [{ name: 'p', type: 'int', value: '9', line: 1 }] },
      description: 'Type: int p = 9'
    },
    {
      text: 'stack<int> s; s.push(10)',
      type: 'stack',
      data: { stack: [10, 20, 30] },
      description: 'Type: stack operations'
    },
    {
      text: 'const arr = [1, 2, 3, 4, 5]',
      type: 'array',
      data: { array: [1, 2, 3, 4, 5] },
      description: 'Type: JavaScript array'
    }
  ];

  // Tutorial loop animation
  useEffect(() => {
    if (showTutorial && !code) {
      const interval = setInterval(() => {
        setTutorialStep(prev => {
          const next = (prev + 1) % tutorialExamples.length;
          const example = tutorialExamples[next];
          setVisualizationType(example.type);
          setData(example.data);
          return next;
        });
      }, 3000); // Change example every 3 seconds
      
      return () => clearInterval(interval);
    } else {
      setShowTutorial(false);
    }
  }, [showTutorial, code]);

  // Parse code in real-time with auto-detection (optimized)
  useEffect(() => {
    if (code && code.trim().length > 10) {
      // Debounce for performance
      const timer = setTimeout(() => {
        const parsed = parseCodeTo3DData(code, language);
        setVisualizationType(parsed.type);
        setData(parsed.data);
        setExecutionSteps(parsed.steps);
        setShowTutorial(false); // Hide tutorial when user types
      }, 150); // Fast debounce
      
      return () => clearTimeout(timer);
    }
  }, [code, language]);

  // Auto-rotate animation
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setRotationY(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [autoRotate]);

  // Auto-play execution
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
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, executionSteps.length]);

  // Update visualization
  useEffect(() => {
    if (executionSteps[currentStep]) {
      const step = executionSteps[currentStep];
      setData(step.data);
      setHighlightIndex(step.highlightIndex);
    }
  }, [currentStep, executionSteps]);

  if (!isVisible) return null;

  return (
    <div className={`fixed ${isFullscreen ? 'inset-0' : 'right-4 bottom-4 w-[500px] h-[400px]'} bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20 z-40 flex flex-col transition-all duration-300`}>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">3D Live Dry Run</h3>
            <p className="text-xs text-gray-400">Real-time visualization</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
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
            <X className="w-4 h-4 text-gray-300 hover:text-white" />
          </button>
        </div>
      </div>

      {/* 3D Scene */}
      <div className="flex-1 relative bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
        <div 
          ref={sceneRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: '1000px' }}
        >
          <div
            className="relative"
            style={{
              transform: `rotateY(${rotationY}deg) rotateX(15deg)`,
              transformStyle: 'preserve-3d',
              transition: autoRotate ? 'none' : 'transform 0.3s ease'
            }}
          >
            {visualizationType === 'array' && (
              <ArrayVisualization3D data={data.array || []} highlightIndex={highlightIndex} />
            )}
            {visualizationType === 'variables' && (
              <VariablesVisualization3D data={data.variables || []} highlightIndex={highlightIndex} />
            )}
            {visualizationType === 'stack' && (
              <StackVisualization3D data={data.stack || []} />
            )}
            {visualizationType === 'tree' && (
              <TreeVisualization3D data={data.tree} highlightIndex={highlightIndex} />
            )}
            {visualizationType === 'graph' && (
              <GraphVisualization3D data={data} highlightIndex={highlightIndex} />
            )}
          </div>
        </div>
        
        {/* Info Overlay */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-4 py-2 rounded-xl border border-white/10">
          <div className="text-xs text-gray-400">Type: <span className="text-purple-400 font-semibold">{visualizationType}</span></div>
          <div className="text-xs text-gray-400">Step: <span className="text-cyan-400 font-semibold">{currentStep + 1}/{executionSteps.length}</span></div>
        </div>
        
        {/* Tutorial Hint - Shows what to type */}
        {showTutorial && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur px-6 py-3 rounded-2xl border-2 border-white/20 shadow-2xl animate-pulse">
            <div className="text-white text-sm font-semibold mb-1">💡 Try typing:</div>
            <div className="text-white font-mono text-lg bg-black/30 px-4 py-2 rounded-lg">
              {tutorialExamples[tutorialStep].text}
            </div>
            <div className="text-white/80 text-xs mt-2 text-center">
              {tutorialExamples[tutorialStep].description}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-white/10 bg-slate-900/80 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setCurrentStep(0); setIsPlaying(false); }}
              className="p-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 rounded-lg transition-all"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4 text-white" />
            </button>
            
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg transition-all shadow-lg"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
            </button>
          </div>
          
          <div className="flex-1 mx-4">
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${(currentStep / (executionSteps.length - 1 || 1)) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>
        
        {executionSteps[currentStep] && (
          <div className="mt-3 text-xs text-gray-300 bg-slate-800/50 rounded-lg p-2">
            {executionSteps[currentStep].description}
          </div>
        )}
      </div>
    </div>
  );
};

// Array 3D Visualization - Memoized for performance
const ArrayVisualization3D = memo(({ data, highlightIndex }) => {
  return (
    <div className="flex gap-4" style={{ transformStyle: 'preserve-3d' }}>
      {data.map((value, index) => (
        <div
          key={`${index}-${value}`}
          className={`relative transition-all duration-300 ${
            highlightIndex === index ? 'scale-110' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateZ(${highlightIndex === index ? '50px' : '0px'})`
          }}
        >
          <div
            className={`w-20 h-20 rounded-lg flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
              highlightIndex === index
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50'
                : 'bg-gradient-to-br from-blue-500 to-cyan-500'
            }`}
            style={{
              transformStyle: 'preserve-3d',
              boxShadow: highlightIndex === index ? '0 0 30px rgba(168, 85, 247, 0.6)' : 'none'
            }}
          >
            <span className="text-white">{value}</span>
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
            [{index}]
          </div>
        </div>
      ))}
    </div>
  );
});

// Stack 3D Visualization
const StackVisualization3D = ({ data }) => {
  return (
    <div className="flex flex-col-reverse gap-2" style={{ transformStyle: 'preserve-3d' }}>
      {data.map((value, index) => (
        <div
          key={index}
          className={`w-32 h-16 rounded-lg flex items-center justify-center text-xl font-bold transition-all duration-300 ${
            index === data.length - 1
              ? 'bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/50'
              : 'bg-gradient-to-br from-purple-500 to-indigo-500'
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateZ(${index * 10}px)`
          }}
        >
          <span className="text-white">{value}</span>
        </div>
      ))}
      <div className="w-40 h-4 bg-slate-700 rounded-lg" style={{ transform: 'translateZ(-10px)' }} />
    </div>
  );
};

// Tree 3D Visualization
const TreeVisualization3D = ({ data, highlightIndex }) => {
  if (!data) return null;
  
  return (
    <div className="flex flex-col items-center gap-8" style={{ transformStyle: 'preserve-3d' }}>
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
          highlightIndex === 0
            ? 'bg-gradient-to-br from-orange-500 to-yellow-500 shadow-lg shadow-orange-500/50 animate-pulse'
            : 'bg-gradient-to-br from-green-500 to-emerald-500'
        }`}
        style={{ transformStyle: 'preserve-3d', transform: 'translateZ(30px)' }}
      >
        <span className="text-white">{data.value}</span>
      </div>
      
      {(data.left || data.right) && (
        <div className="flex gap-16">
          {data.left && (
            <div
              className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-sm font-bold"
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(10px)' }}
            >
              <span className="text-white">{data.left.value}</span>
            </div>
          )}
          {data.right && (
            <div
              className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-sm font-bold"
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(10px)' }}
            >
              <span className="text-white">{data.right.value}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Graph 3D Visualization
const GraphVisualization3D = ({ data, highlightIndex }) => {
  const nodes = data.nodes || [];
  
  return (
    <div className="relative w-64 h-64" style={{ transformStyle: 'preserve-3d' }}>
      {nodes.map((node, index) => {
        const angle = (index / nodes.length) * Math.PI * 2;
        const x = Math.cos(angle) * 100;
        const y = Math.sin(angle) * 100;
        
        return (
          <div
            key={index}
            className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              highlightIndex === index
                ? 'bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/50 scale-125'
                : 'bg-gradient-to-br from-cyan-500 to-blue-500'
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: `translate(${x}px, ${y}px) translateZ(${highlightIndex === index ? '40px' : '20px'})`,
              left: '50%',
              top: '50%',
              marginLeft: '-24px',
              marginTop: '-24px'
            }}
          >
            <span className="text-white">{node.value}</span>
          </div>
        );
      })}
    </div>
  );
};

// Variables 3D Visualization - Shows all variables as boxes
const VariablesVisualization3D = ({ data, highlightIndex }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center max-w-2xl" style={{ transformStyle: 'preserve-3d' }}>
      {data.map((variable, index) => (
        <div
          key={index}
          className={`relative transition-all duration-500 ease-out ${
            highlightIndex === index ? 'scale-110 animate-bounce-subtle' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateZ(${highlightIndex === index ? '60px' : '0px'}) rotateY(${highlightIndex === index ? '10deg' : '0deg'})`,
            animation: highlightIndex === index ? 'slideIn 0.5s ease-out' : 'none'
          }}
        >
          <div
            className={`min-w-24 px-4 h-20 rounded-xl flex flex-col items-center justify-center text-lg font-bold transition-all duration-500 ${
              highlightIndex === index
                ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 shadow-2xl shadow-purple-500/60 border-2 border-white/30'
                : variable.type === 'vector' || variable.type === 'array'
                ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg'
                : 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg'
            }`}
            style={{
              transformStyle: 'preserve-3d',
              boxShadow: highlightIndex === index 
                ? '0 0 40px rgba(168, 85, 247, 0.8), 0 10px 30px rgba(0,0,0,0.3)' 
                : '0 5px 15px rgba(0,0,0,0.2)'
            }}
          >
            <span className="text-white text-sm opacity-80">{variable.name}</span>
            <span className="text-white font-bold text-xl">{variable.value}</span>
          </div>
          
          {/* Type label */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-purple-400 bg-slate-900/80 px-2 py-1 rounded">
            {variable.type}
          </div>
          
          {/* Line number */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
            line {variable.line}
          </div>
          
          {/* Glow effect for highlighted */}
          {highlightIndex === index && (
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400/20 to-pink-400/20 animate-pulse" 
                 style={{ transform: 'translateZ(-5px)' }} />
          )}
        </div>
      ))}
    </div>
  );
};

// Parse code to 3D data - REAL-TIME VARIABLE DETECTION - ALL LANGUAGES
function parseCodeTo3DData(code, language) {
  const variables = [];
  const lines = code.split('\n');
  let shouldAutoOpen = false;
  
  // Detect all variable declarations in real-time
  lines.forEach((line, lineNum) => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('//') || trimmedLine.startsWith('#')) return;
    
    // ===== C++ DETECTION =====
    // vector<int> u, vector<string> names
    const cppVectorMatch = line.match(/vector\s*<\s*(\w+)\s*>\s*(\w+)(?:\s*=\s*\{([^}]*)\})?/);
    if (cppVectorMatch) {
      const values = cppVectorMatch[3] ? cppVectorMatch[3].split(',').map(v => v.trim()) : [];
      variables.push({
        name: cppVectorMatch[2],
        type: 'vector',
        value: values.length > 0 ? values : `vector<${cppVectorMatch[1]}>`,
        line: lineNum + 1
      });
      shouldAutoOpen = true;
    }
    
    // C++ primitives: int p = 9, float x = 3.14, char c = 'a'
    const cppVarMatches = line.matchAll(/(int|float|double|long|short|char|bool|string)\s+(\w+)\s*=\s*([^;,\n]+)/g);
    for (const match of cppVarMatches) {
      variables.push({
        name: match[2],
        type: match[1],
        value: match[3].trim().replace(/['"]/g, ''),
        line: lineNum + 1
      });
      shouldAutoOpen = true;
    }
    
    // C++ arrays: int arr[] = {1,2,3}
    const cppArrayMatch = line.match(/(\w+)\s+(\w+)\s*\[\s*\]\s*=\s*\{([^}]+)\}/);
    if (cppArrayMatch) {
      variables.push({
        name: cppArrayMatch[2],
        type: 'array',
        value: cppArrayMatch[3].split(',').map(v => v.trim()),
        line: lineNum + 1
      });
      shouldAutoOpen = true;
    }
    
    // ===== JAVA DETECTION =====
    // ArrayList<Integer> list = new ArrayList<>();
    const javaListMatch = line.match(/(?:ArrayList|List|LinkedList)<(\w+)>\s+(\w+)/);
    if (javaListMatch) {
      variables.push({
        name: javaListMatch[2],
        type: 'ArrayList',
        value: `List<${javaListMatch[1]}>`,
        line: lineNum + 1
      });
      shouldAutoOpen = true;
    }
    
    // Java primitives: int x = 5;
    const javaVarMatches = line.matchAll(/(int|long|float|double|boolean|char|String)\s+(\w+)\s*=\s*([^;]+)/g);
    for (const match of javaVarMatches) {
      variables.push({
        name: match[2],
        type: match[1],
        value: match[3].trim().replace(/['"]/g, ''),
        line: lineNum + 1
      });
      shouldAutoOpen = true;
    }
    
    // ===== PYTHON DETECTION =====
    // Python lists: nums = [1,2,3,4]
    const pythonListMatch = line.match(/^(\w+)\s*=\s*\[([^\]]+)\]/);
    if (pythonListMatch && !line.includes('def ') && !line.includes('class ')) {
      variables.push({
        name: pythonListMatch[1],
        type: 'list',
        value: pythonListMatch[2].split(',').map(v => v.trim()),
        line: lineNum + 1
      });
      shouldAutoOpen = true;
    }
    
    // Python variables: x = 5, name = "John"
    const pythonVarMatch = line.match(/^(\w+)\s*=\s*([^#\n]+)/);
    if (pythonVarMatch && !line.includes('def ') && !line.includes('class ') && !line.includes('[')) {
      variables.push({
        name: pythonVarMatch[1],
        type: 'variable',
        value: pythonVarMatch[2].trim().replace(/['"]/g, ''),
        line: lineNum + 1
      });
      shouldAutoOpen = true;
    }
    
    // ===== JAVASCRIPT DETECTION =====
    // const/let/var x = 5, arr = [1,2,3]
    const jsVarMatches = line.matchAll(/(const|let|var)\s+(\w+)\s*=\s*([^;,\n]+)/g);
    for (const match of jsVarMatches) {
      const value = match[3].trim();
      const isArray = value.startsWith('[');
      variables.push({
        name: match[2],
        type: isArray ? 'array' : 'variable',
        value: isArray ? value.match(/\[([^\]]+)\]/)?.[1].split(',').map(v => v.trim()) || value : value,
        line: lineNum + 1
      });
      shouldAutoOpen = true;
    }
    
    // ===== GO DETECTION =====
    // var x int = 5, slice := []int{1,2,3}
    const goVarMatch = line.match(/(?:var\s+(\w+)\s+(\w+)\s*=\s*([^;\n]+))|(?:(\w+)\s*:=\s*([^;\n]+))/);
    if (goVarMatch) {
      const name = goVarMatch[1] || goVarMatch[4];
      const type = goVarMatch[2] || 'auto';
      const value = goVarMatch[3] || goVarMatch[5];
      variables.push({
        name: name,
        type: type,
        value: value.trim(),
        line: lineNum + 1
      });
      shouldAutoOpen = true;
    }
    
    // ===== RUST DETECTION =====
    // let x: i32 = 5, let mut vec = vec![1,2,3]
    const rustVarMatch = line.match(/let\s+(?:mut\s+)?(\w+)(?:\s*:\s*(\w+))?\s*=\s*([^;]+)/);
    if (rustVarMatch) {
      variables.push({
        name: rustVarMatch[1],
        type: rustVarMatch[2] || 'auto',
        value: rustVarMatch[3].trim(),
        line: lineNum + 1
      });
      shouldAutoOpen = true;
    }
  });
  
  // ===== DETECT DATA STRUCTURES =====
  const codeLower = code.toLowerCase();
  
  // Stack detection
  if (codeLower.includes('stack') || codeLower.includes('.push(') || codeLower.includes('.pop(')) {
    const stackOps = [];
    lines.forEach(line => {
      if (line.includes('.push(')) {
        const match = line.match(/\.push\(([^)]+)\)/);
        if (match) stackOps.push(match[1].trim());
      }
    });
    
    return {
      type: 'stack',
      data: { stack: stackOps.length > 0 ? stackOps : [10, 20, 30] },
      steps: generateStackSteps(stackOps.length > 0 ? stackOps : [10, 20, 30]),
      shouldAutoOpen: true
    };
  }
  
  // Queue detection
  if (codeLower.includes('queue') || codeLower.includes('deque')) {
    return {
      type: 'stack', // Use stack visualization for queue
      data: { stack: [1, 2, 3, 4] },
      steps: generateStackSteps([1, 2, 3, 4]),
      shouldAutoOpen: true
    };
  }
  
  // Tree/BST detection
  if (codeLower.includes('tree') || codeLower.includes('node') || 
      (codeLower.includes('left') && codeLower.includes('right'))) {
    return {
      type: 'tree',
      data: {
        tree: {
          value: variables.length > 0 ? variables[0].value : 10,
          left: { value: 5 },
          right: { value: 15 }
        }
      },
      steps: generateTreeSteps(),
      shouldAutoOpen: true
    };
  }
  
  // Graph detection
  if (codeLower.includes('graph') || codeLower.includes('edge') || 
      codeLower.includes('vertex') || codeLower.includes('adjacency')) {
    return {
      type: 'graph',
      data: {
        nodes: variables.slice(0, 4).map(v => ({ value: v.name }))
      },
      steps: generateGraphSteps(variables.slice(0, 4)),
      shouldAutoOpen: true
    };
  }
  
  // Linked List detection
  if (codeLower.includes('linkedlist') || codeLower.includes('listnode')) {
    return {
      type: 'array', // Use array visualization for linked list
      data: { array: [1, 2, 3, 4, 5] },
      steps: generateArraySteps([1, 2, 3, 4, 5]),
      shouldAutoOpen: true
    };
  }
  
  // ===== DEFAULT VISUALIZATION =====
  // If we have variables, show them
  if (variables.length > 0) {
    // Check if any variable is an array
    const arrayVars = variables.filter(v => 
      v.type === 'array' || v.type === 'vector' || v.type === 'list' || 
      v.type === 'ArrayList' || Array.isArray(v.value)
    );
    
    if (arrayVars.length > 0) {
      const arrayVar = arrayVars[0];
      const arrayData = Array.isArray(arrayVar.value) ? arrayVar.value : [arrayVar.value];
      
      return {
        type: 'array',
        data: { array: arrayData },
        steps: generateArraySteps(arrayData),
        shouldAutoOpen: shouldAutoOpen
      };
    }
    
    // Show all variables
    return {
      type: 'variables',
      data: { variables: variables },
      steps: generateVariableSteps(variables),
      shouldAutoOpen: shouldAutoOpen
    };
  }
  
  // No variables detected - show placeholder
  return {
    type: 'array',
    data: { array: [] },
    steps: [{ data: { array: [] }, highlightIndex: -1, description: 'Start typing to visualize...' }],
    shouldAutoOpen: false
  };
}

// Generate steps for variables
function generateVariableSteps(variables) {
  return variables.map((v, idx) => ({
    data: { variables: variables.slice(0, idx + 1) },
    highlightIndex: idx,
    description: `${v.type} ${v.name} = ${Array.isArray(v.value) ? `[${v.value.join(', ')}]` : v.value}`
  }));
}

// Generate steps for arrays
function generateArraySteps(arr) {
  return arr.map((val, idx) => ({
    data: { array: arr },
    highlightIndex: idx,
    description: `Element [${idx}] = ${val}`
  }));
}

// Generate steps for stacks
function generateStackSteps(items) {
  const steps = [];
  items.forEach((item, idx) => {
    steps.push({
      data: { stack: items.slice(0, idx + 1) },
      highlightIndex: idx,
      description: `Push ${item} onto stack`
    });
  });
  return steps;
}

// Generate steps for trees
function generateTreeSteps() {
  return [
    { data: { tree: { value: 10, left: { value: 5 }, right: { value: 15 } } }, highlightIndex: 0, description: 'Visit root: 10' },
    { data: { tree: { value: 10, left: { value: 5 }, right: { value: 15 } } }, highlightIndex: 1, description: 'Visit left: 5' },
    { data: { tree: { value: 10, left: { value: 5 }, right: { value: 15 } } }, highlightIndex: 2, description: 'Visit right: 15' }
  ];
}

// Generate steps for graphs
function generateGraphSteps(nodes) {
  if (nodes.length === 0) {
    nodes = [{ value: 'A' }, { value: 'B' }, { value: 'C' }, { value: 'D' }];
  }
  return nodes.map((node, idx) => ({
    data: { nodes: nodes },
    highlightIndex: idx,
    description: `Visit node ${node.value}`
  }));
}

export default LiveTyping3DDryRunCSS;
