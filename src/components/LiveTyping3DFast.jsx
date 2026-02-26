import { useState, useEffect, useRef, memo } from 'react';
import { Activity, Play, Pause, RotateCcw, Eye, X } from 'lucide-react';

// Ultra-fast 3D visualization - loads in <1s
const LiveTyping3DFast = ({ code, language, isVisible, onClose }) => {
  const [data, setData] = useState({ array: [2, 7, 11, 15] });
  const [type, setType] = useState('array');
  const [rotY, setRotY] = useState(0);
  const [autoRot, setAutoRot] = useState(true);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showTut, setShowTut] = useState(true);
  const [tutIdx, setTutIdx] = useState(0);

  // Minimal tutorial examples with algorithms
  const tuts = [
    { txt: 'vector<int> nums = {2,7,11,15}', d: { array: [2, 7, 11, 15] }, t: 'array', desc: 'Array visualization' },
    { txt: 'int p = 9', d: { vars: [{ n: 'p', v: '9' }] }, t: 'vars', desc: 'Variables' },
    { txt: 'stack<int> s', d: { stack: [10, 20, 30] }, t: 'stack', desc: 'Stack operations' },
    { txt: 'binarySearch(arr, target)', d: { bsearch: { arr: [1,3,5,7,9,11,13,15], target: 7, left: 0, right: 7, mid: 3 } }, t: 'bsearch', desc: 'Binary Search' },
    { txt: 'bubbleSort(arr)', d: { sort: { arr: [5,2,8,1,9], comparing: [0,1] } }, t: 'sort', desc: 'Sorting Algorithm' },
    { txt: 'const arr = [1,2,3,4,5]', d: { array: [1, 2, 3, 4, 5] }, t: 'array', desc: 'JavaScript array' }
  ];

  // Tutorial loop
  useEffect(() => {
    if (showTut && !code) {
      const t = setInterval(() => {
        setTutIdx(i => {
          const n = (i + 1) % tuts.length;
          setData(tuts[n].d);
          setType(tuts[n].t);
          return n;
        });
      }, 3000);
      return () => clearInterval(t);
    }
  }, [showTut, code]);

  // Auto-rotate
  useEffect(() => {
    if (!autoRot) return;
    const t = setInterval(() => setRotY(r => (r + 1) % 360), 50);
    return () => clearInterval(t);
  }, [autoRot]);

  // Parse code (ultra-fast real-time)
  useEffect(() => {
    if (!code || code.length < 5) {
      setShowTut(true);
      return;
    }
    
    // Real-time parsing - no debounce for instant feedback
    const parsed = fastParse(code);
    setData(parsed.d);
    setType(parsed.t);
    setShowTut(false);
  }, [code]); // Updates on every keystroke

  if (!isVisible) return null;

  return (
    <div className="fixed right-4 bottom-4 w-[500px] h-[400px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border-2 border-purple-500/30 shadow-2xl z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-slate-900/80">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">3D Live</h3>
            <p className="text-xs text-gray-400">Real-time viz</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setAutoRot(!autoRot)} className={`p-2 rounded-lg ${autoRot ? 'bg-purple-500/20' : 'bg-slate-700'}`}>
            <Eye className="w-4 h-4 text-gray-300" />
          </button>
          <button onClick={onClose} className="p-2 bg-slate-700 hover:bg-red-500 rounded-lg">
            <X className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>

      {/* 3D Scene */}
      <div className="flex-1 relative bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1000px' }}>
          <div style={{ transform: `rotateY(${rotY}deg) rotateX(15deg)`, transformStyle: 'preserve-3d', transition: 'all 0.3s ease' }}>
            {type === 'array' && <ArrayViz data={data.array || []} />}
            {type === 'vars' && <VarsViz data={data.vars || []} />}
            {type === 'mixed' && (
              <div className="flex flex-col gap-6" style={{ transformStyle: 'preserve-3d' }}>
                <VarsViz data={data.vars || []} />
                <ArrayViz data={data.array || []} />
              </div>
            )}
            {type === 'stack' && <StackViz data={data.stack || []} />}
            {type === 'tree' && <TreeViz data={data.tree} />}
            {type === 'bsearch' && <BinarySearchViz data={data.bsearch} />}
            {type === 'sort' && <SortViz data={data.sort} />}
          </div>
        </div>
        
        {/* Tutorial hint */}
        {showTut && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600/90 to-pink-600/90 px-4 py-2 rounded-xl border border-white/20 animate-pulse">
            <div className="text-white text-xs font-semibold mb-1">💡 Try:</div>
            <div className="text-white font-mono text-sm bg-black/30 px-3 py-1 rounded">{tuts[tutIdx].txt}</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-3 border-t border-white/10 bg-slate-900/80">
        <div className="flex items-center gap-2">
          <button onClick={() => setStep(0)} className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg">
            <RotateCcw className="w-4 h-4 text-white" />
          </button>
          <button onClick={() => setPlaying(!playing)} className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
            {playing ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
          </button>
          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: '50%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Array visualization (memoized) - appears instantly
const ArrayViz = memo(({ data }) => (
  <div className="flex gap-3" style={{ transformStyle: 'preserve-3d' }}>
    {data.map((v, i) => (
      <div 
        key={`${i}-${v}`} 
        className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xl font-bold text-white shadow-lg animate-slideIn" 
        style={{ 
          transformStyle: 'preserve-3d',
          animation: `slideIn 0.3s ease-out ${i * 0.1}s both`
        }}
      >
        {v}
      </div>
    ))}
  </div>
));

// Variables visualization (memoized) - appears instantly
const VarsViz = memo(({ data }) => (
  <div className="flex flex-wrap gap-3 justify-center max-w-md" style={{ transformStyle: 'preserve-3d' }}>
    {data.map((v, i) => (
      <div 
        key={`${i}-${v.n}`} 
        className="px-4 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex flex-col items-center justify-center shadow-lg animate-popIn" 
        style={{ 
          transformStyle: 'preserve-3d',
          animation: `popIn 0.4s ease-out ${i * 0.1}s both`
        }}
      >
        <span className="text-white text-xs opacity-80">{v.n}</span>
        <span className="text-white font-bold text-lg">{v.v}</span>
      </div>
    ))}
  </div>
));

// Stack visualization (memoized) - grows in real-time
const StackViz = memo(({ data }) => (
  <div className="flex flex-col-reverse gap-2" style={{ transformStyle: 'preserve-3d' }}>
    {data.map((v, i) => (
      <div 
        key={`${i}-${v}`} 
        className={`w-28 h-12 rounded-lg flex items-center justify-center text-lg font-bold text-white shadow-lg ${i === data.length - 1 ? 'bg-gradient-to-br from-red-500 to-orange-500' : 'bg-gradient-to-br from-purple-500 to-indigo-500'}`} 
        style={{ 
          transformStyle: 'preserve-3d', 
          transform: `translateZ(${i * 10}px)`,
          animation: `stackPush 0.3s ease-out ${i * 0.1}s both`
        }}
      >
        {v}
      </div>
    ))}
  </div>
));

// Tree visualization (memoized) - appears instantly
const TreeViz = memo(({ data }) => {
  if (!data) return null;
  return (
    <div className="flex flex-col items-center gap-6" style={{ transformStyle: 'preserve-3d' }}>
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-lg font-bold text-white shadow-lg animate-bounce-in" style={{ transformStyle: 'preserve-3d' }}>
        {data.val}
      </div>
      <div className="flex gap-12">
        {data.l && (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-sm font-bold text-white shadow-lg animate-slideIn" style={{ transformStyle: 'preserve-3d', animationDelay: '0.2s' }}>
            {data.l}
          </div>
        )}
        {data.r && (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-sm font-bold text-white shadow-lg animate-slideIn" style={{ transformStyle: 'preserve-3d', animationDelay: '0.3s' }}>
            {data.r}
          </div>
        )}
      </div>
    </div>
  );
});

// Binary Search visualization (memoized)
const BinarySearchViz = memo(({ data }) => {
  if (!data) return null;
  return (
    <div className="flex flex-col gap-4" style={{ transformStyle: 'preserve-3d' }}>
      <div className="flex gap-2">
        {data.arr.map((v, i) => (
          <div 
            key={i}
            className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-lg ${
              i === data.mid ? 'bg-gradient-to-br from-yellow-500 to-orange-500 scale-110' :
              i >= data.left && i <= data.right ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
              'bg-gradient-to-br from-gray-500 to-gray-600 opacity-50'
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {v}
          </div>
        ))}
      </div>
      <div className="text-white text-xs text-center">
        Target: {data.target} | Mid: {data.mid}
      </div>
    </div>
  );
});

// Sort visualization (memoized)
const SortViz = memo(({ data }) => {
  if (!data) return null;
  return (
    <div className="flex gap-2" style={{ transformStyle: 'preserve-3d' }}>
      {data.arr.map((v, i) => (
        <div 
          key={i}
          className={`w-12 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-lg ${
            data.comparing && data.comparing.includes(i) 
              ? 'bg-gradient-to-br from-red-500 to-pink-500 animate-pulse' 
              : 'bg-gradient-to-br from-purple-500 to-indigo-500'
          }`}
          style={{ 
            transformStyle: 'preserve-3d',
            height: `${v * 8}px`,
            minHeight: '48px'
          }}
        >
          {v}
        </div>
      ))}
    </div>
  );
});

// Ultra-fast parser (real-time, character-by-character)
function fastParse(code) {
  const c = code.toLowerCase();
  const lines = code.split('\n');
  
  // Multi-variable detection (real-time)
  const vars = [];
  let hasArray = false;
  let arrayData = [];
  
  lines.forEach((line, idx) => {
    // C++ array syntax: int b=[9,6,9] or int arr[]={1,2,3}
    const cppArrayMatch = line.match(/(int|float|double)\s+(\w+)\s*(?:\[\s*\])?\s*=\s*[\[{]([^\]\}]+)[\]\}]/);
    if (cppArrayMatch) {
      hasArray = true;
      arrayData = cppArrayMatch[3].split(',').map(n => n.trim()).filter(n => n);
    }
    
    // C++ variables: int p = 9, float x = 3.14
    const cppVarMatches = line.matchAll(/(int|float|double|long|char)\s+(\w+)\s*=\s*([^;,\[\{]+)(?=[;,]|$)/g);
    for (const match of cppVarMatches) {
      vars.push({ n: match[2], v: match[3].trim(), line: idx + 1 });
    }
    
    // JS variables: const/let/var
    const jsMatch = line.match(/(const|let|var)\s+(\w+)\s*=\s*([^;,\n]+)/);
    if (jsMatch && !jsMatch[3].includes('[')) {
      vars.push({ n: jsMatch[2], v: jsMatch[3].trim(), line: idx + 1 });
    }
    
    // Python variables: x = 5
    const pyMatch = line.match(/^(\w+)\s*=\s*([^#\[\n]+)/);
    if (pyMatch && !line.includes('def') && !line.includes('class')) {
      vars.push({ n: pyMatch[1], v: pyMatch[2].trim(), line: idx + 1 });
    }
  });
  
  // If we have both array and variables, show both
  if (hasArray && arrayData.length > 0 && vars.length > 0) {
    return { 
      t: 'mixed', 
      d: { 
        vars: vars,
        array: arrayData 
      } 
    };
  }
  
  // Array detection (real-time)
  if (hasArray && arrayData.length > 0) {
    return { t: 'array', d: { array: arrayData } };
  }
  
  if (c.includes('vector') || c.includes('[')) {
    const m = code.match(/\[([^\]]+)\]/);
    if (m) {
      const arr = m[1].split(',').map(n => n.trim()).filter(n => n).slice(0, 10);
      if (arr.length > 0) {
        return { t: 'array', d: { array: arr } };
      }
    }
    
    // Vector without initialization
    if (c.includes('vector')) {
      return { t: 'array', d: { array: ['vector'] } };
    }
  }
  
  // Stack detection (real-time)
  if (c.includes('stack') || c.includes('push')) {
    const stackItems = [];
    lines.forEach(line => {
      const pushMatch = line.match(/push\(([^)]+)\)/);
      if (pushMatch) {
        stackItems.push(pushMatch[1].trim());
      }
    });
    return { t: 'stack', d: { stack: stackItems.length > 0 ? stackItems : [10, 20, 30] } };
  }
  
  // Tree detection (real-time)
  if (c.includes('tree') || c.includes('node')) {
    return { t: 'tree', d: { tree: { val: 10, l: 5, r: 15 } } };
  }
  
  // Variables detected (real-time)
  if (vars.length > 0) {
    return { t: 'vars', d: { vars: vars } };
  }
  
  // Partial typing detection
  if (c.includes('int ') || c.includes('const ') || c.includes('let ') || c.includes('var ')) {
    return { t: 'vars', d: { vars: [{ n: '...', v: 'typing', line: 1 }] } };
  }
  
  // Default - show tutorial
  return { t: 'array', d: { array: [] } };
}

export default memo(LiveTyping3DFast);
