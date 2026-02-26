import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Line, Html } from '@react-three/drei';
import { Activity, Play, Pause, RotateCcw, Zap, Eye, Maximize2 } from 'lucide-react';
import * as THREE from 'three';

/**
 * 3D Array Visualization Component
 */
const Array3D = ({ data, highlightIndex, position = [0, 0, 0] }) => {
  const spacing = 1.5;
  
  return (
    <group position={position}>
      {data.map((value, index) => (
        <group key={index} position={[index * spacing - (data.length * spacing) / 2, 0, 0]}>
          <Box
            args={[1.2, 1.2, 1.2]}
            position={[0, 0, 0]}
          >
            <meshStandardMaterial
              color={highlightIndex === index ? '#a855f7' : '#3b82f6'}
              emissive={highlightIndex === index ? '#a855f7' : '#000000'}
              emissiveIntensity={highlightIndex === index ? 0.5 : 0}
            />
          </Box>
          <Html position={[0, 0, 0.7]} center>
            <div className="text-white font-bold text-xl bg-black/50 px-2 py-1 rounded">
              {value}
            </div>
          </Html>
          <Html position={[0, -1, 0]} center>
            <div className="text-gray-400 text-sm">[{index}]</div>
          </Html>
        </group>
      ))}
    </group>
  );
};

/**
 * 3D Binary Tree Node
 */
const TreeNode3D = ({ value, position, leftChild, rightChild, highlight }) => {
  const nodeRef = useRef();
  
  useFrame(() => {
    if (nodeRef.current && highlight) {
      nodeRef.current.rotation.y += 0.05;
    }
  });
  
  return (
    <group position={position}>
      <Sphere ref={nodeRef} args={[0.5, 32, 32]}>
        <meshStandardMaterial
          color={highlight ? '#f59e0b' : '#10b981'}
          emissive={highlight ? '#f59e0b' : '#000000'}
          emissiveIntensity={highlight ? 0.6 : 0}
        />
      </Sphere>

          <Html position={[0, 0, 0]} center>
        <div className="text-white font-bold text-lg bg-black/70 px-3 py-1 rounded-full">
          {value}
        </div>
      </Html>
      
      {/* Lines to children */}
      {leftChild && (
        <Line
          points={[[0, 0, 0], leftChild]}
          color="#6366f1"
          lineWidth={2}
        />
      )}
      {rightChild && (
        <Line
          points={[[0, 0, 0], rightChild]}
          color="#6366f1"
          lineWidth={2}
        />
      )}
    </group>
  );
};

/**
 * 3D Stack Visualization
 */
const Stack3D = ({ items, position = [0, 0, 0] }) => {
  return (
    <group position={position}>
      {items.map((value, index) => (
        <group key={index} position={[0, index * 1.3, 0]}>
          <Box args={[1.5, 1, 1.5]}>
            <meshStandardMaterial
              color={index === items.length - 1 ? '#ef4444' : '#8b5cf6'}
              emissive={index === items.length - 1 ? '#ef4444' : '#000000'}
              emissiveIntensity={index === items.length - 1 ? 0.4 : 0}
            />
          </Box>
          <Html position={[0, 0, 0.8]} center>
            <div className="text-white font-bold text-lg bg-black/60 px-2 py-1 rounded">
              {value}
            </div>
          </Html>
        </group>
      ))}
      {/* Base platform */}
      <Box args={[2, 0.2, 2]} position={[0, -0.7, 0]}>
        <meshStandardMaterial color="#1f2937" />
      </Box>
    </group>
  );
};

/**
 * 3D Graph Visualization
 */

