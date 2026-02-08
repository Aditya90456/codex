# 🎨 AI Whiteboard Visualizer - Deep Technical Explanation

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Frontend Component Deep Dive](#frontend-component-deep-dive)
3. [Backend API Deep Dive](#backend-api-deep-dive)
4. [Drawing System Explained](#drawing-system-explained)
5. [AI Animation System](#ai-animation-system)
6. [Data Flow](#data-flow)
7. [Technical Challenges & Solutions](#technical-challenges--solutions)

---

## 🏗️ Architecture Overview

### System Components
```
┌─────────────────────────────────────────────────────────────┐
│                    LeetCode Editor                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Left Panel                                          │  │
│  │  ┌────────────┬────────────┐                        │  │
│  │  │Description │ Whiteboard │ ← Tabs                 │  │
│  │  └────────────┴────────────┘                        │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │  AIWhiteboardVisualizer Component            │   │  │
│  │  │  ┌────────────────────────────────────────┐  │   │  │
│  │  │  │  Toolbar (Tools, Colors, Controls)     │  │   │  │
│  │  │  └────────────────────────────────────────┘  │   │  │
│  │  │  ┌────────────────────────────────────────┐  │   │  │
│  │  │  │  Canvas (800x600)                      │  │   │  │
│  │  │  │  - Manual Drawing                      │  │   │  │
│  │  │  │  - AI Visualization                    │  │   │  │
│  │  │  └────────────────────────────────────────┘  │   │  │
│  │  │  ┌────────────────────────────────────────┐  │   │  │
│  │  │  │  Animation Info Panel                  │  │   │  │
│  │  │  └────────────────────────────────────────┘  │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP POST
┌─────────────────────────────────────────────────────────────┐
│                    Backend Server (Port 3001)               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /api/ai/visualize-logic                             │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  1. Receive: problemTitle, code                │  │  │
│  │  │  2. Build AI Prompt                            │  │  │
│  │  │  3. Call Gemini 2.5 Flash                      │  │  │
│  │  │  4. Parse JSON Response                        │  │  │
│  │  │  5. Return Animation Steps                     │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ API Call
┌─────────────────────────────────────────────────────────────┐
│              Google Gemini 2.5 Flash API                    │
│  - Analyzes problem and code                                │
│  - Generates step-by-step visualization instructions        │
│  - Returns JSON with drawing coordinates and explanations   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Frontend Component Deep Dive

### Component Structure: `AIWhiteboardVisualizer.jsx`

#### 1. State Management
```javascript
// Canvas reference for direct DOM manipulation
const canvasRef = useRef(null);

// Drawing state
const [isDrawing, setIsDrawing] = useState(false);        // Is user currently drawing?
const [tool, setTool] = useState('pen');                  // Current tool selected
const [color, setColor] = useState('#3b82f6');            // Current color
const [lineWidth, setLineWidth] = useState(2);            // Current line thickness
const [drawings, setDrawings] = useState([]);             // Array of completed drawings
const [currentPath, setCurrentPath] = useState([]);       // Points for current pen/eraser stroke
const [startPoint, setStartPoint] = useState(null);       // Start point for shapes

// AI Animation state
const [aiAnimation, setAiAnimation] = useState(null);     // AI-generated animation data
const [isAnimating, setIsAnimating] = useState(false);    // Is auto-play running?
const [animationStep, setAnimationStep] = useState(0);    // Current step number
const [isGenerating, setIsGenerating] = useState(false);  // Is AI generating?
```

**Why this structure?**
- `drawings` array stores all completed shapes/strokes
- `currentPath` tracks points while user is actively drawing
- `startPoint` captures where shape drawing began
- Separation allows for live preview without modifying saved drawings

#### 2. Drawing System Architecture

##### A. Mouse Event Flow
```
User clicks canvas
       ↓
handleMouseDown()
  - Get mouse position
  - Set isDrawing = true
  - Save startPoint
  - Initialize currentPath (for pen/eraser)
       ↓
User moves mouse
       ↓
handleMouseMove()
  - If not drawing, return
  - Get current mouse position
  - For pen/eraser: Add point to currentPath
  - For shapes: Redraw canvas with preview
       ↓
User releases mouse
       ↓
handleMouseUp()
  - Convert currentPath/shape to drawing object
  - Add to drawings array
  - Reset isDrawing, currentPath, startPoint
```

##### B. Drawing Data Structure
```javascript
// Pen/Eraser Drawing
{
  type: 'pen' | 'eraser',
  color: '#3b82f6',
  lineWidth: 2,
  points: [
    { x: 100, y: 150 },
    { x: 102, y: 152 },
    { x: 105, y: 155 },
    // ... more points
  ]
}

// Shape Drawing (Rectangle, Circle, Arrow)
{
  type: 'rectangle' | 'circle' | 'arrow',
  color: '#3b82f6',
  lineWidth: 2,
  startX: 100,
  startY: 150,
  endX: 200,
  endY: 250
}

// Text Drawing
{
  type: 'text',
  color: '#000000',
  startX: 100,
  startY: 150,
  text: 'Hello',
  fontSize: 16
}
```

##### C. Canvas Rendering Logic

**useEffect Hook:**
```javascript
useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  
  // 1. Clear entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 2. Redraw all saved drawings
  drawings.forEach(drawing => drawShape(ctx, drawing));
  
  // 3. Draw current path (for pen/eraser only)
  if ((tool === 'pen' || tool === 'eraser') && currentPath.length > 0) {
    // Draw live preview of current stroke
  }
}, [drawings, currentPath, color, lineWidth, tool]);
```

**Why redraw everything?**
- Canvas is a bitmap, not vector graphics
- Can't "move" or "edit" individual shapes
- Must clear and redraw all elements on every change
- This is standard canvas pattern

##### D. Shape Drawing Functions

**Rectangle:**
```javascript
case 'rectangle':
  const width = drawing.endX - drawing.startX;
  const height = drawing.endY - drawing.startY;
  ctx.strokeRect(drawing.startX, drawing.startY, width, height);  // Border
  ctx.fillRect(drawing.startX, drawing.startY, width, height);    // Fill
  break;
```

**Circle:**
```javascript
case 'circle':
  // Calculate radius using Pythagorean theorem
  const radius = Math.sqrt(
    Math.pow(drawing.endX - drawing.startX, 2) +
    Math.pow(drawing.endY - drawing.startY, 2)
  );
  ctx.beginPath();
  ctx.arc(drawing.startX, drawing.startY, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
  break;
```

**Arrow:**
```javascript
const drawArrow = (ctx, fromX, fromY, toX, toY) => {
  const headLength = 15;
  const angle = Math.atan2(toY - fromY, toX - fromX);
  
  // Draw line
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
  
  // Draw arrowhead (two lines forming a V)
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
```

**Text:**
```javascript
case 'text':
  ctx.font = `${drawing.fontSize || 16}px Arial`;
  ctx.fillStyle = drawing.color;
  ctx.fillText(drawing.text || '', drawing.startX, drawing.startY);
  break;
```

#### 3. Live Preview System

**Problem:** How to show shape preview while dragging without saving it?

**Solution:** Two-tier rendering
```javascript
handleMouseMove = (e) => {
  if (!isDrawing) return;
  const pos = getMousePos(e);
  
  if (tool === 'pen' || tool === 'eraser') {
    // Add to currentPath - useEffect will render it
    setCurrentPath(prev => [...prev, pos]);
  } else {
    // For shapes: manually redraw canvas with preview
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear and redraw saved drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawings.forEach(drawing => drawShape(ctx, drawing));
    
    // Draw preview of current shape
    if (tool === 'rectangle') {
      const width = pos.x - startPoint.x;
      const height = pos.y - startPoint.y;
      ctx.strokeRect(startPoint.x, startPoint.y, width, height);
    }
    // ... similar for circle, arrow
  }
};
```

**Why different approaches?**
- Pen/eraser: Many points, use React state + useEffect
- Shapes: Single preview, direct canvas manipulation is faster

---

## 🤖 Backend API Deep Dive

### Endpoint: `POST /api/ai/visualize-logic`

#### 1. Request Processing
```javascript
router.post('/visualize-logic', async (req, res) => {
  const { problemId, problemTitle, code } = req.body;
  
  // Validation
  if (!problemTitle) {
    return res.status(400).json({
      success: false,
      error: 'Problem title is required'
    });
  }
  
  // Initialize Gemini model
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  // ... continue processing
});
```

#### 2. AI Prompt Engineering

**Prompt Structure:**
```javascript
const prompt = `You are an expert at visualizing algorithm logic through step-by-step animations.

Problem: ${problemTitle}
${code ? `Code:\n${code}` : ''}

Create a step-by-step visual animation to explain the problem-solving approach. 
For each step, provide:
1. A description of what's happening
2. Visual elements to draw (shapes, arrows, text)
3. Coordinates and styling

Return a JSON object with this structure:
{
  "description": "Overall approach description",
  "steps": [
    {
      "stepNumber": 1,
      "explanation": "What this step does",
      "drawing": {
        "type": "rectangle|circle|arrow|text",
        "color": "#hex",
        "startX": 100,
        "startY": 100,
        "endX": 200,
        "endY": 200,
        "text": "optional text",
        "lineWidth": 2
      }
    }
  ]
}

Focus on:
- Array/list visualizations (boxes with indices)
- Pointer movements (arrows)
- Comparisons (highlighting elements)
- Data structure operations (push, pop, swap)
- Algorithm flow (step-by-step logic)

Keep it simple and visual. Use colors to show different states.
Provide 5-10 animation steps maximum.`;
```

**Why this prompt works:**
- Clear output format specification
- Examples of what to visualize
- Constraints (5-10 steps, simple visuals)
- Focus on educational value

#### 3. Response Handling

```javascript
const result = await model.generateContent(prompt);
const response = result.response;
let text = response.text();

// Clean up markdown code blocks
text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

let animation;
try {
  animation = JSON.parse(text);
} catch (parseError) {
  // Fallback: Create simple default animation
  animation = {
    description: "Visual representation of the problem-solving approach",
    steps: [
      {
        stepNumber: 1,
        explanation: "Initialize data structure",
        drawing: {
          type: "rectangle",
          color: "#3b82f6",
          startX: 100,
          startY: 100,
          endX: 200,
          endY: 150,
          lineWidth: 2
        }
      }
      // ... more default steps
    ]
  };
}

res.json({
  success: true,
  animation: animation
});
```

**Error Handling Strategy:**
- Try to parse AI response as JSON
- If parsing fails, provide fallback animation
- Never return error to user for parsing issues
- Log errors for debugging

#### 4. Example AI Response

**For "Two Sum" problem:**
```json
{
  "description": "Hash map approach for Two Sum",
  "steps": [
    {
      "stepNumber": 1,
      "explanation": "Initialize: Display array and empty hash map",
      "drawing": [
        {
          "type": "rectangle",
          "color": "#D3D3D3",
          "startX": 50,
          "startY": 150,
          "endX": 110,
          "endY": 190,
          "lineWidth": 1
        },
        {
          "type": "text",
          "color": "#000000",
          "startX": 70,
          "startY": 175,
          "text": "2",
          "fontSize": 20
        },
        {
          "type": "text",
          "color": "#000000",
          "startX": 75,
          "startY": 200,
          "text": "idx 0",
          "fontSize": 14
        }
        // ... more elements
      ]
    }
    // ... more steps
  ]
}
```

---

## 🎬 AI Animation System

### Animation Playback Architecture

#### 1. Animation State Machine
```
IDLE → GENERATING → READY → PLAYING → COMPLETE
  ↓                    ↓        ↓         ↓
  └────────────────────┴────────┴─────────┘
              RESET (back to IDLE)
```

#### 2. Play Animation Function

```javascript
const playAnimation = () => {
  if (!aiAnimation || !aiAnimation.steps || isAnimating) return;
  
  setIsAnimating(true);
  setAnimationStep(0);
  clearCanvas(); // Remove manual drawings
  
  let step = 0;
  const interval = setInterval(() => {
    if (step >= aiAnimation.steps.length) {
      setIsAnimating(false);
      clearInterval(interval);
      return;
    }
    
    const animStep = aiAnimation.steps[step];
    setAnimationStep(step);
    
    if (animStep && animStep.drawing) {
      // Handle both single drawing and array of drawings
      const drawingsToAdd = Array.isArray(animStep.drawing) 
        ? animStep.drawing 
        : [animStep.drawing];
      
      drawingsToAdd.forEach(drawing => {
        // Convert AI format to canvas format
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
        
        setDrawings(prev => [...prev, canvasDrawing]);
      });
    }
    
    step++;
  }, 1500); // 1.5 seconds per step
};
```

**Key Points:**
- Uses `setInterval` for timed playback
- Converts AI drawing format to canvas format
- Handles both single drawings and arrays
- Clears manual drawings before starting
- Updates step counter for UI

#### 3. Manual Step Control

```javascript
const nextStep = () => {
  if (!aiAnimation || !aiAnimation.steps) return;
  
  const nextStepIndex = animationStep;
  if (nextStepIndex >= aiAnimation.steps.length) return;
  
  const animStep = aiAnimation.steps[nextStepIndex];
  
  if (animStep && animStep.drawing) {
    const drawingsToAdd = Array.isArray(animStep.drawing) 
      ? animStep.drawing 
      : [animStep.drawing];
    
    drawingsToAdd.forEach(drawing => {
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
      
      setDrawings(prev => [...prev, canvasDrawing]);
    });
  }
  
  setAnimationStep(nextStepIndex + 1);
};
```

**Benefits:**
- User controls pace
- Can pause and study each step
- Same conversion logic as auto-play
- Increments step counter

#### 4. Format Conversion

**AI Format → Canvas Format:**
```javascript
// AI might return:
{
  type: "rectangle",
  color: "#ADD8E6",
  borderColor: "#0000FF",
  startX: 50,
  startY: 150,
  endX: 110,
  endY: 190,
  lineWidth: 2
}

// Convert to:
{
  type: "rectangle",
  color: "#ADD8E6",  // Use color, fallback to borderColor
  lineWidth: 2,
  startX: 50,
  startY: 150,
  endX: 110,
  endY: 190
}
```

**Why conversion needed?**
- AI uses flexible format
- Canvas needs consistent format
- Handles missing fields gracefully
- Ensures compatibility

---

## 🔄 Data Flow

### Complete User Journey

#### Scenario 1: Manual Drawing

```
1. User clicks "Pen" tool
   → setTool('pen')
   → Tool button highlights

2. User clicks canvas at (100, 150)
   → handleMouseDown()
   → setIsDrawing(true)
   → setStartPoint({x: 100, y: 150})
   → setCurrentPath([{x: 100, y: 150}])

3. User drags to (150, 200)
   → handleMouseMove()
   → setCurrentPath([{x: 100, y: 150}, {x: 150, y: 200}])
   → useEffect triggers
   → Canvas redraws with live preview

4. User releases mouse
   → handleMouseUp()
   → Create drawing object:
      {
        type: 'pen',
        color: '#3b82f6',
        lineWidth: 2,
        points: [{x: 100, y: 150}, {x: 150, y: 200}]
      }
   → setDrawings([...drawings, newDrawing])
   → setIsDrawing(false)
   → setCurrentPath([])
   → useEffect triggers
   → Canvas redraws with saved drawing
```

#### Scenario 2: AI Visualization

```
1. User clicks "AI Visualize"
   → setIsGenerating(true)
   → Button shows "Generating..."

2. Frontend sends HTTP POST
   → URL: http://localhost:3001/api/ai/visualize-logic
   → Body: {
       problemTitle: "Two Sum",
       code: "function twoSum(nums, target) { ... }"
     }

3. Backend receives request
   → Validates problemTitle exists
   → Builds AI prompt
   → Calls Gemini API

4. Gemini processes request
   → Analyzes problem
   → Generates visualization steps
   → Returns JSON response

5. Backend processes response
   → Cleans markdown formatting
   → Parses JSON
   → Returns to frontend

6. Frontend receives response
   → setAiAnimation(data.animation)
   → setAnimationStep(0)
   → setIsGenerating(false)
   → Shows success alert

7. User clicks "Play"
   → playAnimation()
   → setIsAnimating(true)
   → clearCanvas()
   → Start interval timer

8. Every 1.5 seconds
   → Get next step
   → Convert drawings to canvas format
   → Add to drawings array
   → useEffect triggers
   → Canvas redraws with new elements
   → Update step counter

9. Animation completes
   → clearInterval()
   → setIsAnimating(false)
   → All steps visible on canvas
```

---

## 🔧 Technical Challenges & Solutions

### Challenge 1: Drawing Not Working

**Problem:**
- User clicks and drags but nothing appears
- Shapes don't render correctly

**Root Cause:**
- `startPoint` not tracked properly
- Mouse coordinates not converted correctly
- State updates not triggering re-renders

**Solution:**
```javascript
// Added startPoint state
const [startPoint, setStartPoint] = useState(null);

// Proper coordinate conversion
const getMousePos = (e) => {
  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,  // Account for canvas position
    y: e.clientY - rect.top
  };
};

// Save startPoint on mouse down
const handleMouseDown = (e) => {
  const pos = getMousePos(e);
  setStartPoint(pos);  // Critical!
  setIsDrawing(true);
};
```

### Challenge 2: AI Drawings Not Rendering

**Problem:**
- AI generates response successfully
- But nothing appears on canvas

**Root Cause:**
- AI format different from canvas format
- Drawing array structure mismatch
- Missing format conversion

**Solution:**
```javascript
// Convert AI format to canvas format
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

// Handle both single and array of drawings
const drawingsToAdd = Array.isArray(animStep.drawing) 
  ? animStep.drawing 
  : [animStep.drawing];
```

### Challenge 3: Live Preview Performance

**Problem:**
- Canvas flickers during drawing
- Performance degrades with many drawings

**Root Cause:**
- useEffect triggers too often
- Redrawing entire canvas on every mouse move

**Solution:**
```javascript
// For pen/eraser: Use React state
if (tool === 'pen' || tool === 'eraser') {
  setCurrentPath(prev => [...prev, pos]);
  // useEffect handles rendering
}

// For shapes: Direct canvas manipulation
else {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawings.forEach(drawing => drawShape(ctx, drawing));
  // Draw preview directly
}
```

### Challenge 4: Backend Model Error

**Problem:**
```
Error: models/gemini-1.5-flash is not found
```

**Root Cause:**
- Old code cached in running server
- Model name outdated

**Solution:**
```bash
# Kill old process
taskkill /F /PID 12880

# Restart backend
cd backend
npm start

# Verify model name in code
model: 'gemini-2.5-flash'  ✅
```

### Challenge 5: Duplicate State Declaration

**Problem:**
```
Identifier 'startPoint' has already been declared
```

**Root Cause:**
- `useState` called twice for same variable
- Once at top, once in middle of component

**Solution:**
```javascript
// ❌ Wrong - declared twice
const [startPoint, setStartPoint] = useState(null);
// ... other code
const [startPoint, setStartPoint] = useState(null);  // Error!

// ✅ Correct - declared once at top
const [startPoint, setStartPoint] = useState(null);
// ... use it throughout component
```

---

## 📊 Performance Considerations

### Canvas Optimization

**Current Approach:**
- Clear and redraw entire canvas on every change
- Simple but can be slow with many drawings

**Optimization Strategies:**
1. **Layer System:** Separate canvas for static vs dynamic content
2. **Dirty Rectangles:** Only redraw changed regions
3. **Off-screen Canvas:** Pre-render complex shapes
4. **RequestAnimationFrame:** Batch updates

**When to Optimize:**
- More than 100 drawings on canvas
- Animation frame rate drops below 30fps
- User reports lag during drawing

### Memory Management

**Current State:**
```javascript
drawings: [
  { type: 'pen', points: [...1000 points] },  // Large array
  { type: 'rectangle', startX: 100, ... },    // Small object
  // ... potentially hundreds of drawings
]
```

**Optimization:**
- Limit drawings array size (e.g., max 500 drawings)
- Implement undo/redo with limited history
- Clear old drawings when memory threshold reached

---

## 🎓 Key Learnings

### 1. Canvas API Fundamentals
- Canvas is immediate mode (not retained)
- Must redraw everything on changes
- Coordinate system starts at top-left (0,0)
- Context state (color, lineWidth) persists

### 2. React + Canvas Integration
- Use `useRef` for canvas DOM access
- Use `useEffect` for rendering
- Separate state (data) from rendering (canvas)
- Don't mix React state with direct canvas manipulation

### 3. AI Integration Best Practices
- Provide clear output format in prompt
- Always have fallback for parsing errors
- Convert AI format to app format
- Handle both single and array responses

### 4. User Experience
- Live preview improves drawing experience
- Step-by-step control better than auto-play only
- Clear visual feedback for all actions
- Graceful error handling with user-friendly messages

---

## 🚀 Future Enhancements

### Potential Features
1. **Undo/Redo:** Stack-based history management
2. **Layers:** Separate manual and AI drawings
3. **Zoom/Pan:** Navigate large canvases
4. **Collaboration:** Real-time multi-user drawing
5. **Export Formats:** SVG, PDF, animated GIF
6. **Custom Colors:** Color picker beyond presets
7. **Text Tool:** Click to add text annotations
8. **Shape Library:** Pre-made algorithm patterns
9. **Animation Speed:** User-controlled playback speed
10. **Save/Load:** Persist drawings to database

### Technical Improvements
1. **WebGL Canvas:** Hardware-accelerated rendering
2. **Web Workers:** Off-thread AI processing
3. **IndexedDB:** Client-side drawing storage
4. **WebSocket:** Real-time collaboration
5. **TypeScript:** Type safety for drawing objects

---

## 📚 References

- [MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [React useRef Hook](https://react.dev/reference/react/useRef)
- [Google Gemini API](https://ai.google.dev/docs)
- [HTML5 Canvas Tutorial](https://www.html5canvastutorials.com/)

---

**Document Version:** 1.0  
**Last Updated:** February 6, 2026  
**Author:** AI Assistant  
**Status:** Complete & Production Ready
