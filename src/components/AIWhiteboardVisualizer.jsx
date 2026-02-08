import { useState, useRef, useEffect } from 'react';
import { Pencil, Eraser, Square, Circle, ArrowRight, Trash2, Download, Sparkles, Play, RotateCcw, ChevronRight, Volume2, VolumeX } from 'lucide-react';

const AIWhiteboardVisualizer = ({ problemId, problemTitle, code }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen'); // pen, eraser, rectangle, circle, arrow, text
  const [color, setColor] = useState('#3b82f6');
  const [lineWidth, setLineWidth] = useState(2);
  const [drawings, setDrawings] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [aiAnimation, setAiAnimation] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true); // Voice enabled by default
  const [voiceLang, setVoiceLang] = useState('en-US'); // Default English

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Clear and redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Debug: Log drawing count
    if (drawings.length > 0) {
      console.log(`🎨 Rendering ${drawings.length} drawings`);
    }
    
    // Draw all saved drawings
    drawings.forEach((drawing, index) => {
      try {
        drawShape(ctx, drawing);
      } catch (error) {
        console.error(`Error drawing shape ${index}:`, error, drawing);
      }
    });

    // Draw current path for pen/eraser only
    if ((tool === 'pen' || tool === 'eraser') && currentPath.length > 0) {
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = tool === 'eraser' ? 20 : lineWidth;
      ctx.beginPath();
      currentPath.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    }
  }, [drawings, currentPath, color, lineWidth, tool]);

  const drawShape = (ctx, drawing) => {
    if (!drawing || !drawing.type) {
      console.warn('Invalid drawing object:', drawing);
      return;
    }

    // Set default values
    ctx.strokeStyle = drawing.color || '#3b82f6';
    ctx.lineWidth = drawing.lineWidth || 2;
    ctx.fillStyle = (drawing.color || '#3b82f6') + '20'; // Semi-transparent fill

    switch (drawing.type) {
      case 'pen':
      case 'eraser':
        if (!drawing.points || !Array.isArray(drawing.points)) {
          console.warn('Invalid points for pen/eraser:', drawing);
          return;
        }
        ctx.strokeStyle = drawing.color || '#3b82f6';
        ctx.beginPath();
        drawing.points.forEach((point, index) => {
          if (point && typeof point.x === 'number' && typeof point.y === 'number') {
            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          }
        });
        ctx.stroke();
        break;

      case 'rectangle':
        if (typeof drawing.startX !== 'number' || typeof drawing.startY !== 'number' ||
            typeof drawing.endX !== 'number' || typeof drawing.endY !== 'number') {
          console.warn('Invalid coordinates for rectangle:', drawing);
          return;
        }
        const width = drawing.endX - drawing.startX;
        const height = drawing.endY - drawing.startY;
        ctx.strokeRect(drawing.startX, drawing.startY, width, height);
        ctx.fillRect(drawing.startX, drawing.startY, width, height);
        break;

      case 'circle':
        if (typeof drawing.startX !== 'number' || typeof drawing.startY !== 'number' ||
            typeof drawing.endX !== 'number' || typeof drawing.endY !== 'number') {
          console.warn('Invalid coordinates for circle:', drawing);
          return;
        }
        const radius = Math.sqrt(
          Math.pow(drawing.endX - drawing.startX, 2) +
          Math.pow(drawing.endY - drawing.startY, 2)
        );
        if (radius > 0) {
          ctx.beginPath();
          ctx.arc(drawing.startX, drawing.startY, radius, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.fill();
        }
        break;

      case 'arrow':
        if (typeof drawing.startX !== 'number' || typeof drawing.startY !== 'number' ||
            typeof drawing.endX !== 'number' || typeof drawing.endY !== 'number') {
          console.warn('Invalid coordinates for arrow:', drawing);
          return;
        }
        drawArrow(ctx, drawing.startX, drawing.startY, drawing.endX, drawing.endY);
        break;

      case 'text':
        if (typeof drawing.startX !== 'number' || typeof drawing.startY !== 'number') {
          console.warn('Invalid coordinates for text:', drawing);
          return;
        }
        ctx.font = `${drawing.fontSize || 16}px Arial`;
        ctx.fillStyle = drawing.color || '#3b82f6';
        ctx.fillText(drawing.text || '', drawing.startX, drawing.startY);
        break;

      default:
        console.warn('Unknown drawing type:', drawing.type);
    }
  };

  const drawArrow = (ctx, fromX, fromY, toX, toY) => {
    const headLength = 15;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    // Draw line
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Draw arrowhead
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  };

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e) => {
    const pos = getMousePos(e);
    setIsDrawing(true);
    setStartPoint(pos);

    if (tool === 'pen' || tool === 'eraser') {
      setCurrentPath([pos]);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);

    if (tool === 'pen' || tool === 'eraser') {
      setCurrentPath(prev => [...prev, pos]);
    } else if (startPoint) {
      // For shapes, draw preview
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Redraw everything
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawings.forEach(drawing => drawShape(ctx, drawing));
      
      // Draw preview of current shape
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.fillStyle = color + '20';
      
      if (tool === 'rectangle') {
        const width = pos.x - startPoint.x;
        const height = pos.y - startPoint.y;
        ctx.strokeRect(startPoint.x, startPoint.y, width, height);
        ctx.fillRect(startPoint.x, startPoint.y, width, height);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(pos.x - startPoint.x, 2) + Math.pow(pos.y - startPoint.y, 2)
        );
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
      } else if (tool === 'arrow') {
        drawArrow(ctx, startPoint.x, startPoint.y, pos.x, pos.y);
      }
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);

    if (tool === 'pen' || tool === 'eraser') {
      if (currentPath.length > 0) {
        const newDrawing = {
          type: tool,
          color: tool === 'eraser' ? '#ffffff' : color,
          lineWidth: tool === 'eraser' ? 20 : lineWidth,
          points: currentPath
        };
        setDrawings(prev => [...prev, newDrawing]);
      }
    } else if (startPoint) {
      // Save shape
      const newDrawing = {
        type: tool,
        color: color,
        lineWidth: lineWidth,
        startX: startPoint.x,
        startY: startPoint.y,
        endX: pos.x,
        endY: pos.y
      };
      setDrawings(prev => [...prev, newDrawing]);
    }

    setIsDrawing(false);
    setCurrentPath([]);
    setStartPoint(null);
  };

  const clearCanvas = () => {
    setDrawings([]);
    setCurrentPath([]);
    setAiAnimation(null);
    setAnimationStep(0);
  };

  // Simple text-to-speech function
  const speak = (text) => {
    if (!isSpeaking || !text) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8; // Slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = voiceLang;
    
    // Try to find a voice for the selected language
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(voice => 
      voice.lang === voiceLang || voice.lang.startsWith(voiceLang.split('-')[0])
    );
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    // Error handling
    utterance.onerror = (event) => {
      console.log('Speech error:', event.error);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeech = () => {
    setIsSpeaking(!isSpeaking);
    if (isSpeaking) {
      window.speechSynthesis.cancel(); // Stop current speech
    }
  };

  // Popular languages for voice
  const languages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
    { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
    { code: 'de-DE', name: 'German', flag: '🇩🇪' },
    { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
    { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷' },
    { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },
    { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' }
  ];

  const generateAIVisualization = async () => {
    setIsGenerating(true);
    
    try {
      // Use instant fallback for now (API quota exceeded)
      console.log('🎨 Using instant visualization (API quota exceeded)');
      
      const fallbackAnimation = {
        steps: [
          {
            stepNumber: 1,
            explanation: `Initialize: Set up array for ${problemTitle}`,
            drawing: [
              {type: "rectangle", color: "#e5e7eb", startX: 50, startY: 100, endX: 110, endY: 150, lineWidth: 2},
              {type: "text", color: "#000", startX: 70, startY: 130, text: "2", fontSize: 20},
              {type: "text", color: "#6b7280", startX: 70, startY: 170, text: "i=0", fontSize: 14},
              {type: "rectangle", color: "#e5e7eb", startX: 120, startY: 100, endX: 180, endY: 150, lineWidth: 2},
              {type: "text", color: "#000", startX: 140, startY: 130, text: "7", fontSize: 20},
              {type: "text", color: "#6b7280", startX: 140, startY: 170, text: "i=1", fontSize: 14},
              {type: "rectangle", color: "#e5e7eb", startX: 190, startY: 100, endX: 250, endY: 150, lineWidth: 2},
              {type: "text", color: "#000", startX: 210, startY: 130, text: "11", fontSize: 20},
              {type: "text", color: "#6b7280", startX: 205, startY: 170, text: "i=2", fontSize: 14}
            ]
          },
          {
            stepNumber: 2,
            explanation: "Process: Check first element",
            drawing: [
              {type: "rectangle", color: "#3b82f6", startX: 50, startY: 100, endX: 110, endY: 150, lineWidth: 3},
              {type: "text", color: "#fff", startX: 70, startY: 130, text: "2", fontSize: 20},
              {type: "text", color: "#3b82f6", startX: 70, startY: 170, text: "i=0", fontSize: 14},
              {type: "rectangle", color: "#e5e7eb", startX: 120, startY: 100, endX: 180, endY: 150, lineWidth: 2},
              {type: "text", color: "#000", startX: 140, startY: 130, text: "7", fontSize: 20},
              {type: "rectangle", color: "#e5e7eb", startX: 190, startY: 100, endX: 250, endY: 150, lineWidth: 2},
              {type: "text", color: "#000", startX: 210, startY: 130, text: "11", fontSize: 20},
              {type: "arrow", color: "#ef4444", startX: 80, startY: 160, endX: 80, endY: 190, lineWidth: 2},
              {type: "text", color: "#ef4444", startX: 90, startY: 185, text: "current", fontSize: 14}
            ]
          },
          {
            stepNumber: 3,
            explanation: "Compare: Check next element",
            drawing: [
              {type: "rectangle", color: "#e5e7eb", startX: 50, startY: 100, endX: 110, endY: 150, lineWidth: 2},
              {type: "text", color: "#000", startX: 70, startY: 130, text: "2", fontSize: 20},
              {type: "rectangle", color: "#3b82f6", startX: 120, startY: 100, endX: 180, endY: 150, lineWidth: 3},
              {type: "text", color: "#fff", startX: 140, startY: 130, text: "7", fontSize: 20},
              {type: "text", color: "#3b82f6", startX: 140, startY: 170, text: "i=1", fontSize: 14},
              {type: "rectangle", color: "#e5e7eb", startX: 190, startY: 100, endX: 250, endY: 150, lineWidth: 2},
              {type: "text", color: "#000", startX: 210, startY: 130, text: "11", fontSize: 20},
              {type: "arrow", color: "#ef4444", startX: 150, startY: 160, endX: 150, endY: 190, lineWidth: 2}
            ]
          },
          {
            stepNumber: 4,
            explanation: "Found: Match found!",
            drawing: [
              {type: "rectangle", color: "#10b981", startX: 50, startY: 100, endX: 110, endY: 150, lineWidth: 3},
              {type: "text", color: "#fff", startX: 70, startY: 130, text: "2", fontSize: 20},
              {type: "rectangle", color: "#10b981", startX: 120, startY: 100, endX: 180, endY: 150, lineWidth: 3},
              {type: "text", color: "#fff", startX: 140, startY: 130, text: "7", fontSize: 20},
              {type: "rectangle", color: "#e5e7eb", startX: 190, startY: 100, endX: 250, endY: 150, lineWidth: 2},
              {type: "text", color: "#000", startX: 210, startY: 130, text: "11", fontSize: 20},
              {type: "text", color: "#10b981", startX: 50, startY: 210, text: "✓ Answer: [0, 1]", fontSize: 18}
            ]
          }
        ]
      };
      
      setAiAnimation(fallbackAnimation);
      setAnimationStep(0);
      console.log('✅ Instant visualization ready');
      alert('✅ Visualization ready! Click Play or Next Step.');
      
    } catch (error) {
      console.error('Error:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const playAnimation = () => {
    if (!aiAnimation || !aiAnimation.steps || isAnimating) return;
    
    setIsAnimating(true);
    setAnimationStep(0);
    clearCanvas(); // Clear existing drawings
    
    let step = 0;

    const interval = setInterval(() => {
      if (step >= aiAnimation.steps.length) {
        setIsAnimating(false);
        clearInterval(interval);
        return;
      }

      const animStep = aiAnimation.steps[step];
      setAnimationStep(step);
      
      // Speak the explanation
      if (animStep.explanation) {
        speak(animStep.explanation);
      }
      
      if (animStep && animStep.drawing) {
        // Handle both single drawing and array of drawings
        const drawingsToAdd = Array.isArray(animStep.drawing) 
          ? animStep.drawing 
          : [animStep.drawing];
        
        // Convert all drawings for this step at once
        const newDrawings = [];
        
        drawingsToAdd.forEach(drawing => {
          // Convert AI drawing format to our canvas format
          const canvasDrawing = {
            type: drawing.type,
            color: drawing.color || drawing.borderColor || '#3b82f6',
            lineWidth: drawing.lineWidth || 2,
            startX: drawing.startX,
            startY: drawing.startY,
            endX: drawing.endX,
            endY: drawing.endY,
            text: drawing.text,
            fontSize: drawing.fontSize
          };
          
          newDrawings.push(canvasDrawing);
        });
        
        // Add all drawings at once to trigger single re-render
        if (newDrawings.length > 0) {
          setDrawings(prev => [...prev, ...newDrawings]);
        }
      }
      
      step++;
    }, 2000); // 2 seconds per step for better visibility
  };

  const nextStep = () => {
    if (!aiAnimation || !aiAnimation.steps) return;
    
    const nextStepIndex = animationStep;
    if (nextStepIndex >= aiAnimation.steps.length) return;
    
    const animStep = aiAnimation.steps[nextStepIndex];
    
    // Speak the explanation
    if (animStep.explanation) {
      speak(animStep.explanation);
    }
    
    if (animStep && animStep.drawing) {
      // Handle both single drawing and array of drawings
      const drawingsToAdd = Array.isArray(animStep.drawing) 
        ? animStep.drawing 
        : [animStep.drawing];
      
      // Convert all drawings for this step at once
      const newDrawings = [];
      
      drawingsToAdd.forEach(drawing => {
        // Convert AI drawing format to our canvas format
        const canvasDrawing = {
          type: drawing.type,
          color: drawing.color || drawing.borderColor || '#3b82f6',
          lineWidth: drawing.lineWidth || 2,
          startX: drawing.startX,
          startY: drawing.startY,
          endX: drawing.endX,
          endY: drawing.endY,
          text: drawing.text,
          fontSize: drawing.fontSize
        };
        
        newDrawings.push(canvasDrawing);
      });
      
      // Add all drawings at once to trigger single re-render
      if (newDrawings.length > 0) {
        setDrawings(prev => [...prev, ...newDrawings]);
      }
    }
    
    setAnimationStep(nextStepIndex + 1);
  };

  const resetAnimation = () => {
    setAnimationStep(0);
    clearCanvas();
    setIsAnimating(false);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `${problemTitle}-whiteboard.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Pencil className="w-5 h-5" />
            AI Whiteboard Visualizer
          </h3>
          <button
            onClick={generateAIVisualization}
            disabled={isGenerating}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 flex items-center gap-2 text-sm"
          >
            <Sparkles className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'AI Visualize'}
          </button>
          <button
            onClick={() => {
              // Test animation directly
              const testAnimation = {
                steps: [
                  {
                    stepNumber: 1,
                    explanation: "Test Step 1: Drawing a blue rectangle",
                    drawing: [
                      {type: "rectangle", color: "#3b82f6", startX: 100, startY: 100, endX: 200, endY: 150, lineWidth: 3},
                      {type: "text", color: "#3b82f6", startX: 120, startY: 130, text: "Test 1", fontSize: 16}
                    ]
                  },
                  {
                    stepNumber: 2,
                    explanation: "Test Step 2: Adding a green circle",
                    drawing: [
                      {type: "circle", color: "#10b981", startX: 300, startY: 125, endX: 350, endY: 125, lineWidth: 2},
                      {type: "text", color: "#10b981", startX: 280, startY: 180, text: "Test 2", fontSize: 16}
                    ]
                  }
                ]
              };
              setAiAnimation(testAnimation);
              setAnimationStep(0);
              console.log('🧪 Test animation loaded');
            }}
            className="px-2 py-1.5 bg-orange-600 text-white rounded text-xs hover:bg-orange-700"
            title="Test Animation"
          >
            Test
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-slate-800 border-b border-slate-700 p-2 flex items-center gap-2 flex-wrap">
        {/* Drawing Tools */}
        <div className="flex items-center gap-1 border-r border-slate-700 pr-2">
          <button
            onClick={() => setTool('pen')}
            className={`p-2 rounded ${tool === 'pen' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-slate-700'}`}
            title="Pen"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-slate-700'}`}
            title="Eraser"
          >
            <Eraser className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('rectangle')}
            className={`p-2 rounded ${tool === 'rectangle' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-slate-700'}`}
            title="Rectangle"
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('circle')}
            className={`p-2 rounded ${tool === 'circle' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-slate-700'}`}
            title="Circle"
          >
            <Circle className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('arrow')}
            className={`p-2 rounded ${tool === 'arrow' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-slate-700'}`}
            title="Arrow"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1 border-r border-slate-700 pr-2">
          {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#000000'].map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded border-2 ${color === c ? 'border-white' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Line Width */}
        <div className="flex items-center gap-2 border-r border-slate-700 pr-2">
          <input
            type="range"
            min="1"
            max="10"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-20"
          />
          <span className="text-gray-400 text-sm">{lineWidth}px</span>
        </div>

        {/* Animation Controls */}
        {aiAnimation && (
          <div className="flex items-center gap-1 border-r border-slate-700 pr-2">
            <button
              onClick={playAnimation}
              disabled={isAnimating}
              className="p-2 rounded text-green-400 hover:bg-slate-700 disabled:opacity-50"
              title="Play Animation"
            >
              <Play className="w-4 h-4" />
            </button>
            <button
              onClick={nextStep}
              disabled={isAnimating || animationStep >= aiAnimation.steps.length}
              className="p-2 rounded text-blue-400 hover:bg-slate-700 disabled:opacity-50"
              title="Next Step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={resetAnimation}
              className="p-2 rounded text-orange-400 hover:bg-slate-700"
              title="Reset Animation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={toggleSpeech}
              className={`p-2 rounded hover:bg-slate-700 ${isSpeaking ? 'text-purple-400' : 'text-gray-500'}`}
              title={isSpeaking ? "Voice On" : "Voice Off"}
            >
              {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            {isSpeaking && (
              <select
                value={voiceLang}
                onChange={(e) => setVoiceLang(e.target.value)}
                className="px-2 py-1 bg-slate-700 rounded text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                title="Voice Language"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={downloadCanvas}
            className="p-2 rounded text-gray-400 hover:bg-slate-700"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={clearCanvas}
            className="p-2 rounded text-red-400 hover:bg-slate-700"
            title="Clear All"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-full bg-white cursor-crosshair"
        />

        {/* AI Animation Info */}
        {aiAnimation && aiAnimation.steps && (
          <div className="absolute bottom-4 left-4 right-4 bg-slate-800 bg-opacity-95 rounded-lg p-3 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">AI Visualization</span>
              <span className="text-gray-400 text-sm">
                Step {animationStep} / {aiAnimation.steps.length}
              </span>
            </div>
            <p className="text-gray-300 text-sm">
              {aiAnimation.steps[animationStep]?.explanation || aiAnimation.description || 'Visualizing algorithm...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIWhiteboardVisualizer;