const Graph3D = ({ nodes, edges, highlightNode, position = [0, 0, 0] }) => {
  const radius = 3;
  
  return (
    <group position={position}>
      {/* Draw edges first */}
      {edges.map((edge, index) => {
        const fromNode = nodes[edge.from];
        const toNode = nodes[edge.to];
        if (!fromNode || !toNode) return null;
        
        return (
          <Line
            key={`edge-${index}`}
            points={[fromNode.position, toNode.position]}
            color="#64748b"
            lineWidth={1.5}
          />
        );
      })}
      
      {/* Draw nodes */}
      {nodes.map((node, index) => (
        <group key={`node-${index}`} position={node.position}>
          <Sphere args={[0.4, 32, 32]}>
            <meshStandardMaterial
              color={highlightNode === index ? '#ec4899' : '#06b6d4'}
              emissive={highlightNode === index ? '#ec4899' : '#000000'}
              emissiveIntensity={highlightNode === index ? 0.5 : 0}
            />
          </Sphere>
          <Html center>
            <div className="text-white font-bold bg-black/70 px-2 py-1 rounded">
              {node.value}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
};

/**
 * Animated Camera Component
 */
const AnimatedCamera = ({ autoRotate }) => {
  return (
    <OrbitControls
      enableZoom={true}
      enablePan={true}
      autoRotate={autoRotate}
      autoRotateSpeed={1}
      minDistance={5}
      maxDistance={20}
    />
  );
};

/**
 * Main 3D Scene Component
 */
const Scene3D = ({ visualizationType, data, highlightIndex, autoRotate }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} />
      
      {visualizationType === 'array' && (
        <Array3D data={data.array || []} highlightIndex={highlightIndex} />
      )}
      
      {visualizationType === 'stack' && (
        <Stack3D items={data.stack || []} />
      )}
      
      {visualizationType === 'tree' && data.tree && (
        <TreeNode3D
          value={data.tree.value}
          position={[0, 2, 0]}
          leftChild={data.tree.left ? [-2, 0, 0] : null}
          rightChild={data.tree.right ? [2, 0, 0] : null}
          highlight={highlightIndex === 0}
        />
      )}
      
      {visualizationType === 'graph' && (
        <Graph3D
          nodes={data.nodes || []}
          edges={data.edges || []}
          highlightNode={highlightIndex}
        />
      )}
      
      <AnimatedCamera autoRotate={autoRotate} />
      
      {/* Grid helper */}
      <gridHelper args={[20, 20, '#374151', '#1f2937']} />
    </>
  );
}; 

/**
 * Main Live Typing 3D Dry Run Component
 */
const LiveTyping3DDryRun = ({ code, language, isVisible, onClose }) => {
  const [visualizationType, setVisualizationType] = useState('array');
  const [data, setData] = useState({ array: [] });
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [executionSteps, setExecutionSteps] = useState([]);
  const [currentStep, setCurrentStep] = useStaflex flex-col transition-all duration-300`}>
      
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

      {/* 3D Canvas */}
      <div className="flex-1 relative bg-gradient-to-b from-slate-950 to-slate-900">
        <Canvas
          camera={{ position: [0, 5, 10], fov: 50 }}
          style={{ background: 'transparent' }}
        >
          <Scene3D
            visualizationType={visualizationType}
            data={data}
            highlightIndex={highlightIndex}
            autoRotate={autoRotate}
          />
        </Canvas>
        
        {/* Overlay Info */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-4 py-2 rounded-xl border border-white/10">
          <div className="text-xs text-gray-400">Type: <span className="text-purple-400 font-semibold">{visualizationType}</span></div>
          <div className="text-xs text-gray-400">Step: <span className="text-cyan-400 font-semibold">{currentStep + 1}/{executionSteps.length}</span></div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-white/10 bg-slate-900/80 backdrop     className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg transition-all shadow-lg"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
          
          {/* Progress Bar */}
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
        
        {/* Current Step Description */}
        {executionSteps[currentStep] && (
          <div className="mt-3 text-xs text-gray-300 bg-slate-800/50 rounded-lg p-2">
            {executionSteps[currentStep].description}
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
    const arrayData = arrayMatch ? arrayMatch[1].split(',').map(n => n.trim()) : [1, 2, 3, 4, 5];
    
    return {
      type: 'array',
      data: { array: arrayData },
      steps: generateArraySteps(arrayData)
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
      data: {
        tree: {
          value: 10,
          left: { value: 5, position: [-2, 0, 0] },
          right: { value: 15, position: [2, 0, 0] }
        }
      },
      steps: generateTreeSteps()
    };
  }
  
  // Detect graph operations
  if (lines.includes('graph') || lines.includes('edge') || lines.includes('vertex')) {
    return {
      type: 'graph',
      data: {
        nodes: [
          { value: 'A', position: [0, 2, 0] },
          { value: 'B', position: [-2, 0, 0] },
          { value: 'C', position: [2, 0, 0] },
          { value: 'D', position: [0, -2, 0] }
        ],
        edges: [
          { from: 0, to: 1 },
          { from: 0, to: 2 },
          { from: 1, to: 3 },
          { from: 2, to: 3 }
        ]
      },
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
  const steps = [];
  arr.forEach((val, idx) => {
    steps.push({
      data: { array: arr },
      highlightIndex: idx,
      description: `Accessing array[${idx}] = ${val}`
    });
  });
  return steps;
}

function generateStackSteps() {
  return [
    { data: { stack: [10] }, highlightIndex: 0, description: 'Push 10 onto stack' },
    { data: { stack: [10, 20] }, highlightIndex: 1, description: 'Push 20 onto stack' },
    { data: { stack: [10, 20, 30] }, highlightIndex: 2, description: 'Push 30 onto stack' },
    { data: { stack: [10, 20] }, highlightIndex: 1, description: 'Pop 30 from stack' }
  ];
}

function generateTreeSteps() {
  return [
    { data: { tree: { value: 10 } }, highlightIndex: 0, description: 'Visit root node: 10' },
    { data: { tree: { value: 10, left: { value: 5 } } }, highlightIndex: 1, description: 'Visit left child: 5' },
    { data: { tree: { value: 10, right: { value: 15 } } }, highlightIndex: 2, description: 'Visit right child: 15' }
  ];
}

function generateGraphSteps() {
  return [
    { data: { nodes: [{ value: 'A', position: [0, 2, 0] }], edges: [] }, highlightIndex: 0, description: 'Start at node A' },
    { data: { nodes: [{ value: 'A', position: [0, 2, 0] }, { value: 'B', position: [-2, 0, 0] }], edges: [{ from: 0, to: 1 }] }, highlightIndex: 1, description: 'Visit neighbor B' }
  ];
}

export default LiveTyping3DDryRun;
