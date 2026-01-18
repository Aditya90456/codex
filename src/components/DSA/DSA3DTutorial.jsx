import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, BookOpen, ArrowUp } from 'lucide-react';

// Simplified 3D CSS-based visualizations (no Three.js dependency)
const DSA3DTutorial = () => {
  const [currentTopic, setCurrentTopic] = useState('arrays');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rotation, setRotation] = useState({ x: 20, y: 45 });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setScrollProgress(scrollPercent);
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Smooth scroll to visualization
  const scrollToVisualization = () => {
    const element = document.getElementById('visualization-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const topics = {
    arrays: {
      title: "📦 3D Arrays",
      emoji: "🎯",
      color: "from-blue-500 to-cyan-500",
      data: [10, 20, 30, 40, 50],
      steps: [
        { title: "Array Structure", description: "Arrays store elements in contiguous memory locations", highlight: -1, code: "int arr[] = {10, 20, 30, 40, 50};" },
        { title: "Access Index 0", description: "First element at index 0 = 10", highlight: 0, code: "arr[0] // Returns 10" },
        { title: "Access Index 2", description: "Third element at index 2 = 30", highlight: 2, code: "arr[2] // Returns 30" },
        { title: "Access Index 4", description: "Last element at index 4 = 50", highlight: 4, code: "arr[4] // Returns 50" },
        { title: "Time Complexity", description: "O(1) for access by index", highlight: -1, code: "// Constant time access!" }
      ]
    },
    linkedlist: {
      title: "🔗 3D Linked List",
      emoji: "🚂",
      color: "from-green-500 to-emerald-500",
      data: [
        { value: 10, next: 1 },
        { value: 20, next: 2 },
        { value: 30, next: 3 },
        { value: 40, next: null }
      ],
      steps: [
        { title: "Linked List", description: "Nodes connected by pointers/references", highlight: -1, code: "class Node { int data; Node next; }" },
        { title: "Head Node", description: "First node in the list (value: 10)", highlight: 0, code: "Node head = new Node(10);" },
        { title: "Traversal", description: "Follow next pointers to traverse", highlight: 1, code: "current = current.next;" },
        { title: "Middle Node", description: "Node with value 30", highlight: 2, code: "// Keep following next" },
        { title: "Tail Node", description: "Last node points to null", highlight: 3, code: "if (node.next == null) // Tail" }
      ]
    },
    stack: {
      title: "📚 3D Stack (LIFO)",
      emoji: "🥞",
      color: "from-yellow-500 to-orange-500",
      data: [10, 20, 30, 40],
      steps: [
        { title: "Stack - LIFO", description: "Last In, First Out data structure", highlight: -1, code: "Stack<Integer> stack = new Stack<>();" },
        { title: "Push 10", description: "Add first element to bottom", highlight: 0, code: "stack.push(10);" },
        { title: "Push 20, 30", description: "Stack elements on top", highlight: 2, code: "stack.push(20); stack.push(30);" },
        { title: "Push 40 (Top)", description: "Most recent element on top", highlight: 3, code: "stack.push(40); // Top element" },
        { title: "Pop Operation", description: "Remove from top (40 first)", highlight: 3, code: "stack.pop(); // Returns 40" }
      ]
    },
    queue: {
      title: "🎢 3D Queue (FIFO)",
      emoji: "🚶",
      color: "from-purple-500 to-pink-500",
      data: [10, 20, 30, 40],
      steps: [
        { title: "Queue - FIFO", description: "First In, First Out data structure", highlight: -1, code: "Queue<Integer> queue = new LinkedList<>();" },
        { title: "Enqueue 10", description: "First element at front", highlight: 0, code: "queue.add(10); // Front" },
        { title: "Enqueue 20, 30", description: "Add to rear of queue", highlight: 2, code: "queue.add(20); queue.add(30);" },
        { title: "Enqueue 40", description: "Latest element at rear", highlight: 3, code: "queue.add(40); // Rear" },
        { title: "Dequeue", description: "Remove from front (10 first)", highlight: 0, code: "queue.remove(); // Returns 10" }
      ]
    },
    tree: {
      title: "🌳 3D Binary Tree",
      emoji: "🌲",
      color: "from-green-600 to-teal-500",
      data: {
        value: 50,
        left: { value: 30, left: { value: 20 }, right: { value: 40 } },
        right: { value: 70, left: { value: 60 }, right: { value: 80 } }
      },
      steps: [
        { title: "Binary Tree", description: "Each node has at most 2 children", highlight: -1, code: "class Node { int val; Node left, right; }" },
        { title: "Root Node (50)", description: "Top node of the tree", highlight: 50, code: "Node root = new Node(50);" },
        { title: "Left Subtree", description: "Values < 50 on left (30, 20, 40)", highlight: 30, code: "root.left = new Node(30);" },
        { title: "Right Subtree", description: "Values > 50 on right (70, 60, 80)", highlight: 70, code: "root.right = new Node(70);" },
        { title: "Leaf Nodes", description: "Nodes with no children", highlight: 20, code: "// 20, 40, 60, 80 are leaves" }
      ]
    },
    graph: {
      title: "🕸️ 3D Graph Network",
      emoji: "🌐",
      color: "from-indigo-500 to-purple-500",
      data: {
        nodes: ['A', 'B', 'C', 'D', 'E'],
        edges: [[0,1], [0,2], [1,3], [2,3], [3,4]]
      },
      steps: [
        { title: "Graph Structure", description: "Vertices connected by edges", highlight: -1, code: "class Graph { List<List<Integer>> adj; }" },
        { title: "Vertex A", description: "Starting vertex/node", highlight: 0, code: "// Node A connects to B and C" },
        { title: "Vertex B", description: "Connected to A and D", highlight: 1, code: "// Multiple connections" },
        { title: "Vertex D", description: "Central node with many connections", highlight: 3, code: "// Hub node" },
        { title: "Vertex E", description: "End node", highlight: 4, code: "// Connected to D only" }
      ]
    }
  };

  const currentTopicData = topics[currentTopic];
  const currentStepData = currentTopicData.steps[currentStep];

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= currentTopicData.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTopic, currentTopicData.steps.length]);

  // Auto-rotate effect
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => ({
        x: prev.x,
        y: (prev.y + 0.5) % 360
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const render3DVisualization = () => {
    const style = {
      transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
      transformStyle: 'preserve-3d'
    };

    switch (currentTopic) {
      case 'arrays':
        return (
          <div className="flex items-center justify-center gap-4" style={style}>
            {currentTopicData.data.map((value, index) => (
              <div
                key={index}
                className={`relative transition-all duration-500 ${
                  currentStepData.highlight === index ? 'scale-125' : 'scale-100'
                }`}
                style={{ transform: 'translateZ(50px)' }}
              >
                <div className={`w-24 h-24 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-2xl ${
                  currentStepData.highlight === index 
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 animate-pulse' 
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                }`}>
                  {value}
                </div>
                <div className="text-center mt-2 text-slate-400 text-sm">[{index}]</div>
              </div>
            ))}
          </div>
        );

      case 'linkedlist':
        return (
          <div className="flex items-center justify-center gap-2" style={style}>
            {currentTopicData.data.map((node, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`relative transition-all duration-500 ${
                    currentStepData.highlight === index ? 'scale-125 z-10' : 'scale-100'
                  }`}
                  style={{ transform: `translateZ(${index * 20}px)` }}
                >
                  <div className={`w-20 h-20 rounded-lg flex items-center justify-center text-xl font-bold text-white shadow-2xl ${
                    currentStepData.highlight === index 
                      ? 'bg-gradient-to-br from-green-400 to-emerald-600 animate-pulse' 
                      : 'bg-gradient-to-br from-green-500 to-emerald-500'
                  }`}>
                    {node.value}
                  </div>
                </div>
                {index < currentTopicData.data.length - 1 && (
                  <div className="text-cyan-400 text-3xl mx-2">→</div>
                )}
              </div>
            ))}
            <div className="text-slate-500 text-2xl ml-2">∅</div>
          </div>
        );

      case 'stack':
        return (
          <div className="flex flex-col-reverse items-center justify-center gap-2" style={style}>
            {currentTopicData.data.map((value, index) => (
              <div
                key={index}
                className={`relative transition-all duration-500 ${
                  currentStepData.highlight === index ? 'scale-110' : 'scale-100'
                }`}
                style={{ transform: `translateZ(${index * 30}px)` }}
              >
                <div className={`w-32 h-16 rounded-lg flex items-center justify-center text-xl font-bold text-white shadow-2xl ${
                  currentStepData.highlight === index 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse' 
                    : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                }`}>
                  {value}
                </div>
                {index === currentTopicData.data.length - 1 && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-yellow-400 text-sm font-bold">
                    ← TOP
                  </div>
                )}
              </div>
            ))}
            <div className="w-40 h-4 bg-slate-700 rounded-full mt-2"></div>
          </div>
        );

      case 'queue':
        return (
          <div className="flex items-center justify-center gap-2" style={style}>
            <div className="text-purple-400 text-sm font-bold mr-4">FRONT →</div>
            {currentTopicData.data.map((value, index) => (
              <div
                key={index}
                className={`relative transition-all duration-500 ${
                  currentStepData.highlight === index ? 'scale-125' : 'scale-100'
                }`}
                style={{ transform: `translateZ(${index * 20}px)` }}
              >
                <div className={`w-20 h-20 rounded-lg flex items-center justify-center text-xl font-bold text-white shadow-2xl ${
                  currentStepData.highlight === index 
                    ? 'bg-gradient-to-br from-purple-400 to-pink-500 animate-pulse' 
                    : 'bg-gradient-to-br from-purple-500 to-pink-500'
                }`}>
                  {value}
                </div>
              </div>
            ))}
            <div className="text-purple-400 text-sm font-bold ml-4">← REAR</div>
          </div>
        );

      case 'tree':
        return (
          <div className="relative" style={style}>
            <div className="flex flex-col items-center gap-8">
              {/* Root */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-2xl ${
                currentStepData.highlight === 50 
                  ? 'bg-gradient-to-br from-green-400 to-teal-500 animate-pulse scale-125' 
                  : 'bg-gradient-to-br from-green-500 to-teal-500'
              }`} style={{ transform: 'translateZ(80px)' }}>
                50
              </div>
              
              {/* Level 1 */}
              <div className="flex gap-32">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-2xl ${
                  currentStepData.highlight === 30 
                    ? 'bg-gradient-to-br from-green-400 to-teal-500 animate-pulse scale-125' 
                    : 'bg-gradient-to-br from-green-500 to-teal-500'
                }`} style={{ transform: 'translateZ(60px)' }}>
                  30
                </div>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-2xl ${
                  currentStepData.highlight === 70 
                    ? 'bg-gradient-to-br from-green-400 to-teal-500 animate-pulse scale-125' 
                    : 'bg-gradient-to-br from-green-500 to-teal-500'
                }`} style={{ transform: 'translateZ(60px)' }}>
                  70
                </div>
              </div>
              
              {/* Level 2 */}
              <div className="flex gap-16">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-2xl ${
                  currentStepData.highlight === 20 
                    ? 'bg-gradient-to-br from-green-400 to-teal-500 animate-pulse scale-125' 
                    : 'bg-gradient-to-br from-green-600 to-teal-600'
                }`} style={{ transform: 'translateZ(40px)' }}>
                  20
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-2xl ${
                  currentStepData.highlight === 40 
                    ? 'bg-gradient-to-br from-green-400 to-teal-500 animate-pulse scale-125' 
                    : 'bg-gradient-to-br from-green-600 to-teal-600'
                }`} style={{ transform: 'translateZ(40px)' }}>
                  40
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-2xl ${
                  currentStepData.highlight === 60 
                    ? 'bg-gradient-to-br from-green-400 to-teal-500 animate-pulse scale-125' 
                    : 'bg-gradient-to-br from-green-600 to-teal-600'
                }`} style={{ transform: 'translateZ(40px)' }}>
                  60
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-2xl ${
                  currentStepData.highlight === 80 
                    ? 'bg-gradient-to-br from-green-400 to-teal-500 animate-pulse scale-125' 
                    : 'bg-gradient-to-br from-green-600 to-teal-600'
                }`} style={{ transform: 'translateZ(40px)' }}>
                  80
                </div>
              </div>
            </div>
          </div>
        );

      case 'graph':
        return (
          <div className="relative w-full h-96" style={style}>
            <svg className="w-full h-full" viewBox="0 0 400 300">
              {/* Edges */}
              <line x1="200" y1="50" x2="100" y2="150" stroke="#64748b" strokeWidth="3" />
              <line x1="200" y1="50" x2="300" y2="150" stroke="#64748b" strokeWidth="3" />
              <line x1="100" y1="150" x2="200" y2="250" stroke="#64748b" strokeWidth="3" />
              <line x1="300" y1="150" x2="200" y2="250" stroke="#64748b" strokeWidth="3" />
              <line x1="200" y1="250" x2="350" y2="250" stroke="#64748b" strokeWidth="3" />
              
              {/* Nodes */}
              {['A', 'B', 'C', 'D', 'E'].map((label, index) => {
                const positions = [
                  { x: 200, y: 50 },
                  { x: 100, y: 150 },
                  { x: 300, y: 150 },
                  { x: 200, y: 250 },
                  { x: 350, y: 250 }
                ];
                const pos = positions[index];
                const isHighlighted = currentStepData.highlight === index;
                
                return (
                  <g key={label}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isHighlighted ? 35 : 30}
                      fill={isHighlighted ? "url(#highlightGradient)" : "url(#nodeGradient)"}
                      className={isHighlighted ? "animate-pulse" : ""}
                    />
                    <text
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dy=".3em"
                      fill="white"
                      fontSize="20"
                      fontWeight="bold"
                    >
                      {label}
                    </text>
                  </g>
                );
              })}
              
              <defs>
                <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <linearGradient id="highlightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto mb-4">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-xl text-white transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              3D DSA Tutorial
            </h1>
            <p className="text-xl text-slate-300">Interactive 3D Visualizations - No Audio Needed! 👁️</p>
          </div>
        </div>

        {/* Topic Selection */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {Object.entries(topics).map(([key, topic]) => (
            <button
              key={key}
              onClick={() => {
                setCurrentTopic(key);
                setCurrentStep(0);
                setIsPlaying(false);
                setTimeout(scrollToVisualization, 100);
              }}
              className={`p-4 rounded-xl font-semibold transition-all duration-300 ${
                currentTopic === key
                  ? `bg-gradient-to-br ${topic.color} text-white shadow-2xl scale-105`
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <div className="text-3xl mb-2">{topic.emoji}</div>
              <div className="text-sm">{topic.title.split(' ')[1]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8" id="visualization-section">
        {/* 3D Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 min-h-[500px] flex items-center justify-center perspective-1000">
            <div className="w-full h-full flex items-center justify-center">
              {render3DVisualization()}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="p-3 bg-blue-500/20 hover:bg-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-blue-400" />
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 bg-green-500/20 hover:bg-green-500/30 rounded-xl transition-all"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-green-400" />
                  ) : (
                    <Play className="w-6 h-6 text-green-400" />
                  )}
                </button>

                <button
                  onClick={() => {
                    setCurrentStep(0);
                    setIsPlaying(false);
                  }}
                  className="p-3 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-xl transition-all"
                >
                  <RotateCcw className="w-6 h-6 text-yellow-400" />
                </button>
              </div>

              <button
                onClick={() => setCurrentStep(Math.min(currentTopicData.steps.length - 1, currentStep + 1))}
                disabled={currentStep === currentTopicData.steps.length - 1}
                className="p-3 bg-blue-500/20 hover:bg-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl transition-all"
              >
                <ChevronRight className="w-6 h-6 text-blue-400" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / currentTopicData.steps.length) * 100}%` }}
              />
            </div>
            <div className="text-center text-slate-400 text-sm mt-2">
              Step {currentStep + 1} of {currentTopicData.steps.length}
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          {/* Current Step Info */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentTopicData.color} flex items-center justify-center text-2xl`}>
                {currentTopicData.emoji}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{currentStepData.title}</h3>
                <p className="text-slate-400 text-sm">{currentTopicData.title}</p>
              </div>
            </div>

            <p className="text-slate-300 text-lg mb-4">
              {currentStepData.description}
            </p>

            {/* Code Example */}
            <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-slate-400 text-xs ml-2">Code Example</span>
              </div>
              <pre className="text-green-400 text-sm font-mono overflow-x-auto">
                {currentStepData.code}
              </pre>
            </div>
          </div>

          {/* All Steps */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              All Steps
            </h4>
            <div className="space-y-2">
              {currentTopicData.steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentStep(index);
                    setIsPlaying(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    currentStep === index
                      ? 'bg-blue-500/20 border border-blue-500/30 text-white'
                      : 'bg-slate-800/30 text-slate-400 hover:bg-slate-700/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentStep === index
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-slate-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{step.title}</div>
                      <div className="text-xs opacity-70">{step.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800/50 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-110 transition-all group"
        >
          <ArrowUp className="w-6 h-6 text-white group-hover:animate-bounce" />
        </button>
      )}

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #1e293b;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
};

export default DSA3DTutorial;
